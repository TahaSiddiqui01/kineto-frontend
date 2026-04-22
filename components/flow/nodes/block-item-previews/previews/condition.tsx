import type { BlockItemPreviewProps } from '../types';

interface ConditionItem { id: string; variableName?: string; operator: string; value: string; }

export function ConditionItemPreview({ block }: BlockItemPreviewProps) {
  const conditions = (block.content.conditions as ConditionItem[] | undefined) ?? [];
  const logicalOperator = (block.content.logicalOperator as string | undefined) ?? 'AND';

  const filled = conditions.filter((c) => c.variableName);
  const label = filled.length > 0
    ? filled.map((c) => `{{${c.variableName}}}`).join(` ${logicalOperator} `)
    : 'Condition';

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
      {filled.length > 0 && (
        <span className="text-[10px] text-gray-600 truncate">
          {filled.length} condition{filled.length > 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}
