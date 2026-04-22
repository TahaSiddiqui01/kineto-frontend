'use client';

import { useShallow } from 'zustand/react/shallow';
import { useFlowStore } from '@/store/flow.store';
import type { GroupFlowNode } from '@/types/flow';
import type { BlockConfigProps } from '../../types';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const CLEAR_SENTINEL = '__clear__';

export function JumpConfig({ block, onChange }: BlockConfigProps) {
  const targetGroupId = block.content.targetGroupId as string | undefined;

  const nodes = useFlowStore(useShallow((s) => s.nodes));
  const groupNodes = nodes.filter((n): n is GroupFlowNode => n.type === 'group');

  function handleValueChange(val: string) {
    onChange({ targetGroupId: val === CLEAR_SENTINEL ? undefined : val });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Jump to group</label>
        {groupNodes.length === 0 ? (
          <p className="text-[11px] text-gray-500 bg-[#1c1d20] rounded-lg px-2.5 py-2 border border-[#2e2f33]">
            No groups in the flow yet. Add a group node first.
          </p>
        ) : (
          <Select value={targetGroupId ?? ''} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a group…" />
            </SelectTrigger>
            <SelectContent>
              {targetGroupId && (
                <SelectItem value={CLEAR_SENTINEL}>Clear selection</SelectItem>
              )}
              {groupNodes.map((node) => (
                <SelectItem key={node.id} value={node.id}>
                  {node.data.title || 'Untitled group'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <p className="text-[10px] text-gray-600">
        Jumps to the selected group. Use this to keep your flow clean and avoid long edge connections.
      </p>
    </div>
  );
}
