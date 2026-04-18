'use client';

import React from 'react';
import type { BlockFieldSchema, BlockContent } from '@/types/flow';

interface BlockConfigFieldProps {
  field: BlockFieldSchema;
  value: string | boolean | undefined;
  onChange: (patch: Partial<BlockContent>) => void;
  inputRef?: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  labelAddon?: React.ReactNode;
}

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

export function BlockConfigField({ field, value, onChange, inputRef, labelAddon }: BlockConfigFieldProps) {
  const handleStringChange = (val: string) => onChange({ [field.key]: val });

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">{field.label}</label>
        {labelAddon}
      </div>

      {field.type === 'text' && (
        <input
          ref={(el) => { if (inputRef) inputRef.current = el; }}
          type="text"
          value={typeof value === 'string' ? value : ''}
          placeholder={field.placeholder}
          onChange={(e) => handleStringChange(e.target.value)}
          className={inputClass}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          ref={(el) => { if (inputRef) inputRef.current = el; }}
          value={typeof value === 'string' ? value : ''}
          placeholder={field.placeholder}
          rows={3}
          onChange={(e) => handleStringChange(e.target.value)}
          className={`${inputClass} resize-y`}
        />
      )}

      {field.type === 'select' && (
        <select
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => handleStringChange(e.target.value)}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="">— select —</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {field.type === 'toggle' && (
        <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
          <div
            onClick={() => onChange({ [field.key]: !value })}
            className={`w-9 h-5 rounded-[10px] relative cursor-pointer transition-colors shrink-0 ${
              value ? 'bg-blue-500' : 'bg-[#2e2f33]'
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                value ? 'left-4.5' : 'left-0.5'
              }`}
            />
          </div>
          <span className="text-[13px] text-gray-400">{value ? 'On' : 'Off'}</span>
        </label>
      )}

      {field.type === 'variable-picker' && (
        <div className="w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg px-2.5 py-[7px] flex items-center gap-1.5 cursor-pointer transition-colors hover:border-[#3e3f43]">
          <span className="text-gray-500 text-[13px] flex-1">
            {typeof value === 'string' && value ? (
              <span className="text-violet-400">{`{{${value}}}`}</span>
            ) : (
              field.placeholder ?? 'Pick a variable…'
            )}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 shrink-0">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      )}

      {field.hint && (
        <p className="text-[11px] text-gray-500 m-0">{field.hint}</p>
      )}
    </div>
  );
}
