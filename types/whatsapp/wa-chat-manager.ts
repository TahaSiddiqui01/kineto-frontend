import { BotFlowData } from "../bot";
import { IncomingMessage } from "./whatsapp";

export interface WaChatResolveParams {
    currentNodeId: string | null;
    flow: BotFlowData
    incomingMessage: IncomingMessage;
}

export interface WaChatResolveResponse {
    previousNodeId: string | null;
    currentNodeId: string | null;
    nextNodeId: string | null;
}

