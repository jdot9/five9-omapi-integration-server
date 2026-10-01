import { SlackRequestAgentDTO } from "../dto/slack/slack-request-agent.dto.js";

export interface MessageStrategy {
    sendMessage(payload: any): Promise<void>;
}