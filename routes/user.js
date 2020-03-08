const router = require("express").Router();
const jwt = require("jsonwebtoken");
const error = require("../utils/errorHandler");
const { authGoogleUser } = require("../utils/google");
const { verify, sign } = require("../utils/jwt");

// Mongoose models
const User = require("../models/user");
const Workspace = require("../models/workspace");

/**
 * Table of content
 * 1) Get request
 * 2) Post requests
 * 3) Put requests
 */

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Get single user
router.get("/:_id", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params._id
    });

    if (!user) return res.status(404).send("user not found");
    res.send(user);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Get user workspace
router.get("/:_id/workspace", async (req, res) => {
  try {
    const workspace = await Workspace.find({
      user_id: req.params._id
    });

    if (!workspace) return res.status(404).send("workspace not found");
    res.send(workspace);
  } catch (e) {
    error.send(res, e.message);
  }
});

module.exports = router;
