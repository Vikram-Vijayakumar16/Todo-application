// import required modules

const db = require('../models/db');
const nodemailer = require('nodemailer');

// Use the below code to notify via gmail

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'drvikram19@gmail.com',
//     pass: '*************',
//   },
// });

// const sendReminderEmail = (to, subject, text) => {
//   const mailOptions = {
//     from: 'drvikram19@gmail.com',
//     to,
//     subject,
//     text,
//   };


// Create nodemailer transporter with ethereal email

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'broderick.donnelly49@ethereal.email',
        pass: 'Bf6BpRxKQGFZzAAg9W'
    }
  });
  
  // Function to send the remainder email
  const sendReminderEmail = (to, subject, text) => {
    const mailOptions = {
      from: 'smtp.ethereal.email',
      to,
      subject,
      text,
    };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Function to check task deadlines for a given user ID
async function checkTaskDeadlines(userId) {
  try {
    // Get current time
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');

    const formattedCurrentTime = `${hours}:${minutes}`;

    // Query the database for email id 
    db.query('SELECT email FROM users WHERE id = ?', [userId], async (err, em) => {
      const userEmail = em[0].email; 

      // Query the database for tasks with approaching deadlines
      db.query('SELECT * FROM tasks WHERE userid = ? AND deadline = ?', [userId, formattedCurrentTime], async (err, task) => {
        for (const task1 of task) {
          console.log('Task deadlines approaching:', task1);
          sendReminderEmail(userEmail, 'Task Reminder', `Task deadline for "${task1.title}" is approaching.`);
        }
      });
    });
  } catch (err) {
    console.error('Error checking task deadlines:', err);
  }
}

// Export the modules
module.exports = { checkTaskDeadlines };
