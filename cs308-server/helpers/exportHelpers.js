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
        // Concatenate user information to a string
        const userInformation = `User:${userName},${userEmail}`;
        console.log('User information:', userInformation);

        let results = [];

        // Get performer from database by performer name
        const performer = await performerController.getPerformerByName(performerName);

        // if performer is not found, return results as empty
        if (!performer) return results;

        const { PerformerID } = performer;
        const performerInformation = `Performer:${performer.Name},${performer.SpotifyID}`;
        console.log('Performer information:', performerInformation);

        // Get ratings from database by userId
        const ratings = await songRatingController.getRatingByUser(userId);
        for (const rating of ratings) {
            // Concatenate rating information to a string
            const ratingInformation = `Rating:${rating.Rating},${rating.Date}`;
            console.log('Rating information:', ratingInformation);

            // Get song id from rating
            const songId = rating.SongID;
            // Get song from database by song id
            const song = await songController.getSongById(songId);
            // Concatenate song information containing Title, ReleaseDate, Album, Length, SpotifyID to a string
            const songInformation = `Song:${song.Title},${song.ReleaseDate},${song.Album},${song.Length},${song.SpotifyID}`;
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

                // Concatenate genre information to a string
                const genreInformation = `Genres:${genreNames.join(',')}`;
                console.log('Genre information:', genreInformation);

                // Concatenate all information in order: user, performer, song, genre, rating ; to a string
                const information = `${userInformation}\n${performerInformation}\n${songInformation}\n${genreInformation}\n${ratingInformation}`;
                console.log(information);
                results.push(information);
            }
        }
        console.log(results);

        return results;
    } catch (error) {
        console.error('Error during exporting ratings:', error);
        throw error;
    }
}

module.exports = {
    exportRatingByPerformerFilter,
};