import type { ComponentType } from 'react';
import type { BlockType } from '@/types/flow';
import type { ChatBlockProps, ChatBlockCategory, Platform, PlatformSupport } from './types';

// Bubble imports
import { TextBubbleChat } from './bubbles/text-bubble';
import { ImageBubbleChat } from './bubbles/image-bubble';
import { VideoBubbleChat } from './bubbles/video-bubble';
import { AudioBubbleChat } from './bubbles/audio-bubble';
import { DocumentBubbleChat } from './bubbles/document-bubble';

// Input imports
import { TextInputChat } from './inputs/text-input';
import { NumberInputChat } from './inputs/number-input';
import { EmailInputChat } from './inputs/email-input';
import { WebsiteInputChat } from './inputs/website-input';
import { PhoneInputChat } from './inputs/phone-input';
import { DateInputChat } from './inputs/date-input';
import { TimeInputChat } from './inputs/time-input';
import { ButtonsInputChat } from './inputs/buttons-input';
import { RatingInputChat } from './inputs/rating-input';
import { PicChoiceInputChat } from './inputs/pic-choice-input';
import { FileInputChat } from './inputs/file-input';
import { AudioInputChat } from './inputs/audio-input';
import { PaymentInputChat } from './inputs/payment-input';
import { CardsInputChat } from './inputs/cards-input';

export interface ChatBlockEntry {
  component: ComponentType<ChatBlockProps>;
  category: ChatBlockCategory;
}

export const CHAT_BLOCK_REGISTRY: Partial<Record<BlockType, ChatBlockEntry>> = {
  // Bubbles
  'text-bubble':       { component: TextBubbleChat,      category: 'bubble' },
  'image-bubble':      { component: ImageBubbleChat,     category: 'bubble' },
  'video-bubble':      { component: VideoBubbleChat,     category: 'bubble' },
  'audio-bubble':      { component: AudioBubbleChat,     category: 'bubble' },
  'document-bubble':   { component: DocumentBubbleChat,  category: 'bubble' },
  // Inputs
  'text-input':        { component: TextInputChat,       category: 'input' },
  'number-input':      { component: NumberInputChat,     category: 'input' },
  'email-input':       { component: EmailInputChat,      category: 'input' },
  'website-input':     { component: WebsiteInputChat,    category: 'input' },
  'phone-input':       { component: PhoneInputChat,      category: 'input' },
  'date-input':        { component: DateInputChat,       category: 'input' },
  'time-input':        { component: TimeInputChat,       category: 'input' },
  'buttons-input':     { component: ButtonsInputChat,    category: 'input' },
  'rating-input':      { component: RatingInputChat,     category: 'input' },
  'pic-choice-input':  { component: PicChoiceInputChat,  category: 'input' },
  'file-input':        { component: FileInputChat,       category: 'input' },
  'audio-input':       { component: AudioInputChat,      category: 'input' },
  'payment-input':     { component: PaymentInputChat,    category: 'input' },
  'cards-input':       { component: CardsInputChat,      category: 'input' },
  // Logic (handled internally by the runner — no UI component needed)
  'set-variable':   { component: () => null, category: 'logic' },
  'condition':      { component: () => null, category: 'logic' },
  'redirect':       { component: () => null, category: 'logic' },
  'script':         { component: () => null, category: 'logic' },
  'typebot-logic':  { component: () => null, category: 'logic' },
  'wait':           { component: () => null, category: 'logic' },
  'ab-test':        { component: () => null, category: 'logic' },
  'webhook':        { component: () => null, category: 'logic' },
  'jump':           { component: () => null, category: 'logic' },
  'return':         { component: () => null, category: 'logic' },
};

// Platform support map
export const PLATFORM_SUPPORT: Partial<Record<BlockType, Record<Platform, PlatformSupport>>> = {
  'text-bubble':       { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'image-bubble':      { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'video-bubble':      { website: 'full', whatsapp: 'partial', instagram: 'none' },
  'audio-bubble':      { website: 'full', whatsapp: 'full',    instagram: 'none' },
  'document-bubble':   { website: 'full', whatsapp: 'full',    instagram: 'none' },
  'text-input':        { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'number-input':      { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'email-input':       { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'website-input':     { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'phone-input':       { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'date-input':        { website: 'full', whatsapp: 'partial', instagram: 'none' },
  'time-input':        { website: 'full', whatsapp: 'partial', instagram: 'none' },
  'buttons-input':     { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'rating-input':      { website: 'full', whatsapp: 'partial', instagram: 'none' },
  'pic-choice-input':  { website: 'full', whatsapp: 'none',    instagram: 'none' },
  'file-input':        { website: 'full', whatsapp: 'full',    instagram: 'none' },
  'audio-input':       { website: 'full', whatsapp: 'full',    instagram: 'none' },
  'payment-input':     { website: 'full', whatsapp: 'none',    instagram: 'none' },
  'cards-input':       { website: 'full', whatsapp: 'none',    instagram: 'none' },
  'set-variable':      { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'condition':         { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'redirect':          { website: 'full', whatsapp: 'none',    instagram: 'none' },
  'script':            { website: 'full', whatsapp: 'none',    instagram: 'none' },
  'typebot-logic':     { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'wait':              { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'ab-test':           { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'webhook':           { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'jump':              { website: 'full', whatsapp: 'full',    instagram: 'full' },
  'return':            { website: 'full', whatsapp: 'full',    instagram: 'full' },
};
