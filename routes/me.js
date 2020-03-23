const router = require("express").Router();
const jwt = require("jsonwebtoken");
const error = require("../utils/errorHandler");
const { authGoogleUser } = require("../utils/google");
const { verify } = require("../utils/jwt");

// Mongoose models
const User = require("../models/user");
const Workspace = require("../models/workspace");
const Result = require("../models/result");

/**
 * Table of content
 * 1) Get request
 * 2) Post requests
 * 3) Delete requests
 */

// Get current user
router.get("/", verify, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.user._id
    });
    res.send(user);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Get user workspace
router.get("/workspace", verify, async (req, res) => {
  try {
    const workspace = await Workspace.find({
      user_id: req.user._id
    }).populate({
      path: "form_id",
      populate: ["user_id", "template_id"]
    });
    res.send(workspace);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Get all users results of published
router.get("/results/:form_id", verify, async (req, res) => {
  try {
    const result = await Result.find({
      user_id: req.user._id,
      form_id: req.params.form_id
    }).populate(["form_id"]);
    res.send(result);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Login user but first create user if user does not exist in database then continue login
router.post("/login", async (req, res) => {
  //   authenticate id_token with google-auth-library
  if (!req.headers.authorization)
    return error.send(res, "Id token not found", 403);
  const _data = await authGoogleUser(req.headers.authorization);

  if (!_data) return error.send(res, "Invalid token", 403);
  const { id, name, email, image_url, exp } = _data;

  try {
    // check if user exist in database
    let user = await User.findOne({
      google_id: id
    });

    if (!user) {
      // create user
      const userData = await User.create({
        google_id: id,
        name,
        email,
        image_url
      });

      user = await userData.save();
    }
    // create and assign jwt
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: exp // default expires in 1 hour
    });

    // set cookie to expire in 15 mins and send data
    res.send({
      access_token: token,
      name,
      email,
      image_url
    });
  } catch (e) {
    error.send(res, e.message);
  }
});

// Get all users results of published
router.delete("/results/:_id", verify, async (req, res) => {
  try {
    const result = await Result.findOneAndDelete({
      user_id: req.user._id,
      _id: req.params._id
    });
    await Workspace.findOne({
      form_id: result.form_id
    }).exec(async (err, doc) => {
      if (!err) {
        return await Workspace.findOneAndUpdate(
          { form_id: result.form_id },
          { response: (+doc.response - 1).toString() }
        );
      }
    });

    res.status(204).send(result);
  } catch (e) {
    error.send(res, e.message);
  }
});

module.exports = router;
