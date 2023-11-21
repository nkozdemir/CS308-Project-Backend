const songPerformerModel = require('../models/songPerformer');

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

module.exports = {
    linkSongPerformer,
    // Add other Performer-related controller functions here
};