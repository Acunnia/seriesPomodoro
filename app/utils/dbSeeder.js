require("dotenv/config");
const AppConfig = require("../models/app-config.model");
const Role = require("../models/role.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const Subcategory = require("../models/subcategory.model");

async function checkDB() {
  const roles = await Role.find().exec();
  if (roles.length === 0) {
    console.log("Crearting default roles");
    populateRoles();
  }

  const adminUser = await User.find({ username: "Admin" }).exec();
  if (adminUser.length === 0) {
    console.log("Creating admin user");
    populateAdmin();
  }

  const appConfig = await AppConfig.find().exec();
  if (appConfig.length === 0) {
    populateConfig();
  } else if (appConfig.length >> 1) {
    dropConfigAndPopulate();
  }

  const seriesSubcategory = await Subcategory.find({
    name: "Main Tracked Series",
  })
    .populate("category")
    .exec();
  if (seriesSubcategory.length === 0) {
    populateCategories();
  }
}

async function populateRoles() {
  return await Role.insertMany([
    { name: "User", admin_level: 1 },
    { name: "Admin", admin_level: 5 },
  ]);
}

async function populateAdmin() {
  const adminRole = await Role.findOne({ name: "Admin" }).exec();
  const adminUser = new User({
    username: "Admin",
    password: process.env.ADMIN_PASSWORD,
    email: process.env.ADMIN_MAIL,
    role: adminRole._id,
  });
  adminUser.save().then((savedUser) => {
    return Role.findOne(savedUser.role._id).then((role) => {
      role.users.push(savedUser._id);
      role.save();
    });
  });
}

async function populateConfig() {
  return await AppConfig.insertMany([
    {
      create_category: 3,
      create_subcategory: 3,
      edit_category: 3,
      edit_subcategory: 3,
      delete_category: 5,
      delete_subcategory: 5,
      edit_user: 5,
      delete_user: 5,
      create_role: 5,
      edit_role: 5,
      delete_role: 5,
      create_serie: 5,
      edit_serie: 5,
      delete_serie: 5,
      motd: "Wellcome to the seriesPomodoro forum",
      banner: "https://i.imgur.com/N9GbszF.jpg",
    },
  ]);
}

async function dropConfigAndPopulate() {
  await AppConfig.deleteMany({});
  return populateConfig();
}

async function populateCategories() {
  try {
    const savedCat = await Category.create({
      name: "Tracked Series",
      description: "General discusion about series",
    });

    const createdSub = await Subcategory.create({
      name: "Main Tracked Series",
      category: savedCat._id,
    });

    const updatedCategory = await Category.findByIdAndUpdate(
      savedCat._id,
      {
        $push: { subcategories: createdSub._id },
      },
      { new: true }
    );

    console.log(updatedCategory);
  } catch (error) {
    console.error(error);
  }
}

module.exports = checkDB;
