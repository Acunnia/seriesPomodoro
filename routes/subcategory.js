const express = require('express')
const subcategoryController = express.Router();
const Subcategory = require('../models/subcategory.model');
const Topic = require("../models/topic.model");



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

subcategoryController.get('/topics', async (req, res) => {
    try {
        const { page = 1, limit = 10, id = null } = req.query;
        // Validar que id exista
        if (!id) {
            return res.status(400).json({ msg: 'No id provided.' });
        }
        const result = { currentPage: page };

        // Buscar la subcategoría por su ID y poblar temas relacionados
        const subcategory = await Subcategory.findById(id)
            .populate({
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
            });

        if (!subcategory) {
            return res.status(404).json({ msg: 'Subcategory not found.' });
        }

        result.topics = subcategory.topics.reduce((topics, topic) => {
            topics.push(topic);
            return topics;
        }, []);

        result.name = subcategory.name;

        // Contar el número total de temas
        const count = await Topic.countDocuments({ _id: { $in: result.topics } });
        result.totalPages = Math.ceil(count / limit);

        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to get info of subcategory.', err });
    }
});



module.exports = subcategoryController
