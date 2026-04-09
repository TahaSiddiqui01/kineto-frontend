
import * as LucideIcons from 'lucide-react';

export function DynamicIcon({ name, color, isDisabled=false }: { name: string; color: string; isDisabled?: boolean }) {
    const Icon = (
        LucideIcons as Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>>
    )[name];
    if (!Icon) return
    <span
        style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: color,
            display: 'inline-block'
        }} />;
    return <Icon size={14} color={isDisabled ? "#2d2e2d" : color} strokeWidth={2} />;
}
