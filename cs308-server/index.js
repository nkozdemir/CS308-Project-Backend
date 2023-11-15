  require('dotenv').config();

  const express = require('express')
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt');
  const axios = require('axios');
  const { validateRegister } = require('./schemaValidator');
  const mysql = require('mysql2');
  const SpotifyWebApi = require('spotify-web-api-node');
  const fetch = require('node-fetch');
  const spotifyRoutes = require('./routes/spotifyRoutes');

  const app = express()
  app.use(express.json());
  const port = 3000;

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  })
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to db!');
  });

  // Spotify API credentials
  const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
  const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const spotifyRedirectUri = process.env.SPOTIFY_REDIRECT_URI;

  const spotifyApi = new SpotifyWebApi({
    clientId: spotifyClientId,
    clientSecret: spotifyClientSecret,
    redirectUri: spotifyRedirectUri,
  });

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  async function getToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64')),
      },
    });
  
    return await response.json();
  }
  

  
  

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
  }); */

  const songData = [
    {
      userid: 1,
      songid: 1,
    },
    {
      userid: 1,
      songid: 2,
    },
    {
      userid: 1,
      songid: 3,
    },
    {
      userid: 2,
      songid: 2,
    },
    {
      userid: 2,
      songid: 3,
    },
  ]

  app.get('/usersong', authenticateToken, (req, res) => {
    res.json(songData.filter((data) => data.userid === req.user.UserID));
  })

  app.post('/register', (req, res) => {
    const { error, value } = validateRegister(req.body);
    if (error) {
      res.status(400).send(error.details.map((detail) => detail.message).join('\n'));
    }
    const { email, password, name } = value;
    connection.query(`SELECT * FROM User WHERE Email='${email}'`, (err, result) => {
      if (result.length > 0) {
        res.status(400).send('User already exists');
      }
      else if (result.length === 0) {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            connection.query(`INSERT INTO User (Email, Password, Name) VALUES ('${email}', '${hash}', '${name}')`, (err, result) => {
              if (err) throw err;
              res.status(200).send('User registered successfully');
            })
          })
        })
      }
      if (err) throw err;
    })
  })

  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    })
  }
  module.exports = {
    getToken,
    spotifyApi,
  };
  app.use('/spotifyapi', spotifyRoutes);

  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })

