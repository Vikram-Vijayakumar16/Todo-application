// Importing the express-session module
const session = require("express-session");

// Middleware function to require user login
function requireLogin(req, res, next) {
  // Check if there is an active session and a user ID exists in the session
  if (req.session && req.session.userId) {
    // If user is logged in, proceed to the next middleware or route handler
    next();
  } else {
    // If user is not logged in, redirect to the home page and log a message
    res.redirect('/');
    console.log("Please sign in to continue");
  }
}

// Export the middleware function for use in other parts of the application
module.exports = requireLogin;
