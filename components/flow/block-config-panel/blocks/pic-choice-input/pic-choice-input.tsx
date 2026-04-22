'use client';

import { Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { SaveFieldRow } from '../../shared/save-field-row';
import type { BlockConfigProps } from '../../types';
import { PicChoiceItemCard, type PicChoiceItem } from './pic-choice-item';


function createItem(): PicChoiceItem {
  return { id: crypto.randomUUID() };
}

export function PicChoiceInputConfig({ block, onChange }: BlockConfigProps) {
  const items = (block.content.items as PicChoiceItem[] | undefined) ?? [createItem()];
  const multiChoice = (block.content.multiChoice as boolean | undefined) ?? false;
  const saveTitleTo = block.content.saveTitleTo as string | undefined;
  const saveInternalValueTo = block.content.saveInternalValueTo as string | undefined;
  const saveImageLinkTo = block.content.saveImageLinkTo as string | undefined;

  function updateItems(updated: PicChoiceItem[]) {
    onChange({ items: updated });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-400">Choices</label>
        {items.map((item, i) => (
          <PicChoiceItemCard
            key={item.id}
            item={item}
            index={i}
            onUpdate={(updated) => updateItems(items.map((it, idx) => (idx === i ? updated : it)))}
            onRemove={() => updateItems(items.filter((_, idx) => idx !== i))}
            canRemove={items.length > 1}
          />
        ))}
        <button
          type="button"
          onClick={() => updateItems([...items, createItem()])}
          className="flex items-center gap-1.5 w-full justify-center py-2 rounded-lg border border-dashed border-[#2e2f33] text-[12px] text-gray-500 hover:text-gray-300 hover:border-[#3e3f43] transition-colors cursor-pointer"
        >
          <Plus size={13} />
          Add choice
        </button>
      </div>

      <div className="h-px bg-[#2e2f33]" />

      <div className="flex items-center gap-2">
        <Checkbox
          id="picMultiChoice"
          checked={multiChoice}
          onCheckedChange={(checked) => onChange({ multiChoice: checked === true })}
        />
        <label htmlFor="picMultiChoice" className="text-xs font-medium text-gray-400 cursor-pointer select-none">
          Multi choice
        </label>
      </div>

      <div className="h-px bg-[#2e2f33]" />

      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium text-gray-400">
          Save into variable{' '}
          <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <SaveFieldRow
          id="pic-save-title"
          label="Title"
          variable={saveTitleTo}
          onToggle={(enabled) => onChange({ saveTitleTo: enabled ? '' : undefined })}
          onVariableChange={(name) => onChange({ saveTitleTo: name })}
        />
        <SaveFieldRow
          id="pic-save-internal"
          label="Internal value"
          variable={saveInternalValueTo}
          onToggle={(enabled) => onChange({ saveInternalValueTo: enabled ? '' : undefined })}
          onVariableChange={(name) => onChange({ saveInternalValueTo: name })}
        />
        <SaveFieldRow
          id="pic-save-image"
          label="Image link"
          variable={saveImageLinkTo}
          onToggle={(enabled) => onChange({ saveImageLinkTo: enabled ? '' : undefined })}
          onVariableChange={(name) => onChange({ saveImageLinkTo: name })}
        />
      </div>
    </div>
  );
}
