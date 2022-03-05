'use strict'
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class room extends Model {
    static associate(models) {
        room.belongsTo(models.user_game, {
            foreignKey: 'owned_by',
            as: 'owner'
        })

        room.belongsTo(models.user_game, {
            foreignKey: 'player1_uuid',
            as: 'player_1'
        })

        room.belongsTo(models.user_game, {
            foreignKey: 'player2_uuid',
            as: 'player_2'
        })

        room.belongsTo(models.user_game, {
            foreignKey: 'winner_uuid',
            as: 'winner'
        })

        room.belongsTo(models.user_game, {
            foreignKey: 'loser_uuid',
            as: 'loser'
        })
    }
  }
  room.init({
    uuid:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    room_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
          msg: "Room Name is Already Used"
      }
    },
    owned_by: {
      type: DataTypes.UUID,
      allowNull: false
    },
    player1_choices: {
      type: DataTypes.ARRAY(DataTypes.ENUM('ROCK', 'PAPER', 'SCISSOR'))
    },
    palyer1_uuid: {
      type : DataTypes.UUID
    },
    player2_choices: {
        type: DataTypes.ARRAY(DataTypes.ENUM('ROCK', 'PAPER', 'SCISSOR'))
      },
      palyer2_uuid: {
        type : DataTypes.UUID
      },
      winner_uuid: {
        type : DataTypes.UUID
      },
      loser_uuid: {
        type : DataTypes.UUID
      },
      draw: {
        type: DataTypes.BOOLEAN
      }
  }, {
    sequelize,
    modelName: 'room',
    freezeTableName: true,
    createdAt: true,
    updatedAt: true
  });

  room.beforeCreate((data) => {
    data.name = data.nemae.toLowerCase()
  })

  room.beforeUpdate((data) => {
    data.name = data.nemae.toLowerCase()
  })
  return room;
};