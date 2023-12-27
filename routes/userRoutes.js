// Import the express module
const express = require('express');

// Create an instance of the express Router
const router = express.Router();

// Import the userController module
const userController = require('../controllers/userController');

// Routes for user authentication and profile management
router.post('/signin', userController.signin);
router.post('/signup', userController.signup);
router.post('/users/update/name', userController.updateUsername);
router.post('/users/update/email', userController.updateEmail);
router.post('/users/update/password', userController.updatePassword);
router.get('/signout', userController.signout);
router.get('/profile', userController.profile);

// Routes for rendering various pages
router.get("/", (req, res) => res.render("signin", { errorMsg: null }));
router.get("/home", (req, res) => res.render("home"));
router.get("/signup", (req, res) => res.render("signup"));
router.get("/todos/create", (req, res) => res.render("create-todo"));
router.get("/todos/update", (req, res) => res.render("update-todo", { task: null }));
router.get("/users/update/name", (req, res) => res.render("update-user-name"));
router.get("/users/update/email", (req, res) => res.render("update-user-email"));
router.get("/users/update/password", (req, res) => res.render("update-user-password", { errorMsg: null }));

// Export the router for use in the main application
module.exports = router;
