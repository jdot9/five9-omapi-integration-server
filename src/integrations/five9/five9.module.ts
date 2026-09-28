import { Logger, Module } from "@nestjs/common";
import { Five9Client } from "./five9.client.js";
import { Five9Service } from "./five9.service.js";


@Module({
    imports: [], // Other modules that this module needs
    controllers: [], // Controllers handle incoming requests
    providers: [Logger, Five9Client, Five9Service], // Services and other injectable classes
    exports: [Five9Client, Five9Service] // Makes a provider available to modules that import this module 
})
export class Five9Module {}
