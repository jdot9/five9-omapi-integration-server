import { Logger, Module } from "@nestjs/common";
import { SlackClient } from "./slack.client.js";
import { SlackService } from "./slack.service.js";
import { ConfigService } from "@nestjs/config";
import { Five9Module } from "../five9/five9.module.js";

@Module({
    imports: [Five9Module], // Other modules that this module needs
    controllers: [], // Controllers handle incoming requests
    providers: [Logger, SlackClient, SlackService, ConfigService], // Services and other injectable classes
    exports: [SlackClient, SlackService] // Makes a provider available to modules that import this module
})
export class SlackModule {}
