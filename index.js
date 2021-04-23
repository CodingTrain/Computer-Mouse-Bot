const Twitter = require('choochootweets');
const dotenv = require('dotenv');
dotenv.config();
console.log('hello bot! 🤖');

const config = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET,
};

const mousebot = new Twitter(config);

// testTweet();

// Server
const express = require('express');
const fs = require('fs');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.json({ limit: '1mb' }));

app.get('/mouse/:x/:y', async (request, response) => {
  let { x, y } = request.params;
  const b64content = fs.readFileSync('MouseTracker/cursor.png', { encoding: 'base64' });
  const response1 = await mousebot.upload(b64content);
  const response2 = await mousebot.tweet(`mouseX: ${x} mouseY: ${y}`, [response1.media_id_string]);
  response.json({ status: { mouseX: x, mouseY: y } });
});
