require('dotenv').config();

const express = require('express')
const cors = require('cors');
//const jwt = require('jsonwebtoken');
const registerRoute = require('./routes/register');
//const spotifyApi = require('./config/spotify');
//const bcrypt = require('bcrypt');
//const axios = require('axios');
//const { validateRegister } = require('./schemaValidator');
//const SpotifyWebApi = require('spotify-web-api-node');
//const fetch = require('node-fetch');
const spotifyRoutes = require('./routes/spotifyRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const songRoutes = require('./routes/songRoutes');
const dataTransferRoutes = require('./routes/dataTransferRoutes');
const performerRoutes = require('./routes/performerRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express()
const port = 3000;

app.use(express.json());

app.use(cors());

app.use('/auth', authMiddleware);

app.use('/spotifyAPI', spotifyRoutes);

app.use('/register', registerRoute);

app.use('/song', songRoutes);

app.use('/transfer', dataTransferRoutes);

app.use('/performer', performerRoutes);

app.use('/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/* // Spotify authentication route
app.get('/spotify-auth', (req, res) => {
  const scopes = [
    "ugc-image-upload",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "app-remote-control",
    "playlist-modify-public",
    "user-modify-playback-state",
    "playlist-modify-private",
    "user-follow-modify",
    "user-read-currently-playing",
    "user-follow-read",
    "user-library-modify",
    "user-read-playback-position",
    "playlist-read-private",
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "playlist-read-collaborative",
    "streaming"
  ];

  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

// Spotify callback route
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);

    // Use the access token and refresh token as needed
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];

    // Read existing content from .env file
    const fs = require('fs');
    const envContent = fs.readFileSync('.env', 'utf-8');

    // Replace existing refresh token or add a new line
    const updatedEnvContent = envContent.replace(
      /^SPOTIFY_REFRESH_TOKEN=.*$/m,
      `SPOTIFY_REFRESH_TOKEN=${refreshToken}`
    );

    // Write the updated content back to the .env file
    fs.writeFileSync('.env', updatedEnvContent);

    // Set access and refresh tokens for future API requests
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    // Redirect or send a response to the client
    res.redirect('/'); // Redirect to the home page or another route
  } catch (error) {
    console.error('Error during Spotify callback:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to refresh the Spotify access token
async function refreshSpotifyAccessToken() {
  try {
    const data = await spotifyApi.refreshAccessToken();
    const accessToken = data.body['access_token'];
    spotifyApi.setAccessToken(accessToken);
    console.log('Spotify access token refreshed:', accessToken);
  } catch (error) {
    console.error('Error refreshing Spotify access token:', error);
  }
}

// Schedule periodic refresh of the access token (e.g., every 50 minutes)
setInterval(refreshSpotifyAccessToken, 50 * 60 * 1000);

// Sample route to demonstrate using the Spotify API
app.get('/spotify-profile', async (req, res) => {
  try {
    // Make a sample request to the Spotify API using the stored access token
    const userProfileResponse = await spotifyApi.getMe();

    // Display user profile information (replace with your desired logic)
    res.json(userProfileResponse.body);
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    res.status(500).send('Internal Server Error');
  }
}); 
*/

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})