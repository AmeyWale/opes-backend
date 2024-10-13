const studentService = require('../services/studentService');

exports.registerStudent = async (req, res) => {
  try {
    console.log("inside the student controller");
    
    const studentData = req.body;
    console.log("request body " + req.body);
    const student = await studentService.createStudent(studentData);
    console.log("new studnet is created");
    return res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
