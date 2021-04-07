// Dependancies
const express = require("express");
const router = express.Router();
const passport = require("passport");

// importing Routes
const postRoutes = require("./posts");

// importing
const upload = require("../middleware/multer");

// controllers
const {
  roomList,
  roomUpdate,
  roomDelete,
  fetchRoom,
  roomCreate,
  inviteUsers,
  removeUser,
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

// **** hierarchy ***

// Using routes
router.use(
  "/:roomId/posts",
  passport.authenticate("jwt", { session: false }),
  postRoutes
);

// Assign user to room
router.post(
  "/:roomId/users",
  passport.authenticate("jwt", { session: false }),
  inviteUsers
);

// Remove user from room
router.delete(
  "/:roomId/users",
  passport.authenticate("jwt", { session: false }),
  removeUser
);

// **** End hierarchy ***

// Room list
router.get("/", roomList);

// Creating Rooms
router.post("/", passport.authenticate("jwt", { session: false }), roomCreate);

// Deleting Rooms
router.delete(
  "/:roomId",
  passport.authenticate("jwt", { session: false }),
  roomDelete
);

// Updating Rooms
router.put(
  "/:roomId",
  passport.authenticate("jwt", { session: false }),
  roomUpdate
);

module.exports = router;
