const express = require('express')

const roleController = express.Router();
const Role = require('../models/role.model')

roleController.get('/', (req, res) => {
    Role.find().then(roles => {
        console.log(roles)
        res.status(200).json({roles});
    });
});

module.exports = roleController
