import express from 'express'; // ES6 import syntax
// import { isAuthenticated, isTeacher } from '../middleware/authMiddleware.js'; // Named imports
import { isAuthenticated, isTeacher } from '../middlewares/authMiddleware.js';
import { createExam, getExamByAssessmentId, getAllExams, updateExam, deleteExam, submitExamResponse,getExamAnalytics } from '../controllers/examController.js'; // Named imports
import validateExam from '../middlewares/validateExam.js'; // Default import for middleware

const examRouter = express.Router(); // Instantiate the router

// Define routes with appropriate middleware and controllers
examRouter.post('/create', isAuthenticated, isTeacher, validateExam, createExam);
examRouter.get('/:assessmentId', isAuthenticated, getExamByAssessmentId);
examRouter.get('/', isAuthenticated, getAllExams);
examRouter.get('/analytics/:assessmentId', getExamAnalytics)
examRouter.put('/:assessmentId', isAuthenticated, isTeacher, validateExam, updateExam);
examRouter.delete('/:assessmentId', isAuthenticated, isTeacher, deleteExam);
examRouter.post('/:assessmentId/submit', isAuthenticated, submitExamResponse);

// Export router using ES6 module syntax    
export default examRouter; // Default export
