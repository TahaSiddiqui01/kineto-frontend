import type { Block, BlockContent } from '@/types/flow';

export interface BlockConfigProps {
  block: Block;
  onChange: (patch: Partial<BlockContent>) => void;
}
