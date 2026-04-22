import { Trash2 } from 'lucide-react';

const inputClass = 'flex-1 bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

export interface KeywordItem {
  id: string;
  value: string;
}

interface KeywordItemRowProps {
  item: KeywordItem;
  canRemove: boolean;
  onUpdate: (updated: KeywordItem) => void;
  onRemove: () => void;
}

export function KeywordItemRow({ item, canRemove, onUpdate, onRemove }: KeywordItemRowProps) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        value={item.value}
        onChange={(e) => onUpdate({ ...item, value: e.target.value })}
        placeholder="Keyword…"
        className={inputClass}
      />
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-gray-600 hover:text-red-400 transition-colors p-1 cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}
