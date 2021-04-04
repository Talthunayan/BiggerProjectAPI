// Slug
const slugify = require("slugify");

// Databse
const { Room } = require("../db/models");

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
      //   include: {
      //     model: Shop,
      //     as: "shop",
      //     attributes: ["id"],
      //   },
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
