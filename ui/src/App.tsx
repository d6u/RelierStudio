import { Global, css } from '@emotion/react';
import { ThemeProvider, extendTheme } from '@mui/joy';
import { Provider } from 'jotai';
import { useMemo } from 'react';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from 'react-router-dom';
import 'reactflow/dist/style.css';

import {
  CANVAS_HANDLE_CONDITION_COLOR_HEAVY,
  CANVAS_HANDLE_CONDITION_COLOR_LIGHT,
  CANVAS_HANDLE_VARIABLE_COLOR_HEAVY,
  CANVAS_HANDLE_VARIABLE_COLOR_LIGHT,
  CANVAS_NODE_CONTENT_WRAPPER_CLASS_NAME,
} from './constants/canvas-constants';
import RootRoute from './routes/RootRoute';
import WorkflowEditorRoute from './routes/WorkflowEditorRoute';
import {
  rootRouteCatchAllLoader,
  workflowEditorRouteLoader,
} from './routes/loaders';
import { ROOT_PATH } from './routes/root-route-util';
import { WORKFLOW_EDITOR_ROUTE_SUB_PATH } from './routes/workflow-editor-route-util';
import { canvasStore } from './states/store';

const MUI_THEME = extendTheme({
  fontFamily: {
    body: '"Inter", sans-serif',
  },
  components: {
    JoyInput: {
      defaultProps: {
        size: 'sm',
        variant: 'outlined',
        color: 'neutral',
      },
    },
    JoyAutocomplete: {
      defaultProps: {
        size: 'sm',
      },
    },
    JoyTextarea: {
      defaultProps: {
        size: 'sm',
        variant: 'outlined',
        color: 'neutral',
      },
    },
    JoySelect: {
      defaultProps: {
        size: 'sm',
        variant: 'outlined',
        color: 'neutral',
      },
    },
    JoyRadioGroup: {
      defaultProps: {
        size: 'sm',
        color: 'neutral',
      },
    },
    JoyRadio: {
      defaultProps: {
        size: 'sm',
        variant: 'outlined',
        color: 'neutral',
      },
    },
    JoyButtonGroup: {
      defaultProps: {
        size: 'sm',
        variant: 'outlined',
        color: 'neutral',
      },
    },
    JoyToggleButtonGroup: {
      defaultProps: {
        size: 'sm',
      },
    },
    JoyButton: {
      defaultProps: {
        size: 'sm',
        variant: 'solid',
        color: 'neutral',
      },
    },
    JoyIconButton: {
      defaultProps: {
        size: 'sm',
        variant: 'plain',
        color: 'neutral',
      },
    },
    JoyMenuButton: {
      defaultProps: {
        size: 'sm',
        variant: 'solid',
        color: 'neutral',
      },
    },
    JoyMenu: {
      defaultProps: {
        size: 'sm',
      },
    },
    JoyMenuItem: {
      defaultProps: {
        color: 'primary', // Somehow this doesn't work
      },
    },
    JoyFormControl: {
      defaultProps: {
        size: 'sm',
      },
    },
    JoyTable: {
      defaultProps: {
        size: 'sm',
        borderAxis: 'both',
        noWrap: true,
        hoverRow: true,
        sx: {
          'tableLayout': 'auto',
          '--Table-headerUnderlineThickness': '1px',
          '--TableCell-headBackground': '#ebebeb',
          'td': {
            whiteSpace: 'normal',
          },
        },
      },
    },
    JoyAccordionGroup: {
      defaultProps: {
        size: 'sm',
      },
    },
  },
});

type Props = {
  // Hash router is used for Electron app
  useHashRouter?: boolean;
};

function App(props: Props) {
  const router = useMemo(() => {
    const createRouter = props.useHashRouter
      ? createHashRouter
      : createBrowserRouter;

    return createRouter([
      {
        path: ROOT_PATH,
        element: <RootRoute />,
        children: [
          {
            index: true,
            loader: rootRouteCatchAllLoader,
          },
          {
            path: WORKFLOW_EDITOR_ROUTE_SUB_PATH,
            loader: workflowEditorRouteLoader,
            element: <WorkflowEditorRoute />,
          },
          {
            path: '*',
            loader: rootRouteCatchAllLoader,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" />,
      },
    ]);
  }, [props.useHashRouter]);

  return (
    <>
      <Global
        styles={css`
          // NOTE: Reset styles

          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          * {
            margin: 0;
          }

          html,
          body {
            height: 100%;
          }

          body {
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
          }

          img,
          picture,
          video,
          canvas,
          svg {
            display: block;
            max-width: 100%;
          }

          p,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            overflow-wrap: break-word;
          }

          #root {
            isolation: isolate;
          }

          // NOTE: Custom styles

          :root {
            --font-family: 'Inter', sans-serif;
            --font-family-mono: 'Menlo', monospace;
          }

          body {
            font-family: var(--font-family);
          }

          code {
            font-family: var(--font-family-mono);
          }

          // NOTE: Custom style for reactflow

          :root {
            --node-selected-background: linear-gradient(
              344deg,
              #64b6fb 0%,
              #276eff 100%
            );
            --canvas-handle-condition-color-light: ${CANVAS_HANDLE_CONDITION_COLOR_LIGHT};
            --canvas-handle-condition-color-heavy: ${CANVAS_HANDLE_CONDITION_COLOR_HEAVY};
            --canvas-handle-variable-color-light: ${CANVAS_HANDLE_VARIABLE_COLOR_LIGHT};
            --canvas-handle-variable-color-heavy: ${CANVAS_HANDLE_VARIABLE_COLOR_HEAVY};
          }

          .react-flow__node.selectable:focus
            .${CANVAS_NODE_CONTENT_WRAPPER_CLASS_NAME} {
            background: var(--node-selected-background);
          }
        `}
      />
      <ThemeProvider theme={MUI_THEME}>
        <Provider store={canvasStore}>
          <RouterProvider router={router} />
        </Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
