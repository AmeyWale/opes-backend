import express from 'express';
import { registerTeacher, loginTeacher, getExamsByLoggedInTeacher, getExamByAssessmentId } from '../controllers/teacherController.js';
import { isAuthenticated, isTeacher } from '../middlewares/authMiddleware.js';
import validateTeacher from '../middlewares/validateTeacher.js';
import loginLimiter from '../middlewares/loginLimiter.js';

const TeacherRouter = express.Router();

// Register teacher
TeacherRouter.post('/register',validateTeacher, registerTeacher);

// Login teacher
TeacherRouter.post('/login',loginLimiter, loginTeacher);

// Get all exams created by the logged-in teacher
TeacherRouter.get('/exams', isAuthenticated, isTeacher, getExamsByLoggedInTeacher);

TeacherRouter.get('/exams/:assessmentId', isAuthenticated, isTeacher, getExamByAssessmentId);

export default TeacherRouter;
