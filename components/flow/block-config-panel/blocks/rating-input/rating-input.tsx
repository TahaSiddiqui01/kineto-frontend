'use client';

import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VariableSelectDropdown } from '../../variable-select-dropdown';
import type { BlockConfigProps } from '../../types';
import { FieldWithVariable } from '../number-inputs/field-with-variable';

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

const ALL_ICON_NAMES = (Object.keys(LucideIcons) as string[]).filter((name) => {
  if (!/^[A-Z]/.test(name)) return false;
  const val = (LucideIcons as Record<string, unknown>)[name];
  return (
    typeof val === 'function' ||
    (typeof val === 'object' && val !== null && '$$typeof' in (val as object))
  );
});

export function RatingInputConfig({ block, onChange }: BlockConfigProps) {
  const min = block.content.min as string | undefined;
  const max = block.content.max as string | undefined;
  const ratingType = (block.content.ratingType as string | undefined) ?? 'numeric';
  const iconName = (block.content.iconName as string | undefined) ?? 'Star';
  const oneClickSubmit = (block.content.oneClickSubmit as boolean | undefined) ?? false;
  const minLabel = block.content.minLabel as string | undefined;
  const maxLabel = block.content.maxLabel as string | undefined;
  const saveAnswerTo = block.content.saveAnswerTo as string | undefined;

  const [iconSearch, setIconSearch] = useState('');

  const filteredIcons = ALL_ICON_NAMES.filter((name) =>
    name.toLowerCase().includes(iconSearch.toLowerCase())
  ).slice(0, 60);

  return (
    <div className="flex flex-col gap-4">
      {/* Min / Max */}
      <div className="grid grid-cols-2 gap-2">
        <FieldWithVariable
          label="Min"
          fieldKey="min"
          value={min}
          placeholder="1"
          onChange={onChange}
        />
        <FieldWithVariable
          label="Max"
          fieldKey="max"
          value={max}
          placeholder="5"
          onChange={onChange}
        />
      </div>

      {/* Min / Max labels */}
      <div className="grid grid-cols-2 gap-2">
        <FieldWithVariable
          label="Min label"
          fieldKey="minLabel"
          value={minLabel}
          placeholder="Poor"
          onChange={onChange}
        />
        <FieldWithVariable
          label="Max label"
          fieldKey="maxLabel"
          value={maxLabel}
          placeholder="Excellent"
          onChange={onChange}
        />
      </div>

      <div className="h-px bg-[#2e2f33]" />

      {/* Rating type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Type</label>
        <Select value={ratingType} onValueChange={(val) => onChange({ ratingType: val })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="numeric">Numeric</SelectItem>
            <SelectItem value="icon">Icon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Icon picker when type is 'icon' */}
      {ratingType === 'icon' && (
        <div className="flex flex-col gap-2 pl-1 border-l-2 border-[#2e2f33]">
          <label className="text-xs font-medium text-gray-400">Icon</label>
          <input
            value={iconSearch}
            onChange={(e) => setIconSearch(e.target.value)}
            placeholder="Search icons…"
            className={inputClass}
          />
          <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto">
            {filteredIcons.map((name) => {
              const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size: number; strokeWidth: number; fill?: string }>>)[name];
              const selected = iconName === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => onChange({ iconName: name })}
                  title={name}
                  className={`flex items-center justify-center p-1.5 rounded-md border-2 cursor-pointer transition-all hover:bg-[#2e2f33] bg-[#16171a] ${
                    selected ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    fill={selected ? 'currentColor' : 'none'}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          id="oneClickSubmit"
          checked={oneClickSubmit}
          onCheckedChange={(checked) => onChange({ oneClickSubmit: checked === true })}
        />
        <label htmlFor="oneClickSubmit" className="text-xs font-medium text-gray-400 cursor-pointer select-none">
          One click submit
        </label>
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
