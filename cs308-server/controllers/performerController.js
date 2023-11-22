const performerModel = require('../models/performer');
const songPerformerModel = require('../models/songPerformer');

async function createPerformer(name, spotifyID) {
  try {
    const performer = await performerModel.create({
      Name: name,
      SpotifyID: spotifyID,
    });
    return performer;
  } catch (error) {
    console.error('Error creating performer:', error);
    throw error;
  }
}

async function getPerformerByName(name) {
  try {
    const performer = await performerModel.findOne({
      where: {
        Name: name,
      },
    });
    return performer;
  } catch (error) {
    console.error('Error getting performer by name:', error);
    throw error;
  }
}

async function getPerformerBySpotifyID(spotifyID) {
  try {
    const performer = await performerModel.findOne({
      where: {
        SpotifyID: spotifyID,
      },
    });
    return performer;
  } catch (error) {
    console.error('Error getting performer by spotifyID:', error);
    throw error;
  }
}

async function deletePerformer(spotifyID) { 
  try {
    // Check if the performer exists
    const performer = await performerModel.findOne({
      where: {
        SpotifyID: spotifyID,
      },
    });

    if (!performer) {
      throw new Error(`Performer with ID ${performerID} not found`);
    }

    // Delete the performer from the SongPerformer table
    await songPerformerModel.destroy({
      where: {
        SpotifyID: spotifyID,
      },
    });

    // Delete the performer ??? Should we ???
  /*   const deletedPerformer = await performerModel.destroy({
      where: {
        SpotifyID: spotifyID,
      },
    }); */

    return deletedPerformer;
  } catch (error) {
    console.error('Error deleting performer:', error);
    throw error;
  }
}

module.exports = {
  createPerformer,
  getPerformerByName,
  getPerformerBySpotifyID,
  deletePerformer,
  // Add other Performer-related controller functions here
};
