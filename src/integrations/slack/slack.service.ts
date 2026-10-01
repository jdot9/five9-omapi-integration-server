import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { SlackClient } from "./slack.client.js";
import { ConfigService } from "@nestjs/config";
import { App } from "@slack/bolt";
import { Five9Client } from "../five9/five9.client.js";


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
        this.slackApp.event('message', async ({event, say}) => {
            // If not message, ignore
            if ('subtype' in event && event.subtype || !event.text) {
                return;
            }

            this.logger.log(`Received Slack message: ${event.text}`);
            // Send message to Five9
            this.five9Client.sendMessage(event.text);
            //await say('Message received by NestJS!');

        })

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

    async sendMessage(channelId: string, message: string) {
        this.logger.log(`Routing message from Five9 agent to channel ${channelId}`);
        this.slackClient.sendMessage(channelId, message);
    }

}