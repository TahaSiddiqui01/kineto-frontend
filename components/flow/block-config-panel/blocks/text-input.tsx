'use client';

import { VariablePickerPopover } from '../variable-picker-popover';
import { VariableSelectDropdown } from '../variable-select-dropdown';
import { useVariableInsertion } from '../hooks/use-variable-insertion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BlockConfigProps } from '../types';

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

const INPUT_MODES = [
  { value: 'text', label: 'Text' },
  { value: 'decimal', label: 'Decimal' },
  { value: 'numeric', label: 'Numeric' },
  { value: 'tel', label: 'Tel' },
  { value: 'search', label: 'Search' },
  { value: 'email', label: 'Email' },
  { value: 'url', label: 'URL' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldWithVariable({
  label,
  fieldKey,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  fieldKey: string;
  value: string | undefined;
  placeholder: string;
  onChange: BlockConfigProps['onChange'];
}) {
  const { inputRef, onInsert } = useVariableInsertion(value, fieldKey, onChange);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">{label}</label>
        <VariablePickerPopover onSelect={onInsert} />
      </div>
      <input
        ref={inputRef as React.Ref<HTMLInputElement>}
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange({ [fieldKey]: e.target.value })}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function TextInputConfig({ block, onChange }: BlockConfigProps) {
  const placeholder = block.content.placeholder as string | undefined;
  const buttonLabel = block.content.buttonLabel as string | undefined;
  const retryMessage = block.content.retryMessage as string | undefined;
  const inputMode = (block.content.inputMode as string | undefined) ?? 'text';
  const saveAnswerTo = block.content.saveAnswerTo as string | undefined;

  return (
    <div className="flex flex-col gap-4">
      <FieldWithVariable
        label="Placeholder"
        fieldKey="placeholder"
        value={placeholder}
        placeholder="Type a placeholder…"
        onChange={onChange}
      />

      <FieldWithVariable
        label="Button label"
        fieldKey="buttonLabel"
        value={buttonLabel}
        placeholder="Send"
        onChange={onChange}
      />

      <FieldWithVariable
        label="Retry message"
        fieldKey="retryMessage"
        value={retryMessage}
        placeholder="Please send a text message."
        onChange={onChange}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Input mode</label>
        <Select value={inputMode} onValueChange={(val) => onChange({ inputMode: val })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INPUT_MODES.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="h-px bg-[#2e2f33]" />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">
          Save answer into variable{' '}
          <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <VariableSelectDropdown
          value={saveAnswerTo}
          onChange={(name) => onChange({ saveAnswerTo: name })}
        />
      </div>
    </div>
  );
}
