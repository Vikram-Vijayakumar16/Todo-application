// Import the mysql module
const mysql = require('mysql');

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',    
  user: 'root',         
  password: '',         
  database: 'todo',     
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Export the MySQL database connection for use in other parts of the application
module.exports = db;
