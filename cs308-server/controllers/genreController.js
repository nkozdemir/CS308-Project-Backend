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

module.exports = {
    createGenre,
    getGenreByName,
    // Add other Performer-related controller functions here
};