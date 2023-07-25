const express = require('express')
const categoryController = express.Router();
const Category = require('../models/category.model')
const Topic = require("../models/topic.model");
const Subcategory = require('../models/subcategory.model');


categoryController.get('/', (req, res) => {
    Category.find().then(categories => {
        res.status(200).json({categories});
    });
});

/*
categoryController.get('/:id', (req, res) => {
    Category.findById(req.params.id).then(category => {
        res.status(200).json({category});
    }).catch(errDB => res.status(404).json({msg: "Cant find category", errDB}))
});*/

categoryController.post('/create', (req, res) => {
    const {name} = req.body

    const newCat = new Category({ name })

    newCat.save()
        .then(savedCat => res.status(200).json({cat: savedCat}))
        .catch(saveErr => res.status(400).json({msg:'Failed creating category.', err: saveErr}))
})

// [/api/categories] /topics
// get all topics and subcategories from a category
categoryController.get('/topics', (req, res) => {
    const { page = 1, limit = 10, id = null } = req.query;
    const result = { currentPage: page };

    if (!id) {
        return res.status(400).json({ msg: 'No id.' });
    }

    Category.findById(id)
        .populate({
            path: 'subcategories',
            populate: {
                path: 'topics',
                options:{
                    limit,
                    skip: (page - 1) * limit,
                    sort: { updatedAt: -1 },
                },
                populate: {
                    path: 'lastreply',
                    select: '-message',
                    populate: {
                        path: 'author',
                        select: 'username',
                    },
                }
            }

        })
        .then(category  => {
            if (!category) {
                return res.status(404).json({ msg: 'Category not found.' });
            }

            result.topics = category.subcategories.reduce((topics, subcategory) => {
                if (subcategory.topics && subcategory.topics.length > 0) {
                    topics.push(...subcategory.topics);
                }
                return topics;
            }, []);

            result.name = category.name;
            result.description = category.description;
            result.subcategories = category.subcategories;

            return Topic.countDocuments({ _id: { $in: result.topics } });
        })
        .then(count => {
            result.totalPages = Math.ceil(count / limit);

            return res.status(200).json(result);
        })
        .catch(err =>{
            console.log(err)
                res.status(400).json({ msg: 'Failed to get info of subcategory.', err })
            }
        );
});


// todo: get all topics from a subcategory /api/subcategories/topics

module.exports = categoryController
