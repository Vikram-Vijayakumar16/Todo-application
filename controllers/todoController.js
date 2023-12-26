const db = require('../models/db');

module.exports = {
  createTodo: (req, res) => {
    const { title, desc, dead } = req.body;
    const userid = req.session.userId;

    if (!userid || !title || !desc || !dead) {
      return res.json({ msg: 'Invalid input for creating a todo' });
    }

    db.query('SELECT * FROM users WHERE id = ?', [userid], (err, userResult) => {
      if (err) throw err;

      if (userResult.length === 0) {
        return res.json({ msg: 'Wrong user id' });
      }

      db.query('INSERT INTO tasks (userid, title, description, deadline) VALUES (?, ?, ?, ?)', [userid, title, desc, dead], (err, taskResult) => {
        if (err) throw err;
        res.status(201).json({ msg: 'Todo created successfully', todoId: taskResult.insertId });
      });
    });
  },

  listTodos: (req, res) => {
    const userid = req.session.userId;

    db.query('SELECT * FROM users WHERE id = ?', [userid], (err, userResult) => {
      if (err) throw err;

      if (userResult.length === 0) {
        return res.json({ msg: 'User id does not exist' });
      }

      db.query('SELECT * FROM tasks WHERE userid = ?', [userid], (err, result) => {
        if (err) throw err;
        res.render('list-todos', { todos: result });
      });
    });
  },
 
  updateTodo: (req, res) => {
    const { title, status } = req.body;
    const userid = req.session.userId;
  
    if (!userid || !title) {
      return res.status(400).json({ msg: 'Invalid input for updating task status' });
    }
  
    db.query('SELECT * FROM tasks WHERE userid = ? AND title = ?', [userid, title], (err, taskResult) => {
      if (err) throw err;
  
      if (taskResult.length === 0) {
        return res.json({ msg: 'Task not found' });
      }
  
      db.query('UPDATE tasks SET completed = ? WHERE userid = ? AND title = ?', [status, userid, title], (err, updateResult) => {
        if (err) throw err;
  
        if (status) {
          const { title, description, deadline } = taskResult[0];
  
          db.query('INSERT INTO completed_tasks (userid, title, description, deadline) VALUES (?, ?, ?, ?)', [userid, title, description, deadline], (err, insertResult) => {
            if (err) throw err;
  
            db.query('DELETE FROM tasks WHERE userid = ? AND title = ?', [userid, title], (err, deleteResult) => {
              if (err) throw err;
              res.status(200).json({
                success: true,
                msg: 'Successfully updated task status and removed from tasks',
                updateResult,
                deleteResult,
              });
            });
          });
        } else {
          res.json({ success: false, msg: 'Task updation failed', updateResult });
        }
      });
    });
  }, 

  getUpdateTodoPage: (req, res) => {
    const userid = req.session.userId;
    const taskId = req.params.title;

    if (!userid || !taskId) {
      return res.json({ msg: 'Invalid input for updating task status' });
    }

    db.query('SELECT * FROM tasks WHERE userid = ? AND title = ?', [userid, taskId], (err, taskResult) => {
      if (err) throw err;

      if (taskResult.length === 0) {
        return res.send('Task not found');
      }

      res.render('update-todo', { task: taskResult[0] });
    });
  }
}
