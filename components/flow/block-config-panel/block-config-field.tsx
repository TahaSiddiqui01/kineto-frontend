'use client';

import React from 'react';
import type { BlockFieldSchema, BlockContent } from '@/types/flow';

interface BlockConfigFieldProps {
  field: BlockFieldSchema;
  value: string | boolean | undefined;
  onChange: (patch: Partial<BlockContent>) => void;
}

export function BlockConfigField({ field, value, onChange }: BlockConfigFieldProps) {
  const inputBase: React.CSSProperties = {
    width: '100%',
    background: '#1c1d20',
    border: '1px solid #2e2f33',
    borderRadius: 8,
    color: '#e2e4e8',
    fontSize: 13,
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  const handleStringChange = (val: string) => onChange({ [field.key]: val });

  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af' }}>{field.label}</label>

      {field.type === 'text' && (
        <input
          type="text"
          value={typeof value === 'string' ? value : ''}
          placeholder={field.placeholder}
          onChange={(e) => handleStringChange(e.target.value)}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#2e2f33')}
          style={{ ...inputBase, padding: '7px 10px' }}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          value={typeof value === 'string' ? value : ''}
          placeholder={field.placeholder}
          rows={3}
          onChange={(e) => handleStringChange(e.target.value)}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#2e2f33')}
          style={{ ...inputBase, padding: '7px 10px', resize: 'vertical' }}
        />
      )}

      {field.type === 'select' && (
        <select
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => handleStringChange(e.target.value)}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#2e2f33')}
          style={{ ...inputBase, padding: '7px 10px', cursor: 'pointer' }}
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
        <label className="flex items-center gap-2.5 cursor-pointer select-none" style={{ width: 'fit-content' }}>
          <div
            onClick={() => onChange({ [field.key]: !value })}
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              background: value ? '#3b82f6' : '#2e2f33',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 2,
                left: value ? 18 : 2,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
              }}
            />
          </div>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>{value ? 'On' : 'Off'}</span>
        </label>
      )}

      {field.type === 'variable-picker' && (
        <div
          style={{
            ...inputBase,
            padding: '7px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
          }}
          onClick={() => {
            // Placeholder — variable picker popover to be wired later
          }}
        >
          <span style={{ color: '#6b7280', fontSize: 13, flex: 1 }}>
            {typeof value === 'string' && value ? (
              <span style={{ color: '#a78bfa' }}>{`{{${value}}}`}</span>
            ) : (
              field.placeholder ?? 'Pick a variable…'
            )}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      )}

      {field.hint && (
        <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>{field.hint}</p>
      )}
    </div>
  );
}
