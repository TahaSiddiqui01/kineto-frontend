'use client';

import { useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { VariableSelectDropdown } from '../../variable-select-dropdown';
import { VariablePickerPopover } from '../../variable-picker-popover';
import { useVariableInsertion } from '../../hooks/use-variable-insertion';
import type { BlockConfigProps } from '../../types';

const inputClass = 'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

interface Props {
  valueType: string;
  value: string | undefined;
  listVariable: string | undefined;
  indexListVariable: string | undefined;
  timezone: string | undefined;
  executeOnClient: boolean;
  onChange: BlockConfigProps['onChange'];
}

export function ValueTypeSection({ valueType, value, listVariable, indexListVariable, timezone, executeOnClient, onChange }: Props) {
  const { inputRef: valueRef, onInsert: insertIntoValue } = useVariableInsertion(value, 'value', onChange);

  if (valueType === 'custom') {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-400">Value</label>
            <VariablePickerPopover onSelect={insertIntoValue} />
          </div>
          <textarea
            ref={valueRef as React.Ref<HTMLTextAreaElement>}
            value={value ?? ''}
            onChange={(e) => onChange({ value: e.target.value })}
            placeholder="Type a value or expression…"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="sv-execute-client"
            checked={executeOnClient}
            onCheckedChange={(checked) => onChange({ executeOnClient: checked === true })}
          />
          <label htmlFor="sv-execute-client" className="text-xs text-gray-400 cursor-pointer select-none">
            Execute on client
          </label>
        </div>
      </div>
    );
  }

  if (valueType === 'append') {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-400">Value to append</label>
          <VariablePickerPopover onSelect={insertIntoValue} />
        </div>
        <input
          ref={valueRef as React.Ref<HTMLInputElement>}
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange({ value: e.target.value })}
          placeholder="Value to append…"
          className={inputClass}
        />
      </div>
    );
  }

  if (valueType === 'now' || valueType === 'yesterday' || valueType === 'tomorrow') {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Timezone <span className="text-gray-600 font-normal">(optional)</span></label>
        <input
          type="text"
          value={timezone ?? ''}
          onChange={(e) => onChange({ timezone: e.target.value })}
          placeholder="e.g. America/New_York"
          className={inputClass}
        />
        <p className="text-[10px] text-gray-600">Returns ISO 8601 format. Leave blank for UTC.</p>
      </div>
    );
  }

  if (valueType === 'map-item') {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">List variable</label>
          <VariableSelectDropdown
            value={listVariable}
            onChange={(name) => onChange({ listVariable: name })}
            placeholder="Select list variable…"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">Index list variable</label>
          <VariableSelectDropdown
            value={indexListVariable}
            onChange={(name) => onChange({ indexListVariable: name })}
            placeholder="Select index variable…"
          />
        </div>
      </div>
    );
  }

  if (valueType === 'empty') {
    return (
      <p className="text-[11px] text-gray-500 bg-[#1c1d20] rounded-lg px-2.5 py-2 border border-[#2e2f33]">
        This will reset the variable to an uninitialized state.
      </p>
    );
  }

  // For environment-name, device-type, transcript, result-id, random-id, moment-of-day, phone-number, contact-name, pop, shift
  // no additional config needed — show an info hint
  const hints: Record<string, string> = {
    'environment-name': 'Sets to "web" or "whatsapp".',
    'device-type': 'Sets to "desktop", "tablet", or "mobile".',
    'transcript': 'Stores the full conversation history.',
    'result-id': 'Captures the current user\'s result ID.',
    'random-id': 'Generates a unique CUID.',
    'moment-of-day': 'Sets to "morning", "afternoon", "evening", or "night".',
    'phone-number': 'WhatsApp only — captures the user\'s phone number.',
    'contact-name': 'WhatsApp only — captures the user\'s display name.',
    'pop': 'Removes and returns the last item from the list variable.',
    'shift': 'Removes and returns the first item from the list variable.',
  };

  const hint = hints[valueType];
  if (!hint) return null;

  return (
    <p className="text-[11px] text-gray-500 bg-[#1c1d20] rounded-lg px-2.5 py-2 border border-[#2e2f33]">
      {hint}
    </p>
  );
}
