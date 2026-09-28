import { Injectable } from "@nestjs/common";
import { SlackRequestAgentDTO } from "./dto/slack/slack-request-agent.dto.js";
import { SlackService } from "../integrations/slack/slack.service.js";

@Injectable()
export class WebhookService {
    constructor(private readonly slackService: SlackService) {}

    async handle(payload: SlackRequestAgentDTO) {
        switch (payload.app) 
        {
            case 'slack':
                //return this.slackService.sendMessage();
                return;
        }
    }

}