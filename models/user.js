'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = (models) => {
    User.hasMany(models.blog, { foreignKey: 'userId' })
    User.hasMany(models.likes, { foreignKey: 'userId' })
    User.hasMany(models.comments, { foreignKey: 'userId' })
  };

  return User;
};