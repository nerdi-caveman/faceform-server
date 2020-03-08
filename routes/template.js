const router = require("express").Router();
const error = require("../utils/errorHandler");
const { verify } = require("../utils/jwt");

// Mongoose models
const Template = require("../models/template");

/**
 * Table of content
 * 1) Get request
 * 2) Post requests
 * 3) Delete requests
 */

// Get all templates
router.get("/", async (req, res) => {
  try {
    const template = await Template.find();
    res.send(template);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Get single template
router.get("/:_id", async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params._id
    });

    if (!template) return res.status(404).send("template not found");
    res.send(template);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Add template
router.post("/add", async (req, res) => {
  try {
    const templateData = await Template.create(req.body);

    const savedTemplate = await templateData.save();

    res.status(201).send({
      data: savedTemplate
    });
  } catch (e) {
    error.send(res, e.message);
  }
});

// delete template
router.delete("/delete/:_id", async (req, res) => {
  try {
    const template = await Template.deleteOne({
      _id: req.params._id
    });

    res.status(204).send(template);
  } catch (e) {
    error.send(res, e.message);
  }
});

module.exports = router;
