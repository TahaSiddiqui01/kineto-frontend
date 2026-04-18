import { NodeManager } from '@/lib/flow/node-manager';
import type { BlockItemPreviewProps } from '../types';

export function DefaultBlockItemPreview({ block }: BlockItemPreviewProps) {
  const def = NodeManager.getBlockDefinition(block.type);
  return (
    <span className="flex-1 truncate text-sm font-medium text-[#e2e4e8]">
      {def?.label ?? block.type}
    </span>
  );
}
