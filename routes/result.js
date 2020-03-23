const router = require("express").Router();
const error = require("../utils/errorHandler");
const { verify } = require("../utils/jwt");

// Mongoose model
const Result = require("../models/result");
const Workspace = require("../models/workspace");

/**
 * Table of content
 * 1) Post requests
 * 2) Delete requests
 */

// Add result
router.post("/add", async (req, res) => {
  try {
    const resultData = await Result.create(req.body);
    await Workspace.findOne({
      form_id: req.body.form_id
    }).exec(async (err, doc) => {
      if (!err) {
        return await Workspace.findOneAndUpdate(
          { form_id: req.body.form_id },
          { response: (1 + +doc.response).toString() }
        );
      }
    });

    const savedResult = await resultData.save();
    res.status(201).send({
      data: savedResult
    });

  } catch (e) {
    error.send(res, e.message);
  }
});

// Update result
router.put("/update/:_id", verify, async (req, res) => {
  try {
    const resultData = await Result.findOneAndUpdate(
      { _id: req.params._id, user_id: req.user._id },
      req.body,
      { new: true },
      (err, doc) => {
        if (err) {
          error.send(res, "Something wrong when updating data!");
        }
      }
    );

    const savedResult = await resultData.save();

    res.status(200).send({
      data: savedResult
    });
  } catch (e) {
    error.send(res, e.message);
  }
});

// Delete workspace
// router.delete("/delete/:_id", async (req, res) => {
//   try {
//     const result = await Workspace.deleteOne({
//       _id: req.params._id
//     });

//     res.status(204).send(result);
//   } catch (e) {
//     error.send(res, e.message);
//   }
// });

module.exports = router;
