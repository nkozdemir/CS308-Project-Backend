const spotifyApi = require('../config/spotify.js');
const songGenreController = require('../controllers/songGenreController');

// A function to get top tracks from a playlist
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

// A function to retrieve images of an artist
async function getArtistImages(artistId) {
  try {
    const data = await spotifyApi.getArtist(artistId);
    const images = JSON.stringify(data.body.images.flat());
    //console.log(images);
    return images;
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    return [];
  }
}

// A function to get genres of an album given the album's id
async function getAlbumGenres(albumId) {
  try {
    const data = await spotifyApi.getAlbum(albumId);
    //console.log(data);
    return data.body.genres;
  } catch (error) {
    console.error('Error during Spotify API request:', error);
    throw error;
  }
}

// A function to search for a song on Spotify
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

// A function to get recommended songs based on song data
async function getRecommendedSongs(songData, numberOfResults = 6) {
  try {
    let spotifyIds = songData.map(song => song.SpotifyID);
    //console.log("Initial spotifyids:", spotifyIds);

    // If there are songs with no SpotifyID, get their genre information and store them in a separate array
    let genreSeeds = [];
    const songsWithNoSpotifyId = songData.filter(song => !song.SpotifyID).map(song => song.SongID);
    if (songsWithNoSpotifyId.length > 0) {
      //console.log("Songs with no spotify id:", songsWithNoSpotifyId);
      for (let i = 0; i < songsWithNoSpotifyId.length; i++) {
        const songGenreLink = await songGenreController.getLinkBySong(songsWithNoSpotifyId[i]);
        //console.log("Song genre links:", songGenreLink);
        const genre = songGenreLink.map(link => link.GenreInfo.Name);
        //console.log("Genre:", genre);
        genreSeeds = genreSeeds.concat(genre);
      }
      //console.log("Genre seeds:", genreSeeds);
    }
    // Pick songsWithNoSpotifyId.length random genres from genreSeeds
    genreSeeds = genreSeeds.sort(() => Math.random() - Math.random()).slice(0, songsWithNoSpotifyId.length);
    // Convert genre names to lowercase
    genreSeeds = genreSeeds.map(genre => genre.toLowerCase());
    //console.log("Genre seeds:", genreSeeds);

    // Remove songs with no SpotifyID from spotifyIds
    spotifyIds = spotifyIds.filter(id => id);
    //console.log("Spotifyids:", spotifyIds);

    const request = {
      seed_tracks: spotifyIds,
      limit: numberOfResults,
    }
    if (genreSeeds.length > 0) {
      request.seed_genres = genreSeeds;
    }
    //console.log("Request:", request);

    const recommendations = await spotifyApi.getRecommendations(request);
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
      //Genres: track.artists[0].genres, 
    }));  
    //console.log(tracks);

    return tracks;
  } catch (error) {
    console.error('Error getting recommended songs:', error);
    throw error;
  }
}

// A function to get recommended songs based on performer data
async function getRecommendedSongsByPerformer(performerData, numberOfResults = 6) {
  try {
    const spotifyIds = performerData;
    //console.log("Initial spotifyids:", spotifyIds);

    const recommendations = await spotifyApi.getRecommendations({
      seed_artists: spotifyIds,
      limit: numberOfResults,
    });

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
      //Genres: track.artists[0].genres, 
    }));

    return tracks;
  } catch (error) {
    console.error('Error getting recommended songs:', error);
    throw error;
  }
}

module.exports = {
  getTopTracksFromPlaylist,
  getArtistGenres,
  getAlbumGenres,
  searchSong,
  getRecommendedSongs,
  getArtistImages,
  getRecommendedSongsByPerformer,
  // Add other Spotify-related helper functions here
};