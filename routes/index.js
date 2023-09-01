const userController = require('./user');
const categoryController = require('./category');
const subcategoryController = require('./subcategory')
const topicController = require('./topic')
const replyController = require('./reply')
const statsController = require('./stats');

module.exports = {
    userController,
    categoryController,
    subcategoryController,
    topicController,
    replyController,
    statsController
};
