import { useRef, useCallback } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { ImagePicker, type ImagePickerValue } from '../../shared/image-picker';
import { VariablePickerPopover } from '../../variable-picker-popover';

export interface PicChoiceItem {
  id: string;
  imageUrl?: string;
  iconName?: string;
  iconColor?: string;
  title?: string;
  description?: string;
  internalValue?: string;
}

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

function ItemTextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string | undefined;
  placeholder: string;
  onChange: (val: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onInsert = useCallback((varName: string) => {
    const token = `{{${varName}}}`;
    const cur = value ?? '';
    const el = inputRef.current;
    if (!el) { onChange(cur + token); return; }
    const start = el.selectionStart ?? cur.length;
    const end = el.selectionEnd ?? cur.length;
    onChange(cur.slice(0, start) + token + cur.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + token.length;
      el.setSelectionRange(pos, pos);
    });
  }, [value, onChange]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-gray-500">{label}</label>
        <VariablePickerPopover onSelect={onInsert} />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

export function PicChoiceItemCard({
  item,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  item: PicChoiceItem;
  index: number;
  onUpdate: (updated: PicChoiceItem) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  const handleImageChange = useCallback((patch: ImagePickerValue) => {
    onUpdate({ ...item, ...patch });
  }, [item, onUpdate]);

  const preview = item.title || item.imageUrl || `Choice ${index + 1}`;

  return (
    <div className="flex flex-col rounded-lg border border-[#2e2f33] overflow-hidden">
      <div
        className="flex items-center justify-between px-2.5 py-2 bg-[#16171a] cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="text-[12px] font-medium text-gray-400 truncate flex-1">{preview}</span>
        <div className="flex items-center gap-1 shrink-0">
          {canRemove && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="flex items-center justify-center w-5 h-5 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
          {expanded ? <ChevronUp size={13} className="text-gray-500" /> : <ChevronDown size={13} className="text-gray-500" />}
        </div>
      </div>

      {expanded && (
        <div className="flex flex-col gap-3 p-2.5 bg-[#1a1b1e]">
          <ImagePicker
            value={{ imageUrl: item.imageUrl, iconName: item.iconName, iconColor: item.iconColor }}
            allowIconsTab
            allowVariables={false}
            onChange={handleImageChange}
          />
          <ItemTextField
            label="Title"
            value={item.title}
            placeholder="Choice title…"
            onChange={(val) => onUpdate({ ...item, title: val })}
          />
          <ItemTextField
            label="Description"
            value={item.description}
            placeholder="Optional description…"
            onChange={(val) => onUpdate({ ...item, description: val })}
          />
          <ItemTextField
            label="Internal value"
            value={item.internalValue}
            placeholder="Value stored in variable…"
            onChange={(val) => onUpdate({ ...item, internalValue: val })}
          />
        </div>
      )}
    </div>
  );
}
