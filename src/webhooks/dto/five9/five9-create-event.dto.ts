export class Five9CreateEventDTO {
    chatId: string;
    eventType: string;
    payload: {
        eventSerialNumber: number;
        externalId: string;
        correlationId: string;
        timestamp: string;
    }
}