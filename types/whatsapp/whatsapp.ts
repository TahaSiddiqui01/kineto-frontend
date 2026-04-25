export interface IncomingMessage {
    from: string
    id: string
    text: string
    type: string
    messages?: unknown[]
}