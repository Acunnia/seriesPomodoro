const express = require('express')
const subcategoryController = express.Router();
const Subcategory = require('../models/subcategory.model');



subcategoryController.get('/info', (req, res) => {
    const { sid } = req.query;
    Subcategory.findOne({ shortid: sid }, '-topics')
        .then(subcategory => {
            return res.status(200).json(subcategory);
        })
        .catch(err =>
            res.status(400).json({ msg: 'Failed to get info of subcategory', err })
        );
});


module.exports = subcategoryController
