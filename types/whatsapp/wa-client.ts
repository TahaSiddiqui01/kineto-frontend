import type { Block } from "@/types/flow"
import type { IncomingMessage } from "./whatsapp"

export interface WaClientSendMessageParams {
    incomingMessage: IncomingMessage;
    currentNodeId: string | null;
    data: import("@/types/bot").BotFlowData
}

export interface WaSendTextParams {
    to: string
    text: string
}

export interface WaSendButtonsParams {
    to: string
    body: string
    buttons: { id: string; title: string }[]
}

export interface WaSendImageParams {
    to: string
    url: string
    caption?: string
}

export interface WaSendBlockParams {
    to: string
    block: Block
}
