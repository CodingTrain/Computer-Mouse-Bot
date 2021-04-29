const dotenv = require('dotenv');
dotenv.config();
console.log('hello bot! 🤖');
const dateFormat = require('dateformat');

// const config = {
//   consumer_key: process.env.CONSUMER_KEY,
//   consumer_secret: process.env.CONSUMER_SECRET,
//   token: process.env.TOKEN,
//   token_secret: process.env.TOKEN_SECRET,
// };

const express = require('express');
const fs = require('fs');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.json({ limit: '1mb' }));

const Twitter = require('twitter-lite');

// Twitter creds and settings (generally doesn't need to be touched)
// as creds are set in .env file (see env-sample)
const client = new Twitter({
  subdomain: 'api',
  version: '1.1',
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.TOKEN,
  access_token_secret: process.env.TOKEN_SECRET,
});

const upload = new Twitter({
  subdomain: 'upload',
  version: '1.1',
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.TOKEN,
  access_token_secret: process.env.TOKEN_SECRET,
});

console.log('twitter-lite');
app.get('/mouse/:x/:y/:name/:minutes', async (request, response) => {
  let { x, y, name } = request.params;
  try {
    const b64content = fs.readFileSync('MouseTracker/cursor.png', {
      encoding: 'base64',
    });
    const media = await upload.post('media/upload', {
      media_data: b64content,
    });
    const alt = await upload.post('media/metadata/create', {
      media_id: media.media_id_string,
      alt_text: {
        text: `Visualization of mouse path ending at ${x},${y}`,
      },
    });
    const thetime =
      dateFormat('mediumDate') + ' ' + dateFormate('longTime');
    const tweet = await client.post('statuses/update', {
      status: `${minutes} minutes of mouse movements from ${name} at ${thetime}`,
      media_ids: [media.media_id_string],
    });
  } catch (error) {
    console.error(error);
  }
  response.json({ status: { name, mouseX: x, mouseY: y } });
});

// const config = {
//   consumer_key: process.env.TWITTER_CONSUMER_KEY,
//   consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//   token: process.env.TWITTER_ACCESS_TOKEN,
//   token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
//   env: process.env.TWITTER_WEBHOOK_ENV,
//   ngrok: process.env.NGROK_AUTH_TOKEN,
// };

// For testing in this repo
// const ChooChooTweets = require('choochootweets');
// const a2zitp = new ChooChooTweets(config);

// start();
// async function start() {
//   console.log('listening');
//   let webhookURL;
//   if (process.env.PROJECT_DOMAIN) {
//     webhookURL = `https://${process.env.PROJECT_DOMAIN}.glitch.me/webhook`;
//   }
//   await a2zitp.initActivity(tweetHandler, webhookURL);
// }

// async function tweetHandler(for_user_id, tweet) {
//   const { user, id_str, text } = tweet;
//   if (user.id_str !== for_user_id && !/^RT\s/.test(text)) {
//     const results = await newTweet(tweet);
//     if (results) {
//       console.log(results);
//       let reply_txt;
//       if (results.isTotal) {
//         reply_txt = `Wow! I have set your total miles to ${results.miles} miles!`;
//       } else {
//         reply_txt = `Great job! Your run of ${results.miles} miles has been logged! Your total is now ${results.updated.total} miles!\n${getStringProgressBar(results.updated.total)}`;
//       }
//       await a2zitp.reply(id_str, reply_txt);
//     } else {
//       await a2zitp.reply(id_str, `So sorry, I was not able to log any miles!`);
//     }
//   }
// }
