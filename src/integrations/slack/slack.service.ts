import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { SlackClient } from "./slack.client.js";
import { ConfigService } from "@nestjs/config";
import { App } from "@slack/bolt";
import { Five9Client } from "../five9/five9.client.js";
import { emojify } from "node-emoji";


@Injectable()
export class SlackService implements OnModuleInit, OnModuleDestroy{
    private slackApp: App;

    constructor(private readonly slackClient: SlackClient,
                private readonly five9Client: Five9Client,
                private readonly logger: Logger,
                private readonly configService: ConfigService,
    ) {}

    async onModuleInit() {
        this.slackApp = new App({
            token: this.configService.getOrThrow<string>('SLACK_BOT_TOKEN'),
            appToken: this.configService.getOrThrow<string>('SLACK_APP_TOKEN'),
            socketMode: true,
        });

        // Register event listeners
        // 2 Slack apps were needed to get around the round robin silent fail problem. (Problem resolved)
        this.slackApp.event('message', async ({event, say}) => {
            // If not message, ignore
            if ('subtype' in event && event.subtype || !event.text) {
                this.logger.debug(`Ignoring Slack event (subtype=${'subtype' in event ? event.subtype : undefined}, text=${'text' in event ? event.text : undefined})`);
                return;
            } else if(event.text == '$disconnect') { 
                const result = await this.five9Client.terminateChat(event.user);
                if (result == 'success') {
                    await say('You have ended the conversation.');
                    this.logger.log('You have ended chat interaction with Five9 agent. (Slack)');
                } else {
                    await say('Failed to disconnect.');
                    this.logger.warn(`Failed to disconnect (Slack)`);
                }
                return;
            }

            this.logger.log(`Received Slack message: ${event.text}`);
            await this.five9Client.sendMessage(emojify(event.text)); // Convert :shortcode: to unicode before sending to Five9

        })

        // Surface errors Bolt would otherwise swallow in its own default handler
        this.slackApp.error(async (error) => {
            this.logger.error(`Bolt app error: ${error}`);
        });

        // Establish socket mode connection
        await this.slackApp.start();
        this.logger.log('Slack Socket Mode connected')
    }

    async onModuleDestroy() {
        if (this.slackApp) {
            await this.slackApp.stop();
            this.logger.log('Slack app stopped');
        }
    }
   

    async createPrivateSlackChannel(userId: string) {
        this.logger.log(`Processing Five9 ACCEPT webhook event. Creating private slack channel.`);
        const channelId = await this.slackClient.createConversation(userId);
        return channelId;
    }

    async sendMessage(channelId: string, message: string, displayName?: string) {
        this.logger.log(`Routing message from Five9 agent to channel ${channelId}`);
        this.slackClient.sendMessage(channelId, message.replace(/\\!/g, '!'), displayName); // Five9's RICHTEXT content escapes "!" as "\!"; undo that before posting to Slack
    }

    async showTypingIndicator(channelId: string): Promise<string | undefined> {
        return this.slackClient.sendTypingIndicator(channelId);
    }

    async clearTypingIndicator(channelId: string, ts: string): Promise<void> {
        await this.slackClient.clearTypingIndicator(channelId, ts);
    }

}