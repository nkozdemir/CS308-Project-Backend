/* 
Todo:
- Create a schema to validate song data.
- Modify getTopTracksFromPlaylist to fetch genres by album id.
*/
const spotifyApi = require('../config/spotify.js');
const songController = require('../controllers/songController');

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
          SpotifyId: track.track.id,
          Title: track.track.name,
          Performer: artistInfo,
          Album: {
            id: track.track.album.id,
            name: track.track.album.name,
            type: track.track.album.album_type,
            release_date: track.track.album.release_date,
            images: track.track.album.images
          },
          Length: track.track.duration_ms,
          Genres: track.track.album.genres, // Associate album genres with each track
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
    return data.body.artists.map(artist => artist.genres).flat();
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    return [];
  }
}

const searchSong = async (trackName, performerName, albumName) => {
  try {
    // Construct the search query based on the provided parameters
    let searchQuery = `track:${trackName}`;
    if (performerName) {
      searchQuery += ` artist:${performerName}`;
    }
    if (albumName) {
      searchQuery += ` album:${albumName}`;
    }

    // Use the Spotify API to search for tracks
    const data = await spotifyApi.searchTracks(searchQuery);

    // Check if there are tracks in the response
    if (data.body.tracks && data.body.tracks.items.length > 0) {
      const numberOfResults = 3;

      // Extract the first few tracks
      const trackResults = data.body.tracks.items.slice(0, numberOfResults);

      // Extract relevant information for each track
      const formattedResults = await Promise.all(trackResults.map(async (track) => {
        const artistInfo = track.artists.map(artist => ({
          name: artist.name,
          id: artist.id,
        }));

        // Get album genres, if empty get artist genres
        const albumGenres = track.album.genres;
        const artistIds = artistInfo.map(artist => artist.id);
        const artistGenres = await getArtistGenres(artistIds);
        const genresToUse = albumGenres && albumGenres.length > 0 ? albumGenres : artistGenres;
      
        // Extract additional information about the track
        const trackInfo = {
          SpotifyId: track.id,
          Title: track.name,
          Performer: artistInfo,
          Album: {
            id: track.album.id,
            name: track.album.name,
            type: track.album.album_type,
            release_date: track.album.release_date,
            images: track.album.images,
          },
          Length: track.duration_ms,
          Genres: genresToUse,
          // Add more properties as needed
        };
      
        return trackInfo;
      }));
      
      return {
        status: 'success',
        data: formattedResults,
      };
      
    } else {
      return {
        status: 'success',
        data: null, // No matching tracks found
      };
    }
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    throw error;
  }
};

/**
 * Provides song recommendations based on given songs.
 * @param {Array} songIds - An array of song IDs.
 * @param {number} numberOfResults - The number of recommended songs to return.
 * @returns {Promise<Array>} - A promise that resolves to an array of recommended song objects.
 */
async function getRecommendedSongs(songData, numberOfResults) {
  try {
    let spotifyIds = [];

    for (i = 0; i < songData.length; i++) {
      const song = await songController.getSongById(songData[i]);
      const spotifyId = song.SpotifyID;
      spotifyIds.push(spotifyId);
    }
    console.log(spotifyIds);

    // If there are more than 5 ids, choose 5 random ids
    if (spotifyIds.length > 5) {
      const randomIndices = [];
      while (randomIndices.length < 5) {
        const randomIndex = Math.floor(Math.random() * spotifyIds.length);
        if (!randomIndices.includes(randomIndex)) {
          randomIndices.push(randomIndex);
        }
      }
      spotifyIds = randomIndices.map(index => spotifyIds[index]);
    }
    
    const recommendations = await spotifyApi.getRecommendations({
      seed_tracks: spotifyIds.slice(0, 5),
      limit: numberOfResults,
    });
    //console.log(recommendations.body.tracks);

    const tracks = recommendations.body.tracks.map(track => ({
      SpotifyId: track.id,
      Title: track.name,
      Performer: track.artists.map(artist => ({
        name: artist.name,
        id: artist.id,
      })),
      Album: {
        id: track.album.id,
        name: track.album.name,
        type: track.album.album_type,
        release_date: track.album.release_date,
        images: track.album.images,
      },
      Length: track.duration_ms,
      Genres: track.artists.genres || [],
    })).slice(0, numberOfResults);  
    //console.log(tracks);

    return tracks;
  } catch (error) {
    console.error('Error getting recommended songs:', error);
    throw error;
  }
}

module.exports = {
  getTopTracksFromPlaylist,
  getArtistGenres,
  searchSong,
  getRecommendedSongs,
  // Add other Spotify-related helper functions here
};