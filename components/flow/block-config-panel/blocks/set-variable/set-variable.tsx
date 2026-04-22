'use client';

import type { BlockConfigProps } from '../../types';
import { VariableSelectDropdown } from '../../variable-select-dropdown';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ValueTypeSection } from './value-type-section';

const VALUE_TYPES = [
  { value: 'custom', label: 'Custom' },
  { value: 'empty', label: 'Empty' },
  { value: 'append', label: 'Append value(s)' },
  { value: 'environment-name', label: 'Environment name' },
  { value: 'device-type', label: 'Device type' },
  { value: 'transcript', label: 'Transcript' },
  { value: 'result-id', label: 'Result ID' },
  { value: 'now', label: 'Now' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'random-id', label: 'Random ID' },
  { value: 'moment-of-day', label: 'Moment of day' },
  { value: 'map-item', label: 'Map item (same index)' },
  { value: 'phone-number', label: 'Phone number' },
  { value: 'contact-name', label: 'Contact name' },
  { value: 'pop', label: 'Pop (remove last)' },
  { value: 'shift', label: 'Shift (remove first)' },
];

export function SetVariableConfig({ block, onChange }: BlockConfigProps) {
  const variable = block.content.variable as string | undefined;
  const valueType = (block.content.valueType as string | undefined) ?? 'custom';
  const value = block.content.value as string | undefined;
  const listVariable = block.content.listVariable as string | undefined;
  const indexListVariable = block.content.indexListVariable as string | undefined;
  const timezone = block.content.timezone as string | undefined;
  const executeOnClient = (block.content.executeOnClient as boolean | undefined) ?? false;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Variable</label>
        <VariableSelectDropdown
          value={variable}
          onChange={(name) => onChange({ variable: name })}
          placeholder="Select variable to set…"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Set value</label>
        <Select value={valueType} onValueChange={(val) => onChange({ valueType: val, value: undefined, listVariable: undefined, indexListVariable: undefined, timezone: undefined })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VALUE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ValueTypeSection
        valueType={valueType}
        value={value}
        listVariable={listVariable}
        indexListVariable={indexListVariable}
        timezone={timezone}
        executeOnClient={executeOnClient}
        onChange={onChange}
      />
    </div>
  );
}
