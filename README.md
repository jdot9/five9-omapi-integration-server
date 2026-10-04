# Five9 Open Messaging API Integration Server
This integration server is designed for Slack users to initiate chat interactions with Agents through Five9's Open Messaging API.
Before proceeding with setting up this app, please make sure you have Docker installed, a workspace in Slack, and have completed the prerequisites required for using Five9's Open Messaging API.

## Demonstration
https://youtu.be/adDfNc2BUHo

## Set Up

1. Create a Slack app

2. Add the following OAuth Scopes under Bot Token Scopes for your app:
    - channels:history
    - chat:write
    - chat:wrote.customize
    - commands
    - groups:history
    - groups:read
    - groups:write
    - groups:write.invites
    - users:read
    - users:read.email

3. Copy your App Token and Bot User OAuth Token.

4. Navigate to .env.sample. (omapi-integration-server -> .env.sample)

5. rename .env.sample to .env

6. Assign your tokens to the appropriate environment variables.

7. Repeat steps 1 - 6 for your second app but navigate to the other .env.sample before assigning tokens.
(omapi-integration-server -> f9-omapi-jason2 -> .env.sample)

8. Add this slash command to your second app: /request-agent

9. Open a terminal and make sure you are in f9-omapi-jason2

10. Install the Slack CLI

11. Run command: slack login

12. After successfully authenticating, run this command: slack run
    -  Note: If you are presented with a list of options, select option 2 (Use all app settings values)

13. Open a second terminal

14. Run command: docker build -t f9-omapi-backend .

15. Run command: docker run -p 3000:3000 --env-file .env --name app f9-omapi-backend

You're now ready to connect with a Five9 Agent through Slack.

Go to a slack channel in your workspace and enter the command below: 

/request-agent your-first-name, your-last-name, your-phone-number
