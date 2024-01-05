const songRatingController = require('../controllers/songRatingController');
const songController = require('../controllers/songController');
const songPerformerController = require('../controllers/songPerformerController');
const songGenreController = require('../controllers/songGenreController');
const performerController = require('../controllers/performerController');
const genreController = require('../controllers/genreController');
const userController = require('../controllers/userController');

async function exportRatingByPerformerFilter(userId, performerName) {
    try {
        // Get user from database by user id
        const user = await userController.getUserById(userId);
        // Get user name from user
        const userName = user.Name;
        // Get user email from user
        const userEmail = user.Email;
        // Concatenate user information to an object
        const userInformation = {
            Name: userName,
            Email: userEmail,
        };
        //console.log('User information:', userInformation);

        let ratingData = [];

        // Get performer from database by performer name
        const performer = await performerController.getPerformerByName(performerName);

        // if performer is not found, return results as empty
        if (!performer) return {};
        const { PerformerID } = performer;
        const performerInformation = {
            Name: performer.Name,
            SpotifyID: performer.SpotifyID,
        };
        //console.log('Performer information:', performerInformation);

        const headerInformation = { User: userInformation, Performer: performerInformation };
        console.log('Header information:', headerInformation);

        // Get ratings from database by userId
        const ratings = await songRatingController.getRatingByUser(userId);
        for (const rating of ratings) {
            // Get song id from rating
            const songId = rating.SongID;
            // Get song from database by song id
            const song = await songController.getSongByID(songId);
            // Concatenate song information containing Title, ReleaseDate, Album, Length, SpotifyID to an object
            const songInformation = {
                Title: song.Title,
                ReleaseDate: song.ReleaseDate,
                Album: song.Album,
                Length: song.Length,
                SpotifyID: song.SpotifyID,
            };
            console.log('Song information:', songInformation);

            let genreNames = [];

            // Get song performer links from database by song id
            const songPerformerLinks = await songPerformerController.getLinkBySong(songId);
            // Get performer ids from song performer links
            const performerIds = songPerformerLinks.map(link => link.PerformerID);
            if (!performerIds.includes(PerformerID)) {
                // If performer is not in performer ids, skip this rating
                continue;
            }
            else {
                for (const performerId of performerIds) {
                    // Get performer from database by performer id
                    const performer = await performerController.getPerformerById(performerId);
                    if (performer.PerformerID == PerformerID) {
                        // Get song genre links from database by song id
                        const songGenreLinks = await songGenreController.getLinkBySong(songId);
                        // Get genre ids from song genre links
                        const genreIds = songGenreLinks.map(link => link.GenreID);
                        for (const genreId of genreIds) {
                            // Get genre from database by genre id
                            const genre = await genreController.getGenreById(genreId);
                            genreNames.push(genre.Name);
                        }
                    }
                }

                // Concatenate genre information to an object
                const genreInformation = {
                    Genres: genreNames,
                };
                console.log('Genre information:', genreInformation);

                // Concatenate all information in order: user, performer, song, genre, rating ; to an object
                const ratingInformation = {
                    Song: songInformation,
                    Genre: genreInformation,
                    Rating: rating.Rating,
                    Date: rating.Date,
                };
                console.log(ratingInformation);

                ratingData.push(ratingInformation);
            }
        }

        if (ratingData.length == 0) 
            return {};
        else {
            const finalData = { ...headerInformation, SongRatings: ratingData };
            console.log('Final data:', finalData);

            return finalData;
        }
    } catch (error) {
        console.error('Error during exporting ratings:', error);
        throw error;
    }
}

function formatEntry(data) {
    const user = `User:\n\tName:${data.User.Name}\n\tEmail: ${data.User.Email}`;
    const performer = `Performer:\n\tName: ${data.Performer.Name}\n\tSpotifyID: ${data.Performer.SpotifyID}`;
    
    const songRatings = data.SongRatings.map(rating => {
      const song = `Song:\n\tTitle: ${rating.Song.Title}\n\tReleaseDate: ${rating.Song.ReleaseDate}\n\tAlbum: ${rating.Song.Album}\n\tLength(ms): ${rating.Song.Length}\n\tSpotifyID: ${rating.Song.SpotifyID}`;
      const genres = `\tGenres: ${rating.Genre.Genres.join(', ')}`;
      const ratingInfo = `Rating: ${rating.Rating}\nDate: ${rating.Date}`;
      return `${song}\n${genres}\n${ratingInfo}`;
    }).join('\n');
  
    return `${user}\n${performer}\nSongRatings:\n${songRatings}`;
}

module.exports = {
    exportRatingByPerformerFilter,
    formatEntry,
};