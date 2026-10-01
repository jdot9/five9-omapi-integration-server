import { Injectable } from "@nestjs/common";
import { MessageStrategy } from "../interfaces/message-strategy.interface.js";
import { SlackService } from "../../integrations/slack/slack.service.js";


@Injectable()
export class SlackMessageStrategy implements MessageStrategy {
    constructor(private readonly slackService: SlackService) {}

    sendMessage(payload: any): Promise<void> {
        throw new Error("Method not implemented.");
    }

}