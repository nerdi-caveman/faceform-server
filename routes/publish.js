const router = require("express").Router();
const error = require("../utils/errorHandler");
const { verify } = require("../utils/jwt");

// Mongoose model
const Publish = require("../models/publish");

/**
 * Table of content
 * 1) Get request
 * 2) Post requests
 */

// Get all published forms
router.get("/", async (req, res) => {
  try {
    const publish = await Publish.find().populate(["form_id"]);
    res.send(publish);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Get single workspace data
router.get("/:_id", async (req, res) => {
  try {
    const publish = await Publish.findOne({
      form_id: req.params._id
    }).populate({ path: "form_id", populate: ["template_id", "user_id"] });

    if (!publish) return res.status(404).send("publish not found");
    res.send(publish);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Add workspace
router.post("/add", verify, async (req, res) => {
  try {
    if (req.user._id) {
      const publish = await Publish.findOne(req.body);
      if (publish) return res.send("Already publish");
      const publishData = await Publish.create(req.body);

      const savedPublish = await publishData.save();

      res.status(201).send({
        data: savedPublish
      });
    }
  } catch (e) {
    error.send(res, e.message);
  }
});

module.exports = router;
