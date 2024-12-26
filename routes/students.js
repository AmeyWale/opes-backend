import express from "express";
import * as studentController from '../controllers/studentController.js';
import validateStudent from '../middlewares/validateStudent.js';

const StudentRouter = express.Router();

StudentRouter.post('/register', validateStudent, studentController.registerStudent);

StudentRouter.get('/', studentController.getAllStudents);

StudentRouter.get('/:id', studentController.getStudentById);

StudentRouter.put('/:id', validateStudent, studentController.updateStudent);

export default StudentRouter;
