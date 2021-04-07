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
  return Post;
};
