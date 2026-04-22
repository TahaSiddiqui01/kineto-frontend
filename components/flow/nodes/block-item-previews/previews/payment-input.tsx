import type { BlockItemPreviewProps } from '../types';

export function PaymentInputItemPreview({ block }: BlockItemPreviewProps) {
  const provider = (block.content.provider as string | undefined) ?? 'stripe';
  const price = block.content.price as string | undefined;
  const currency = (block.content.currency as string | undefined) ?? 'USD';
  const buttonLabel = block.content.buttonLabel as string | undefined;

  const label = buttonLabel || (price ? `${price} ${currency}` : 'Payment input');

  const subtitle = [
    provider.charAt(0).toUpperCase() + provider.slice(1),
    price ? `${price} ${currency}` : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
        <span className="text-[10px] text-gray-600 truncate">{subtitle}</span>
      </div>
    </div>
  );
}
