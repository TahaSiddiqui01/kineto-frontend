'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { VariableSelectDropdown } from '../variable-select-dropdown';

interface SaveFieldRowProps {
  id: string;
  label: string;
  variable: string | undefined;
  onToggle: (enabled: boolean) => void;
  onVariableChange: (name: string | undefined) => void;
}

export function SaveFieldRow({ id, label, variable, onToggle, onVariableChange }: SaveFieldRowProps) {
  const enabled = variable !== undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          checked={enabled}
          onCheckedChange={(checked) => onToggle(checked === true)}
        />
        <label htmlFor={id} className="text-xs text-gray-400 cursor-pointer select-none">
          {label}
        </label>
      </div>
      {enabled && (
        <div className="pl-6">
          <VariableSelectDropdown
            value={variable}
            onChange={onVariableChange}
            placeholder="Select a variable…"
          />
        </div>
      )}
    </div>
  );
}
