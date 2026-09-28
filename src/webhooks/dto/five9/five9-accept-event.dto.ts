export class Five9AcceptEventDTO {
    chatId: string;
    eventType: string;
    payload: {
        eventSerialNumber: number;
        displayName: string;
        userId: number;
        from: string;
        timestamp: string;
    }
}