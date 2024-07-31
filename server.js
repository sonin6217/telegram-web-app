const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;
const URI = `/webhook/${process.env.BOT_TOKEN}`;
const WEBHOOK_URL = `${process.env.WEBHOOK_URL}${URI}`;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post(URI, async (req, res) => {
  const { message } = req.body;

  if (message && message.text === '/start') {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: message.chat.id,
      text: 'Welcome to Hamster Kombat! Click here to play: YOUR_GAME_URL'
    });
  }

  return res.send();
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
});
