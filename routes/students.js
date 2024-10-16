const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const validateStudent = require('../middlewares/validateStudent');

router.post('/register', validateStudent, studentController.registerStudent);

router.get('/', studentController.getAllStudents);

router.get('/:id', studentController.getStudentById);

router.put('/:id', validateStudent, studentController.updateStudent);


module.exports = router;
