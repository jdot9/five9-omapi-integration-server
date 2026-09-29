import { Logger, Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller.js';
import { Five9Module } from '../integrations/five9/five9.module.js';
import { SlackModule } from '../integrations/slack/slack.module.js';

@Module({
    imports: [Five9Module, SlackModule], // Other modules that this module needs
    controllers: [WebhookController], // Controllers handle incoming requests
    providers: [Logger], // Services and other injectable classes
    exports: [] // Makes a provider available to modules that import this module 
})
export class WebhooksModule {}
