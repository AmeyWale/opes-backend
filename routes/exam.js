import express from 'express'; // ES6 import syntax
import { isAuthenticated, isTeacher } from '../middleware/authMiddleware.js'; // Named imports
import { createExam, getExamByAssessmentId, getAllExams, updateExam, deleteExam, submitExamResponse } from '../controllers/examController.js'; // Named imports
import validateExam from '../middleware/validateExam.js'; // Default import for middleware

const router = express.Router(); // Instantiate the router

// Define routes with appropriate middleware and controllers
router.post('/create', isAuthenticated, isTeacher, validateExam, createExam);
router.get('/:assessmentId', isAuthenticated, getExamByAssessmentId);
router.get('/', isAuthenticated, getAllExams);
router.put('/:assessmentId', isAuthenticated, isTeacher, validateExam, updateExam);
router.delete('/:assessmentId', isAuthenticated, isTeacher, deleteExam);
router.post('/:assessmentId/submit', isAuthenticated, submitExamResponse);

// Export router using ES6 module syntax
export default router; // Default export
