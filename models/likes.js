'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  likes.init({
    userId: DataTypes.INTEGER,
    blogId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'likes',
  });

  likes.associate = (models) => {
    likes.belongsTo(models.User, { foreignKey: 'userId' });
    likes.belongsTo(models.blog, { foreignKey: 'blogId' });
  };

  return likes;
};