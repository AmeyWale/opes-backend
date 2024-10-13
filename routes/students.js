const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const validateStudent = require('../middlewares/validateStudent');

router.post('/register', validateStudent, studentController.registerStudent);

module.exports = router;
