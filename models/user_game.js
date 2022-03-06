'use strict'
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_game extends Model {
    static associate(models) {
        user_game.hasOne(models.user_game_history, {
          foreignKey: 'user_game_uuid',
          as: "user_history"
        })

        user_game.hasOne(models.user_game_biodata, {
          foreignKey: "user_game_uuid",
          as: 'user_biodata'
        })

        user_game.hasMany(models.room, {
          foreignKey: 'owned_by',
          as: 'room'
        })

        user_game.hasMany(models.room, {
          foreignKey: 'player1_uuid',
          as: 'room_player1_uuid'
        })

        user_game.hasMany(models.room, {
          foreignKey: 'player2_uuid',
          as: 'room_player2_uuid'
        })

        user_game.hasMany(models.room, {
          foreignKey: 'winner_uuid',
          as: 'winner_room'
        })

        user_game.hasMany(models.room, {
          foreignKey: 'loser_uuid',
          as: 'loser_room'
        })
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
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull : false
    },
    role: {
      type : DataTypes.ENUM('SuperAdmin', 'PlayerUser'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'user_game',
    freezeTableName: true,
    createdAt: true,
    updatedAt: true
  });

  user_game.beforeCreate((data) => {
    data.email = data.email.toLowerCase()
  })

  user_game.beforeUpdate((data) => {
    data.email = data.email.toLowerCase()
  })
  return user_game;
};