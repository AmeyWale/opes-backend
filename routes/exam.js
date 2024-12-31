import express from 'express'; // ES6 import syntax
// import { isAuthenticated, isTeacher } from '../middleware/authMiddleware.js'; // Named imports
import { isAuthenticated, isTeacher } from '../middlewares/authMiddleware.js';
import { createExam, getExamByAssessmentId, getAllExams, updateExam, deleteExam, submitExamResponse } from '../controllers/examController.js'; // Named imports
import validateExam from '../middlewares/validateExam.js';


const ExamRouter = express.Router(); // Instantiate the router

// Define routes with appropriate middleware and controllers
ExamRouter.post('/create', isAuthenticated, isTeacher, validateExam, createExam);
ExamRouter.get('/:assessmentId', getExamByAssessmentId);
ExamRouter.get('/', isAuthenticated, getAllExams);
ExamRouter.put('/:assessmentId', isAuthenticated, isTeacher, validateExam, updateExam);
ExamRouter.delete('/:assessmentId', isAuthenticated, isTeacher, deleteExam);
// ExamRouter.post('/:assessmentId/submit', isAuthenticated, submitExamResponse);


ExamRouter.post('/:assessmentId/submit', submitExamResponse);

// Export router using ES6 module syntax
export default ExamRouter; // Default export
