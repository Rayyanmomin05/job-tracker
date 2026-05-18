const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
  },
  salary: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM(
      'Applied',
      'Interview',
      'Offer',
      'Rejected',
      'Withdrawn'
    ),
    defaultValue: 'Applied',
  },
  appliedDate: {
    type: DataTypes.DATEONLY,
  },
  jobUrl: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

module.exports = Application;