import { useVariableInsertion } from "../../hooks/use-variable-insertion";
import { BlockConfigProps } from "../../types";
import { VariablePickerPopover } from "../../variable-picker-popover";

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

// ── Sub-components ────────────────────────────────────────────────────────────

export function FieldWithVariable({
  label,
  fieldKey,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  fieldKey: string;
  value: string | undefined;
  placeholder: string;
  onChange: BlockConfigProps['onChange'];
}) {
  const { inputRef, onInsert } = useVariableInsertion(value, fieldKey, onChange);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">{label}</label>
        <VariablePickerPopover onSelect={onInsert} />
      </div>
      <input
        ref={inputRef as React.Ref<HTMLInputElement>}
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange({ [fieldKey]: e.target.value })}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}
