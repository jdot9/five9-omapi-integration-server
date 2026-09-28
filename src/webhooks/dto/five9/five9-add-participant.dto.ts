export class Five9AddParticipantEventDTO {
    chatId: string;
    eventType: string;
    payload: {
        eventSerialNumber: number;
        displayName: string;
        participantType: string;
        timestamp: string;
    }
}