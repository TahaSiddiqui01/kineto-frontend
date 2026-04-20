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
import { CURRENCY_CODES, UNIT_OPTIONS } from '@/helpers';

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

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

function FormatSection({
  format,
  currency,
  unit,
  onChange,
}: {
  format: string;
  currency: string | undefined;
  unit: string | undefined;
  onChange: BlockConfigProps['onChange'];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Format</label>
        <Select
          value={format}
          onValueChange={(val) => onChange({ format: val, currency: undefined, unit: undefined })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent >
            <SelectItem value="decimal" >Decimal</SelectItem>
            <SelectItem value="currency" >Currency</SelectItem>
            <SelectItem value="percent" >Percentage</SelectItem>
            <SelectItem value="unit" >Unit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {format === 'currency' && (
        <div className="flex flex-col gap-1.5 pl-1 border-l-2 border-[#2e2f33]">
          <label className="text-xs font-medium text-gray-400">Currency</label>
          <Select value={currency ?? 'USD'} onValueChange={(val) => onChange({ currency: val })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent >
              {CURRENCY_CODES.map((c) => (
                <SelectItem key={c.value} value={c.value} >
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {format === 'unit' && (
        <div className="flex flex-col gap-1.5 pl-1 border-l-2 border-[#2e2f33]">
          <label className="text-xs font-medium text-gray-400">Unit</label>
          <Select value={unit ?? 'meter'} onValueChange={(val) => onChange({ unit: val })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent >
              {UNIT_OPTIONS.map((u) => (
                <SelectItem key={u.value} value={u.value} >
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function NumberInputConfig({ block, onChange }: BlockConfigProps) {
  const placeholder = block.content.placeholder as string | undefined;
  const buttonLabel = block.content.buttonLabel as string | undefined;
  const min = block.content.min as string | undefined;
  const max = block.content.max as string | undefined;
  const step = block.content.step as string | undefined;
  const format = (block.content.format as string | undefined) ?? 'decimal';
  const currency = block.content.currency as string | undefined;
  const unit = block.content.unit as string | undefined;
  const locale = block.content.locale as string | undefined;
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

      <div className="h-px bg-[#2e2f33]" />

      {/* Min / Max / Step row */}
      <div className="grid grid-cols-3 gap-2">
        <FieldWithVariable label="Min" fieldKey="min" value={min} placeholder="—" onChange={onChange} />
        <FieldWithVariable label="Max" fieldKey="max" value={max} placeholder="—" onChange={onChange} />
        <FieldWithVariable label="Step" fieldKey="step" value={step} placeholder="—" onChange={onChange} />
      </div>

      <FormatSection format={format} currency={currency} unit={unit} onChange={onChange} />

      <FieldWithVariable
        label="Locale"
        fieldKey="locale"
        value={locale}
        placeholder="en-US"
        onChange={onChange}
      />
      <p className="text-[10px] text-gray-600 -mt-2">
        Locale codes follow the format &apos;en&apos; or &apos;en-US&apos; (language-region).
      </p>

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
