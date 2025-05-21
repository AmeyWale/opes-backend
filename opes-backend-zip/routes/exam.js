import express from 'express'; // ES6 import syntax
// import { isAuthenticated, isTeacher } from '../middleware/authMiddleware.js'; // Named imports
import { isAuthenticated, isTeacher } from '../middlewares/authMiddleware.js';
import { createExam, getExamByAssessmentId, getAllExams, updateExam, deleteExam, submitExamResponse,getExamAnalytics } from '../controllers/examController.js'; // Named imports
import validateExam, {validateUpdateExam} from '../middlewares/validateExam.js'; // Default import for middleware

const examRouter = express.Router(); // Instantiate the router

// Define routes with appropriate middleware and controllers
examRouter.post('/create', isAuthenticated, isTeacher, validateExam, createExam);
examRouter.get('/:assessmentId', getExamByAssessmentId);
examRouter.get('/', isAuthenticated, getAllExams);
examRouter.get('/analytics/:assessmentId', isAuthenticated,isTeacher, getExamAnalytics)
examRouter.put('/:assessmentId', isAuthenticated, isTeacher, validateUpdateExam, updateExam);
examRouter.delete('/:examId', isAuthenticated, isTeacher, deleteExam);
examRouter.post('/:assessmentId/submit', isAuthenticated, submitExamResponse);

// Export router using ES6 module syntax    
export default examRouter; // Default export
