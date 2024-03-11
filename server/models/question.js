'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.belongsTo(models.Chapter)
      Question.hasMany(models.Option);
    }
  }
  Question.init({
    ChapterId: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Question must not be empty"
        },
        notNull: {
          msg: "Question must not be null"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};