import { Checkbox } from '@/components/ui/checkbox';
import type { BlockConfigProps } from '../../types';
import { FieldWithVariable } from '../number-inputs/field-with-variable';

export function DateRangeSection({
  isRange,
  fromLabel,
  toLabel,
  onChange,
}: {
  isRange: boolean;
  fromLabel: string | undefined;
  toLabel: string | undefined;
  onChange: BlockConfigProps['onChange'];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="isRange"
          checked={isRange}
          onCheckedChange={(checked) =>
            onChange({ isRange: checked === true })
          }
        />
        <label
          htmlFor="isRange"
          className="text-xs font-medium text-gray-400 cursor-pointer select-none"
        >
          Is Range
        </label>
      </div>

      {isRange && (
        <div className="flex flex-col gap-3 pl-1 border-l-2 border-[#2e2f33]">
          <FieldWithVariable
            label="From label"
            fieldKey="fromLabel"
            value={fromLabel}
            placeholder="From"
            onChange={onChange}
          />
          <FieldWithVariable
            label="To label"
            fieldKey="toLabel"
            value={toLabel}
            placeholder="To"
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
}
