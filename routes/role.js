const express = require('express')

const roleController = express.Router();
const Role = require('../models/user.model')

roleController.get('/', (req, res) => {
    Role.find().then(roles => {
        res.status(200).json({roles});
    });
});

module.exports = roleController
