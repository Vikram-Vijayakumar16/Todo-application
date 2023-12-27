
const bcrypt = require('bcrypt');
const db = require('../models/db');
const schedule = require('node-schedule');
const { checkTaskDeadlines } = require('../controllers/taskUtils');


module.exports = {

  async signin(req, res) {
    const { name, password } = req.body;

    try {
      db.query('SELECT * FROM users WHERE name = ?', [name], async (err, user) => {
        if (user.length > 0) {
          const passwordMatch = await bcrypt.compare(password, user[0].password);

          if (passwordMatch) {
            req.session.userId = user[0].id;
            req.session.userName = user[0].name;
            
            schedule.scheduleJob('* * * * *', async () => { // Run every minute
              await checkTaskDeadlines(user[0].id);
            });
            return res.redirect('/home');
          }
        }
        const errMsg = "Enter the valid username or password ";
        return res.status(404).render('signin', { errorMsg: errMsg });
      });
    } catch (err) {
      //console.error(err);
      return res.status(500).render('signin', { errorMsg: 'Internal Server error' });
    }
  },

  async signout(req, res) {
    try {
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

  async signup(req, res) {
    const { name, email, password } = req.body;

    try {
      //Generate the  hash value for the password and store it in the database
      const hashedPassword = await bcrypt.hash(password, 10); 
      await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
      return res.redirect('/');
    } catch (err) {
      console.error(err);
      return res.json({ msg: 'Internal Server Error' });
    }
  },

  async updatePassword(req, res) {
    const {OldPassword, NewPassword} = req.body;
    const userid = req.session.userId;

    try {
        const user = await db.query('SELECT * FROM users WHERE id = ?', [userid]);

        if (user.length === 0) {
          return res.status(404).json({ msg: 'Wrong user id' });
        }

         db.query('SELECT password FROM users WHERE id = ?', [userid], async (err, psswd) => {
            //compare the new password with the old password
            const passwordMatch = await bcrypt.compare(OldPassword, psswd[0].password);

            if(passwordMatch){
              const hashedPassword = await bcrypt.hash(NewPassword, 10);
              await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userid]);
              return res.status(200).json({ msg: 'Password updated successfully' });
            
            }else{
              return res.json({msg: "Old password is incorrect"})
            }
        });

    } catch (err) {
      console.error(err);
      return res.json({ msg: 'Internal Server Error' });
    }
  },

  profile: (req, res) => {
    const userid = req.session.userId;

    db.query('SELECT * FROM users WHERE id = ?', [userid], (err, userResult) => {
      if (err) throw err;

      if (userResult.length === 0) {
        return res.json({ msg: 'User id does not exist' });
      }

        res.render('profile', { account: userResult });
      
    });
  },

  async updateUsername(req, res) {
    try {
      const { name } = req.body;
      const userid = req.session.userId;

      const userResult = await db.query('SELECT * FROM users WHERE id = ?', [userid]);

      if (userResult.length === 0) {
        return res.json({ msg: 'Wrong user id' });
      }

      await db.query('UPDATE users SET name = ? WHERE id = ?', [name, userid]);

      res.status(200).json({ msg: 'Username updated successfully' });
    } catch (err) {
      console.error(err);
      res.json({ msg: 'Internal Server Error' });
    }
  },
  
  async updateEmail(req, res) {
    try {
      const { email } = req.body;
      const userid = req.session.userId;

      const userResult = await db.query('SELECT * FROM users WHERE id = ?', [userid]);

      if (userResult.length === 0) {
        return res.json({ msg: 'Wrong user id' });
      }

      await db.query('UPDATE users SET email = ? WHERE id = ?', [email, userid]);

      res.status(200).json({ msg: 'Email updated successfully' });
    } catch (err) {
      console.error(err);
      res.json({ msg: 'Internal Server Error' });
    }
  },
};
