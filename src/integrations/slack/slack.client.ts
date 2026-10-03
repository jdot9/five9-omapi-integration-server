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


        constructor(private readonly configService: ConfigService,
                    private readonly logger: Logger,
        ){}

        async createConversation(userId: string) {
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

        async sendMessage(channelId: string, message: string, displayName?: string) {
            const agentEmoji = ':technologist:'; 
            const botEmoji = ':robot_face:';
            const body = {
                "channel": channelId,
                "text": message,
                "username": `${displayName ?? 'BOT'}`,
                "icon_emoji": `${displayName ? agentEmoji : botEmoji}`,
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

        // Slack has no typing-indicator API for modern (granular-scope) apps; that only
        // existed on the deprecated RTM API. Simulate it by posting a placeholder message
        // and deleting it once the real message arrives (see clearTypingIndicator).
        async sendTypingIndicator(channelId: string): Promise<string | undefined> {
            const body = {
                "channel": channelId,
                "text": "_Agent is typing..._",
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
                if (!response.ok) {
                    throw new Error(`Slack Chat API returned status ${response.status}: ${JSON.stringify(data)}`);
                }
                this.logger.log(`Typing indicator posted to channel ${channelId}`);
                return data.ts;
            } catch (error) {
                this.logger.warn(`Failed to post typing indicator to channel ${channelId}`);
            }
        }

        async clearTypingIndicator(channelId: string, ts: string): Promise<void> {
            const body = {
                "channel": channelId,
                "ts": ts,
            }

            try {
                const response = await fetch(`${this.baseUrl}/chat.delete`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.configService.get<string>('SLACK_BOT_TOKEN')}`,
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify(body)
                })
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(`Slack Chat API returned status ${response.status}: ${JSON.stringify(data)}`);
                }
                this.logger.log(`Typing indicator cleared in channel ${channelId}`);
            } catch (error) {
                this.logger.warn(`Failed to clear typing indicator in channel ${channelId}`);
            }
        }
}