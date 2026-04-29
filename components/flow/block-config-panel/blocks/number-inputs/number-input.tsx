'use client';

import { VariableSelectDropdown } from '../../variable-select-dropdown';
import type { BlockConfigProps } from '../../types';
import { FieldWithVariable } from './field-with-variable';
import { FormatSection } from './format-section';


// ── Main component ────────────────────────────────────────────────────────────

export function NumberInputConfig({ block, onChange }: BlockConfigProps) {
  const placeholder = block.content.placeholder as string | undefined;
  const buttonLabel = block.content.buttonLabel as string | undefined;
  const retryMessage = block.content.retryMessage as string | undefined;
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

      <FieldWithVariable
        label="Retry message"
        fieldKey="retryMessage"
        value={retryMessage}
        placeholder="That doesn't look like a number. Please try again."
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
