import { Logger, Module } from "@nestjs/common";
import { SlackClient } from "./slack.client.js";
import { SlackService } from "./slack.service.js";

@Module({
    imports: [], // Other modules that this module needs
    controllers: [], // Controllers handle incoming requests
    providers: [Logger, SlackClient, SlackService], // Services and other injectable classes
    exports: [SlackClient, SlackService] // Makes a provider available to modules that import this module 
})
export class SlackModule {}
