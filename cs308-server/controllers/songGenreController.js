const songGenreModel = require('../models/songGenre');

async function getSongGenreLink(songID, genreID) {
    try {
        const songGenreLink = await songGenreModel.findOne({
            where: {
                SongID: songID,
                GenreID: genreID,
            },
        });
        return songGenreLink;
    } catch (error) {
        console.error('Error getting songgenre:', error);
        throw error;
    }
}

async function getLinkBySong(songID) {
    try {
        const songGenreLink = await songGenreModel.findAll({
            where: {
                SongID: songID,
            },
        });
        return songGenreLink;
    } catch (error) {
        console.error('Error getting songgenre:', error);
        throw error;
    }
}

async function getLinkByGenre(genreID) {
    try {
        const songGenreLink = await songGenreModel.findAll({
            where: {
                GenreID: genreID,
            },
        });
        return songGenreLink;
    } catch (error) {
        console.error('Error getting songgenre:', error);
        throw error;
    }
}

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

async function deleteSongGenre(songID) {
    try {
        const deletedSongGenre = await songGenreModel.destroy({
            where: {
                SongID: songID,
            },
        });
        return deletedSongGenre;
    } catch (error) {
        console.error('Error deleting songgenre:', error);
        throw error;
    }
}

module.exports = {
    getSongGenreLink,
    getLinkBySong,
    getLinkByGenre,
    linkSongGenre,
    deleteSongGenre,
    // Add other Performer-related controller functions here
};