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
    
})

module.exports = appConfigController
