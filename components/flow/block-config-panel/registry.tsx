import type { ComponentType } from 'react';
import type { BlockType } from '@/types/flow';
import type { BlockConfigProps } from './types';
import { TextBubbleConfig } from './blocks/text-bubble';
import { ImageBubbleConfig } from './blocks/image-bubble';
import { VideoBubbleConfig } from './blocks/video-bubble';
import { AudioBubbleConfig } from './blocks/audio-bubble';
import { EmbedBubbleConfig } from './blocks/embed-bubble';
import { TextInputConfig } from './blocks/text-input';
import { NumberInputConfig } from './blocks/number-inputs/number-input';
import { AudioInputConfig } from './blocks/audio-input';
import { EmailInputConfig } from './blocks/email-input/email-input';
import { WebsiteInputConfig } from './blocks/website-input/website-input';
import { DateInputConfig } from './blocks/date-input/date-input';
import { TimeInputConfig } from './blocks/time-input/time-input';
import { PhoneInputConfig } from './blocks/phone-input/phone-input';
import { ButtonsInputConfig } from './blocks/buttons-input/buttons-input';
import { PicChoiceInputConfig } from './blocks/pic-choice-input/pic-choice-input';
import { PaymentInputConfig } from './blocks/payment-input/payment-input';
import { RatingInputConfig } from './blocks/rating-input/rating-input';
import { FileInputConfig } from './blocks/file-input/file-input';
import { CardsInputConfig } from './blocks/cards-input/cards-input';
import { SetVariableConfig } from './blocks/set-variable/set-variable';
import { ConditionConfig } from './blocks/condition/condition';
import { RedirectConfig } from './blocks/redirect/redirect';
import { ScriptConfig } from './blocks/script/script';
import { TypebotLogicConfig } from './blocks/typebot-logic/typebot-logic';
import { WaitConfig } from './blocks/wait/wait';
import { AbTestConfig } from './blocks/ab-test/ab-test';
import { WebhookConfig } from './blocks/webhook/webhook';
import { JumpConfig } from './blocks/jump/jump';
import { ReturnConfig } from './blocks/return/return';
import { CommandEventConfig } from './blocks/command-event/command-event';
import { ReplyEventConfig } from './blocks/reply-event/reply-event';
import { InvalidEventConfig } from './blocks/invalid-event/invalid-event';

export const BLOCK_CONFIG_REGISTRY: Partial<Record<BlockType, ComponentType<BlockConfigProps>>> = {
  // bubbles
  'text-bubble': TextBubbleConfig,
  'image-bubble': ImageBubbleConfig,
  'video-bubble': VideoBubbleConfig,
  'audio-bubble': AudioBubbleConfig,
  'embed-bubble': EmbedBubbleConfig,
  // inputs
  'text-input': TextInputConfig,
  'number-input': NumberInputConfig,
  'audio-input': AudioInputConfig,
  'email-input': EmailInputConfig,
  'website-input': WebsiteInputConfig,
  'date-input': DateInputConfig,
  'time-input': TimeInputConfig,
  'phone-input': PhoneInputConfig,
  'buttons-input': ButtonsInputConfig,
  'pic-choice-input': PicChoiceInputConfig,
  'payment-input': PaymentInputConfig,
  'rating-input': RatingInputConfig,
  'file-input': FileInputConfig,
  'cards-input': CardsInputConfig,
  // logic
  'set-variable': SetVariableConfig,
  'condition': ConditionConfig,
  'redirect': RedirectConfig,
  'script': ScriptConfig,
  'typebot-logic': TypebotLogicConfig,
  'wait': WaitConfig,
  'ab-test': AbTestConfig,
  'webhook': WebhookConfig,
  'jump': JumpConfig,
  'return': ReturnConfig,
  // events
  'command-event': CommandEventConfig,
  'reply-event': ReplyEventConfig,
  'invalid-event': InvalidEventConfig,
};

export const DEFAULT_BLOCK_CONFIG = TextBubbleConfig;
