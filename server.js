const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;
const URI = `/webhook/${process.env.BOT_TOKEN}`;
const WEBHOOK_URL = `${process.env.WEBHOOK_URL}${URI}`;

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get(`${URI}/new`, (req, res)=>{
  res.send("Hello")
})

app.post(URI, async (req, res) => {
  console.log('Webhook request received:', req.body);
  const { message } = req.body;

  if (message) {
    console.log(`Message received: ${message.text}`);
    if (message.text === '/start') {
      console.log('Received /start command');
      try {
        const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: message.chat.id,
          text: 'Welcome to Hamster Kombat! Click here to play: YOUR_GAME_URL'
        });
        console.log('Response sent to Telegram:', response.data);
      } catch (error) {
        console.error('Error sending message to Telegram:', error.response ? error.response.data : error.message);
      }
    } else {
      console.log('Received other command:', message.text);
    }
  } else {
    console.log('No message received in the request');
  }

  res.status(200).send('Webhook processed');
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    const response = await axios.post(`${TELEGRAM_API}/setWebhook`, {
      url: WEBHOOK_URL
    });
    console.log(`Webhook set to ${WEBHOOK_URL}`);
  } catch (error) {
    console.error(`Error setting webhook: ${error.response ? error.response.data : error.message}`);
  }
});

// Temporary route for testing
app.get('/test-webhook', (req, res) => {
  res.send('Test webhook is working');
});
