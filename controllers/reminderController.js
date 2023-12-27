// Import the express module
const express = require('express');

// Create an instance of the express Router
const router = express.Router();

// Import nodemailer for sending emails and node-cron for scheduling reminders
const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Import the database connection module
const db = require('../models/db');

// Create a nodemailer transporter with Ethereal email credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'broderick.donnelly49@ethereal.email',
    pass: 'Bf6BpRxKQGFZzAAg9W'
  }
});

// Function to send a reminder email
const sendReminderEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'smtp.ethereal.email',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Route to start the reminder service
router.post('/startReminders', (req, res) => {
  const userId = req.session.userId;

  // Check if the user is logged in
  if (!userId) {
    return res.status(400).json({ msg: 'User not logged in' });
  }

  // Schedule a cron job to check task deadlines every minute
  cron.schedule('* * * * *', async () => {
    try {
      // Query the database to get tasks for the user
      const tasks = await db.query('SELECT * FROM tasks WHERE userid = ?', [userId]);
      const currentTime = new Date();

      // Loop through tasks to check for approaching deadlines
      for (const task of tasks) {
        const deadlineTime = new Date(task.deadline);

        if (deadlineTime.getTime() === currentTime.getTime()) {
          // If the deadline is approaching, get user email and send a reminder email
          const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
          const userEmail = user[0].email;

          sendReminderEmail(userEmail, 'Task Reminder', `Task deadline for "${task.title}" is approaching.`);
        }
      }
    } catch (error) {
      console.error('Error checking deadlines:', error);
    }
  });

  // Respond with a success message
  res.status(200).json({ msg: 'Reminder service started successfully' });
});

// Export the router for use in the main application
module.exports = router;
