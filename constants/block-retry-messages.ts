import type { BlockType } from '@/types/flow'

export const BLOCK_RETRY_MESSAGES: Partial<Record<BlockType, string>> = {
    'text-input':    'Please send a text message.',
    'number-input':  "That doesn't look like a number. Please try again.",
    'email-input':   'Invalid email, please try again.',
    'website-input': 'Invalid URL, please try again.',
    'audio-input':   'Please send a voice message 🎙️',
}
