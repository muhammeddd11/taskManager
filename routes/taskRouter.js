// define variables and require modules
const taskController = require('./../controllers/taskController');
const express = require('express');
const authController = require('./../controllers/authController')
// define the router that match routes to handler function
const router = express.Router();

//match the requests to specific route to controller functions

router.route('/')
    .get(taskController.getTasks)
    .post(authController.protect, authController.restrictedTo('user'), taskController.createTask)

router.route('/:id')
    .get(taskController.getTask)
    .delete(taskController.deleteTask)
    .patch(authController.protect, authController.restrictedTo('user'), taskController.updateTask)

module.exports = router