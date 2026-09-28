import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { WebhooksModule } from './webhooks/webhooks.module.js';
import { ConfigModule } from '@nestjs/config';
import { Five9Module } from './integrations/five9/five9.module.js';

@Module({
  imports: [
    WebhooksModule,
    Five9Module,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
