// Dependancies
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Controllers
const { signup, signin } = require("../controllers/userController");

// Sign up "register"
router.post("/signup", signup);

// Sign in "register"
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);

module.exports = router;
