const requestAgentCallback = async ({ ack, respond, logger }) => {
  try {
    await ack();
    // Parse user_id
    // Send POST request to backend 

    await respond('Request for Five9 Agent sent.');
  } catch (error) {
    logger.error(error);
  }
};

export { requestAgentCallback };