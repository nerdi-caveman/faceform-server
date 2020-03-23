const router = require("express").Router();
const error = require("../utils/errorHandler");
const { verify } = require("../utils/jwt");

// Mongoose model
const Workspace = require("../models/workspace");
const Publish = require("../models/publish");
const Form = require("../models/form");
const Result = require("../models/result");

/**
 * Table of content
 * 1) Get request
 * 2) Post requests
 * 3) Delete requests
 */

// Get single workspace data
router.get("/:_id", verify, async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params._id
    });

    if (!workspace) return res.status(404).send("workspace not found");
    res.send(workspace);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Get all workspace data
router.get("/", async (req, res) => {
  try {
    const workspace = await Workspace.find().populate({
      path: "form_id",
      populate: ["user_id", "template_id"]
    });
    res.send(workspace);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Get single workspace data
router.get("/:_id", verify, async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params._id
    });

    if (!workspace) return res.status(404).send("workspace not found");
    res.send(workspace);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Add workspace
router.post("/add", verify, async (req, res) => {
  try {
    const user_id = req.user._id;
    const workspaceData = await Workspace.create({
      name: req.body.name,
      user_id: user_id,
      form_id: req.body.form_id
    });

    const savedWorkspace = await workspaceData.save();

    res.status(201).send({
      data: savedWorkspace
    });
  } catch (e) {
    error.send(res, e.message);
  }
});

// Delete workspace
router.delete("/delete/:_id", verify, async (req, res) => {
  try {
    const user_id = req.user._id;

    const workspaceData = await Workspace.findOne({
      _id: req.params._id,
      user_id
    });

    if (!workspaceData) return error.send(res, "Workspace does not exist", 404);

    const form_id = workspaceData.form_id;

    // Delete from publish
    await Publish.deleteOne({
      form_id: form_id,
      user_id
    }).populate(["form_id"]);

    // Delete from workspace
    await Workspace.deleteOne({
      _id: req.params._id,
      user_id
    });

    // Delete from results
    await Result.deleteMany({
      form_id: form_id,
      user_id
    });

    // Delete from form
    const form = await Form.deleteOne({
      _id: form_id,
      user_id
    });
    res.status(204).send(form);
  } catch (e) {
    error.send(res, e.message);
  }
});

module.exports = router;
