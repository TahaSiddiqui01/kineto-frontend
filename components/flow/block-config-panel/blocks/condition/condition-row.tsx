'use client';

import { Trash2 } from 'lucide-react';
import { VariableSelectDropdown } from '../../variable-select-dropdown';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const inputClass = 'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

const OPERATORS = [
  { value: 'equal', label: 'Equal to' },
  { value: 'not-equal', label: 'Not equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'not-contains', label: 'Does not contain' },
  { value: 'greater-than', label: 'Greater than' },
  { value: 'less-than', label: 'Less than' },
  { value: 'is-set', label: 'Is set' },
  { value: 'is-empty', label: 'Is empty' },
  { value: 'starts-with', label: 'Starts with' },
  { value: 'ends-with', label: 'Ends with' },
  { value: 'matches-regex', label: 'Matches regex' },
  { value: 'not-matches-regex', label: 'Does not match regex' },
];

const NO_VALUE_OPERATORS = ['is-set', 'is-empty'];

export interface ConditionItem {
  id: string;
  variableName: string | undefined;
  operator: string;
  value: string;
}

interface ConditionRowProps {
  item: ConditionItem;
  canRemove: boolean;
  onUpdate: (updated: ConditionItem) => void;
  onRemove: () => void;
}

export function ConditionRow({ item, canRemove, onUpdate, onRemove }: ConditionRowProps) {
  const showValue = !NO_VALUE_OPERATORS.includes(item.operator);

  return (
    <div className="flex flex-col gap-1.5 p-2.5 rounded-lg border border-[#2e2f33] bg-[#1c1d20]">
      <div className="flex items-center gap-1.5">
        <div className="flex-1 min-w-0">
          <VariableSelectDropdown
            value={item.variableName}
            onChange={(name) => onUpdate({ ...item, variableName: name })}
            placeholder="Select variable…"
          />
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 text-gray-600 hover:text-red-400 transition-colors p-1 cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
      <Select value={item.operator} onValueChange={(val) => onUpdate({ ...item, operator: val })}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPERATORS.map((op) => (
            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showValue && (
        <input
          type="text"
          value={item.value}
          onChange={(e) => onUpdate({ ...item, value: e.target.value })}
          placeholder="Value…"
          className={inputClass}
        />
      )}
    </div>
  );
}
