// Dependancies
const express = require("express");
const router = express.Router();

// controllers
const {
  roomList,
  roomUpdate,
  roomDelete,
  fetchRoom,
} = require("../controllers/roomController");

// Param Middleware
router.param("roomId", async (req, res, next, roomId) => {
  const room = await fetchRoom(roomId, next);
  if (room) {
    req.room = room;
    next();
  } else {
    const err = new Error("Room Not Found");
    err.status = 404;
    next(err);
  }
});

// Room list
router.get("/", roomList);

// Deleting Rooms
router.delete("/:roomId", roomDelete);

// Updating Rooms
router.put("/:roomId", roomUpdate);

module.exports = router;
