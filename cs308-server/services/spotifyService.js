const SpotifyWebApi = require('spotify-web-api-node');
const fetch = require('node-fetch');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const getToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
    },
  });

  return await response.json();
};

const setAccessToken = async () => {
  try {
    const tokenResponse = await getToken();
    spotifyApi.setAccessToken(tokenResponse.access_token);
  } catch (error) {
    console.error('Error setting Spotify access token:', error);
  }
};

module.exports = {
  spotifyApi,
  getToken,
  setAccessToken,
};
