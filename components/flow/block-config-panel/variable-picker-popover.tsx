'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useFlowStore } from '@/store/flow.store';

interface VariablePickerPopoverProps {
  onSelect: (varName: string) => void;
}

export function VariablePickerPopover({ onSelect }: VariablePickerPopoverProps) {
  const { variables, setVariablePanelOpen } = useFlowStore(
    useShallow((s) => ({ variables: s.variables, setVariablePanelOpen: s.setVariablePanelOpen }))
  );

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        title="Insert variable"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 text-[11px] font-semibold rounded px-1.5 py-0.5 border cursor-pointer transition-all duration-150 tracking-[0.02em] ${
          open
            ? 'text-violet-400 bg-violet-400/10 border-violet-400/35'
            : 'text-gray-500 bg-transparent border-[#2e2f33] hover:text-gray-300'
        }`}
      >
        <span className="font-mono text-xs">{'{x}'}</span>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] right-0 min-w-45 max-h-55 overflow-y-auto bg-[#1c1d20] border border-[#2e2f33] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.45)] z-50 py-1">
          {variables.length === 0 ? (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setOpen(false);
                setVariablePanelOpen(true);
              }}
              className="flex items-center gap-1.5 w-full px-3 py-2 bg-transparent border-none cursor-pointer text-violet-400 text-xs font-medium hover:bg-violet-400/8 transition-colors"
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
                  onSelect(v.name);
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-1.5 bg-transparent border-none cursor-pointer text-left text-[#e2e4e8] text-[13px] transition-colors hover:bg-white/5"
              >
                <span className="font-mono text-[11px] text-violet-400 bg-violet-400/[0.12] rounded px-[5px] py-px shrink-0">
                  {`{{${v.name}}}`}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
