const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
const sendSlackMessage = async (channel, text) => {
    try {
        await slackClient.chat.postMessage({
            channel,
            text,
        });
    } catch (error) {
        console.error('Error sending message: ', error);
    }
};
const processChatMessage = (messageText) => {
    return `Received your message: ${messageText}`;
};
app.post('/message/slack', async (req, res) => {
    const { event } = req.body;
    if (req.body.type === 'url_verification') {
        return res.json({ challenge: req.body.challenge });
    }
    if (event && event.type === 'message' && !event.subtype) {
        const responseText = processChatMessage(event.text);
        await sendSlackMessage(event.channel, responseText);
    }
    res.status(200).send();
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});