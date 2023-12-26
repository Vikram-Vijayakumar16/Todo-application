
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.post('/todos/create', todoController.createTodo);
// router.get('/todos/list', todoController.listTodos);
// router.get("/todos/list", (req, res) => res.render("list-todos"));
router.get('/todos/list', todoController.listTodos);
router.post('/todos/update', todoController.updateTodo);
router.get('/todos/update/:title', todoController.getUpdateTodoPage);

module.exports = router;
