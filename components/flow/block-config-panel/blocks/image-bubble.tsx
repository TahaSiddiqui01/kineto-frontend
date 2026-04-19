'use client';

import { BlockConfigField } from '../block-config-field';
import { VariablePickerPopover } from '../variable-picker-popover';
import { useVariableInsertion } from '../hooks/use-variable-insertion';
import type { BlockConfigProps } from '../types';


const fields = [
  { key: 'text', label: 'Message', type: 'textarea', placeholder: 'Type your message…' },
]

export function TextBubbleConfig({ block, onChange }: BlockConfigProps) {
  const value = block.content["text"] as string | undefined;
  const { inputRef, onInsert } = useVariableInsertion(value, "text", onChange);

  return (
    <div className="flex flex-col gap-4">
      <BlockConfigField
        field={fields[0]}
        value={value}
        onChange={onChange}
        inputRef={inputRef}
        labelAddon={<VariablePickerPopover onSelect={onInsert} />}
      />
    </div>
  );
}
