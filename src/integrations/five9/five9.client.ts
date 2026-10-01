

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class Five9Client {

    private readonly baseUrl: string = 'https://api.prod.us.five9.net'
    private token: string | null = null;
    private chatId: string | null = null;
    private domainId: string | null = null;

    constructor(private readonly configService: ConfigService,
                private readonly logger: Logger,
    ){}
    
    async getBearerToken() {
        const url = `${this.baseUrl}/oauth2/v1/token`;
        const username = this.configService.get<string>('FIVE9_CONSUMER_KEY');
        const password = this.configService.get<string>('FIVE9_SECRET_ID');
        this.logger.log(`Consumer Key: ${username}\nSecret ID: ${password}`);
        const credentials = Buffer.from(`${username}:${password}`).toString('base64');
        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            scope: 'openmessaging:read openmessaging:write', // The scope name "openmessaging" can be retrieved from a valid token's payload by decoding the base64 middle section.
                                                             // You can get a valid token from a successful request sent using Postman. I couldn't find the scope name in the docs.
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
            if (!response.ok) {
                throw new Error(`Five9 API returned status ${response.status}: ${JSON.stringify(data)}`);
            }
            this.logger.log(`New token created. Expires in ${data.expires_in} seconds`);
            this.token = data.access_token;
            return;
        } catch (error) {
            this.logger.warn(`Failed to retrieve token. Check your Five9 environment variables. (CONSUMER_KEY and SECRET_ID)\n${error}`);
        }
    }

    async createNewChat(domainId: string, deliveryProfileId: string, phoneNumber: string, slackUserId: string) {
        this.domainId = domainId;
        const url = `${this.baseUrl}/messaging-service/v1/domains/${domainId}/delivery-profiles/${deliveryProfileId}/chats`
        const body = {
            "channel": "GENERIC",
            "campaignSource": {
                "campaignId": "411",
                "campaignName": "zzJasonTestChat", // Replace with environment variable
                "campaignHandle": "Chat"
            },
            "contactSource": {
                "clientHandle": `${phoneNumber}`
            },
            "attributes": [
                {
                    "attributeName": "slackUserId",
                    "attributeValue": `${slackUserId}`
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
            if (!response.ok) {
                throw new Error(`Five9 API returned status ${response.status}: ${JSON.stringify(data)}`);
            }
            this.logger.log(`New chat created\n\n${JSON.stringify(data)}`);
            this.chatId = data.chatId;
            return;
        } catch (error) {
            this.logger.warn(`Failed to create a new chat.\n${error}`);
        }
    }

    async sendMessage(text: string) {
        const url = `${this.baseUrl}/messaging-service/v1/domains/${this.domainId}/chats/${this.chatId}/messages`;
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
            if (!response.ok) {
                throw new Error(`Five9 API (send message) returned status ${response.status}: ${JSON.stringify(data)}`);
            }
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