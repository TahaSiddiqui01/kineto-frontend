import type { ChatMessage } from './hooks/use-chat-runner';
import type { Platform } from './registry/types';
import type { Block, BlockType } from '@/types/flow';
import { CHAT_BLOCK_REGISTRY, PLATFORM_SUPPORT } from './registry';
import { UnsupportedBlock } from './registry/unsupported-block';
import { TypingIndicator } from './typing-indicator';
import { NodeManager } from '@/lib/flow/node-manager';
import { cn } from '@/lib/utils';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  variables: Record<string, string>;
  platform: Platform;
  /** True when this message is the active pending input */
  isPendingInput?: boolean;
  onAnswer?: (value: string) => void;
}

export function ChatMessageBubble({
  message,
  variables,
  platform,
  isPendingInput = false,
  onAnswer,
}: ChatMessageBubbleProps) {
  // User message — right-aligned, primary colour
  if (message.source === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 bg-primary text-primary-foreground text-sm break-words">
          {message.content.text as string ?? ''}
        </div>
      </div>
    );
  }

  const blockType = message.blockType as BlockType;
  const entry = CHAT_BLOCK_REGISTRY[blockType];
  const category = entry?.category ?? 'bubble';
  const support = PLATFORM_SUPPORT[blockType]?.[platform] ?? 'full';
  const def = NodeManager.getBlockDefinition(blockType);

  const block: Block = { id: message.id, type: blockType, content: message.content };

  // Choose wrapper style based on content type
  const isInputBubble = category === 'input';
  const wrapperClass = cn(
    'max-w-[82%] rounded-2xl rounded-tl-sm text-sm',
    isInputBubble
      ? 'bg-muted/30 border border-border px-3.5 py-2.5'
      : 'bg-muted px-3.5 py-2.5',
  );

  return (
    <div className="flex justify-start">
      <div className={wrapperClass}>
        {/* Typing indicator */}
        {message.isTyping ? (
          <TypingIndicator />
        ) : support === 'none' ? (
          // Platform doesn't support this block at all
          <UnsupportedBlock platform={platform} blockLabel={def?.label ?? blockType} support="none" />
        ) : (
          <>
            {support === 'partial' && (
              <div className="mb-2">
                <UnsupportedBlock platform={platform} blockLabel={def?.label ?? blockType} support="partial" />
              </div>
            )}

            {isInputBubble ? (
              isPendingInput ? (
                // Active input — render the interactive form inline
                entry && <entry.component block={block} variables={variables} platform={platform} onAnswer={onAnswer} />
              ) : (
                // Already answered — show a dimmed label so the question is still visible
                <p className="text-xs text-muted-foreground/60 italic select-none">
                  {(block.content.placeholder as string | undefined) ||
                    (block.content.buttonLabel as string | undefined) ||
                    def?.label ||
                    'Input'}
                </p>
              )
            ) : (
              // Bubble block
              entry && <entry.component block={block} variables={variables} platform={platform} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
