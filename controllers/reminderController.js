const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const db = require('../models/db');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'broderick.donnelly49@ethereal.email',
      pass: 'Bf6BpRxKQGFZzAAg9W'
  }
});

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


router.post('/startReminders', (req, res) => {
    const userId = req.session.userId;
  
    if (!userId) {
      return res.status(400).json({ msg: 'User not logged in' });
    }
  
    cron.schedule('* * * * *', async () => {
      try {
        const tasks = await db.query('SELECT * FROM tasks WHERE userid = ?', [userId]);
        const currentTime = new Date();
  
        for (const task of tasks) {
          const deadlineTime = new Date(task.deadline);
  
          if (deadlineTime.getTime() === currentTime.getTime()) {
            const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
            const userEmail = user[0].email;
  
            sendReminderEmail(userEmail, 'Task Reminder', `Task deadline for "${task.title}" is approaching.`);
          }
        }
      } catch (error) {
        console.error('Error checking deadlines:', error);
      }
    });
  
    res.status(200).json({ msg: 'Reminder service started successfully' });
  });

  module.exports = router;
