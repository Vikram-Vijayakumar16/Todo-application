// Import the express module
const express = require('express');

// Create an instance of the express application
const app = express();

// Set the port number for the server
const port = 3000;

// Import necessary middleware modules
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');

// Import the custom middleware for user authentication
const requireLogin = require('./middleware/authMiddleware');

// Import the user and todo routes
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');

// Configure session middleware
app.use(session({
  secret: 'tariv-ilhok',
  resave: false,
  saveUninitialized: true,
  name: 'Vikram',
  cookie: { maxAge: null, secure: false },
}));

// Use method-override middleware for handling HTTP methods other than GET and POST
app.use(methodOverride('_method'));

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set the 'views' directory for storing EJS view templates
app.set('views', path.join(__dirname, 'views'));

// Apply requireLogin middleware to certain routes
app.use(['/home', '/todos/create', '/todos/list', '/todos/update',
         '/users/update/name', '/users/update/email', '/users/update/password'], requireLogin);

// Use the user and todo routes
app.use('/', userRoutes);
app.use('/', todoRoutes);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
