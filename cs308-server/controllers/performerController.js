const performerModel = require('../models/performer');
//const songPerformerModel = require('../models/songPerformer');

async function getAllPerformers() {
  try {
    const performers = await performerModel.findAll();
    return performers;
  } catch (error) {
    console.error('Error getting all performers:', error);
    throw error;
  }
}

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

async function getPerformerById(performerID) {
  try {
    const performer = await performerModel.findOne({
      where: {
        PerformerID: performerID,
      },
    });
    return performer;
  } catch (error) {
    console.error('Error getting performer by ID:', error);
    throw error;
  }
}

async function deletePerformerBySpotifyId(spotifyID) {
  try {
    const performer = await performerModel.destroy({
      where: {
        SpotifyID: spotifyID,
      },
    });
    return performer;
  } catch (error) {
    console.error('Error deleting performer by spotifyID:', error);
    throw error;
  }
}

async function deletePerformerByPerformerId(performerID) {
  try {
    const performer = await performerModel.destroy({
      where: {
        PerformerID: performerID,
      },
    });
    return performer;
  } catch (error) {
    console.error('Error deleting performer by ID:', error);
    throw error;
  }
}

module.exports = {
  getAllPerformers,
  createPerformer,
  getPerformerByName,
  getPerformerBySpotifyID,
  getPerformerById,
  deletePerformerBySpotifyId,
  deletePerformerByPerformerId,
  // Add other Performer-related controller functions here
};
