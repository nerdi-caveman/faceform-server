const router = require("express").Router();
const error = require("../utils/errorHandler");
const { verify } = require("../utils/jwt");

// Mongoose models
const Form = require("../models/form");

/**
 * Table of content
 * 1) Get request
 * 2) Post requests
 * 3) Put requests
 * 4) Delete requests
 */

// Get all form
router.get("/", verify, async (req, res) => {
  try {
    if (req.user.access === "admin") {
      const form = await Form.find().populate(["user_id"]);
      res.send(form);
    } else {
      error.send(res, "You dont have permission");
    }
  } catch (e) {
    error.send(res, e.message);
  }
});

// Get single form
router.get("/:_id", verify, async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.params._id,
      user_id: req.user._id
    }).populate(["user_id", "template_id"]);

    if (!form) return res.status(404).send("form not found");
    res.send(form);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Add form
router.post("/add", verify, async (req, res) => {
  try {
    if (req.user._id) {
      const _data = {
        user_id: req.user._id,
        template_id: req.body.template_id,
        form: req.body.form
      };
      const formData = await Form.create(_data);

      const savedForm = await formData.save();

      res.status(201).send({
        data: savedForm
      });
    } else {
      error.send(res, "You dont have permission");
    }
  } catch (e) {
    error.send(res, e.message);
  }
});

// update form
router.put("/update/:_id", verify, async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      { _id: req.params._id, user_id: req.user._id },
      req.body,
      { new: true },
      (err, doc) => {
        if (err) {
          error.send(res, "Something wrong when updating data!");
        }
      }
    );

    if (!form) {
      return error.send(res, "Form doesnt exist");
    }
    const saved = await form.save();
    res.send({
      data: saved
    });
  } catch (e) {
    error.send(res, e.message);
  }
});

// delete form
router.delete("/delete/:_id", verify, async (req, res) => {
  try {
    const form = await Form.deleteOne({
      _id: req.params._id,
      user_id: req.user._id
    });

    res.status(204).send(form);
  } catch (e) {
    error.send(res, e.message);
  }
});

module.exports = router;
