import { AlertTriangle } from 'lucide-react';
import type { Platform } from './types';

interface Props {
  platform: Platform;
  blockLabel: string;
  support: 'partial' | 'none';
}

export function UnsupportedBlock({ platform, blockLabel, support }: Props) {
  const platformLabel = platform === 'whatsapp' ? 'WhatsApp' : 'Instagram';

  return (
    <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
      <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />
      <p className="text-[11px] text-amber-400 leading-relaxed">
        {support === 'none'
          ? `${blockLabel} is not supported on ${platformLabel}.`
          : `${blockLabel} has limited support on ${platformLabel}.`}
      </p>
    </div>
  );
}
