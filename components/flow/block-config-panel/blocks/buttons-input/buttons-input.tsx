'use client';

import { Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { SaveFieldRow } from '../../shared/save-field-row';
import type { BlockConfigProps } from '../../types';
import { ButtonItemRow, type ButtonItem } from './button-item-row';


function createButton(): ButtonItem {
  return { id: crypto.randomUUID(), text: '' };
}

export function ButtonsInputConfig({ block, onChange }: BlockConfigProps) {
  const buttons = (block.content.buttons as ButtonItem[] | undefined) ?? [createButton()];
  const multiChoice = (block.content.multiChoice as boolean | undefined) ?? false;
  const searchable = (block.content.searchable as boolean | undefined) ?? false;
  const saveLabelTo = block.content.saveLabelTo as string | undefined;
  const saveInternalValueTo = block.content.saveInternalValueTo as string | undefined;

  function updateButtons(updated: ButtonItem[]) {
    onChange({ buttons: updated });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-400">Buttons</label>
        {buttons.map((btn, i) => (
          <ButtonItemRow
            key={btn.id}
            item={btn}
            index={i}
            onUpdate={(updated) => updateButtons(buttons.map((b, idx) => (idx === i ? updated : b)))}
            onRemove={() => updateButtons(buttons.filter((_, idx) => idx !== i))}
            canRemove={buttons.length > 1}
          />
        ))}
        <button
          type="button"
          onClick={() => updateButtons([...buttons, createButton()])}
          className="flex items-center gap-1.5 w-full justify-center py-2 rounded-lg border border-dashed border-[#2e2f33] text-[12px] text-gray-500 hover:text-gray-300 hover:border-[#3e3f43] transition-colors cursor-pointer"
        >
          <Plus size={13} />
          Add button
        </button>
      </div>

      <div className="h-px bg-[#2e2f33]" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="multiChoice"
            checked={multiChoice}
            onCheckedChange={(checked) => onChange({ multiChoice: checked === true })}
          />
          <label htmlFor="multiChoice" className="text-xs font-medium text-gray-400 cursor-pointer select-none">
            Multi choice
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="searchable"
            checked={searchable}
            onCheckedChange={(checked) => onChange({ searchable: checked === true })}
          />
          <label htmlFor="searchable" className="text-xs font-medium text-gray-400 cursor-pointer select-none">
            Searchable
          </label>
        </div>
      </div>

      <div className="h-px bg-[#2e2f33]" />

      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium text-gray-400">
          Save into variable{' '}
          <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <SaveFieldRow
          id="btn-save-label"
          label="Label"
          variable={saveLabelTo}
          onToggle={(enabled) => onChange({ saveLabelTo: enabled ? '' : undefined })}
          onVariableChange={(name) => onChange({ saveLabelTo: name })}
        />
        <SaveFieldRow
          id="btn-save-internal"
          label="Internal value"
          variable={saveInternalValueTo}
          onToggle={(enabled) => onChange({ saveInternalValueTo: enabled ? '' : undefined })}
          onVariableChange={(name) => onChange({ saveInternalValueTo: name })}
        />
      </div>
    </div>
  );
}
