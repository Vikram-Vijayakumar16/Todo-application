const db = require('../models/db');
const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'drvikram19@gmail.com',
//     pass: 'bjoaxwhifkrxtwij',
//   },
// });

// const sendReminderEmail = (to, subject, text) => {
//   const mailOptions = {
//     from: 'drvikram19@gmail.com',
//     to,
//     subject,
//     text,
//   };

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

async function checkTaskDeadlines(userId) {
  try {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');

    const formattedCurrentTime = `${hours}:${minutes}`;

    db.query('SELECT * FROM tasks WHERE userid = ? AND deadline = ?', [userId, formattedCurrentTime], async (err, task) => {
      for (const task1 of task) {
        console.log('Task deadlines approaching:', task1);

        db.query('SELECT email FROM users WHERE id = ?', [task1.userid], async (err, em) => {
          const userEmail = em[0].email; 
          sendReminderEmail(userEmail, 'Task Reminder', `Task deadline for "${task1.title}" is approaching.`);
        });
      }
    });
  } catch (err) {
    console.error('Error checking task deadlines:', err);
  }
}

module.exports = { checkTaskDeadlines };
