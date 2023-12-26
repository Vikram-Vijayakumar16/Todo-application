
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const requireLogin = require('./middleware/authMiddleware');

const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');

app.use(session({
  secret: 'tariv-ilhok',
  resave: false,
  saveUninitialized: true,
}));

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

app.use(['/home','/todos/create','/todos/list','/todos/update',
        '/users/update/name','/users/update/email','/users/update/password'], requireLogin);

app.use('/', userRoutes);
app.use('/', todoRoutes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
