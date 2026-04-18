'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Plus } from 'lucide-react';
import { useFlowStore } from '@/store/flow.store';
import type { BlockFieldSchema, BlockContent } from '@/types/flow';

interface BlockConfigFieldProps {
  field: BlockFieldSchema;
  value: string | boolean | undefined;
  onChange: (patch: Partial<BlockContent>) => void;
}

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

export function BlockConfigField({ field, value, onChange }: BlockConfigFieldProps) {
  const { variables, setVariablePanelOpen } = useFlowStore(
    useShallow((s) => ({ variables: s.variables, setVariablePanelOpen: s.setVariablePanelOpen }))
  );

  const [varMenuOpen, setVarMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleStringChange = (val: string) => onChange({ [field.key]: val });

  const insertVariable = useCallback(
    (varName: string) => {
      const el = inputRef.current;
      const token = `{{${varName}}}`;
      if (!el) {
        handleStringChange((typeof value === 'string' ? value : '') + token);
        setVarMenuOpen(false);
        return;
      }
      const cur = typeof value === 'string' ? value : '';
      const start = el.selectionStart ?? cur.length;
      const end = el.selectionEnd ?? cur.length;
      const next = cur.slice(0, start) + token + cur.slice(end);
      onChange({ [field.key]: next });
      setVarMenuOpen(false);
      requestAnimationFrame(() => {
        el.focus();
        const pos = start + token.length;
        el.setSelectionRange(pos, pos);
      });
    },
    [value, field.key, onChange]
  );

  useEffect(() => {
    if (!varMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [varMenuOpen]);

  const showVarButton = field.showVariables && (field.type === 'text' || field.type === 'textarea');

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">{field.label}</label>

        {showVarButton && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              title="Insert variable"
              onClick={() => setVarMenuOpen((o) => !o)}
              className={`flex items-center gap-1 text-[11px] font-semibold rounded px-1.5 py-0.5 border cursor-pointer transition-all duration-150 tracking-[0.02em] ${
                varMenuOpen
                  ? 'text-violet-400 bg-violet-400/10 border-violet-400/35'
                  : 'text-gray-500 bg-transparent border-[#2e2f33] hover:text-gray-300'
              }`}
            >
              <span className="font-mono text-xs">{'{x}'}</span>
            </button>

            {varMenuOpen && (
              <div className="absolute top-[calc(100%+6px)] right-0 min-w-[180px] max-h-[220px] overflow-y-auto bg-[#1c1d20] border border-[#2e2f33] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.45)] z-50 py-1">
                {variables.length === 0 ? (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setVarMenuOpen(false);
                      setVariablePanelOpen(true);
                    }}
                    className="flex items-center gap-1.5 w-full px-3 py-2 bg-transparent border-none cursor-pointer text-violet-400 text-xs font-medium hover:bg-violet-400/[0.08] transition-colors"
                  >
                    <Plus size={12} />
                    Add Variable
                  </button>
                ) : (
                  variables.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertVariable(v.name);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 bg-transparent border-none cursor-pointer text-left text-[#e2e4e8] text-[13px] transition-colors hover:bg-white/5"
                    >
                      <span className="font-mono text-[11px] text-violet-400 bg-violet-400/[0.12] rounded px-[5px] py-px shrink-0">
                        {'{{}}'}
                      </span>
                      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {v.name}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {field.type === 'text' && (
        <input
          ref={(el) => { inputRef.current = el; }}
          type="text"
          value={typeof value === 'string' ? value : ''}
          placeholder={field.placeholder}
          onChange={(e) => handleStringChange(e.target.value)}
          className={inputClass}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          ref={(el) => { inputRef.current = el; }}
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
                value ? 'left-[18px]' : 'left-0.5'
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
