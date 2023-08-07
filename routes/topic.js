const express = require('express')
const passport = require('passport');

const topicController = express.Router();
const Topic = require('../models/topic.model');
const Reply = require('../models/reply.model');
const User = require('../models/user.model');
const Subcategory = require("../models/subcategory.model");

topicController.get('/',async (req, res) => {
    try {
        const { page = 1, limit = 10, id = null } = req.query;

        const result = { currentPage: page };

        const foundTopic = await Topic.findById(id)
            .populate({
                path: 'author',
                select: 'username',
            })
            .populate({
            path: 'replies',
            populate: {
                path: 'author',
                select: 'username',
            },
        })

        if (!foundTopic) {
            return res.status(404).json({ msg: 'Topic not found.' });
        }
        console.log("solicita id", id)
        result.topic = foundTopic
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to get info of topic.', err });
    }
})


topicController.post('/create', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { title, message, author, subcategory, description } = req.body;

    // Verificar si la subcategoría existe
    Subcategory.findById(subcategory)
        .then(existingSubcategory => {
            if (!existingSubcategory) {
                return res.status(404).json({ error: 'La subcategoría no existe' });
            }

            // Crear un nuevo tema
            const newTopic = new Topic({
                title,
                description,
                category: existingSubcategory.category,
                author,
            });

            // Guardar el tema en la base de datos
            return newTopic.save()
                .then(savedTopic => {
                    // Crear una nueva respuesta para el tema
                    const newReply = new Reply({
                        message,
                        author,
                        topic: savedTopic._id,
                    });

                    // Guardar la respuesta en la base de datos
                    return newReply.save()
                        .then(savedReply => {
                            // Actualizar la referencia al último tema y última respuesta en la subcategoría
                            existingSubcategory.lastreply = savedReply._id;
                            existingSubcategory.topics.push(savedTopic._id);
                            savedTopic.replies.push(savedReply._id);
                            savedTopic.lastreply = savedReply._id;
                            savedTopic.save();
                            return existingSubcategory.save()
                                .then(() => {
                                    // Actualizar las referencias al último tema y última respuesta en el autor del tema
                                    return User.findById(author)
                                        .then(topicAuthor => {
                                            topicAuthor.lastreply = savedReply._id;
                                            topicAuthor.topics.push(savedTopic._id);
                                            return topicAuthor.save();
                                        });
                                });
                        })
                        .then(() => {
                            res.status(201).json({ message: 'Tema creado exitosamente', topic: savedTopic });
                        });
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el tema' });
        });
})

module.exports = topicController
