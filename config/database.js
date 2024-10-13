//for using mongoDB
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;


//for using the mysql
const mysql = require('mysql2/promise');

const connectMysqlDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,    // e.g., 'localhost'
      user: process.env.DB_USER,    // your database username
      password: process.env.DB_PASSWORD, // your database password
      database: process.env.DB_NAME  // your database name
    });
    
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectMysqlDB;

