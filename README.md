# Higher or Lower · YouTube API

A web game inspired by the classic *Higher or Lower* format. Compare two YouTube videos and guess whether the second video has more or fewer views than the first one.

The game retrieves real data from YouTube Data API v3, reveals the result with an animated counter, and saves the player's best score in the browser.

**Live demo:** [labs.paginee.com/higherLower](https://labs.paginee.com/higherLower/)

## How to play

1. Look at the view count of the video on the left.
2. Decide whether the video on the right has more (`Higher`) or fewer (`Lower`) views.
3. If your answer is correct, your streak increases and a new video appears.
4. If your answer is incorrect, the game ends and you can start again.

The thumbnails also work as embedded YouTube players, allowing you to play, pause, and resume each video during the game.

## Features

- Real YouTube view counts.
- Random video selection without immediate repeats.
- Session caching to reduce API requests.
- Current score and personal best saved with `localStorage`.
- Embedded YouTube players.
- Animated view-count reveal.
- Confetti after every correct answer.
- Dark interface inspired by YouTube.
- Split-screen layout inspired by *Higher or Lower*.
- Responsive design for desktops, laptops, tablets, and mobile devices.
- Visible error handling for network failures and invalid responses.

## Technologies

- HTML5
- CSS3
- JavaScript
- JavaScript Vercel Functions
- YouTube Data API v3
- YouTube Embed Player

The project does not use a framework or require a build process.

## Project structure

```text
higherLower/
├── api/
│   └── youtubeProxy.mjs
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── index.html
├── logo.jpg
└── pest.png
```

`youtubeProxy.mjs` is a server-side Vercel Function that acts as an intermediary between the browser and YouTube, preventing the API key from being sent to the client.

## Local installation

### Requirements

- Node.js and the Vercel CLI.
- An API key with access to YouTube Data API v3.

### 1. Clone the repository

```bash
git clone https://github.com/emma-za/higherLower-YoutubeAPI.git
cd higherLower-YoutubeAPI
```

### 2. Configure the API key

Create a `.env.local` file in the project root:

```dotenv
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
```

Do not commit this file to GitHub. Add it to `.gitignore`:

The included `.gitignore` prevents environment files from being committed.

### 3. Start the local server

Install the Vercel CLI and start its local development server:

```bash
npm install --global vercel
vercel dev
```

Open the local URL displayed by the Vercel CLI.

## Production configuration

In Vercel, open **Project Settings → Environment Variables** and create a variable named `YOUTUBE_API_KEY`. Apply it to Production, Preview, and Development as needed, then redeploy the project.

When the game is deployed inside a subdirectory, keep the proxy URL relative to the project location:

```javascript
const proxyUrl = new URL('api/youtubeProxy', document.baseURI);
```

## Security

- Restrict the API key exclusively to **YouTube Data API v3** in Google Cloud Console.
- Never store credentials in JavaScript or HTML.
- Store production credentials in Vercel Environment Variables.
- If a key is exposed accidentally, revoke it and generate a new one.

## Author

Created by [@emm_zaid](https://x.com/emm_zaid).
