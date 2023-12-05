const songPerformerModel = require('../models/songPerformer');

async function getSongPerformerLink(songID, performerID) {
    try {
        const songPerformerLink = await songPerformerModel.findOne({
            where: {
                SongID: songID,
                PerformerID: performerID,
            },
        });
        return songPerformerLink;
    } catch (error) {
        console.error('Error getting songperformer:', error);
        throw error;
    }
}

async function getLinkBySong(songID) {
    try {
        const songPerformerLink = await songPerformerModel.findAll({
            where: {
                SongID: songID,
            },
        });
        return songPerformerLink;
    } catch (error) {
        console.error('Error getting songperformer:', error);
        throw error;
    }
}

async function getLinkByPerformer(performerID) {
    try {
        const songPerformerLink = await songPerformerModel.findAll({
            where: {
                PerformerID: performerID,
            },
        });
        return songPerformerLink;
    } catch (error) {
        console.error('Error getting songperformer:', error);
        throw error;
    }
}

async function linkSongPerformer(songID, performerID) {
    try {
        const existingLink = await songPerformerModel.findOne({
            where: {
                SongID: songID,
                PerformerID: performerID,
            }
        });
        if (existingLink) {
            console.log(`Song ${songID} is already linked to the performer with ID ${performerID}`);
            return existingLink;
        }
        const songperformer = await songPerformerModel.create({
            SongID: songID,
            PerformerID: performerID,
        });
        return songperformer;
    } catch (error) {
        console.error('Error creating songperformer:', error);
        throw error;
    }
}

async function deleteSongPerformer(songID) {
    try {
        const deletedSongPerformer = await songPerformerModel.destroy({
            where: {
                SongID: songID,
            },
        });
        return deletedSongPerformer;
    } catch (error) {
        console.error('Error deleting songperformer:', error);
        throw error;
    }
}

async function deleteSongPerformerByPerformerId(performerID) {
    try {
        const deletedSongPerformer = await songPerformerModel.destroy({
            where: {
                PerformerID: performerID,
            },
        });
        return deletedSongPerformer;
    } catch (error) {
        console.error('Error deleting songperformer:', error);
        throw error;
    }
}

module.exports = {
    getSongPerformerLink,
    getLinkBySong,
    getLinkByPerformer,
    linkSongPerformer,
    deleteSongPerformer,
    deleteSongPerformerByPerformerId,
    // Add other Performer-related controller functions here
};