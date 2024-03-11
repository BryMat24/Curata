'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Unit.belongsTo(models.Course);
      Unit.hasMany(models.Chapter);
    }
  }
  Unit.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    CourseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Course",
        key: "id"
      },
      validate: {
        notEmpty: {
          msg: "Course id must not be empty"
        },
        notNull: {
          msg: "Course id must not be null"
        }
      }
    },
    unitName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Unit name must not be empty"
        },
        notNull: {
          msg: "Unit name must not be null"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Unit',
  });
  return Unit;
};