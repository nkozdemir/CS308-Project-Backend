const fetch = require('node-fetch');
const spotifyApi = require('../config/spotify');

const getToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(spotifyApi._credentials.clientId + ':' + spotifyApi._credentials.clientSecret).toString('base64')),
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
  setAccessToken,
};
