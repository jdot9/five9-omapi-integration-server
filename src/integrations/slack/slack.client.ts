// Create private slack channel (conversations.create)
// Get user id returned from property (channel.creator)
// Invite your self (conversations.invite)

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";

@Injectable()
export class SlackClient {
        private readonly baseUrl = 'https://slack.com/api';
        private channelId: string;
        private userId: string;

        constructor(private readonly configService: ConfigService,
                    private readonly logger: Logger,
        ){}

        async createConversation(userId: string) {
            this.userId = userId;
            this.channelId = randomUUID();
            const body = {
                "name": `five9-agent-${this.channelId}`,
                "is_private": true
            }

            try {
                const response = await fetch(`${this.baseUrl}/conversations.create`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.configService.get<string>('SLACK_BOT_TOKEN')}`,
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify(body)
                })
                const data = await response.json();
                if (!response.ok || data.error == 'invalid_arguments') {
                    throw new Error(`Slack Conversations API returned status ${response.status}: ${JSON.stringify(data)}`);
                }
                this.logger.log(data);
                const channelId = data.channel.id;
                const creatorId = data.channel.creator;
                this.logger.log(`Channel (${channelId}) created by slack bot ${creatorId}.`)
                this.inviteUserToConversation(channelId, userId);
                return channelId;
            } catch (error) {
                this.logger.warn('Failed to create conversation.');
            }
        }

        async inviteUserToConversation(channelId: string, userId: string) {
            try {
                const body = {
                    "channel": `${channelId}`,
                    "users": `${userId}`
                }
                const response = await fetch(`${this.baseUrl}/conversations.invite`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.configService.get<string>('SLACK_BOT_TOKEN')}`,
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify(body)
                })
                const data = await response.json();
                if (!response.ok || data.error == "cant_invite_self") {
                    throw new Error(`Slack Conversations API returned status ${response.status}: ${JSON.stringify(data)}`);
                }
                this.logger.log(`Invite sent to user ${userId} (creator)`);
            } catch (error) {
                this.logger.warn(`Failed to invite user ${userId} (creator) to channel ${channelId}`)
            }
        }

        async sendMessage(channelId: string, message: string) {

            const body = {
                "channel": channelId,
                "text": message,
            }

            try {
                const response = await fetch(`${this.baseUrl}/chat.postMessage`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.configService.get<string>('SLACK_BOT_TOKEN')}`,
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify(body)
                })
                const data = await response.json();
                if(!response.ok) {
                    throw new Error(`Slack Chat API returned status ${response.status}: ${JSON.stringify(data)}`);
                }
                this.logger.log(`Message routed to channel ${channelId}`);
            } catch (error) {
                this.logger.warn(`Failed to route message to channel ${channelId}`);
            }
        }
}