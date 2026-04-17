'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {
  }
  blog.init({
    title: DataTypes.STRING,
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "slug",
        msg: "Slug must be unique"
      }
    },
      content: DataTypes.STRING,
      image: DataTypes.JSON,
      userId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      view: DataTypes.INTEGER,
    }, {
    sequelize,
    modelName: 'blog',
  });

  blog.associate = (models) => {
    blog.belongsTo(models.User, { foreignKey: 'userId' })
    blog.belongsTo(models.categories, { foreignKey: 'categoryId' });
    blog.hasMany(models.likes, { foreignKey: 'blogId' })
    blog.hasMany(models.comments, { foreignKey: 'blogId' })
  };

  return blog;
};



