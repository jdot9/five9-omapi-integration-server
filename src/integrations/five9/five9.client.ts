

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class Five9Client {

    private token: string | null = null;
    private chatId: string | null = null;
    private domainId: string | null = null;

    constructor(private readonly configService: ConfigService,
                private readonly logger: Logger,
    ){}
    
    async getBearerToken() {
        const url = 'https://api.prod.us.five9.net/oauth2/v1/token';
        const username = this.configService.get<string>('CONSUMER_KEY');
        const password = this.configService.get<string>('SECRET_ID');
        this.logger.log(`Consumer Key: ${username}\nSecret ID: ${password}`);
        const credentials = Buffer.from(`${username}:${password}`).toString('base64');
        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            scope: 'read',
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body,
            });
    
            const data = await response.json();
            this.logger.log(`New token created. Expires in ${data.expires_in} seconds`);
            this.token = data.access_token;
        } catch (error) {
            this.logger.warn(`Failed to retrieve token. Check your Five9 environment variables. (CONSUMER_KEY and SECRET_ID)\n${error}`);
        }
    }

    async createNewChat(domainId: string, deliveryProfileId: string, phoneNumber: string) {
        this.domainId = domainId;
        const url = `https://api.prod.us.five9.net/messaging-service/v1/domains/${domainId}/delivery-profiles/${deliveryProfileId}/chats`
        const body = {
            "channel": "GENERIC",
            "campaignSource": {
                "campaignId": "411",
                "campaignName": "zzJasonTestChat",
                "campaignHandle": "Chat"
            },
            "contactSource": {
                "clientHandle": phoneNumber
            },
            "attributes": [
                {
                    "attributeName": "Subject",
                    "attributeValue": "Open Messaging API"
                }
            ]
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            this.logger.log(`New chat created\n\n${data}`);
            this.chatId = data.chatId;
        } catch (error) {
            this.logger.warn(`Failed to create a new chat.\n${error}`);
        }
        
    }

    async sendMessage(text: string) {
        const url = `https://api.prod.us.five9.net/messaging-service/v1/domains/${this.domainId}/chats/${this.chatId}/messages`;
        const body = {
            "type": "RICHTEXT",
            "timestamp": new Date().toISOString(), // Current UTC time
            "text": text
        }
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const data = await response.json();
            if (data.status == 'RECEIVED'){
                this.logger.log("Message delivered.");
            } else {
                this.logger.warn("Message sent.")
            }
        } catch (error) {
            this.logger.warn(`Failed to send message.\n${error}`);
        }
    }

}