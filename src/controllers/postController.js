// Slug
const slugify = require("slugify");

// Databse
const { User, Room, Post } = require("../db/models");

// Fetch post
exports.fetchPost = async (postId, next) => {
  try {
    const post = await Post.findByPk(postId);
    return post;
  } catch (error) {
    next(error);
  }
};

// Post list
exports.postList = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      // include: {
      //   model: Product,
      //   as: "products",
      //   attributes: { exclude: ["createdAt", "updatedAt"] },
      // },
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// Create post
exports.postCreate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    //   req.body.userId = req.user.id; // relation stuff
    const newPost = await Post.create(req.body);
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
