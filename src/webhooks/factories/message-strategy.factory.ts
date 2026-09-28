import { Injectable } from "@nestjs/common";
import { SlackMessageStrategy } from "../strategies/slack-message.strategy.js";
import { MessageStrategy } from "../interfaces/message-strategy.interface.js";


@Injectable()
export class MessageStrategyFactory {
    constructor(private readonly slackStrategy: SlackMessageStrategy) {}

    getStrategy(type: string): MessageStrategy {
        
        switch (type) {
            case 'slack':
                return this.slackStrategy;
            
            default:
                throw new Error(`Unsupported message type: ${type}`);
        }
    }
}