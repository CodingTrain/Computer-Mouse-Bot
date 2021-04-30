const config = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET,
  env: process.env.TWITTER_WEBHOOK_ENV,
  ngrok: process.env.NGROK_AUTH_TOKEN,
};

const Twitter = require('choochootweets');
const mousebot = new Twitter(config);

start();

async function start() {
  console.log('listening for @ mentions');
  await mousebot.initActivity(tweetHandler);
}

async function tweetHandler(for_user_id, tweet) {
  const { user, id_str, text } = tweet;
  // if (user.id_str !== for_user_id && !/^RT\s/.test(text)) {
  if (!/^RT\s/.test(text)) {
    console.log('Tweet event!');
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
