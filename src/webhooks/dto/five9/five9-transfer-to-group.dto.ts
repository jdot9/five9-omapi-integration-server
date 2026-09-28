export class Five9TransferToGroupEventDTO {
    chatId: string;
    eventType: string;
    payload: {
        eventSerialNumber: number;
        skillGroup: string;
        timestamp: string;
    }
}