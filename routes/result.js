const router = require("express").Router();
const error = require("../utils/errorHandler");
const { verify } = require("../utils/jwt");

// Mongoose model
const Result = require("../models/result");

/**
 * Table of content
 * 1) Get request
 * 2) Post requests
 * 3) Delete requests
 */

// Get all result data
router.get("/:_id", verify, async (req, res) => {
  try {
    const result = await Result.find({
      publish_id: req.params._id
    });

    if (!result) return res.status(404).send("result not found");
    res.send(result);
  } catch (e) {
    error.send(res, e.message);
  }
});

// Add result
router.post("/add", verify, async (req, res) => {
  try {
    const resultData = await Result.create(req.body);

    const savedResult = await resultData.save();

    res.status(201).send({
      data: savedResult
    });
  } catch (e) {
    error.send(res, e.message);
  }
});

// // Add result
// router.put("/update/:_id", async (req, res) => {
//   try {
//     const resultData = await Result.findOneAndUpdate(
//       { _id: req.params._id },
//       { $push: { items: res.body } },
//       { new: true },
//       (err, doc) => {
//         if (err) {
//           error.send(res, "Something wrong when updating data!");
//         }
//       }
//     );

//     const savedResult = await resultData.save();

//     res.status(200).send({
//       data: savedResult
//     });
//   } catch (e) {
//     error.send(res, e.message);
//   }
// });

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
