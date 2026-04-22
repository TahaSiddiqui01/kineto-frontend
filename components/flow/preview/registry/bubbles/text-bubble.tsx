import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

export function TextBubbleChat({ block, variables }: ChatBlockProps) {
  const text = interpolate(block.content.text as string ?? '', variables);
  return (
    <p className="text-sm text-foreground whitespace-pre-wrap break-words">
      {text || <span className="text-muted-foreground italic">Empty message</span>}
    </p>
  );
}
