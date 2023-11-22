const { DataTypes } = require('sequelize');
const connection = require('../config/db');
const SongModel = require('./song');

const Performer = connection.define('Performer', {
  PerformerID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SpotifyID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

Performer.belongsToMany(SongModel, { through: 'SongPerformer', foreignKey: 'PerformerID' });
SongModel.belongsToMany(Performer, { through: 'SongPerformer', foreignKey: 'SongID' });

module.exports = Performer;
