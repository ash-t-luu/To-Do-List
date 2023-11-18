const express = require('express');
const Router = express.Router();

const crudController = require("../controllers/crudControllers");
const authenticationController = require('../controllers/authenticationController');

Router.get('/tasks', crudController.getTask, (req, res) => {
    return res.status(200).json(res.locals.tasks);
});

Router.post('/addTask', crudController.addTask, (req, res) => {
    return res.status(200).json(res.locals.addTask);
});

Router.patch('/editTask/:taskId', crudController.updateTask, (req, res) => {
    return res.status(200).json(res.locals.addTask);
});

Router.delete('/deleteTask/:taskId', crudController.deleteTask);

module.exports = Router;