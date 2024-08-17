import { css } from '@emotion/react';
import { IconButton } from '@mui/joy';
import { useAtom, useAtomValue } from 'jotai';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ZIndex } from '../../constants/z-index';
import IconChevronLeftTwo from '../../icons/IconChevronLeftTwo';
import IconPlusCircleFill from '../../icons/IconPlusCircleFill';
import { generatePathForWorkflowEditorRoute } from '../../routes/workflow-editor-route-util';
import { createFlow } from '../../states/actions/workflow';
import { canvasUiLeftMenuBarOpenAtom } from '../../states/atoms/canvas-ui';
import {
  currentWorkflowIdAtom,
  workflowsAtom,
} from '../../states/atoms/workflows';

function LeftMenuBar() {
  const workflows = useAtomValue(workflowsAtom);
  const currentWorkflowId = useAtomValue(currentWorkflowIdAtom);
  const [leftMenuBarOpen, setLeftMenuBarOpen] = useAtom(
    canvasUiLeftMenuBarOpenAtom,
  );

  const navigate = useNavigate();

  const leftMenuBarRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={leftMenuBarRef}
        css={css`
          top: 0;
          left: 0;
          position: fixed;
          width: 300px;
          height: 100vh;
          background-color: white;
          border-right: 1px solid #e0e0e0;
          z-index: ${ZIndex.LEFT_MENU_BAR};
          transform: translateX(${leftMenuBarOpen ? '0' : '-300px'});
          transition: transform 0.2s;
        `}
      >
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            padding: 5px;
          `}
        >
          <IconButton
            variant="plain"
            onClick={() => {
              createFlow(navigate);
            }}
          >
            <IconPlusCircleFill
              css={css`
                fill: gray;
                width: 18px;
                height: 18px;
              `}
            />
          </IconButton>
          <IconButton
            variant="plain"
            onClick={() => {
              setLeftMenuBarOpen((prev) => !prev);
            }}
          >
            <IconChevronLeftTwo
              css={css`
                fill: gray;
                width: 18px;
                height: 18px;
              `}
            />
          </IconButton>
        </div>
        <div
          css={css`
            padding-left: 5px;
            padding-right: 5px;
          `}
        >
          {workflows.map((workflow) => (
            <Link
              key={workflow.id}
              css={css`
                text-decoration: none;
                color: black;
              `}
              to={generatePathForWorkflowEditorRoute(workflow.id)}
            >
              <div
                css={css`
                  background-color: ${workflow.id === currentWorkflowId
                    ? '#f0f0f0'
                    : 'transparent'};
                  padding: 5px;
                `}
              >
                {workflow.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {leftMenuBarOpen && (
        <div
          css={css`
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.2);
            z-index: ${ZIndex.LEFT_MENU_BAR_BACKDROP};
          `}
          onClick={() => {
            setLeftMenuBarOpen(false);
          }}
        />
      )}
    </>
  );
}

export default LeftMenuBar;
