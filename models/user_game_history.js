'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_game_history extends Model {
      static associate(models) {
      user_game_history.belongsTo(models.user_game, {
        foreignKey: 'user_game_uuid',
        as: 'user_game'
      })
    }
  }
  user_game_history.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    win: {
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    lose: {
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    draw: {
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    user_game_uuid: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'user_game_history',
    freezeTableName : true,
    createdAt: true,
    updatedAt:true
  });
  return user_game_history;
};