const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Application = require('./Application');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// One application can have many notes
Application.hasMany(Note, { onDelete: 'CASCADE' });
Note.belongsTo(Application);

module.exports = Note;