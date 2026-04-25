import { WaClientSendMessageParams } from "@/types/whatsapp";

class WaClient {
    private readonly apiUrl = "https://graph.facebook.com/v25.0/1041052832423699/messages";

    async sendMessage(params: WaClientSendMessageParams) {
        const { incomingMessage, currentNodeId, data } = params

        const body = {
            messaging_product: 'whatsapp',
            recipient_type: "individual",
            to: incomingMessage.from,
            type: 'text',
            text: {
                body: `Echoing your message: "${incomingMessage.text}". Current node: ${currentNodeId ?? "none"}.`
            }
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.WA_API_ACCESS_TOKEN}`
            },
            body: JSON.stringify(body)
        };

        const response = await fetch(this.apiUrl, options);

        if (!response.ok) {
            console.error("[WaClient] Failed to send message:", await response.text());
            return;
        }

        const wa_response_data = await response.json();

        // For now, just log the message details — implement actual API call here
        console.log("[WaClient] Sending message with params:", body)
        console.log("[WaClient] API response:", wa_response_data)
    }
}


export const wa_client = new WaClient()

