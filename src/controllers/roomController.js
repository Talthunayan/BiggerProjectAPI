// Slug
const slugify = require("slugify");

// Databse
const { Room, Post, User } = require("../db/models");

// Include Convention
const includeHasan = {
  attributes: { exclude: ["createdAt", "updatedAt"] },
  include: [
    {
      model: Post,
      as: "post",
      attributes: ["id", "text"],
    },
    {
      model: User,
      as: "user",
      attributes: ["id"],
    },
  ],
};

// Fetch room
exports.fetchRoom = async (roomId, next) => {
  try {
    const room = await Room.findByPk(roomId, includeHasan);
    return room;
  } catch (error) {
    next(error);
  }
};

// Room list
exports.roomList = async (req, res, next) => {
  try {
    const rooms = await Room.findAll(includeHasan);
    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

// Create Room (Salem)
exports.roomCreate = async (req, res, next) => {
  try {
    if (req.user) {
      const newRoom = await Room.create({
        name: req.body.name,
        description: req.body.description,
        // admin: req.user.username,
      });
      newRoom.addUser(req.user);
      res.status(201).json(newRoom);
    }
  } catch (err) {
    next(err);
  }
};

// Update room
exports.roomUpdate = async (req, res, next) => {
  try {
    if (req.user.username === req.room.admin) {
      await req.room.update(req.body);
      res.status(204).end();
    } else {
      res.json({ message: "Unauthorized Admin" }).end();
    }
  } catch (err) {
    next(err);
  }
};

// Delete room
exports.roomDelete = async (req, res, next) => {
  try {
    if (req.user.username === req.room.admin) {
      await req.room.destroy();
      res.status(204).end();
    } else {
      res.json({ message: "Unauthorized Admin" }).end();
    }
  } catch (err) {
    next(err);
  }
};

// // Remove or delinking Room from User (Sus form*)
// exports.removeRoom = async (req, res, next) => {
//   try {
//     const room = await Room.findByPk(req.body.roomId);

//     req.user.removeRoom(room);

//     res.status(200).end();
//   } catch (error) {
//     next(error);
//   }
// };
