'use client';

import { useRef, useCallback } from 'react';
import type { BlockContent } from '@/types/flow';

export function useVariableInsertion(
  value: string | undefined,
  fieldKey: string,
  onChange: (patch: Partial<BlockContent>) => void
) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const onInsert = useCallback(
    (varName: string) => {
      const token = `{{${varName}}}`;
      const cur = value ?? '';
      const el = inputRef.current;

      if (!el) {
        onChange({ [fieldKey]: cur + token });
        return;
      }

      const start = el.selectionStart ?? cur.length;
      const end = el.selectionEnd ?? cur.length;
      onChange({ [fieldKey]: cur.slice(0, start) + token + cur.slice(end) });

      requestAnimationFrame(() => {
        el.focus();
        const pos = start + token.length;
        el.setSelectionRange(pos, pos);
      });
    },
    [value, fieldKey, onChange]
  );

  return { inputRef, onInsert };
}
