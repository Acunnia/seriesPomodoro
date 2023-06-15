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
    const {username, email, password} = req.body;

    User.findOne({email})
        .then(user => {
            if (user) {
                return res.status(400).json({msg: 'Email already in use.'});
            }
        Role.findOne({admin_level: 1})
            .then(role => {
                const newUser = new User({
                    username,
                    email,
                    password,
                    admin_level: role._id,
                });

                bcrypt.genSalt(10, (genErr, salt) => {
                    if (genErr) {
                        throw genErr;
                    }

                    bcrypt.hash(newUser.password, salt, (hashErr, hash) => {
                        if (hashErr) {
                            throw hashErr;
                        }

                        newUser.password = hash;
                        newUser
                            .save()
                            .then(savedUser => {
                                // Se completa la lógica adicional después de guardar el usuario
                                // ...
                                res.status(200).json({user: savedUser});
                            })
                            .catch(saveErr => {
                                // Manejo de error al guardar el usuario
                                // ...
                                res.status(400).json({msg: 'Failed to register user.', err: saveErr});
                            });
                    });
                });
            })
            .catch(roleErr => {
                // Manejo de error al buscar el rol
                // ...
                res.status(500).json({msg: 'Internal server error', err: roleErr});
            });
        })
        .catch(userErr => {
            // Manejo de error al buscar el usuario existente
            // ...
            res.status(500).json({msg: 'Internal server error', err: userErr});
        })

});

module.exports = userController
