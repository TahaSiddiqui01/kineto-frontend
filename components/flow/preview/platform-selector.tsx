import type { Platform } from './registry/types';

interface PlatformSelectorProps {
  value: Platform;
  onChange: (p: Platform) => void;
}

const PLATFORMS: { id: Platform; label: string; emoji: string; comingSoon?: boolean }[] = [
  { id: 'website',   label: 'Website',   emoji: '🌐' },
  { id: 'whatsapp',  label: 'WhatsApp',  emoji: '💬', comingSoon: true },
  { id: 'instagram', label: 'Instagram', emoji: '📸', comingSoon: true },
];

export function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-muted/40 border border-border">
      {PLATFORMS.map((p) => (
        <button
          key={p.id}
          type="button"
          disabled={p.comingSoon}
          onClick={() => !p.comingSoon && onChange(p.id)}
          title={p.comingSoon ? `${p.label} — coming soon` : p.label}
          className={[
            'relative flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors',
            value === p.id
              ? 'bg-background text-foreground shadow-sm'
              : p.comingSoon
                ? 'text-muted-foreground/40 cursor-not-allowed'
                : 'text-muted-foreground hover:text-foreground cursor-pointer',
          ].join(' ')}
        >
          <span>{p.emoji}</span>
          <span>{p.label}</span>
          {p.comingSoon && (
            <span className="absolute -top-1.5 -right-1 text-[8px] font-semibold px-1 py-0.5 rounded bg-muted text-muted-foreground/60 leading-none">
              Soon
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
