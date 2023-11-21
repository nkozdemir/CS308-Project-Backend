const songGenreModel = require('../models/songGenre');

async function linkSongGenre(songID, genreID) {
    try {
        const existingLink = await songGenreModel.findOne({
            where: {
                SongID: songID,
                GenreID: genreID,
            }
        });
        if (existingLink) {
            console.log(`Song ${songID} is already linked to the genre with ID ${genreID}`);
            return existingLink;
        }

        const songgenre = await songGenreModel.create({
            SongID: songID,
            GenreID: genreID,
        });
        return songgenre;
    } catch (error) {
        console.error('Error creating songgenre:', error);
        throw error;
    }
}

module.exports = {
    linkSongGenre,
    // Add other Performer-related controller functions here
};