import { Observable, TimeoutError, map, retry, scan, tap } from 'rxjs';
import invariant from 'tiny-invariant';

import {
  type CreateDefaultCanvasDataContext,
  NodeFunctions,
  type RunNodeResult,
  createIncomingCondition,
  createOutgoingCondition,
  createOutputVariable,
} from 'canvas-data-base';
import {
  type ChatGPTMessage,
  type GetCompletionArguments,
  getNonStreamingCompletion,
  getStreamingCompletion,
} from 'integrations/openai';

import {
  type ChatGPTChatCompletionNodeConfig,
  type ChatGPTChatCompletionNodeParams,
  createDefaultChatGPTChatCompletionNodeConfig,
} from './node-definition';

export const CHATGPT_CHAT_COMPLETION_NODE_FUNCTIONS: NodeFunctions<
  ChatGPTChatCompletionNodeConfig,
  ChatGPTChatCompletionNodeParams
> = {
  createDefaultCanvasData(context: CreateDefaultCanvasDataContext) {
    const nodeId = context.generateNodeId();

    const incomingCondition = createIncomingCondition({
      id: context.generateConnectorId(),
      nodeId: nodeId,
    });

    const outgoingCondition = createOutgoingCondition({
      id: context.generateConnectorId(),
      nodeId: nodeId,
    });

    const contentOutputVariable = createOutputVariable({
      id: context.generateConnectorId(),
      nodeId: nodeId,
      name: 'content',
    });

    const nodeConfig = createDefaultChatGPTChatCompletionNodeConfig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('ChatGPT'),
      incomingConditionIds: [incomingCondition.id],
      outgoingConditionIds: [outgoingCondition.id],
      inputVariableIds: [],
      outputVariableIds: [contentOutputVariable.id],
    });

    return {
      nodeConfigs: [nodeConfig],
      connectors: [incomingCondition, outgoingCondition, contentOutputVariable],
    };
  },

  runNodeObservable(params) {
    return new Observable<RunNodeResult>((subscriber) => {
      const { nodeParams, preferStreaming } = params;

      if (!nodeParams.apiKey) {
        subscriber.next({ errors: ['OpenAI API key is missing'] });
        subscriber.complete();
        return;
      }

      // NOTE: Main Logic

      const options: GetCompletionArguments = {
        apiKey: nodeParams.apiKey,
        model: nodeParams.model,
        messages: nodeParams.messages,
        temperature: nodeParams.temperature,
        stop: nodeParams.stop,
        seed: nodeParams.seed,
        responseFormat:
          nodeParams.responseFormatType != null
            ? { type: nodeParams.responseFormatType }
            : null,
      };

      let obs: Observable<RunNodeResult>;

      if (preferStreaming) {
        obs = getStreamingCompletion(options).pipe(
          scan(
            (acc: ChatGPTMessage, piece): ChatGPTMessage => {
              if ('error' in piece) {
                // console.error(piece.error.message);
                throw piece.error.message;
              }

              let { role, content } = acc;

              const choice = piece.choices[0];

              invariant(choice != null);

              if (choice.delta.role) {
                role = choice.delta.role;
              }

              if (choice.delta.content) {
                content += choice.delta.content;
              }

              return { role, content };
            },
            {
              role: 'assistant',
              content: '',
            },
          ),
          map((message: ChatGPTMessage): RunNodeResult => {
            return {
              variableValues: [message.content],
            };
          }),
        );
      } else {
        obs = getNonStreamingCompletion(options).pipe(
          tap({
            next(result) {
              if (result.isError) {
                console.error(result.data);
                throw result.data;
              }
            },
            error(error) {
              if (error instanceof TimeoutError) {
                console.debug('ERROR: OpenAI API call timed out.');
              } else {
                console.debug('ERROR: OpenAI API call errored.', error);
              }
            },
          }),
          retry(2),
          map((result): RunNodeResult => {
            invariant(!result.isError);

            const choice = result.data.choices[0];

            invariant(choice != null);

            return {
              variableValues: [choice.message.content],
            };
          }),
        );
      }

      // NOTE: Teardown logic
      return obs.subscribe(subscriber);
    });
  },
};
