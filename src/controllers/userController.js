// Dependancies
const bcrypt = require("bcrypt");
const slugify = require("slugify");

// Webtoken
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../config/keys");

// Database
const { User, Room } = require("../db/models");

// Sign up
exports.signup = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("exports.signup -> hashedPassword", hashedPassword);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    const payload = {
      id: newUser.id,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      admin: newUser.admin,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.status(201).json({ token: token });
  } catch (error) {
    next(error);
  }
};

// Sign in
exports.signin = (req, res) => {
  console.log(`Attempting login for ${req.user.username}`);
  const { user } = req;
  const payload = {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    admin: user.admin,
    exp: Date.now() + parseInt(JWT_EXPIRATION_MS),
  };
  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
  res.json({ token: token });
};

// Check username
exports.checkUsername = async (req, res, next) => {
  try {
    let available = true;
    const user = await User.findOne({ where: { username: req.body.username } });
    if (user) available = false;

    res.json({ available });
  } catch (error) {
    next(error);
  }
};

// *** Commands ***

// Fetch users
exports.fetchUser = async (userId, next) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: Room,
        as: "room",
        attributes: {
          include: ["id", "name"],
          exclude: ["createdAt", "updatedAt"],
          through: {
            attributes: [],
          },
        },
      },
    });
    return user;
  } catch (error) {
    next(error);
  }
};

// User list
exports.userList = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: Room,
        as: "room",
        attributes: {
          include: ["id", "name"],
          exclude: ["createdAt", "updatedAt"],
          through: {
            attributes: [],
          },
        },
      },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Update user
exports.userUpdate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    await req.user.update(req.body);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// Delete user
exports.userDelete = async (req, res, next) => {
  try {
    await req.user.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
