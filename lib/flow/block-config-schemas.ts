import type { BlockConfigSchema, BlockType } from '@/types/flow';

export const BLOCK_CONFIG_SCHEMAS: BlockConfigSchema[] = [
  // ── Bubbles ──────────────────────────────────────────────────────────────────
  {
    blockType: 'text-bubble',
    title: 'Text bubble',
    fields: [
      { key: 'text', label: 'Message', type: 'textarea', placeholder: 'Type your message…', showVariables: true },
    ],
  },
  {
    blockType: 'image-bubble',
    title: 'Image bubble',
    fields: [
      { key: 'imageUrl', label: 'Image URL', type: 'text', placeholder: 'https://example.com/image.png' },
      { key: 'alt',      label: 'Alt text',  type: 'text', placeholder: 'Describe the image' },
    ],
  },
  {
    blockType: 'video-bubble',
    title: 'Video bubble',
    fields: [
      { key: 'videoUrl', label: 'Video URL', type: 'text', placeholder: 'https://youtube.com/watch?v=…' },
    ],
  },
  {
    blockType: 'embed-bubble',
    title: 'Embed bubble',
    fields: [
      { key: 'embedUrl', label: 'Embed URL / HTML', type: 'textarea', placeholder: '<iframe …>' },
    ],
  },
  {
    blockType: 'audio-bubble',
    title: 'Audio bubble',
    fields: [
      { key: 'audioUrl', label: 'Audio URL', type: 'text', placeholder: 'https://example.com/audio.mp3' },
    ],
  },

  // ── Inputs ───────────────────────────────────────────────────────────────────
  {
    blockType: 'text-input',
    title: 'Text input',
    fields: [
      { key: 'placeholder',  label: 'Placeholder',       type: 'text',            placeholder: 'Type your answer…' },
      { key: 'buttonLabel',  label: 'Button label',      type: 'text',            placeholder: 'Send', defaultValue: 'Send' },
      { key: 'variableName', label: 'Save the answer in a variable', type: 'variable-picker' },
    ],
  },
  {
    blockType: 'number-input',
    title: 'Number input',
    fields: [
      { key: 'placeholder',  label: 'Placeholder',   type: 'text',            placeholder: 'Enter a number…' },
      { key: 'min',          label: 'Min value',     type: 'text',            placeholder: '0' },
      { key: 'max',          label: 'Max value',     type: 'text',            placeholder: '100' },
      { key: 'buttonLabel',  label: 'Button label',  type: 'text',            defaultValue: 'Send' },
      { key: 'variableName', label: 'Save the answer in a variable', type: 'variable-picker' },
    ],
  },
  {
    blockType: 'email-input',
    title: 'Email input',
    fields: [
      { key: 'placeholder',  label: 'Placeholder',    type: 'text',     placeholder: 'Type your email…' },
      { key: 'buttonLabel',  label: 'Button label',   type: 'text',     placeholder: 'Send', defaultValue: 'Send' },
      { key: 'retryMessage', label: 'Retry message',  type: 'textarea', placeholder: 'This email doesn\'t seem to be valid. Can you type it again?' },
      { key: 'variableName', label: 'Save the answer in a variable', type: 'variable-picker' },
    ],
  },
  {
    blockType: 'website-input',
    title: 'Website input',
    fields: [
      { key: 'placeholder',  label: 'Placeholder',   type: 'text', placeholder: 'https://…' },
      { key: 'buttonLabel',  label: 'Button label',  type: 'text', defaultValue: 'Send' },
      { key: 'variableName', label: 'Save the answer in a variable', type: 'variable-picker' },
    ],
  },
  {
    blockType: 'date-input',
    title: 'Date input',
    fields: [
      { key: 'placeholder',  label: 'Placeholder',  type: 'text' },
      { key: 'format',       label: 'Date format',  type: 'select', defaultValue: 'MM/DD/YYYY', options: [
        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
      ]},
      { key: 'variableName', label: 'Save the answer in a variable', type: 'variable-picker' },
    ],
  },
  {
    blockType: 'time-input',
    title: 'Time input',
    fields: [
      { key: 'placeholder',  label: 'Placeholder',  type: 'text' },
      { key: 'variableName', label: 'Save the answer in a variable', type: 'variable-picker' },
    ],
  },
  {
    blockType: 'phone-input',
    title: 'Phone input',
    fields: [
      { key: 'placeholder',     label: 'Placeholder',     type: 'text', placeholder: '+1 555 000 0000' },
      { key: 'defaultCountry',  label: 'Default country', type: 'text', placeholder: 'US' },
      { key: 'retryMessage',    label: 'Retry message',   type: 'textarea' },
      { key: 'variableName',    label: 'Save the answer in a variable', type: 'variable-picker' },
    ],
  },
  {
    blockType: 'buttons-input',
    title: 'Buttons',
    fields: [
      { key: 'message',       label: 'Message',        type: 'textarea', placeholder: 'Choose an option' },
      { key: 'variableName',  label: 'Save the answer in a variable', type: 'variable-picker' },
    ],
  },
  {
    blockType: 'pic-choice-input',
    title: 'Picture choice',
    fields: [
      { key: 'message',      label: 'Message',       type: 'textarea' },
      { key: 'variableName', label: 'Save the answer in a variable', type: 'variable-picker' },
    ],
  },
  {
    blockType: 'payment-input',
    title: 'Payment',
    fields: [
      { key: 'amount',      label: 'Amount',    type: 'text', placeholder: '10.00' },
      { key: 'currency',    label: 'Currency',  type: 'select', defaultValue: 'USD', options: [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
      ]},
      { key: 'description', label: 'Description', type: 'text' },
    ],
  },
  {
    blockType: 'rating-input',
    title: 'Rating',
    fields: [
      { key: 'maxRating',    label: 'Max rating',  type: 'select', defaultValue: '5', options: [
        { value: '5',  label: '5 stars' },
        { value: '10', label: '10 stars' },
      ]},
      { key: 'variableName', label: 'Save the answer in a variable', type: 'variable-picker' },
    ],
  },
  {
    blockType: 'file-input',
    title: 'File upload',
    fields: [
      { key: 'buttonLabel',  label: 'Button label',   type: 'text',   defaultValue: 'Upload a file' },
      { key: 'accept',       label: 'Accepted types', type: 'text',   placeholder: '.pdf,.jpg,.png' },
      { key: 'variableName', label: 'Save the answer in a variable', type: 'variable-picker' },
    ],
  },
  {
    blockType: 'cards-input',
    title: 'Cards',
    fields: [
      { key: 'message',      label: 'Message',       type: 'textarea' },
      { key: 'variableName', label: 'Save the answer in a variable', type: 'variable-picker' },
    ],
  },

  // ── Logic ────────────────────────────────────────────────────────────────────
  { blockType: 'set-variable',  title: 'Set variable',  fields: [
    { key: 'variableName', label: 'Variable name', type: 'text', placeholder: 'my-variable' },
    { key: 'expression',   label: 'Value',         type: 'textarea', placeholder: 'Enter value or expression…' },
  ]},
  { blockType: 'condition',     title: 'Condition',     fields: [
    { key: 'expression', label: 'Condition expression', type: 'textarea', placeholder: '{{variable}} = "value"' },
  ]},
  { blockType: 'redirect',      title: 'Redirect',      fields: [
    { key: 'url',    label: 'URL',           type: 'text', placeholder: 'https://…' },
    { key: 'openNewTab', label: 'Open in new tab', type: 'toggle', defaultValue: true },
  ]},
  { blockType: 'script',        title: 'Script',        fields: [
    { key: 'code', label: 'JavaScript code', type: 'textarea', placeholder: 'console.log("hello")' },
  ]},
  { blockType: 'typebot-logic', title: 'Typebot',       fields: [
    { key: 'typebotId', label: 'Typebot ID', type: 'text' },
  ]},
  { blockType: 'wait',          title: 'Wait',          fields: [
    { key: 'duration', label: 'Duration (seconds)', type: 'text', placeholder: '2' },
  ]},
  { blockType: 'ab-test',       title: 'AB Test',       fields: [
    { key: 'aPercent', label: 'Percentage for path A', type: 'text', placeholder: '50' },
  ]},
  { blockType: 'webhook',       title: 'Webhook',       fields: [
    { key: 'url',    label: 'Webhook URL', type: 'text', placeholder: 'https://…' },
    { key: 'method', label: 'Method',     type: 'select', defaultValue: 'POST', options: [
      { value: 'POST',   label: 'POST'   },
      { value: 'GET',    label: 'GET'    },
      { value: 'PUT',    label: 'PUT'    },
      { value: 'DELETE', label: 'DELETE' },
    ]},
  ]},
  { blockType: 'jump',          title: 'Jump',          fields: [
    { key: 'targetGroupId', label: 'Target group', type: 'text', placeholder: 'Group ID' },
  ]},
  { blockType: 'return',        title: 'Return',        fields: [] },

  // ── Events ───────────────────────────────────────────────────────────────────
  { blockType: 'start-event',   title: 'Start event',   fields: [] },
  { blockType: 'command-event', title: 'Command event', fields: [
    { key: 'command', label: 'Command', type: 'text', placeholder: '/start' },
  ]},
  { blockType: 'reply-event',   title: 'Reply event',   fields: [
    { key: 'match', label: 'Reply contains', type: 'text', placeholder: 'keyword' },
  ]},
  { blockType: 'invalid-event', title: 'Invalid event', fields: [] },

  // ── Integrations (minimal config for now) ────────────────────────────────────
  { blockType: 'sheets',            title: 'Google Sheets',  fields: [
    { key: 'spreadsheetId', label: 'Spreadsheet ID', type: 'text' },
    { key: 'sheetName',     label: 'Sheet name',     type: 'text' },
  ]},
  { blockType: 'analytics',         title: 'Analytics',      fields: [
    { key: 'eventName', label: 'Event name', type: 'text' },
  ]},
  { blockType: 'http-request',      title: 'HTTP request',   fields: [
    { key: 'url',    label: 'URL',    type: 'text', placeholder: 'https://api.example.com' },
    { key: 'method', label: 'Method', type: 'select', defaultValue: 'GET', options: [
      { value: 'GET',    label: 'GET'    },
      { value: 'POST',   label: 'POST'   },
      { value: 'PUT',    label: 'PUT'    },
      { value: 'DELETE', label: 'DELETE' },
    ]},
    { key: 'body', label: 'Request body', type: 'textarea', placeholder: '{\n  "key": "value"\n}' },
  ]},
  { blockType: 'email-integration', title: 'Send Email',     fields: [
    { key: 'to',      label: 'To',      type: 'text', placeholder: 'user@example.com' },
    { key: 'subject', label: 'Subject', type: 'text' },
    { key: 'body',    label: 'Body',    type: 'textarea' },
  ]},
  { blockType: 'zapier',      title: 'Zapier',      fields: [{ key: 'webhookUrl', label: 'Webhook URL', type: 'text' }] },
  { blockType: 'make-com',    title: 'Make.com',    fields: [{ key: 'webhookUrl', label: 'Webhook URL', type: 'text' }] },
  { blockType: 'pabbly',      title: 'Pabbly',      fields: [{ key: 'webhookUrl', label: 'Webhook URL', type: 'text' }] },
  { blockType: 'chatwoot',    title: 'Chatwoot',    fields: [{ key: 'apiKey', label: 'API Key', type: 'text' }] },
  { blockType: 'pixel',       title: 'Pixel',       fields: [{ key: 'pixelId', label: 'Pixel ID', type: 'text' }] },
  { blockType: 'openai',      title: 'OpenAI',      fields: [
    { key: 'prompt', label: 'Prompt', type: 'textarea' },
    { key: 'model',  label: 'Model',  type: 'select', defaultValue: 'gpt-4o', options: [
      { value: 'gpt-4o',      label: 'GPT-4o'      },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    ]},
    { key: 'variableName', label: 'Save response in', type: 'variable-picker' },
  ]},
  { blockType: 'cal-com',     title: 'Cal.com',     fields: [{ key: 'calLink', label: 'Cal.com link', type: 'text', placeholder: 'username/meeting' }] },
  { blockType: 'chatnode',    title: 'ChatNode',     fields: [{ key: 'apiKey', label: 'API Key', type: 'text' }] },
  { blockType: 'qr-code',     title: 'QR Code',     fields: [{ key: 'content', label: 'Content / URL', type: 'text' }] },
  { blockType: 'dify-ai',     title: 'Dify.AI',     fields: [{ key: 'apiKey', label: 'API Key', type: 'text' }, { key: 'prompt', label: 'Prompt', type: 'textarea' }] },
  { blockType: 'mistral',     title: 'Mistral',     fields: [{ key: 'prompt', label: 'Prompt', type: 'textarea' }, { key: 'variableName', label: 'Save response in', type: 'variable-picker' }] },
  { blockType: 'eleven-labs', title: 'ElevenLabs',  fields: [{ key: 'text', label: 'Text to synthesise', type: 'textarea' }, { key: 'voiceId', label: 'Voice ID', type: 'text' }] },
  { blockType: 'anthropic',   title: 'Anthropic',   fields: [{ key: 'prompt', label: 'Prompt', type: 'textarea' }, { key: 'model', label: 'Model', type: 'text', defaultValue: 'claude-sonnet-4-6' }, { key: 'variableName', label: 'Save response in', type: 'variable-picker' }] },
  { blockType: 'together',    title: 'Together',    fields: [{ key: 'prompt', label: 'Prompt', type: 'textarea' }] },
  { blockType: 'openrouter',  title: 'OpenRouter',  fields: [{ key: 'prompt', label: 'Prompt', type: 'textarea' }, { key: 'model', label: 'Model ID', type: 'text' }] },
  { blockType: 'nocodb',      title: 'NocoDB',      fields: [{ key: 'apiKey', label: 'API Key', type: 'text' }, { key: 'tableId', label: 'Table ID', type: 'text' }] },
  { blockType: 'segment',     title: 'Segment',     fields: [{ key: 'eventName', label: 'Event name', type: 'text' }] },
  { blockType: 'groq',        title: 'Groq',        fields: [{ key: 'prompt', label: 'Prompt', type: 'textarea' }, { key: 'variableName', label: 'Save response in', type: 'variable-picker' }] },
  { blockType: 'zendesk',     title: 'Zendesk',     fields: [{ key: 'subject', label: 'Ticket subject', type: 'text' }] },
  { blockType: 'posthog',     title: 'Posthog',     fields: [{ key: 'eventName', label: 'Event name', type: 'text' }] },
  { blockType: 'perplexity',  title: 'Perplexity',  fields: [{ key: 'prompt', label: 'Prompt', type: 'textarea' }] },
  { blockType: 'deepseek',    title: 'DeepSeek',    fields: [{ key: 'prompt', label: 'Prompt', type: 'textarea' }] },
  { blockType: 'blink',       title: 'Blink',       fields: [{ key: 'url', label: 'Target URL', type: 'text' }] },
  { blockType: 'gmail',       title: 'Gmail',       fields: [{ key: 'to', label: 'To', type: 'text' }, { key: 'subject', label: 'Subject', type: 'text' }, { key: 'body', label: 'Body', type: 'textarea' }] },
];

export const BLOCK_CONFIG_SCHEMAS_MAP = new Map<BlockType, BlockConfigSchema>(
  BLOCK_CONFIG_SCHEMAS.map((s) => [s.blockType, s])
);
