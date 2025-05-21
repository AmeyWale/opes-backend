import express from "express";
import * as studentController from '../controllers/studentController.js';
import validateStudent from '../middlewares/validateStudent.js';
import validateTimeFrameForExam from "../middlewares/validateTimeFrameForExam.js";

const StudentRouter = express.Router();

StudentRouter.post('/register', validateStudent, validateTimeFrameForExam, studentController.registerStudent);

StudentRouter.get('/', studentController.getAllStudents);

StudentRouter.get('/:id', studentController.getStudentById);

StudentRouter.get('/:studentId/details', studentController.getStudentExamDetails);

StudentRouter.put('/:id', validateStudent, studentController.updateStudent);

export default StudentRouter;
