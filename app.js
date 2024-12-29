import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createError from 'http-errors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';


import studentRouter from './routes/students.js';
import TeacherRouter from './routes/teacher.js';

dotenv.config();

// Initialize the application
const app = express();

// Connect to the database
connectDB();

// View engine setup
// app.set('views', path.join(path.resolve(), 'views'));
// app.set('view engine', 'jade');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));

// Routes
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/students', studentRouter);
app.use('/api/teachers', TeacherRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500).json({message: err.message || 'An unexpected error occurred.',});
  // res.render('error');
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
