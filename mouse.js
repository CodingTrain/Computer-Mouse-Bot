const dotenv = require('dotenv');
dotenv.config();
console.log('hello bot! 🤖');
const dateFormat = require('dateformat');

const express = require('express');
const fs = require('fs');

const app = express();
// app.use(cors());

app.listen(3000, () => console.log('listening at 3000'));
app.use(express.json({ limit: '5mb' }));

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

app.post('/mouse', async (request, response) => {
  let { x, y, name, minutes, base64 } = request.body;
  // try {
  //   const media = await upload.post('media/upload', {
  //     media_data: base64,
  //   });
  //   const alt = await upload.post('media/metadata/create', {
  //     media_id: media.media_id_string,
  //     alt_text: {
  //       text: `Visualization of mouse path ending at ${x},${y}`,
  //     },
  //   });
  //   const thetime =
  //     dateFormat('mediumDate') + ' ' + dateFormat('longTime');
  //   const tweet = await client.post('statuses/update', {
  //     status: `${minutes} minutes of mouse movements from ${name} at ${thetime}`,
  //     media_ids: [media.media_id_string],
  //   });
  // } catch (error) {
  //   console.error(error);
  // }
  response.json({ status: { name, mouseX: x, mouseY: y } });
});

// app.get('/mouse/:x/:y/:name/:minutes', async (request, response) => {
//   let { x, y, name, minutes } = request.params;
//   try {
//     const b64content = fs.readFileSync('MouseTracker/mouse.png', {
//       encoding: 'base64',
//     });
//     const media = await upload.post('media/upload', {
//       media_data: b64content,
//     });
//     const alt = await upload.post('media/metadata/create', {
//       media_id: media.media_id_string,
//       alt_text: {
//         text: `Visualization of mouse path ending at ${x},${y}`,
//       },
//     });
//     const thetime =
//       dateFormat('mediumDate') + ' ' + dateFormat('longTime');
//     const tweet = await client.post('statuses/update', {
//       status: `${minutes} minutes of mouse movements from ${name} at ${thetime}`,
//       media_ids: [media.media_id_string],
//     });
//   } catch (error) {
//     console.error(error);
//   }
//   response.json({ status: { name, mouseX: x, mouseY: y } });
// });
