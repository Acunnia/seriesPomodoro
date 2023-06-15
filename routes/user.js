const express = require('express')
const userController = express.Router();
const User = require('../models/user.model')
const Role = require('../models/role.model')
const bcrypt = require("bcrypt");

userController.get('/', (req, res) => {
    User.find().populate('role').then(users => {
        res.status(200).json({users});
    });
});

userController.post('/register', (req, res) => {
    const {username, email, pass} = req.body
    if (User.findOne({email})){
        return res.status(400).json({message: "User already exists"})
    }

    const role = Role.findOne({admin_level:1})
    const newUser = new User({username, email, pass, admin_level: role._id})

    bcrypt.genSalt(10, (genErr, salt) => {
        if (genErr) throw genErr
        bcrypt.hash(newUser.pass, salt, (hastErr, hash) => {
            newUser.pass = hash
            newUser.save().then(user => res.status(200).json({message: 'User created'}))
                .catch(err => res.status(400).json({message: 'Error on user creation', err}))
        })
    })

})

module.exports = userController
