import { Body, Controller, Logger, Post } from '@nestjs/common';
import { SlackRequestAgentDTO } from './dto/slack/slack-request-agent.dto.js';
import { Five9Service } from '../integrations/five9/five9.service.js';
import { Five9AcceptEventDTO } from './dto/five9/five9-accept-event.dto.js';
import { SlackService } from '../integrations/slack/slack.service.js';

@Controller('webhooks')
export class WebhookController {
    constructor(private readonly five9Service: Five9Service,
                private readonly logger: Logger
    ) {}

  @Post('slack')
  handleSlackRequestAgentEvent(@Body() payload: SlackRequestAgentDTO ) {
    this.logger.log("Slack request-agent command triggered.");
    this.five9Service.requestAgent(payload.domainId, payload.deliveryProfileId, payload.phoneNumber);
  }

  @Post('five9')
  handleFive9DeliveryProfileEvent(@Body() payload: Five9AcceptEventDTO){
    switch (payload.eventType) {
      case 'ACCEPT':
        this.logger.log(`Five9 agent ${payload.payload.displayName} accepted your request.`);
        // Create private slack channel (conversations.create)
        // Get user id returned from property (channel.creator)
        // Invite your self (conversations.invite)
        break;
      case 'CREATE':
        this.logger.log("Request for Five9 agent delivered. Awaiting agent to accept chat interaction.");
        break;
      case 'ERROR':
        this.logger.log("Failed to deliver chat request to Five9.");
        break;
  }
}
}