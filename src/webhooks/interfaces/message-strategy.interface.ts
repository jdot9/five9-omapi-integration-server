import { SlackRequestAgentDTO } from "../dto/slack/slack-request-agent.dto.js";

export interface MessageStrategy {
    handle(payload: SlackRequestAgentDTO): Promise<void>;
}