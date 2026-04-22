import type { BlockItemPreviewProps } from '../types';
import { COUNTRY_CODES } from '@/helpers';

export function PhoneInputItemPreview({ block }: BlockItemPreviewProps) {
  const placeholder = block.content.placeholder as string | undefined;
  const buttonLabel = block.content.buttonLabel as string | undefined;
  const defaultCountry = block.content.defaultCountry as string | undefined;
  const saveAnswerTo = block.content.saveAnswerTo as string | undefined;

  const label = placeholder || buttonLabel || 'Phone input';

  const country = defaultCountry
    ? COUNTRY_CODES.find((c) => c.value === defaultCountry)
    : undefined;

  const subtitle = [
    country ? `${country.flag} ${country.dialCode}` : null,
    saveAnswerTo ? `{{${saveAnswerTo}}}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
        {subtitle && (
          <span className="text-[10px] text-gray-600 truncate">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
