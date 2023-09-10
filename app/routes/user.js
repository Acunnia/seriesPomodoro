require('dotenv/config');
const express = require('express')
const userController = express.Router();
const User = require('../models/user.model')
const Role = require('../models/role.model')
const passport = require('passport');
const checkPermissionMiddleware = require('../utils/checkPermission');
const secret = '10';
const jwt = require('jsonwebtoken');

userController.get('/', (req, res) => {
    const response = {};
    User.find().populate({
        path: 'role',
        select: '_id name'
    }).select('-password').then(users => {
        response.users = users;
        Role.find().then(roles => { 
            response.roles = roles;
            res.status(200).json({ response });
        })

        
    });
});

userController.post('/register', (req, res) => {
    const {username, email, password} = req.body;

    User.findOne({ email })
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
                    role: role._id,
                });

                newUser
                    .save()
                    .then(savedUser => {
                        Role.findOne(savedUser.role._id).then(role => {
                            role.users.push(savedUser._id);
                            role.save().then(() => {
                                res.status(200).json({user: savedUser});
                            })
                        })
                    })
                    .catch(saveErr => {
                        res.status(400).json({msg: 'Failed to register user.', err: saveErr});
                    });
            })
            .catch(roleErr => {
                res.status(500).json({msg: 'Internal server error', err: roleErr});
            });
        })
        .catch(userErr => {
            res.status(500).json({msg: 'Internal server error', err: userErr});
        })

});

userController.post('/login', (req,res) => {
    const { email, password } = req.body;
    User.findOne({ email }, '+password').populate("role", "admin_level name").then(user => {
        if (!user) {
            return res.status(404).json({ msg: 'This user does not exists.' });
        }

        user.comparePassword(password.toString()).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user._id,
                    username: user.username,
                    admin_level: user.role.admin_level,
                };

                jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
                    if (err) {
                        res.status(500).json({ msg: 'Error signing token.', err });
                    }

                    res.status(200).json({
                        success: true,
                        token,
                        user: {
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            role: {
                                name: user.role.name,
                                admin_level: user.role.admin_level
                            }
                        },
                    });
                });
            } else {
                res.status(400).json({ msg: 'Password is incorrect.' });
            }
        });
    });
});

userController.get('/search/:name', (req, res) => {
    const name = req.params.name;

    User.findOne({ username: { $regex: new RegExp(name, 'i') } })
        .populate('role', 'name')
        .populate('replies')
        .populate('topics')
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const formattedRegisterDate = user.registerDate.toDateString();

            const result = {
                username: user.username,
                role: user.role ? user.role.name : null,
                bio: user.bio,
                registerDate: formattedRegisterDate,
                numReplies: user.replies.length,
                numTopics: user.topics.length,
            };

            return res.status(200).json(result);
        })
        .catch(error => {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        });
})

userController.put('/edit/:id', passport.authenticate('jwt', {session: false}), checkPermissionMiddleware("edit_user"), async (req, res) => {
    const userId = req.params.id
    const { username, email, role } = req.body
    try {
        const user = await User.findById(userId);
        const currentRole = await Role.findById(user.role);
        const newRole = await Role.findById(role)

        //Try to update user
        user.username = username;
        user.email = email;
        user.role = newRole._id;
        user.save();

        //Try to update role
        currentRole.users.remove(user._id);
        currentRole.save();

        newRole.users.push(user._id);
        newRole.save();

        res.status(200).json({message: 'Usuario actualizado correctamente'});
    
    } catch (error) {
        res.status(500).json({message: 'Error en el servidor'});
    }
})

module.exports = userController
