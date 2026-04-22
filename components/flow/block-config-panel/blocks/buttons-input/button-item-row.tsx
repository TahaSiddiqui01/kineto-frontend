import { useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { VariablePickerPopover } from '../../variable-picker-popover';

export interface ButtonItem {
  id: string;
  text: string;
  internalValue?: string;
}

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

function makeInserter(
  ref: React.RefObject<HTMLInputElement | null>,
  getValue: () => string,
  setValue: (v: string) => void,
) {
  return (varName: string) => {
    const token = `{{${varName}}}`;
    const cur = getValue();
    const el = ref.current;
    if (!el) { setValue(cur + token); return; }
    const start = el.selectionStart ?? cur.length;
    const end = el.selectionEnd ?? cur.length;
    setValue(cur.slice(0, start) + token + cur.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + token.length;
      el.setSelectionRange(pos, pos);
    });
  };
}

export function ButtonItemRow({
  item,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  item: ButtonItem;
  index: number;
  onUpdate: (updated: ButtonItem) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const textRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);

  const onInsertText = useCallback(
    makeInserter(textRef, () => item.text, (v) => onUpdate({ ...item, text: v })),
    [item, onUpdate],
  );

  const onInsertValue = useCallback(
    makeInserter(valueRef, () => item.internalValue ?? '', (v) => onUpdate({ ...item, internalValue: v })),
    [item, onUpdate],
  );

  return (
    <div className="flex flex-col gap-2 p-2.5 bg-[#16171a] rounded-lg border border-[#2e2f33]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-500">Button {index + 1}</span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center justify-center w-5 h-5 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] text-gray-500">Label</label>
          <VariablePickerPopover onSelect={onInsertText} />
        </div>
        <input
          ref={textRef}
          type="text"
          value={item.text}
          onChange={(e) => onUpdate({ ...item, text: e.target.value })}
          placeholder="Button text…"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] text-gray-500">Internal value</label>
          <VariablePickerPopover onSelect={onInsertValue} />
        </div>
        <input
          ref={valueRef}
          type="text"
          value={item.internalValue ?? ''}
          onChange={(e) => onUpdate({ ...item, internalValue: e.target.value })}
          placeholder="Value stored when selected…"
          className={inputClass}
        />
      </div>
    </div>
  );
}
