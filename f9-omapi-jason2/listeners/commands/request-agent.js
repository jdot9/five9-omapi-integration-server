import dotenv from 'dotenv'
dotenv.config()
// slash-command parameters are available through the command.text property
const requestAgentCallback = async ({ ack, respond, logger, command }) => {
  try {
    await ack("Request sent.");
    // Parse user_id
    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    const message = command.text; // Removes all spaces
    const cleanedMessage = message.replace(/[\s.]/g, "");
    const ids = cleanedMessage.split(',');
    const isValidPhoneNumber = phoneRegex.test(ids[2]);
    logger.info(ids);
    
    if (ids.length < 3 || !isValidPhoneNumber)
    {
        await respond('Failed to process request. Please enter your first name, last name and phone number.\nEx. /request-agent Jason, Dotson, +19119119111');
        return;
    }
  
    const data = {
        app: 'slack',
        firstName: ids[0],
        lastName: ids[1],
        phoneNumber: ids[2],
        userId: command.user_id
    };
    // Send POST request to backend 
    const response = 
    await fetch(`${process.env.WEBHOOK_URL}/webhooks/slack`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    });
    const text = await response.text();
    await respond('An agent will be with you shortly.');
  } catch (error) {
    logger.error(error);
  }
};

export { requestAgentCallback };