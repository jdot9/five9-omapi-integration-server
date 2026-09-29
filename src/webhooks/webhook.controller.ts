import { Body, Controller, Logger, Post } from '@nestjs/common';
import { SlackRequestAgentDTO } from './dto/slack/slack-request-agent.dto.js';
import { Five9Service } from '../integrations/five9/five9.service.js';
import { SlackService } from '../integrations/slack/slack.service.js';

@Controller('webhooks')
export class WebhookController {

    private slackUserId: string;
  
    constructor(private readonly five9Service: Five9Service,
                private readonly slackService: SlackService,
                private readonly logger: Logger
    ) {}

  @Post('slack')
  async handleSlackRequestAgentEvent(@Body() payload: SlackRequestAgentDTO ) {
    this.logger.log("Slack request-agent command triggered.");
    this.slackUserId = payload.userId;
    await this.five9Service.requestAgent(payload.domainId, payload.deliveryProfileId, payload.phoneNumber);
  }

  @Post('five9')
  handleFive9DeliveryProfileEvent(@Body() payload: any){
    switch (payload.eventType) {
      case 'ACCEPT':
        this.logger.log(`Five9 agent ${payload.payload.displayName} accepted your request.`);
        this.slackService.createPrivateSlackChannel(this.slackUserId);
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