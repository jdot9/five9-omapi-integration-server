import { Injectable } from "@nestjs/common";
import { SlackClient } from "./slack.client.js";


@Injectable()
export class SlackService {
    constructor(private readonly slackClient: SlackClient) {}

    
}