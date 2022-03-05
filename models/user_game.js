'use strict'
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_game extends Model {
    static associate(models) {
      // define association here
    }
  }
  user_game.init({
    uuid:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
          msg: "Username Sudah Digunakan"
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
          msg: "Email Sudah Digunakan"
      }
    }
  }, {
    sequelize,
    modelName: 'user_game',
    freezeTableName: true,
    createdAt: true,
    updatedAt: true
  });
  return user_game;
};