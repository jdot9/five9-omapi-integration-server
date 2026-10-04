# Five9 Open Messaging API Integration Server
This integration server is designed for Slack users to initiate chat interactions with Five9 Agents through the Open Messaging API.
Before proceeding with setting up this app, please make sure you have Docker installed, a workspace in Slack, and have completed the prerequisites required for using Five9's Open Messaging API.

## Demonstration
https://youtu.be/adDfNc2BUHo

## Set Up

1. Clone this repo and open a terminal.

2. Run command: docker build -t f9-omapi-backend .

3. Run command: docker run -p 3000:3000 --env-file .env --name app f9-omapi-backend

4. Create a Slack app

5. Add the following OAuth Scopes under Bot Token Scopes for your app:
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

6. Copy your App Token and Bot User OAuth Token.

7. Navigate to .env.sample. (omapi-integration-server -> .env.sample)

8. rename .env.sample to .env

9. Assign your tokens to the appropriate environment variables.

10. Repeat steps 3 - 8 for your second app but navigate to the other .env.sample before assigning tokens.
(omapi-integration-server -> f9-omapi-jason2 -> .env.sample)

11. Add this slash command to your second app: /request-agent

12. Open a terminal and make sure you are in f9-omapi-jason2

13. Install the Slack CLI

14. Run command: slack login

15. After successfully authenticating, run this command: slack run
    -  Note: If you are presented with a list of options, select option 2 (Use all app settings values)

You're now ready to connect with a Five9 Agent through Slack.

Go to a slack channel and enter the command below: 

/request-agent your-first-name, your-last-name, your-phone-number