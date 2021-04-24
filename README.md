# A Bot for the Computer Mouse Conference

## Instructions

1. Download or clone this repository and cd into the directory from a shell prompt.

```
git clone https://github.com/shiffman/Computer-Mouse-Bot
cd Computer-Mouse-Bot
```

2. Set up a [Twitter Developer Account](https://developer.twitter.com/) and create an application with "read and write" permissions.

3. Rename `env-sample` to `.env` and copy your Twitter API Key / Secret, Access Token / Secret into the file:

```
CONSUMER_KEY=**********
CONSUMER_SECRET=**********
TOKEN=**********
TOKEN_SECRET=**********
```

4. Install [node.js](https://nodejs.org/en/) and run:

```
npm install
npm run start
```

5. Download [Processing](https://processing.org/download) and open `MouseTracker/MouseTracker.pde`.
