export class Five9TransferToAgentEventDTO {
    chatId: string;
    eventType: string;
    payload: {
        eventSerialNumber: number;
        displayName: string;
        userId: number;
        timestamp: string;
    }
}