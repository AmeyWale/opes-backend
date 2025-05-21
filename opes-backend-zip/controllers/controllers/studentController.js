import bcrypt from 'bcrypt'; // Import bcrypt for password hashing and comparison
import jwt from 'jsonwebtoken'; // Import JWT for generating tokens
import * as studentService from '../services/studentService.js'; // Import student service

// Register Student
export const registerStudent = async (req, res) => {
  try {
    console.log("Inside the student controller");

    const studentData = req.body;
    console.log("Request body:", req.body);

    // Hash the password before saving
    const saltRounds = 10; // Number of salt rounds for bcrypt
    // studentData.password = await bcrypt.hash(studentData.password, saltRounds);

    // Create the student with all necessary fields
    const student = await studentService.createStudent(studentData);
    console.log("New student created");

    return res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: student,
    });
  } catch (error) {
    console.error("Error in registerStudent:", error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  console.log("Inside getting all students");
  try {
    const students = await studentService.getAllStudents();
    return res.status(200).json({
      status: 'success',
      data: students,
    });
  } catch (error) {
    console.error("Error in getAllStudents:", error);
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
    console.error("Error in getStudentById:", error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Login Student
// export const loginStudent = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find the student by email
//     const student = await studentService.getStudentByEmail(email);
//     if (!student) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'Student not found',
//       });
//     }

//     // Compare the provided password with the stored hashed password
//     const isPasswordValid = await bcrypt.compare(password, student.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         status: 'error',
//         message: 'Invalid password',
//       });
//     }

//     // Create JWT token if password is correct
//     const payload = {
//       id: student._id,
//       email: student.email,
//     };

//     // Generate the token with an expiration time (e.g., 1 hour)
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     return res.status(200).json({
//       status: 'success',
//       message: 'Login successful',
//       token, // Send the token to the client
//     });
//   } catch (error) {
//     console.error("Error in loginStudent:", error);
//     return res.status(500).json({
//       status: 'error',
//       message: error.message,
//     });
//   }
// };
