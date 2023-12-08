const genreModel = require('../models/genre');

async function createGenre(genreName) {
    try {
        const genre = await genreModel.create({
            Name: genreName,
        });
        return genre;
    } catch (error) {
        console.error('Error creating genre:', error);
        throw error;
    }
}

async function getGenreById(genreID) {
    try {
        const genre = await genreModel.findOne({
            where: {
                GenreID: genreID,
            },
        });
        return genre;
    } catch (error) {
        console.error('Error getting genre by id:', error);
        throw error;
    }
}

async function getGenreByName(genreName) {
    try {
        const genre = await genreModel.findOne({
            where: {
                Name: genreName,
            },
        });
        return genre;
    } catch (error) {
        console.error('Error getting genre by name:', error);
        throw error;
    }
}

async function deleteGenre(genreID) {
    try {
        const genre = await genreModel.destroy({
            where: {
                GenreID: genreID,
            },
        });
        return genre;
    } catch (error) {
        console.error('Error deleting genre:', error);
        throw error;
    }
}

module.exports = {
    createGenre,
    getGenreByName,
    getGenreById,
    deleteGenre,
    // Add other Performer-related controller functions here
};