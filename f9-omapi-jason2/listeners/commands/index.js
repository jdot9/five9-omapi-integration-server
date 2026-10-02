import { requestAgentCallback } from './request-agent.js';
import { sampleCommandCallback } from './sample-command.js';

export const register = (app) => {
  app.command('/sample-command', sampleCommandCallback);
  app.command('/request-agent', requestAgentCallback);
};
