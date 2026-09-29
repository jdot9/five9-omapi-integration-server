import { Injectable, Logger } from "@nestjs/common";
import { SlackClient } from "./slack.client.js";


@Injectable()
export class SlackService {
    constructor(private readonly slackClient: SlackClient,
                private readonly logger: Logger
    ) {}
   
    async createPrivateSlackChannel(userId: string) {
        this.logger.log(`Processing Five9 ACCEPT webhook event. Creating private slack channel.`);
        this.slackClient.createConversation(userId);
    }
}