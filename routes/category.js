const express = require('express')
const categoryController = express.Router();
const Category = require('../models/category.model')

categoryController.get('/', (req, res) => {
    Category.find().then(categories => {
        res.status(200).json({categories});
    });
});

categoryController.get('/:id', (req, res) => {
    Category.findById(req.params.id).then(category => {
        res.status(200).json({category});
    }).catch(errDB => res.status(404).json({msg: "Cant find category", errDB}))
});

categoryController.post('/create', (req, res) => {
    const {name} = req.body

    const newCat = new Category({ name })

    newCat.save()
        .then(savedCat => res.status(200).json({cat: savedCat}))
        .catch(saveErr => res.status(400).json({msg:'Failed creating category.', err: saveErr}))
})


module.exports = categoryController
