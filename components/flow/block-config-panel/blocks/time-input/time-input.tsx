'use client';

import { VariableSelectDropdown } from '../../variable-select-dropdown';
import type { BlockConfigProps } from '../../types';
import { FieldWithVariable } from '../number-inputs/field-with-variable';


export function TimeInputConfig({ block, onChange }: BlockConfigProps) {
  const format = block.content.format as string | undefined;
  const buttonLabel = block.content.buttonLabel as string | undefined;
  const saveAnswerTo = block.content.saveAnswerTo as string | undefined;

  return (
    <div className="flex flex-col gap-4">
      <FieldWithVariable
        label="Format"
        fieldKey="format"
        value={format}
        placeholder="HH:mm"
        onChange={onChange}
      />
      <p className="text-[10px] text-gray-600 -mt-2">
        e.g. HH:mm (24h), hh:mm a (12h), HH:mm:ss
      </p>

      <FieldWithVariable
        label="Button label"
        fieldKey="buttonLabel"
        value={buttonLabel}
        placeholder="Send"
        onChange={onChange}
      />

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
