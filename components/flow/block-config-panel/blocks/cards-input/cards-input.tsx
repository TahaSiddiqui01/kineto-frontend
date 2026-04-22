'use client';

import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VariableSelectDropdown } from '../../variable-select-dropdown';
import type { BlockConfigProps } from '../../types';
import { CardItemCard, type CardItem } from './card-item';

const SAVE_FIELD_OPTIONS = [
  { value: 'title', label: 'Title' },
  { value: 'imageUrl', label: 'Image URL' },
  { value: 'description', label: 'Description' },
  { value: 'internalValue', label: 'Internal value' },
  { value: 'buttonLabel', label: 'Button label' },
];

function createCard(): CardItem {
  return { id: crypto.randomUUID() };
}

export function CardsInputConfig({ block, onChange }: BlockConfigProps) {
  const cards = (block.content.cards as CardItem[] | undefined) ?? [createCard()];
  const saveField = (block.content.saveField as string | undefined) ?? 'internalValue';
  const saveAnswerTo = block.content.saveAnswerTo as string | undefined;

  function updateCards(updated: CardItem[]) {
    onChange({ cards: updated });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-400">Cards</label>
        {cards.map((card, i) => (
          <CardItemCard
            key={card.id}
            item={card}
            index={i}
            onUpdate={(updated) => updateCards(cards.map((c, idx) => (idx === i ? updated : c)))}
            onRemove={() => updateCards(cards.filter((_, idx) => idx !== i))}
            canRemove={cards.length > 1}
          />
        ))}
        <button
          type="button"
          onClick={() => updateCards([...cards, createCard()])}
          className="flex items-center gap-1.5 w-full justify-center py-2 rounded-lg border border-dashed border-[#2e2f33] text-[12px] text-gray-500 hover:text-gray-300 hover:border-[#3e3f43] transition-colors cursor-pointer"
        >
          <Plus size={13} />
          Add card
        </button>
      </div>

      <div className="h-px bg-[#2e2f33]" />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Save result into variable</label>
        <p className="text-[10px] text-gray-600">Select which field to store when the user clicks a card</p>
        <Select value={saveField} onValueChange={(val) => onChange({ saveField: val })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SAVE_FIELD_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">
          Variable{' '}
          <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <VariableSelectDropdown
          value={saveAnswerTo}
          onChange={(name) => onChange({ saveAnswerTo: name })}
        />
      </div>
    </div>
  );
}
