'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Course.hasMany(models.Unit);
    }
  }
  Course.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Course name must not be empty"
        },
        notNull: {
          msg: "Course name must not be null"
        }
      }
    },
    courseImage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Course image must not be empty"
        },
        notNull: {
          msg: "Course image must not be null"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};