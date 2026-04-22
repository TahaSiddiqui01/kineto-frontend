'use client';

import { Plus } from 'lucide-react';
import type { BlockConfigProps } from '../../types';
import { VariableSelectDropdown } from '../../variable-select-dropdown';
import { KeywordItemRow, type KeywordItem } from './keyword-item-row';

function createKeyword(): KeywordItem {
  return { id: crypto.randomUUID(), value: '' };
}

export function ReplyEventConfig({ block, onChange }: BlockConfigProps) {
  const keywords = (block.content.keywords as KeywordItem[] | undefined) ?? [createKeyword()];
  const saveReplyTo = block.content.saveReplyTo as string | undefined;

  function updateKeywords(updated: KeywordItem[]) {
    onChange({ keywords: updated });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-400">Keywords</label>
        {keywords.map((kw, i) => (
          <KeywordItemRow
            key={kw.id}
            item={kw}
            canRemove={keywords.length > 1}
            onUpdate={(updated) => updateKeywords(keywords.map((k, idx) => (idx === i ? updated : k)))}
            onRemove={() => updateKeywords(keywords.filter((_, idx) => idx !== i))}
          />
        ))}
        <button
          type="button"
          onClick={() => updateKeywords([...keywords, createKeyword()])}
          className="flex items-center gap-1.5 w-full justify-center py-2 rounded-lg border border-dashed border-[#2e2f33] text-[12px] text-gray-500 hover:text-gray-300 hover:border-[#3e3f43] transition-colors cursor-pointer"
        >
          <Plus size={13} />
          Add keyword
        </button>
      </div>

      <div className="h-px bg-[#2e2f33]" />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">
          Save reply into variable <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <VariableSelectDropdown
          value={saveReplyTo}
          onChange={(name) => onChange({ saveReplyTo: name })}
        />
      </div>
    </div>
  );
}
