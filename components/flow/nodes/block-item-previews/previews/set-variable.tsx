import type { BlockItemPreviewProps } from '../types';

export function SetVariableItemPreview({ block }: BlockItemPreviewProps) {
  const variable = block.content.variable as string | undefined;
  const valueType = (block.content.valueType as string | undefined) ?? 'custom';
  const value = block.content.value as string | undefined;

  const typeLabels: Record<string, string> = {
    custom: 'Custom', empty: 'Empty', append: 'Append', 'environment-name': 'Env name',
    'device-type': 'Device type', transcript: 'Transcript', 'result-id': 'Result ID',
    now: 'Now', yesterday: 'Yesterday', tomorrow: 'Tomorrow', 'random-id': 'Random ID',
    'moment-of-day': 'Moment of day', 'map-item': 'Map item', 'phone-number': 'Phone',
    'contact-name': 'Contact name', pop: 'Pop', shift: 'Shift',
  };

  const label = variable ? `{{${variable}}}` : 'Set variable';
  const subLabel = [typeLabels[valueType] ?? valueType, value && valueType === 'custom' ? `= ${value.slice(0, 20)}${value.length > 20 ? '…' : ''}` : null]
    .filter(Boolean).join(' · ');

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
      {subLabel && <span className="text-[10px] text-gray-600 truncate">{subLabel}</span>}
    </div>
  );
}
