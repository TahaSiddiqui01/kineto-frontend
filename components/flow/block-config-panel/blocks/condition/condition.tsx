'use client';

import { Plus } from 'lucide-react';
import type { BlockConfigProps } from '../../types';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ConditionRow, type ConditionItem } from './condition-row';

function createCondition(): ConditionItem {
  return { id: crypto.randomUUID(), variableName: undefined, operator: 'equal', value: '' };
}

export function ConditionConfig({ block, onChange }: BlockConfigProps) {
  const conditions = (block.content.conditions as ConditionItem[] | undefined) ?? [createCondition()];
  const logicalOperator = (block.content.logicalOperator as string | undefined) ?? 'AND';

  function updateConditions(updated: ConditionItem[]) {
    onChange({ conditions: updated });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {conditions.map((cond, i) => (
          <div key={cond.id} className="flex flex-col gap-2">
            <ConditionRow
              item={cond}
              canRemove={conditions.length > 1}
              onUpdate={(updated) => updateConditions(conditions.map((c, idx) => (idx === i ? updated : c)))}
              onRemove={() => updateConditions(conditions.filter((_, idx) => idx !== i))}
            />
            {i < conditions.length - 1 && (
              <div className="flex items-center justify-center">
                <Select value={logicalOperator} onValueChange={(val) => onChange({ logicalOperator: val })}>
                  <SelectTrigger className="w-20 h-6 text-[11px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => updateConditions([...conditions, createCondition()])}
          className="flex items-center gap-1.5 w-full justify-center py-2 rounded-lg border border-dashed border-[#2e2f33] text-[12px] text-gray-500 hover:text-gray-300 hover:border-[#3e3f43] transition-colors cursor-pointer"
        >
          <Plus size={13} />
          Add condition
        </button>
      </div>
    </div>
  );
}
