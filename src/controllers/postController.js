// Slug
const slugify = require("slugify");

// Databse
const { User, Room, Post } = require("../db/models");

// Fetch post
exports.fetchPost = async (postId, next) => {
  try {
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: Room,
          as: "room",
          attributes: ["id"],
        },
      ],
    });
    return post;
  } catch (error) {
    next(error);
  }
};

// Post list
exports.postList = async (req, res, next) => {
  try {
    if (req.room.user.find((user) => user.id === req.user.id)) {
      res.json(req.room.post);
    } else {
      res.json({ message: "Room has no posts" });
    }
  } catch (err) {
    next(err);
  }
};

// Create Post
exports.postCreate = async (req, res, next) => {
  try {
    // const { roomId } = req.params;
    // console.log(roomId);
    // res.end();
    const newPost = await Post.create({
      text: req.body.text,
      userId: req.user.id,
      roomId: req.room.id,
      // image: req.body.image,
    });

    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};

// Update post
exports.postUpdate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    await req.post.update(req.body);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// Delete post
exports.postDelete = async (req, res, next) => {
  try {
    await req.post.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
