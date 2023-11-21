const spotifyApi = require('../config/spotify.js');

// A function to get genres of an artist given the artist's id
async function getArtistGenres(artistIds) {
  try {
    const data = await spotifyApi.getArtists(artistIds);
    //console.log(data.body.artists.map(artist => artist.genres).flat());
    return data.body.artists.map(artist => artist.genres).flat();
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    return [];
  }
}

module.exports = {
    getArtistGenres,
    // Add other Spotify-related helper functions here
};