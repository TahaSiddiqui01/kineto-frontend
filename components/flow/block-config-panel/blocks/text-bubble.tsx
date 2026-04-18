'use client';

import { BLOCK_CONFIG_SCHEMAS_MAP } from '@/lib/flow/block-config-schemas';
import { BlockConfigField } from '../block-config-field';
import { VariablePickerPopover } from '../variable-picker-popover';
import { useVariableInsertion } from '../hooks/use-variable-insertion';
import type { BlockConfigProps } from '../types';

const fields = BLOCK_CONFIG_SCHEMAS_MAP.get('text-bubble')?.fields ?? [];
const messageField = fields.find((f) => f.key === 'text')!;

export function TextBubbleConfig({ block, onChange }: BlockConfigProps) {
  const value = block.content[messageField.key] as string | undefined;
  const { inputRef, onInsert } = useVariableInsertion(value, messageField.key, onChange);

  return (
    <div className="flex flex-col gap-4">
      <BlockConfigField
        field={messageField}
        value={value}
        onChange={onChange}
        inputRef={inputRef}
        labelAddon={<VariablePickerPopover onSelect={onInsert} />}
      />
    </div>
  );
}
