'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { VariableSelectDropdown } from '../../variable-select-dropdown';
import type { BlockConfigProps } from '../../types';
import { FieldWithVariable } from '../number-inputs/field-with-variable';
import { DateRangeSection } from './date-range-section';


export function DateInputConfig({ block, onChange }: BlockConfigProps) {
  const isRange = (block.content.isRange as boolean | undefined) ?? false;
  const withTime = (block.content.withTime as boolean | undefined) ?? false;
  const fromLabel = block.content.fromLabel as string | undefined;
  const toLabel = block.content.toLabel as string | undefined;
  const min = block.content.min as string | undefined;
  const max = block.content.max as string | undefined;
  const format = block.content.format as string | undefined;
  const saveAnswerTo = block.content.saveAnswerTo as string | undefined;

  return (
    <div className="flex flex-col gap-4">
      <DateRangeSection
        isRange={isRange}
        fromLabel={fromLabel}
        toLabel={toLabel}
        onChange={onChange}
      />

      <div className="flex items-center gap-2">
        <Checkbox
          id="withTime"
          checked={withTime}
          onCheckedChange={(checked) =>
            onChange({ withTime: checked === true })
          }
        />
        <label
          htmlFor="withTime"
          className="text-xs font-medium text-gray-400 cursor-pointer select-none"
        >
          With Time
        </label>
      </div>

      <div className="h-px bg-[#2e2f33]" />

      <div className="grid grid-cols-2 gap-2">
        <FieldWithVariable
          label="Min"
          fieldKey="min"
          value={min}
          placeholder="—"
          onChange={onChange}
        />
        <FieldWithVariable
          label="Max"
          fieldKey="max"
          value={max}
          placeholder="—"
          onChange={onChange}
        />
      </div>

      <FieldWithVariable
        label="Format"
        fieldKey="format"
        value={format}
        placeholder={withTime ? 'MM/DD/YYYY HH:mm' : 'MM/DD/YYYY'}
        onChange={onChange}
      />
      <p className="text-[10px] text-gray-600 -mt-2">
        e.g. MM/DD/YYYY, DD-MM-YYYY, YYYY-MM-DD
        {withTime ? ', HH:mm, hh:mm a' : ''}
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
