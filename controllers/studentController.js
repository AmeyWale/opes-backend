import { createStudent, getAllStudents as fetchAllStudents, getStudentById as fetchStudentById, updateStudent as updateStudentService } from '../services/studentService.js';

export const registerStudent = async (req, res) => {
  try {
    console.log("inside the student controller");

    const studentData = req.body;
    console.log("request body " + req.body);
    const student = await createStudent(studentData);
    console.log("new student is created");
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
export const getAllStudents = async (req, res) => {
  console.log("inside getting all students");
  try {
    const students = await fetchAllStudents(); // Use the renamed function here
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
export const getStudentById = async (req, res) => {
  const { id } = req.params; // Retrieve the student ID from the request parameters
  try {
    const student = await fetchStudentById(id); // Use the renamed function here
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

// Update a student by ID
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedStudent = await updateStudentService(id, updatedData); // Use the renamed function here
    if (!updatedStudent) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found or update failed',
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Student updated successfully',
      data: updatedStudent,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

