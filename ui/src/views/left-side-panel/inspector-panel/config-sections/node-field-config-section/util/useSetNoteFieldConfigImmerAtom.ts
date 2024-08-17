import { useImmerAtom } from 'jotai-immer';
import { focusAtom } from 'jotai-optics';
import { useMemo } from 'react';

import { canvasNodeConfigsAtom } from '../../../../../../states/atoms/canvas-data';

function useSetFieldConfigImmerAtom<T>(
  nodeId: string,
  fieldKey: string,
  fieldIndex: number,
) {
  const [fieldConfig_, setFieldConfig_] = useImmerAtom(
    useMemo(
      () =>
        focusAtom(canvasNodeConfigsAtom, (optic) => {
          return optic
            .prop(nodeId)
            .prop('fields')
            .prop(fieldKey)
            .prop('configs')
            .prop(fieldIndex);
        }),
      [fieldIndex, fieldKey, nodeId],
    ),
  );

  const fieldConfig = fieldConfig_ as T;
  // NOTE: This probably should be Draft<T> but it's causing type errors
  const setFieldConfig = setFieldConfig_ as (fn: (draft: T) => void) => void;

  return [fieldConfig, setFieldConfig] as const;
}

export default useSetFieldConfigImmerAtom;
