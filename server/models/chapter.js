'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chapter.belongsTo(models.Unit);
      Chapter.hasMany(models.Question);
    }
  }
  Chapter.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    chapterName: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Unit",
        key: "id"
      },
      validate: {
        notEmpty: {
          msg: "Chapter name must not be empty"
        },
        notNull: {
          msg: "Chapter name must not be null"
        }
      }
    },
    UnitId: DataTypes.INTEGER,
    videoId: DataTypes.STRING,
    videoThumbNail: DataTypes.STRING,
    videoTitle: DataTypes.STRING,
    videoTranscript: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Chapter',
  });
  return Chapter;
};