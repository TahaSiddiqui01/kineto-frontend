'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '@/components/providers/theme-provider';

const CYCLE: Theme[] = ['light', 'dark', 'system'];

const ICONS = {
  light:  { Icon: Sun,     label: 'Light',  next: 'Dark'   },
  dark:   { Icon: Moon,    label: 'Dark',   next: 'System' },
  system: { Icon: Monitor, label: 'System', next: 'Light'  },
} satisfies Record<Theme, { Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; label: string; next: string }>;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function cycle() {
    const idx = CYCLE.indexOf(theme);
    setTheme(CYCLE[(idx + 1) % CYCLE.length]);
  }

  const { Icon, label, next } = ICONS[theme];

  return (
    <div className="fixed bottom-5 right-5 z-50 group">
      <button
        type="button"
        onClick={cycle}
        aria-label={`Switch to ${next} theme`}
        className="
          flex items-center justify-center
          w-10 h-10 rounded-full
          bg-background border border-border
          shadow-lg shadow-black/10
          text-foreground
          hover:scale-105 active:scale-95
          transition-all duration-150
          cursor-pointer
        "
      >
        <Icon size={16} strokeWidth={1.75} />
      </button>

      {/* Tooltip */}
      <span
        className="
          pointer-events-none absolute bottom-full right-0 mb-2
          whitespace-nowrap rounded-md px-2 py-1
          bg-popover text-popover-foreground border border-border
          text-xs shadow-md
          opacity-0 translate-y-1
          group-hover:opacity-100 group-hover:translate-y-0
          transition-all duration-150
        "
      >
        {label} — click for {next}
      </span>
    </div>
  );
}
