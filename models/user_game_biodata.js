'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_game_biodata extends Model {
      static associate(models) {
      // define association here
    }
  }
  user_game_biodata.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: DataTypes.STRING(255),
    city: DataTypes.STRING(255),
    hobby: DataTypes.STRING(255),
    date_of_birth: DataTypes.DATEONLY,
    user_game_uuid: {
        type: DataTypes.UUID,
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'user_game_biodata',
    freezeTableName: true,
    createdAt: true,
    updatedAt: true
  });
  return user_game_biodata;
};