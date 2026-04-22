'use client';

import { VariableSelectDropdown } from '../../variable-select-dropdown';
import type { BlockConfigProps } from '../../types';
import { FieldWithVariable } from '../number-inputs/field-with-variable';


export function WebsiteInputConfig({ block, onChange }: BlockConfigProps) {
  const placeholder = block.content.placeholder as string | undefined;
  const buttonLabel = block.content.buttonLabel as string | undefined;
  const retryMessage = block.content.retryMessage as string | undefined;
  const saveAnswerTo = block.content.saveAnswerTo as string | undefined;

  return (
    <div className="flex flex-col gap-4">
      <FieldWithVariable
        label="Placeholder"
        fieldKey="placeholder"
        value={placeholder}
        placeholder="https://example.com"
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
        placeholder="Invalid URL, please try again."
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
