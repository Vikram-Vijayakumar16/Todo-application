const session = require("express-session");

function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect('/');
    console.log("Please sign in to continue");
  }
}

module.exports = requireLogin;
