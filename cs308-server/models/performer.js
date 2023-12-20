const { DataTypes } = require('sequelize');
const connection = require('../config/db');
const SongModel = require('./song');
const PerformerRatingModel = require('./performerRating');

const Performer = connection.define('Performer', {
  PerformerID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  SpotifyID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true,
});

Performer.belongsToMany(SongModel, { through: 'SongPerformer', foreignKey: 'PerformerID' });
SongModel.belongsToMany(Performer, { through: 'SongPerformer', foreignKey: 'SongID' });

Performer.hasMany(PerformerRatingModel, { foreignKey: 'PerformerID', as: 'PerformerRatingInfo' });
PerformerRatingModel.belongsTo(Performer, { foreignKey: 'PerformerID', as: 'PerformerInfo' });

module.exports = Performer;