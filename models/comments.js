'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  comments.init({
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    blogId: DataTypes.INTEGER,
    parentid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'comments',
  });

  comments.associate = (models) => {
    comments.belongsTo(models.blog, { foreignKey: 'blogId' })
    comments.belongsTo(models.User, { foreignKey: 'userId' })
    comments.hasMany(models.comments, { foreignKey: 'parentid', as: 'replies', onDelete: 'CASCADE' });
    comments.belongsTo(models.comments, { foreignKey: 'parentid', as: 'parent' });
  }
  return comments;
};