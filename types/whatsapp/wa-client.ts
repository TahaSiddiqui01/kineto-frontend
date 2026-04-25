import { BotFlowData } from "../bot";
import { IncomingMessage } from "./whatsapp";

export interface WaClientSendMessageParams {
    incomingMessage: IncomingMessage;
    currentNodeId: string | null;
    data: BotFlowData
}