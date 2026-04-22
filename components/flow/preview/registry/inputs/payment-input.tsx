'use client';
import { CreditCard } from 'lucide-react';
import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

export function PaymentInputChat({ block, variables, onAnswer }: ChatBlockProps) {
  const currency = block.content.currency as string ?? 'USD';
  const price = interpolate(String(block.content.price ?? ''), variables);

  return (
    <button
      type="button"
      onClick={() => onAnswer?.(`Payment: ${price} ${currency}`)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
    >
      <CreditCard size={14} />
      Pay {price} {currency}
    </button>
  );
}
