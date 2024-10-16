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


// Get all students
exports.getAllStudents = async (req, res) => {
  console.log("inside getting all student");
  try {
    const students = await studentService.getAllStudents();
    return res.status(200).json({
      status: 'success',
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get a student by ID
exports.getStudentById = async (req, res) => {
  const { id } = req.params; // Retrieve the student ID from the request parameters
  try {
    const student = await studentService.getStudentById(id); // This function needs to be implemented in your studentService
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found',
      });
    }
    return res.status(200).json({
      status: 'success',
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};