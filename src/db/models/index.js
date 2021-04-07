"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Relations

// Room to Post (One to Many)
db.Room.hasMany(db.Post, {
  as: "post",
  foreignKey: "roomId",
  allowNull: false,
});

db.Post.belongsTo(db.Room, {
  as: "room",
  foreignKey: "roomId",
});

// User to Post
// user post relationship (One to Many)
db.User.hasMany(db.Post, {
  as: "post",
  foreignKey: "userId",
});

db.Post.belongsTo(db.User, {
  as: "user",
  foreignKey: "userId",
});

// Users to Rooms
// user Room "Membership" (Many to Many)
db.User.belongsToMany(db.Room, {
  through: "UserRooms",
  as: "room",
  foreignKey: "userId",
});

db.Room.belongsToMany(db.User, {
  through: "UserRooms",
  as: "user",
  foreignKey: "roomId",
});

// User to User (many-many relation)
// db.User.belongsToMany(db.User, {
//   as: "user a",
//   through: db.Friend,
//   foreignKey: "user1Id",
//   unique: true,
// });
// db.User.belongsToMany(db.User, {
//   as: "user b",
//   through: db.Friend,
//   foreignKey: "user2Id",
//   unique: true,
// });

module.exports = db;
