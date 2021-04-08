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

// {
//   "id": 5,
//   "name": "Hasan room",
//   "slug": "hasan-room",
//   "description": "A legend?",
//   "admin": "Salem",
//   "post": [],
//   "user": [
//       {
//           "id": 1,
//           "UserRooms": {
//               "admin": true,
//               "createdAt": "2021-04-07T23:01:41.874Z",
//               "updatedAt": "2021-04-07T23:01:41.874Z",
//               "userId": 1,
//               "roomId": 5
//           }
//       }
//   ]
// }

// CheckAdmin function
const checkAdmin = (room, pizza) => {
  const foundUser = room.user.find((user) => user.id === pizza.id);
  return foundUser ? foundUser.UserRooms.admin : false;
};

// CheckMember function
const checkMember = (room, pizza) => {
  const foundRoom = room.user.find((room) => room.id === pizza.id);
  return foundRoom ? foundRoom.UserRooms.admin : true;
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

// My Room list
exports.myRoomList = async (req, res, next) => {
  try {
    const rooms = await Room.findAll(includeHasan);
    const myRooms = rooms.filter((room) => checkAdmin(room, req.user));
    res.json(myRooms);
  } catch (err) {
    next(err);
  }
};

// Explore Room list
exports.exploreRoomList = async (req, res, next) => {
  try {
    const rooms = await Room.findAll(includeHasan);
    const exploreRooms = rooms.filter((room) => checkMember(room, req.user));
    res.json(exploreRooms);
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
        admin: req.user.username,
      });
      newRoom.addUser(req.user, { through: { admin: true } });
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

// ***** Admin powers *****

// Assign room to user "invite"
exports.inviteUsers = async (req, res, next) => {
  try {
    if (req.user.username === req.room.admin) {
      const user = await User.findByPk(req.body.userId);
      req.room.addUser(user);
      res.status(200).end();
    } else {
      res.json({ message: "Unauthorized Admin" }).end();
    }
  } catch (error) {
    next(error);
  }
};

// Remove user from room
exports.removeUser = async (req, res, next) => {
  try {
    if (req.user.username === req.room.admin) {
      const user = await User.findByPk(req.body.userId);
      req.room.removeUser(user);
      res.status(200).end();
    } else {
      res.json({ message: "Unauthorized Admin" }).end();
    }
  } catch (error) {
    next(error);
  }
};
