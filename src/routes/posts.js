// Dependancies
const express = require("express");
const router = express.Router();
const passport = require("passport");

// importing
const upload = require("../middleware/multer");

// controllers
const {
  postList,
  postUpdate,
  postDelete,
  fetchPost,
} = require("../controllers/postController");

// Param Middleware
router.param("postId", async (req, res, next, postId) => {
  const post = await fetchPost(postId, next);
  if (post) {
    req.post = post;
    next();
  } else {
    const err = new Error("Post Not Found");
    err.status = 404;
    next(err);
  }
});

// Post list
router.get("/", postList);

// Deleting Posts
router.delete("/:postId", postDelete);

// Updating Posts
router.put("/:postId", upload.single("image"), postUpdate);

module.exports = router;
