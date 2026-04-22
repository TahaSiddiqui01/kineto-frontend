import type { ComponentType } from 'react';
import type { BlockType, Block } from '@/types/flow';
import type { BlockItemPreviewProps } from './types';
import { TextBubbleItemPreview } from './previews/text-bubble';
import { ImageBubbleItemPreview } from './previews/image-bubble';
import { VideoBubbleItemPreview } from './previews/video-bubble';
import { AudioBubbleItemPreview } from './previews/audio-bubble';
import { EmbedBubbleItemPreview } from './previews/embed-bubble';
import { TextInputItemPreview } from './previews/text-input';
import { NumberInputItemPreview } from './previews/number-input';
import { AudioInputItemPreview } from './previews/audio-input';
import { EmailInputItemPreview } from './previews/email-input';
import { WebsiteInputItemPreview } from './previews/website-input';
import { DateInputItemPreview } from './previews/date-input';
import { TimeInputItemPreview } from './previews/time-input';
import { PhoneInputItemPreview } from './previews/phone-input';
import { ButtonsInputItemPreview } from './previews/buttons-input';
import { PicChoiceInputItemPreview } from './previews/pic-choice-input';
import { PaymentInputItemPreview } from './previews/payment-input';
import { RatingInputItemPreview } from './previews/rating-input';
import { FileInputItemPreview } from './previews/file-input';
import { CardsInputItemPreview } from './previews/cards-input';
import { SetVariableItemPreview } from './previews/set-variable';
import { ConditionItemPreview } from './previews/condition';
import { RedirectItemPreview } from './previews/redirect';
import { ScriptItemPreview } from './previews/script';
import { TypebotLogicItemPreview } from './previews/typebot-logic';
import { WaitItemPreview } from './previews/wait';
import { AbTestItemPreview } from './previews/ab-test';
import { WebhookItemPreview } from './previews/webhook';
import { JumpItemPreview } from './previews/jump';
import { ReturnItemPreview } from './previews/return';
import { CommandEventItemPreview } from './previews/command-event';
import { ReplyEventItemPreview } from './previews/reply-event';
import { InvalidEventItemPreview } from './previews/invalid-event';

export interface BlockItemPreviewEntry {
  component: ComponentType<BlockItemPreviewProps>;
  hasContent: (block: Block) => boolean;
}

export const BLOCK_ITEM_PREVIEW_REGISTRY: Partial<Record<BlockType, BlockItemPreviewEntry>> = {
  'text-bubble': {
    component: TextBubbleItemPreview,
    hasContent: (b) => !!b.content.text,
  },
  'image-bubble': {
    component: ImageBubbleItemPreview,
    hasContent: (b) => !!b.content.imageUrl || !!b.content.iconName,
  },
  'video-bubble': {
    component: VideoBubbleItemPreview,
    hasContent: (b) => !!b.content.videoUrl,
  },
  'audio-bubble': {
    component: AudioBubbleItemPreview,
    hasContent: (b) => !!b.content.audioUrl,
  },
  'embed-bubble': {
    component: EmbedBubbleItemPreview,
    hasContent: (b) => !!b.content.embedUrl,
  },
  'text-input': {
    component: TextInputItemPreview,
    hasContent: (b) => !!b.content.placeholder || !!b.content.buttonLabel,
  },
  'number-input': {
    component: NumberInputItemPreview,
    hasContent: (b) => !!b.content.placeholder || !!b.content.buttonLabel,
  },
  'audio-input': {
    component: AudioInputItemPreview,
    hasContent: (b) => !!b.content.audioUrl,
  },
  'email-input': {
    component: EmailInputItemPreview,
    hasContent: (b) => !!b.content.placeholder || !!b.content.buttonLabel,
  },
  'website-input': {
    component: WebsiteInputItemPreview,
    hasContent: (b) => !!b.content.placeholder || !!b.content.buttonLabel,
  },
  'date-input': {
    component: DateInputItemPreview,
    hasContent: (b) => !!b.content.format || !!b.content.isRange || !!b.content.withTime,
  },
  'time-input': {
    component: TimeInputItemPreview,
    hasContent: (b) => !!b.content.format || !!b.content.buttonLabel,
  },
  'phone-input': {
    component: PhoneInputItemPreview,
    hasContent: (b) => !!b.content.placeholder || !!b.content.buttonLabel || !!b.content.defaultCountry,
  },
  'buttons-input': {
    component: ButtonsInputItemPreview,
    hasContent: (b) => {
      const btns = b.content.buttons as Array<{ text: string }> | undefined;
      return !!btns?.some((btn) => btn.text.trim());
    },
  },
  'pic-choice-input': {
    component: PicChoiceInputItemPreview,
    hasContent: (b) => {
      const items = b.content.items as Array<{ title?: string; imageUrl?: string }> | undefined;
      return !!items && items.length > 0;
    },
  },
  'payment-input': {
    component: PaymentInputItemPreview,
    hasContent: (b) => !!b.content.price || !!b.content.testSecretKey || !!b.content.liveSecretKey,
  },
  'rating-input': {
    component: RatingInputItemPreview,
    hasContent: (b) => !!b.content.max || !!b.content.ratingType,
  },
  'file-input': {
    component: FileInputItemPreview,
    hasContent: (b) => !!b.content.fileUrlVariable || !!b.content.submitButtonLabel,
  },
  'cards-input': {
    component: CardsInputItemPreview,
    hasContent: (b) => {
      const cards = b.content.cards as Array<unknown> | undefined;
      return !!cards && cards.length > 0;
    },
  },
  // logic
  'set-variable': {
    component: SetVariableItemPreview,
    hasContent: (b) => !!b.content.variable,
  },
  'condition': {
    component: ConditionItemPreview,
    hasContent: (b) => {
      const c = b.content.conditions as Array<{ variableName?: string }> | undefined;
      return !!c?.some((i) => i.variableName);
    },
  },
  'redirect': {
    component: RedirectItemPreview,
    hasContent: (b) => !!b.content.url,
  },
  'script': {
    component: ScriptItemPreview,
    hasContent: (b) => !!b.content.code,
  },
  'typebot-logic': {
    component: TypebotLogicItemPreview,
    hasContent: (b) => !!b.content.typebotId,
  },
  'wait': {
    component: WaitItemPreview,
    hasContent: (b) => !!b.content.seconds,
  },
  'ab-test': {
    component: AbTestItemPreview,
    hasContent: (b) => b.content.aPercent !== undefined,
  },
  'webhook': {
    component: WebhookItemPreview,
    hasContent: (b) => !!b.content.saveResultTo,
  },
  'jump': {
    component: JumpItemPreview,
    hasContent: (b) => !!b.content.targetGroupId,
  },
  'return': {
    component: ReturnItemPreview,
    hasContent: (_b) => false,
  },
  // events
  'command-event': {
    component: CommandEventItemPreview,
    hasContent: (b) => !!b.content.command,
  },
  'reply-event': {
    component: ReplyEventItemPreview,
    hasContent: (b) => {
      const k = b.content.keywords as Array<{ value: string }> | undefined;
      return !!k?.some((i) => i.value.trim());
    },
  },
  'invalid-event': {
    component: InvalidEventItemPreview,
    hasContent: (_b) => false,
  },
};
