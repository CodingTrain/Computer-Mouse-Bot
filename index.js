const dotenv = require('dotenv');
dotenv.config();
console.log('hello bot! 🤖');
const dateFormat = require('dateformat');

const express = require('express');
const fs = require('fs');
const request = require('request');

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

app.get('/mouse/:x/:y/:name/:minutes', async (request, response) => {
  let { x, y, name, minutes } = request.params;
  try {
    const b64content = fs.readFileSync('MouseTracker/mouse.png', {
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
      dateFormat('mediumDate') + ' ' + dateFormat('longTime');
    const tweet = await client.post('statuses/update', {
      status: `${minutes} minutes of mouse movements from ${name} at ${thetime}`,
      media_ids: [media.media_id_string],
    });
  } catch (error) {
    console.error(error);
  }
  response.json({ status: { name, mouseX: x, mouseY: y } });
});

const config = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET,
  env: process.env.TWITTER_WEBHOOK_ENV,
  ngrok: process.env.NGROK_AUTH_TOKEN,
};

// For testing in this repo
const ChooChooTweets = require('choochootweets');
const a2zitp = new ChooChooTweets(config);

start();
async function start() {
  console.log('listening for @ mentions');
  await a2zitp.initActivity(tweetHandler);
}

async function tweetHandler(for_user_id, tweet) {
  const { user, id_str, text } = tweet;
  if (user.id_str !== for_user_id && !/^RT\s/.test(text)) {
    console.log('mention event');
    let out = `@${user.screen_name}\n${text}\n${dateFormat()}`;
    console.log(out);
    fs.writeFileSync(`tweets/${id_str}.txt`, out, 'utf-8');
    const media = tweet.entities.media;
    if (media && media.length > 0) {
      console.log(`downloading ${media.length} images`);
      for (let i = 0; i < media.length; i++) {
        const img = media[i].media_url;
        downloadFile(img, `${id_str}_${i}`);
      }
    }
  }
}

// Deal with downloading
function downloadFile(url, filename) {
  const tokens = url.split('.');
  const ext = tokens.pop();
  filename = filename + '.' + ext;
  console.log('Download: ' + url + ' to ' + filename);

  // Make the request
  request.head(url, downloaded);

  // Here's the callback for when it is done
  function downloaded(err, res, body) {
    // Look at what it is
    // const type = res.headers['content-type'];
    // Figure out what file extension it should have
    // Figure out what file extension it should have

    // Now save it to disk with that filename
    // Put it in the Processing folder
    request(url)
      .pipe(fs.createWriteStream('tweets/' + filename))
      .on('close', () => {
        console.log('image downloaded');
      });
  }
}
