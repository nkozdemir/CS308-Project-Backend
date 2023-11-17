const express = require('express');
const { setAccessToken, spotifyApi } = require('../services/spotifyService');

const router = express.Router();

// Middleware to set the access token before handling routes
router.use(async (req, res, next) => {
  await setAccessToken();
  next();
});

router.get('/getTrackById', async (req, res) => {
  try {
    // Use the Spotify API to get information about a specific track
    const trackInfo = await spotifyApi.getTrack('4cOdK2wGLETKBW3PvgPWqT');
    res.json(trackInfo.body);
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/filterSongByArtist', async (req, res) => {
  try {
    const { trackName, artistName } = req.query;

    if (!trackName || !artistName) {
      return res.status(400).send('Missing required parameters: trackName and artistName');
    }

    // Use the Spotify API to search for tracks
    const data = await spotifyApi.searchTracks(`track:${trackName} artist:${artistName}`);

    // Check if there are tracks in the response
    if (data.body.tracks && data.body.tracks.items.length > 0) {
      const numberOfResults = 3;

      // Extract the first few tracks
      const trackResults = data.body.tracks.items.slice(0, numberOfResults);

      // Extract relevant information for each track
      const formattedResults = trackResults.map(track => ({
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
      }));

      res.json(formattedResults);
    } else {
      res.status(404).send('No matching tracks found.');
    }
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to fetch top x tracks from a Spotify playlist
router.get('/getTopTracksFromPlaylist', async (req, res) => {
  try {
    const { playlistId, numberOfResults } = req.body;

    if (!playlistId) return res.status(400).send('Missing required parameter: playlistId');
    if (!numberOfResults) return res.status(400).send('Missing required parameter: numberOfResults');

    // Use the Spotify API to get tracks from a playlist
    const data = await spotifyApi.getPlaylistTracks(playlistId);

    // Check if there are tracks in the response
    if (data.body.items && data.body.items.length > 0) {
      // check if requested number of tracks is valid
      if (numberOfResults > data.body.items.length) return res.status(400).send('Requested number of tracks is greater than number of tracks in playlist');

      // Extract the first few tracks
      const trackResults = data.body.items.slice(0, numberOfResults);

      // Extract relevant information for each track
      const formattedResults = trackResults.map(track => ({
        Id: track.track.id,
        Title: track.track.name,
        Performer: track.track.artists.map(artist => ({ 
          name: artist.name, 
          id: artist.id 
        })),
        Album: {
          id: track.track.album.id, 
          name: track.track.album.name,
          artists: track.track.album.artists.map(artist => ({
            name: artist.name,
            id: artist.id,
            type: artist.type
          })), 
          type: track.track.album.album_type, 
          release_date: track.track.album.release_date,
          images: track.track.album.images 
        },
        Length: track.track.duration_ms,
      }));
      
      // Add genres to each track
      const artistIds = formattedResults.map(track => track.Performer.map(artist => artist.id)).flat();
      const genres = await getArtistGenres(artistIds);
      // check if genres are valid
      if (genres.length === 0) return res.status(400).send('No genres found for artists in playlist');
      formattedResults.forEach(track => {
        track.Genres = genres;
      });
      
      res.json(formattedResults);
    } else {
      res.status(404).send('No matching tracks found.');
    }
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    res.status(500).send('Internal Server Error');
  }
});

// A function to get genres of an artist given the artist's id
async function getArtistGenres(artistIds) {
  try {
    const data = await spotifyApi.getArtists(artistIds);
    console.log(data.body.artists.map(artist => artist.genres).flat());
    return data.body.artists.map(artist => artist.genres).flat();
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    return [];
  }
}

module.exports = router;