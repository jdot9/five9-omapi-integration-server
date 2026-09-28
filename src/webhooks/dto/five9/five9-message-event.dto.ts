export class Five9MessageEventDTO {
    chatId: string;
    eventType: string;
    payload: {
        eventSerialNumber: number;
        messageSerialNumber: number;
        from: string;
        displayName: string;
        text: string;
        contentType: string
        timestamp: string;
    }
}