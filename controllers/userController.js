// Import necessary modules and libraries
const bcrypt = require('bcrypt');
const db = require('../models/db');
const schedule = require('node-schedule');
const { checkTaskDeadlines } = require('../controllers/taskUtils');

// Exported module containing various authentication and user-related functions
module.exports = {

  // Function to handle user sign-in
  async signin(req, res) {
    const { name, password } = req.body;

    try {
      // Query the database to retrieve user information based on the provided username
      db.query('SELECT * FROM users WHERE name = ?', [name], async (err, user) => {
        if (user.length > 0) {
          // Check if the entered password matches the hashed password stored in the database
          const passwordMatch = await bcrypt.compare(password, user[0].password);

          if (passwordMatch) {
            // Set user session variables and schedule a job to check task deadlines
            req.session.userId = user[0].id;
            req.session.userName = user[0].name;

            schedule.scheduleJob('* * * * *', async () => { // Run every minute
              await checkTaskDeadlines(user[0].id);
            });

            // Redirect the user to the home page upon successful sign-in
            return res.redirect('/home');
          }
        }
        // Return an error message if sign-in fails
        const errMsg = "Enter the valid username or password ";
        return res.status(404).render('signin', { errorMsg: errMsg });
      });
    } catch (err) {
      // Handle potential errors and return an internal server error message
      //console.error(err);
      return res.status(500).render('signin', { errorMsg: 'Internal Server error' });
    }
  },

  // Function to handle user sign-out
  async signout(req, res) {
    try {
      // Destroy user session and redirect to the main page
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          return res.json({ msg: 'Internal Server Error' });
        }

        res.redirect('/');
      });
    } catch (err) {
      console.error(err);
      return res.json({ msg: 'Internal Server Error' });
    }
  },

  // Function to handle user registration
  async signup(req, res) {
    const { name, email, password } = req.body;

    try {
      // Generate a hash value for the password and store it in the database
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
      // Redirect the user to the main page upon successful registration
      return res.redirect('/');
    } catch (err) {
      // Handle potential errors and return an internal server error message
      console.error(err);
      return res.json({ msg: 'Internal Server Error' });
    }
  },

  // Function to handle updating user password
  async updatePassword(req, res) {
    const { OldPassword, NewPassword } = req.body;
    const userid = req.session.userId;

    try {
      // Retrieve user information based on the user ID
      const user = await db.query('SELECT * FROM users WHERE id = ?', [userid]);

      if (user.length === 0) {
        return res.status(404).json({ msg: 'Wrong user id' });
      }

      // Retrieve the current password from the database
      db.query('SELECT password FROM users WHERE id = ?', [userid], async (err, psswd) => {
        // Compare the new password with the old password
        const passwordMatch = await bcrypt.compare(OldPassword, psswd[0].password);

        if (passwordMatch) {
          // Update the password in the database if the old password is correct
          const hashedPassword = await bcrypt.hash(NewPassword, 10);
          await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userid]);
          return res.status(200).json({ msg: 'Password updated successfully' });
        } else {
          return res.json({ msg: "Old password is incorrect" });
        }
      });

    } catch (err) {
      // Handle potential errors and return an internal server error message
      console.error(err);
      return res.json({ msg: 'Internal Server Error' });
    }
  },

  // Function to render user profile
  profile: (req, res) => {
    const userid = req.session.userId;

    // Retrieve user information based on the user ID
    db.query('SELECT * FROM users WHERE id = ?', [userid], (err, userResult) => {
      if (err) throw err;

      if (userResult.length === 0) {
        return res.json({ msg: 'User id does not exist' });
      }

      // Render the user profile page with the retrieved user information
      res.render('profile', { account: userResult });
    });
  },

  // Function to handle updating username
  async updateUsername(req, res) {
    try {
      const { name } = req.body;
      const userid = req.session.userId;

      // Retrieve user information based on the user ID
      const userResult = await db.query('SELECT * FROM users WHERE id = ?', [userid]);

      if (userResult.length === 0) {
        return res.json({ msg: 'Wrong user id' });
      }

      // Update the username in the database
      await db.query('UPDATE users SET name = ? WHERE id = ?', [name, userid]);

      // Return a success message upon successful update
      res.status(200).json({ msg: 'Username updated successfully' });
    } catch (err) {
      // Handle potential errors and return an internal server error message
      console.error(err);
      res.json({ msg: 'Internal Server Error' });
    }
  },

  // Function to handle updating user email
  async updateEmail(req, res) {
    try {
      const { email } = req.body;
      const userid = req.session.userId;

      // Retrieve user information based on the user ID
      const userResult = await db.query('SELECT * FROM users WHERE id = ?', [userid]);

      if (userResult.length ===0) {
        return res.json({ msg: 'Wrong user id' });
      }

      // Update the email in the database
      await db.query('UPDATE users SET email = ? WHERE id = ?', [email, userid]);

      // Return a success message upon successful update
      res.status(200).json({ msg: 'Email updated successfully' });
    } catch (err) {
      // Handle potential errors and return an internal server error message
      console.error(err);
      res.json({ msg: 'Internal Server Error' });
    }
  },
};
