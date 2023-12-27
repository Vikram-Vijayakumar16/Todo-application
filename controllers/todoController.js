// Import the required modules
const db = require('../models/db');

// Exported module containing functions related to task management
module.exports = {

  // Function to create a new task for the user
  createTodo: (req, res) => {

    // Get the new task details from the form
    const { title, desc, dead } = req.body;
    const userid = req.session.userId;

    // Check for valid input parameters
    if (!userid || !title || !desc || !dead) {
      return res.json({ msg: 'Invalid input for creating a todo' });
    }

    // Query the database for verifying the existence of the user ID
    db.query('SELECT * FROM users WHERE id = ?', [userid], (err, userResult) => {
      if (err) throw err;

      if (userResult.length === 0) {
        return res.json({ msg: 'Wrong user id' });
      }

      // Query the database to insert the new task into the task table
      db.query('INSERT INTO tasks (userid, title, description, deadline) VALUES (?, ?, ?, ?)', [userid, title, desc, dead], (err, taskResult) => {
        if (err) throw err;
        res.status(201).json({ msg: 'Todo created successfully', todoId: taskResult.insertId });
      });
    });
  },

  // Function to list all the pending tasks of the user
  listTodos: (req, res) => {
    const userid = req.session.userId;

    // Query the database for the existence of the user ID
    db.query('SELECT * FROM users WHERE id = ?', [userid], (err, userResult) => {
      if (err) throw err;

      if (userResult.length === 0) {
        return res.json({ msg: 'User id does not exist' });
      }

      // Query the database to retrieve all the incomplete tasks of the user
      db.query('SELECT * FROM tasks WHERE userid = ?', [userid], (err, result) => {
        if (err) throw err;

        // Display all the retrieved task details using the list-todos EJS file
        res.render('list-todos', { todos: result });
      });
    });
  },
 
  // Function to update the completion status of the incomplete task
  updateTodo: (req, res) => {
    const { title, status } = req.body;
    const userid = req.session.userId;
  
    // Check for valid input parameters
    if (!userid || !title) {
      return res.status(400).json({ msg: 'Invalid input for updating task status' });
    }
  
    db.query('SELECT * FROM tasks WHERE userid = ? AND title = ?', [userid, title], (err, taskResult) => {
      if (err) throw err;
  
      if (taskResult.length === 0) {
        return res.json({ msg: 'Task not found' });
      }
  
      // Query the database to update the completion status of the particular task
      db.query('UPDATE tasks SET completed = ? WHERE userid = ? AND title = ?', [status, userid, title], (err, updateResult) => {
        if (err) throw err;
  
        if (status) {
          const { title, description, deadline } = taskResult[0];
  
          // Query the database to insert all the completed task into the completed table
          db.query('INSERT INTO completed_tasks (userid, title, description, deadline) VALUES (?, ?, ?, ?)', [userid, title, description, deadline], (err, insertResult) => {
            if (err) throw err;
  
            // Delete all the completed task from the assigned table
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

  // Function to assign the task name which needs to be updated directly to the form
  getUpdateTodoPage: (req, res) => {
    const userid = req.session.userId;
  
    // Get the taskId by using the task title from the request body 
    const taskId = req.params.title;

    // Check for valid input parameters
    if (!userid || !taskId) {
      return res.json({ msg: 'Invalid input for updating task status' });
    }

    // Query the database to get the task details
    db.query('SELECT * FROM tasks WHERE userid = ? AND title = ?', [userid, taskId], (err, taskResult) => {
      if (err) throw err;

      if (taskResult.length === 0) {
        return res.send('Task not found');
      }

      // Render the update-todo EJS file with the retrieved task details
      res.render('update-todo', { task: taskResult[0] });
    });
  }
};
