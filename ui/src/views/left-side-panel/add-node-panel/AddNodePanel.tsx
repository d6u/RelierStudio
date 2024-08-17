import { css } from '@emotion/react';

import { NODE_TYPES } from 'canvas-data-unified';

import AddNodeCard from './components/AddNodeCard';

function AddNodePanel() {
  return (
    <div
      css={css`
        min-height: 100%;
        padding: 10px;
        background-color: #f6f7f8;
        display: grid;
        // NOTE: The actual width of AddNodeCard is more than 300px
        // This is to make sure when left side panel is expanded,
        // AddNodePanel can render 2 cards per row, while keeping 1 card per
        // row when left side panel is contracted.
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        // NOTE: 107px is the height of AddNodeCard
        grid-auto-rows: 107px;
        gap: 10px;
      `}
    >
      {NODE_TYPES.map((nodeType) => {
        return <AddNodeCard key={nodeType} nodeType={nodeType} />;
      })}
    </div>
  );
}

export default AddNodePanel;
