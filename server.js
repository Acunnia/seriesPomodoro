require("dotenv/config");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 80;
const path = require("path");
const passport = require("passport");
const mongoose = require("mongoose");
const controllers = require("./routes");
const { Strategy, ExtractJwt } = require("passport-jwt");
const checkDB = require("./utils/dbSeeder");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(passport.initialize());
require("./utils/auth")(passport);

// API Routers
app.use("/api/users", controllers.userController);
app.use("/api/categories", controllers.categoryController);
app.use("/api/subcategories", controllers.subcategoryController);
app.use("/api/topics", controllers.topicController);
app.use("/api/reply", controllers.replyController);
app.use("/api/stats", controllers.statsController);
app.use("/api/roles", controllers.roleController);
app.use("/api/config", controllers.appConfigController);
app.use("/api/series", controllers.serieController);

// If no API routes
// are hit, send the build version of the React client
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// MongoDB connection
const connectDb = () => {
  return mongoose.connect(process.env.MONGO, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

checkDB();

connectDb().then(async () => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
