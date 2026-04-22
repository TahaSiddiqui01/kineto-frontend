import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COUNTRY_CODES } from '@/helpers';
import type { BlockConfigProps } from '../../types';

export function CountrySelect({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: BlockConfigProps['onChange'];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-400">Default country</label>
      <Select
        value={value ?? 'US'}
        onValueChange={(val) => onChange({ defaultCountry: val })}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              <span className="flex items-center gap-2">
                <span>{c.flag}</span>
                <span>{c.label}</span>
                <span className="text-gray-500 text-[11px]">{c.dialCode}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
