import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { BlockConfigProps } from '../../types';
import { CURRENCY_CODES, UNIT_OPTIONS } from '@/helpers';


export function FormatSection({
  format,
  currency,
  unit,
  onChange,
}: {
  format: string;
  currency: string | undefined;
  unit: string | undefined;
  onChange: BlockConfigProps['onChange'];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Format</label>
        <Select
          value={format}
          onValueChange={(val) => onChange({ format: val, currency: undefined, unit: undefined })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent >
            <SelectItem value="decimal" >Decimal</SelectItem>
            <SelectItem value="currency" >Currency</SelectItem>
            <SelectItem value="percent" >Percentage</SelectItem>
            <SelectItem value="unit" >Unit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {format === 'currency' && (
        <div className="flex flex-col gap-1.5 pl-1 border-l-2 border-[#2e2f33]">
          <label className="text-xs font-medium text-gray-400">Currency</label>
          <Select value={currency ?? 'USD'} onValueChange={(val) => onChange({ currency: val })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent >
              {CURRENCY_CODES.map((c) => (
                <SelectItem key={c.value} value={c.value} >
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {format === 'unit' && (
        <div className="flex flex-col gap-1.5 pl-1 border-l-2 border-[#2e2f33]">
          <label className="text-xs font-medium text-gray-400">Unit</label>
          <Select value={unit ?? 'meter'} onValueChange={(val) => onChange({ unit: val })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent >
              {UNIT_OPTIONS.map((u) => (
                <SelectItem key={u.value} value={u.value} >
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
