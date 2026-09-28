export class Five9RemoveParticipantEventDTO {
    chatId: string;
    eventType: string;
    payload: {
        eventSerialNumber: number;
        displayName: string;
        participantType: string;
        timestamp: string;
    }
}