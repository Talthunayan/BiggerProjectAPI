// Slug
const SequelizeSlugify = require("sequelize-slugify");

module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define("Room", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
  SequelizeSlugify.slugifyModel(Room, {
    source: ["name"],
  });

  return Room;
};
