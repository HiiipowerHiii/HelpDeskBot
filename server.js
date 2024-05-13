const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const { WebClient } = require('@slack/web-api');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const slackBotClient = new WebClient(process.env.SLACK_BOT_TOKEN);

const responseCache = new Map();

const postMessageToSlack = async (channelId, messageText) => {
    try {
        await slackBotClient.chat.postMessage({
            channel: channelId,
            text: messageText,
        });
    } catch (error) {
        console.error('Error posting message to Slack: ', error);
        throw error; 
    }
};

const generateResponseFromMessage = (messageText) => {
    if (responseCache.has(messageText)) {
        return responseCache.get(messageText);
    }
    const response = `Received your message: ${messageText}`;
    responseCache.set(messageText, response);
    return response;
};

app.post('/message/slack', async (req, res) => {
    try {
        const { event } = req.body;
        if (req.body.type === 'url_verification') {
            return res.json({ challenge: req.body.challenge });
        }
        if (event && event.type === 'message' && !event.subtype) {
            const responseText = generateResponseFromMessage(event.text);
            await postMessageToSlack(event.channel, responseText);
        }
        res.status(200).send();
    } catch (error) {
        console.error('Failed to process Slack event: ', error);
        res.status(500).send("Internal Server Error");
    }
});

const SERVER_PORT = process.env.PORT || 3000;

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});

process.on('uncaughtException', (error) => {
    console.error('Fatal Error - Uncaught Exception:', error);
    process.exit(1); 
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', promise, 'reason:', reason);
});