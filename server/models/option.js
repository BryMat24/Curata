'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Option.belongsTo(models.Question);
    }
  }
  Option.init({
    option: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Option must not be empty"
        },
        notNull: {
          msg: "Option must not be null"
        }
      }
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Option status must not be empty"
        },
        notNull: {
          msg: "Option status must not be null"
        }
      }
    },
    QuestionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Option',
  });
  return Option;
};