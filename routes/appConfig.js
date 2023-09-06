const express = require('express')

const appConfigController = express.Router();
const AppConfig = require('../models/app-config.model');
const passport = require('passport');

appConfigController.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    AppConfig.findOne().then(config => {
        res.status(200).json(config);
    })
});

appConfigController.get('/info', (req, res) => {
    AppConfig.find({}, "motd banner").then(config => {
        res.status(200).json(config);
    })
});

appConfigController.put('/edit', passport.authenticate('jwt', {session: false}), (req, res) => {
    const values = req.body.values;
    try {
        AppConfig.findOneAndUpdate({},values).then(() => {
            res.status(200).json({msg: "Updated"})
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to get info of subcategory.', err });
    }}
)

module.exports = appConfigController
