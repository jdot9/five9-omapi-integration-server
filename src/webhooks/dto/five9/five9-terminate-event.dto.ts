export class Five9TerminateEventDTO {
    chatId: string;
    eventType: string;
    payload: {
        eventSerialNumber: number;
        timestamp: string;
    }
}