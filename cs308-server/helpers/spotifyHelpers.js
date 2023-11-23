/* 
Todo:
- Create a schema to validate song data.
- Modify getTopTracksFromPlaylist to fetch genres by album id.
*/
const spotifyApi = require('../config/spotify.js');

async function getTopTracksFromPlaylist(playlistId, numberOfResults) {
  try {
    if (!playlistId || !numberOfResults) throw new Error('Missing required parameters: playlistId and numberOfResults');

    // Use the Spotify API to get tracks from a playlist
    const data = await spotifyApi.getPlaylistTracks(playlistId);

    // Check if there are tracks in the response
    if (data.body.items && data.body.items.length > 0) {
      // check if requested number of tracks is valid
      if (numberOfResults > data.body.items.length) throw new Error('Requested number of tracks is greater than the number of tracks in the playlist');

      // Extract the first few tracks
      const trackResults = data.body.items.slice(0, numberOfResults);

      // Extract relevant information for each track
      const formattedResults = await Promise.all(trackResults.map(async (track) => {
        const artistInfo = track.track.artists.map(artist => ({
          name: artist.name,
          id: artist.id,
        }));

        const artistIds = artistInfo.map(artist => artist.id);
        const genres = await getArtistGenres(artistIds);

        return {
          Id: track.track.id,
          Title: track.track.name,
          Performer: artistInfo,
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
          Genres: genres, // Associate genres with each track
        };
      }));

      return formattedResults;
    } else {
      throw new Error('No matching tracks found.');
    }
  } catch (error) {
    console.error('Error during Spotify API request:', error);
  }
};

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
  getTopTracksFromPlaylist,
  getArtistGenres,
  // Add other Spotify-related helper functions here
};