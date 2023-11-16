const Performer = require('../models/performer');

async function createPerformer(name) {
  try {
    const performer = await Performer.create({
      Name: name,
    });
    return performer;
  } catch (error) {
    console.error('Error creating performer:', error);
    throw error;
  }
}

// Add other Performer-related controller functions here

module.exports = {
  createPerformer,
  // Add other Performer-related controller functions here
};
