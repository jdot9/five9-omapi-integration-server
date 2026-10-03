import { Body, Controller, Logger, Post } from '@nestjs/common';
import { SlackRequestAgentDTO } from './dto/slack/slack-request-agent.dto.js';
import { Five9Service } from '../integrations/five9/five9.service.js';
import { SlackService } from '../integrations/slack/slack.service.js';

@Controller('webhooks')
export class WebhookController {

    private slackUserId: string;
    private slackChannelId: string;
    private typingMessageTs: string | undefined;
    // Maybe create an array of objects containing slackUserId and privateSlackChannel?
  
    constructor(private readonly five9Service: Five9Service,
                private readonly slackService: SlackService,
                private readonly logger: Logger
    ) {}

  @Post('slack')
  async handleSlackRequestAgentEvent(@Body() request: SlackRequestAgentDTO ) {
    this.logger.log("Slack request-agent command triggered.");
    this.slackUserId = request.userId;
    await this.five9Service.requestAgent(request.firstName, request.lastName, request.phoneNumber, request.userId);
  }
  

  @Post('five9')
  async handleFive9DeliveryProfileEvent(@Body() request: any){
    switch (request.eventType) {
      case 'CREATE':
        this.logger.log("Request for Five9 agent delivered. Awaiting agent to accept chat interaction.");
        break;
      case 'ACCEPT':
        this.logger.log(`Five9 agent ${request.payload.displayName} accepted your request.`);
        this.slackChannelId = await this.slackService.createPrivateSlackChannel(this.slackUserId); // This must return the slack channel id and be saved in memory
        break;
      case 'TYPING':
        this.logger.log(`Agent is typing`);
        if (!this.typingMessageTs) {
          this.typingMessageTs = await this.slackService.showTypingIndicator(this.slackChannelId);
        }
        break;
      case 'MESSAGE':
        this.logger.log("Message notification triggered.");
        if (this.typingMessageTs) {
          await this.slackService.clearTypingIndicator(this.slackChannelId, this.typingMessageTs);
          this.typingMessageTs = undefined;
        }
        this.slackService.sendMessage(this.slackChannelId, request.payload.text, request.payload.displayName); // Route message to slack channel, pass agent's name
        break;
      case 'TERMINATE':
        this.logger.log(`Chat closed. (agent has left channel ${this.slackChannelId})`);
        this.slackService.sendMessage(this.slackChannelId, 'Chat closed.\nYour assigned Agent has left the channel.');
        break;
      case 'ERROR':
        this.logger.log("Failed to deliver chat request to Five9.");
        break;
  }
}


}