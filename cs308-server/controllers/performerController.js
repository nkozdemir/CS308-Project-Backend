const performerModel = require('../models/performer');

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

module.exports = {
  createPerformer,
  getPerformerByName,
  getPerformerBySpotifyID,
  // Add other Performer-related controller functions here
};
