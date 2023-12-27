// Import the express module
const express = require('express');

// Create an instance of the express Router
const router = express.Router();

// Import the todoController module
const todoController = require('../controllers/todoController');

// Route to handle the creation of a new todo item
router.post('/todos/create', todoController.createTodo);

// Route to list all todo items
router.get('/todos/list', todoController.listTodos);

// Route to update the status of a todo item
router.post('/todos/update', todoController.updateTodo);

// Route to get the update page for a specific todo item
router.get('/todos/update/:title', todoController.getUpdateTodoPage);

// Export the router for use in the main application
module.exports = router;
