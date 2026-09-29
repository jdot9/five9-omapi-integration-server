

import { Injectable, Logger } from "@nestjs/common";
import { Five9Client } from "./five9.client.js";


@Injectable()
export class Five9Service {
    constructor(private readonly five9Client: Five9Client,
                private readonly logger: Logger
    ) {}

    async requestAgent(domaindId: string, deliveryProfileId: string, phoneNumber: string) {
        this.logger.log('Processing request for Five9 agent...');
        await this.five9Client.getBearerToken();
        await this.five9Client.createNewChat(domaindId, deliveryProfileId, phoneNumber);
    }
    
}