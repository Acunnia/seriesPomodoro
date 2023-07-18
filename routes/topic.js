const express = require('express')
const passport = require('passport');
const mongoose = require("mongoose");

const topicController = express.Router();
const Topic = require('../models/topic.model');
const Reply = require('../models/reply.model');
const SubCategory = require('../models/subcategory.model');
const User = require('../models/user.model');


topicController.post('/create', passport.authenticate('jwt', {session: false}), (req, res) => {
    console.log("Autenticado")
})


module.exports = topicController
