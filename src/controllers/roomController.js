// Slug
const slugify = require("slugify");

// Databse
const { Room, Post } = require("../db/models");

// Fetch room
exports.fetchRoom = async (roomId, next) => {
  try {
    const room = await Room.findByPk(roomId);
    return room;
  } catch (error) {
    next(error);
  }
};

// Room list
exports.roomList = async (req, res, next) => {
  try {
    const rooms = await Room.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: Post,
        as: "post",
        attributes: ["id"],
      },
    });
    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

// Update room
exports.roomUpdate = async (req, res, next) => {
  try {
    await req.room.update(req.body);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// Delete room
exports.roomDelete = async (req, res, next) => {
  try {
    await req.room.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// //*** Posts ***//
// // Create post
// exports.postCreate = async (req, res, next) => {
// if (req.room.) //
//   if (req.room.id === req.post.roomId) {
//     if (req.file) {
//       req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
//     }
//     req.body.roomId = req.room.id;
//     const newPost = await Post.create(req.body);
//     res.status(201).json(newPost);
//   } else {
//     const err = new Error("Unauthorized");
//     err.status = 401;
//     next(err);
//   }
// };
