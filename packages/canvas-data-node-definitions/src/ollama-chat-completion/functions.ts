import {
  Observable,
  type ReadableStreamLike,
  filter,
  map,
  mergeMap,
  scan,
  share,
  throwError,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

import {
  type CreateDefaultCanvasDataContext,
  NodeFunctions,
  type RunNodeResult,
  createIncomingCondition,
  createOutgoingCondition,
  createOutputVariable,
} from 'canvas-data-base';
import { type ChatGPTMessage } from 'integrations/openai';

import {
  type OllamaChatCompletionNodeConfig,
  type OllamaChatCompletionNodeParams,
  createDefaultOllamaChatCompletionNodeConfig,
} from './node-definition';

type StreamResponse = {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: false;
};

type FinalResponse = {
  model: string;
  message: { role: 'assistant'; content: '' };
  created_at: string;
  done: true;
  done_reason: string;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
};

export const OLLAMA_CHAT_COMPLETION_NODE_FUNCTIONS: NodeFunctions<
  OllamaChatCompletionNodeConfig,
  OllamaChatCompletionNodeParams
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

    const nodeConfig = createDefaultOllamaChatCompletionNodeConfig({
      nodeId: nodeId,
      name: context.getAvailableNodeName('Ollama Chat'),
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

      // NOTE: Main Logic

      let obs: Observable<RunNodeResult>;

      const fetchOptions = {
        method: 'POST',
        headers: {},
        body: JSON.stringify({
          model: nodeParams.model,
          messages: nodeParams.messages,
          format: nodeParams.format,
          options: JSON.parse(nodeParams.options),
          stream: preferStreaming,
        }),
      };

      const dataObs = fromFetch(`${nodeParams.endpoint}/api/chat`, {
        ...fetchOptions,
        selector(response) {
          // TODO: Will HTTP error status be reflected here as reponse.ok?

          if (response.body == null) {
            return throwError(() => new Error('response body is null'));
          }

          return response.body?.pipeThrough(
            new TextDecoderStream(),
          ) as ReadableStreamLike<string>;
        },
      }).pipe(
        // NOTE: Sometimes the API returns two JSON objects in one chunk
        mergeMap((chunk) => chunk.split('\n')),
        // NOTE: Remove empty lines
        filter((content) => content.trim() !== ''),
        map<string, unknown>((content) => {
          try {
            console.debug('content', content);
            return JSON.parse(content);
          } catch (error) {
            // TODO: Report error to telemetry
            console.error('Error parsing JSON', error);
            return {};
          }
        }),
        share(),
      );

      if (preferStreaming) {
        obs = dataObs.pipe(
          scan(
            (acc: ChatGPTMessage, piece_): ChatGPTMessage => {
              const piece = piece_ as StreamResponse | FinalResponse;

              let { role, content } = acc;

              role = piece.message.role;
              content += piece.message.content;

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
        obs = dataObs.pipe(
          map((result_): RunNodeResult => {
            const result = result_ as FinalResponse;

            return {
              variableValues: [result.message.content],
            };
          }),
        );
      }

      // NOTE: Teardown logic
      return obs.subscribe(subscriber);
    });
  },
};
