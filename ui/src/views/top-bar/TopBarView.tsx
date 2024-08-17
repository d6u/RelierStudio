import { css } from '@emotion/react';
import {
  Button,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  ToggleButtonGroup,
} from '@mui/joy';
import { useAtom, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';

import IconArrowshapeLeftArrowshapeRight from '../../icons/IconArrowshapeLeftArrowshapeRight';
import IconLineThreeHorizontal from '../../icons/IconLineThreeHorizontal';
import IconThreeDots from '../../icons/IconThreeDots';
import { deleteFlow } from '../../states/actions/workflow';
import {
  LeftSidePanelType,
  canvasLeftSidePanelExpandedAtom,
  canvasLeftSidePanelTypeAtom,
} from '../../states/atoms/canvas-left-side-panel';
import { canvasUiLeftMenuBarOpenAtom } from '../../states/atoms/canvas-ui';

function TopBarView() {
  const [leftSidePanelType, setLeftSidePanelType] = useAtom(
    canvasLeftSidePanelTypeAtom,
  );

  const [leftSidePanelExpanded, setLeftSidePanelExpanded] = useAtom(
    canvasLeftSidePanelExpandedAtom,
  );

  const setLeftMenuBarOpen = useSetAtom(canvasUiLeftMenuBarOpenAtom);

  const navigate = useNavigate();

  return (
    <div
      css={css`
        grid-area: top-bar;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        padding-left: 10px;
        padding-right: 10px;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          gap: 5px;
        `}
      >
        <IconButton
          variant="outlined"
          onClick={() => {
            setLeftMenuBarOpen((prev) => !prev);
          }}
        >
          <IconLineThreeHorizontal
            css={css`
              fill: gray;
              width: 18px;
              height: 18px;
            `}
          />
        </IconButton>
        <ToggleButtonGroup
          value={leftSidePanelType}
          onChange={(_event, value: LeftSidePanelType | null) => {
            if (value != null) {
              setLeftSidePanelType(value);
            }
          }}
        >
          <Button value={LeftSidePanelType.CavnasConfig}>Settings</Button>
          <Button value={LeftSidePanelType.AddNode}>Add Node</Button>
          <Button value={LeftSidePanelType.Inspector}>Inspector</Button>
          <Button value={LeftSidePanelType.Simulate}>Simulate</Button>
          <Button value={LeftSidePanelType.RunHistories}>Histories</Button>
        </ToggleButtonGroup>
        <IconButton
          variant={leftSidePanelExpanded ? 'solid' : 'outlined'}
          onClick={() => {
            setLeftSidePanelExpanded((prev) => !prev);
          }}
        >
          <IconArrowshapeLeftArrowshapeRight
            css={css`
              fill: ${leftSidePanelExpanded ? 'white' : 'gray'};
              width: 18px;
              height: 18px;
            `}
          />
        </IconButton>
        {/* <ButtonGroup>
          <Button
            disabled={canvasHistory.pointerIndex < 0}
            onClick={() => {
              undo();
            }}
          >
            Undo
          </Button>
          <Button
            disabled={
              canvasHistory.pointerIndex ===
              canvasHistory.patchesHistory.length - 1
            }
            onClick={() => {
              redo();
            }}
          >
            Redo
          </Button>
        </ButtonGroup> */}
      </div>
      <div
        css={css`
          display: flex;
          align-items: center;
          gap: 5px;
        `}
      >
        <Dropdown>
          <MenuButton
            slots={{ root: IconButton }}
            slotProps={{ root: { variant: 'plain' } }}
          >
            <IconThreeDots
              css={css`
                fill: gray;
                width: 18px;
                height: 18px;
                rotate: 90deg;
              `}
            />
          </MenuButton>
          <Menu>
            <MenuItem
              onClick={() => {
                deleteFlow(navigate);
              }}
            >
              Delete workflow
            </MenuItem>
          </Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default TopBarView;
