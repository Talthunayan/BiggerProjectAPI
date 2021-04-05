// Slug
const SequelizeSlugify = require("sequelize-slugify");

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  SequelizeSlugify.slugifyModel(Post, {
    source: ["text"],
  });
  return Post;
};
