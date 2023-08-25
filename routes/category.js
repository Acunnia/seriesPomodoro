const express = require('express')
const categoryController = express.Router();
const Category = require('../models/category.model')
const Topic = require("../models/topic.model");
const Subcategory = require('../models/subcategory.model');

// [/api/categories] /
// get all categories raw
categoryController.get('/', (req, res) => {
    Category.find().populate('subcategories').then(categories => {
        res.status(200).json({ categories });
    });
});


categoryController.post('/create', (req, res) => {
    const { name, description, image } = req.body

    const newCat = new Category({ name, description, image })

    newCat.save()
        .then(savedCat => res.status(200).json({ cat: savedCat }))
        .catch(saveErr => res.status(400).json({ msg: 'Failed creating category.', err: saveErr }))
})

// [/api/categories] /topics
// get all topics and subcategories from a category limited by 10
categoryController.get('/topics', async (req, res) => {
    try {
        const { page = 1, limit = 10, id = null } = req.query;

        if (!id) {
            return res.status(400).json({ msg: 'No id provided.' });
        }

        const result = { currentPage: page };

        // Buscar la categoría por su ID y poblar sus subcategorías y temas relacionados
        const category = await Category.findById(id)
            .populate({
                path: 'subcategories',
                populate: {
                    path: 'topics',
                    options: {
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
                    },
                },
            });

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

        // Contar el número total de temas
        const count = await Topic.countDocuments({ _id: { $in: result.topics } });
        result.totalPages = Math.ceil(count / limit);

        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to get info of subcategory.', err });
    }
});

categoryController.delete('/delete/:categoryId', async (req, res) => {
    const catId = req.params.categoryId;

    try {
        const category = await Category.findById(catId);

        if (!category) {
            return res.status(404).json({ message: 'Caategory was not found' });
        }

        if (category.subcategories.length > 0) {
            return res.status(400).json({ message: 'Cannot delete: Subcategories already exists' });
        }

        await Category.deleteOne({ _id: catId });

        return res.json({ message: 'Category was deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Error trying to delete the category', error: error.message });
    }
});

categoryController.put('/edit/:categoryId', async (req, res) => {
    const catId = req.params.categoryId;
    const { name, description, image } = req.body;

    try {
        const category = await Category.findById(catId);

        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        category.name = name;
        category.description = description;
        category.image = image;

        const updatedCategory = await category.save();

        return res.json({ message: 'Categoría actualizada exitosamente', cat: updatedCategory });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar la categoría', error: error.message });
    }
});

module.exports = categoryController
