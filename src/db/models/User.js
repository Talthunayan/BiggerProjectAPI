// Slug
const SequelizeSlugify = require("sequelize-slugify");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email already exists",
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Username already exists",
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  SequelizeSlugify.slugifyModel(User, {
    source: ["name"],
  });
  return User;
};
