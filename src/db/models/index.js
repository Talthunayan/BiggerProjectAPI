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
// Room to Post
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
db.User.hasMany(db.Post, {
  as: "post",
  foreignKey: "userId",
});

db.Post.belongsTo(db.User, {
  as: "user",
  foreignKey: "userId",
});

// Users to Rooms

module.exports = db;

// /**
//  * many-to-many relationship
//  *
//  * We need 2 `belongsToMany` that goes both ways
//  *
//  * e.g. db.Foo.belongsToMany(db.Bar, options)
//  *      db.Bar.belongsToMany(db.Foo, options)
//  *
//  * for the options:
//  * {
//  *    through: name of the through table in the db
//  *    as: the name of the array on the fetched object
//  *    foreignKey: the ambassador that you send to the through table (perspective of first model)
//  * }
//  */

// // student course relationship
// db.Student.belongsToMany(db.Course, {
//   through: "StudentCourse",
//   as: "courses",
//   foreignKey: "studentId",
// });

// db.Course.belongsToMany(db.Student, {
//   through: "StudentCourse",
//   as: "students",
//   foreignKey: "courseId",
// });
