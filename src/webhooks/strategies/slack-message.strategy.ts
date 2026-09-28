import { Injectable } from "@nestjs/common";
import { MessageStrategy } from "../interfaces/message-strategy.interface.js";
import { SlackRequestAgentDTO } from "../dto/slack/slack-request-agent.dto.js";
import { SlackService } from "../../integrations/slack/slack.service.js";


@Injectable()
export class SlackMessageStrategy implements MessageStrategy {
    constructor(private readonly slackService: SlackService) {}

    async handle(payload: SlackRequestAgentDTO): Promise<void> {
        // change to payload.message
        return;
       // await this.slackService.sendMessage(payload.app);
    }

}