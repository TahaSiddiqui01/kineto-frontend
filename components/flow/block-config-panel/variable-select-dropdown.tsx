'use client';

import { Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useFlowStore } from '@/store/flow.store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VariableSelectDropdownProps {
  value: string | undefined;
  onChange: (name: string | undefined) => void;
  placeholder?: string;
}

const CLEAR_SENTINEL = '__clear__';

export function VariableSelectDropdown({
  value,
  onChange,
  placeholder = 'Select a variable…',
}: VariableSelectDropdownProps) {
  const { variables, setVariablePanelOpen } = useFlowStore(
    useShallow((s) => ({ variables: s.variables, setVariablePanelOpen: s.setVariablePanelOpen })),
  );

  const handleValueChange = (val: string) => {
    if (val === CLEAR_SENTINEL) {
      onChange(undefined);
    } else {
      onChange(val);
    }
  };

  if (variables.length === 0) {
    return (
      <button
        type="button"
        onClick={() => setVariablePanelOpen(true)}
        className="flex items-center gap-1.5 w-full rounded-lg border border-dashed border-border px-2.5 py-[7px] text-xs font-medium text-violet-400 hover:bg-accent transition-colors cursor-pointer"
      >
        <Plus size={12} />
        Add Variable
      </button>
    );
  }

  return (
    <Select value={value ?? ''} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {value && (
            <span className="font-mono text-[11px] text-violet-400 bg-violet-400/[0.12] rounded px-[5px] py-px">
              {`{{${value}}}`}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {value && (
          <SelectItem value={CLEAR_SENTINEL}>Clear selection</SelectItem>
        )}
        {variables.map((v) => (
          <SelectItem key={v.id} value={v.name}>
            <span className="font-mono text-[11px] text-violet-400 bg-violet-400/[0.12] rounded px-[5px] py-px">
              {`{{${v.name}}}`}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
