import { sampleCommandCallback } from './sample-command.js';
import { requestAgentCallback } from './request-agent.js';

export const register = (app) => {
  app.command('/sample-command', sampleCommandCallback);
  app.command('/request-agent', requestAgentCallback);
  
};
