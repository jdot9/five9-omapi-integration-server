export class Five9ErrorEventDTO {
    chatId: string;
    eventType: string;
    payload: {
        eventSerialNumber: number;
        errorCode: string;
        errorMessage: string;
        timestamp: string;
    }
}