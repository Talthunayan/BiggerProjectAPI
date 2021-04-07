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

// **** post hierarchy ***

// Using routes

// Add post to room
router.use(
  "/:roomId/posts",
  passport.authenticate("jwt", { session: false }),
  postRoutes
);

// **** End hierarchy ***

// Room list
router.get("/", roomList);

// Creating Rooms
router.post("/", passport.authenticate("jwt", { session: false }), roomCreate);

// Deleting Rooms
router.delete("/:roomId", roomDelete);

// // Delteing Rooms from User ( Super Sus*)
// router.delete(
//   "/:userId/rooms",
//   passport.authenticate("jwt", { session: false }),
//   removeRoom
// );

// Updating Rooms
router.put("/:roomId", roomUpdate);

module.exports = router;
