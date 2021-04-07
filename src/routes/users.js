// Dependancies
const express = require("express");
const router = express.Router();
const passport = require("passport");

// importing
const upload = require("../middleware/multer");

// Controllers
const {
  signup,
  signin,
  fetchUser,
  userList,
  userUpdate,
  userDelete,
  // postCreate,
  // assignToRoom,
} = require("../controllers/userController");

// Sign up "register"
router.post("/signup", signup);

// Sign in "register"
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);

// Param Middleware
router.param("userId", async (req, res, next, userId) => {
  const user = await fetchUser(userId, next);
  if (user) {
    req.user = user;
    next();
  } else {
    const err = new Error("User Not Found");
    err.status = 404;
    next(err);
  }
});

// user list
router.get("/", userList);

// Deleting Users
router.delete("/:userId", userDelete);

// Updating Users
router.put("/:userId", upload.single("image"), userUpdate);

// // Linking A Post to A User
// router.post(
//   "/:userId/posts",
//   passport.authenticate("jwt", { session: false }),
//   upload.single("image"),
//   postCreate
// );

// ********** Room relation **********

// // Assign Room to User
// router.post("/:userId/rooms", assignToRoom);

module.exports = router;
