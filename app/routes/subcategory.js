const express = require("express");
const subcategoryController = express.Router();
const Subcategory = require("../models/subcategory.model");
const Topic = require("../models/topic.model");
const Category = require("../models/category.model");
const passport = require("passport");
const checkPermissionMiddleware = require("../utils/checkPermission");

subcategoryController.get("/info", (req, res) => {
  const { id } = req.query;
  Subcategory.findById(id, "-topics")
    .then((subcategory) => {
      return res.status(200).json(subcategory);
    })
    .catch((err) =>
      res.status(400).json({ msg: "Failed to get info of subcategory", err })
    );
});

subcategoryController.get("/topics", async (req, res) => {
  try {
    const { page = 1, limit = 10, id = null } = req.query;
    if (!id) {
      return res.status(400).json({ msg: "No id provided." });
    }
    const result = {};

    const subcategory = await Subcategory.findById(id).populate({
      path: "topics",
      options: {
        limit,
        skip: (page - 1) * limit,
        sort: { isPinned: -1, updatedAt: -1 },
      },
      populate: {
        path: "lastreply",
        select: "-message",
        populate: {
          path: "author",
          select: "username",
        },
      },
    });

    if (!subcategory) {
      return res.status(404).json({ msg: "Subcategory not found." });
    }

    result.topics = subcategory.topics.reduce((topics, topic) => {
      topics.push(topic);
      return topics;
    }, []);

    result.name = subcategory.name;

    result.page = page;
    const count = await Topic.countDocuments({ category: id });
    result.totalPages = Math.ceil(count / limit);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Failed to get info of subcategory.", err });
  }
});

subcategoryController.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  checkPermissionMiddleware("create_subcategory"),
  async (req, res) => {
    const { name, category } = req.body;

    try {
      const savedCat = await Category.findById(category);

      if (!savedCat) {
        return res.status(404).json({ msg: "Category does not exist" });
      }

      const newSubcat = new Subcategory({ name, category });

      const savedSubcat = await newSubcat.save();

      savedCat.subcategories.push(savedSubcat._id);

      await savedCat.save();

      return res.status(200).json({ subcat: savedSubcat });
    } catch (error) {
      return res
        .status(400)
        .json({ msg: "Failed creating subcategory.", err: error });
    }
  }
);

module.exports = subcategoryController;
