import { createStudent, getAllStudents as fetchAllStudents, getStudentById as fetchStudentById, updateStudent as updateStudentService } from '../services/studentService.js';
import Student from '../models/studentModel.js';

import Exam from '../models/examModel.js'
import Student from '../models/studentModel.js';
import jwt from 'jsonwebtoken';//need to install

export const registerStudent = async (req, res) => {
  const { assessmentId, uniqueId } = req.body;
  try {
    // Find the exam by the string assessmentId first
    const exam = await Exam.findOne({ assessmentId }).maxTimeMS(5000);
    if (!exam) {
      return res.status(404).json({
        status: 'error',
        message: 'Invalid Assessment ID. The specified assessment does not exist.',
      });
    }

    // Check for existing student using the ObjectId, not the string
    const existingStudent = await Student.findOne({ 
      assessmentId: exam._id, 
      uniqueId 
    });
    
    if (existingStudent) {
      return res.status(400).json({
        status: 'error',
        message: 'Student already registered for this assessment.',
      });
    }

    // Prepare student data with the ObjectId
    const studentData = {
      ...req.body,
      assessmentId: exam._id,
    };

    console.log("studentData : ", studentData);
    const student = await createStudent(studentData);
   
    // Generate JWT token for the student
    const token = jwt.sign(
      { id: student._id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                    student,
                    token,
                  },
          });
  } catch (error) {
    // Error handling...
    console.error("Error in registerStudent:", error);
  return res.status(500).json({
    status: 'error',
    message: error.message,
  });
  }
};

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

//Get student performance for exam
export const getStudentExamDetails = async (req, res) => {
  const { studentId, examId } = req.params;

  try {
    // Find exam by assessmentId (e.g. "ASSESS-79A935F5")
    const exam = await Exam.findOne({ assessmentId: examId });
    if (!exam) {
      return res.status(404).json({ status: 'error', message: 'Exam not found' });
    }

    // Fetch student and ensure registered for this exam
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ status: 'error', message: 'Student not found' });
    }

    // Ensure student is linked to the correct exam
    if (student.assessmentId.toString() !== exam._id.toString()) {
      return res.status(400).json({ status: 'error', message: 'Student not registered for this exam' });
    }

    const passingScore = exam.passingScore;
    const isPassed = student.totalCorrect >= passingScore;

    // Build response
    const resultDetails = exam.questions.map((question) => {
      const studentAnswerObj = student.answers.find(
        (ans) => ans.questionId.toString() === question._id.toString()
      );

      return {
        question: question.text,
        options: question.options,
        studentAnswer: studentAnswerObj ? question.options?.[studentAnswerObj.studentAnswer - 1] : 'N/A',
        correctAnswer: question.options?.[question.correctAnswer - 1] || 'N/A',
        isCorrect: studentAnswerObj?.isCorrect ?? false
      };
    });

    return res.status(200).json({
      status: 'success',
      data: {
        examTitle: exam.title,
        studentName: student.name,
        score: student.totalCorrect,
        status: isPassed ? 'Passed' : 'Failed',
        answers: resultDetails
      }
    });

  } catch (error) {
    console.error('Error fetching student exam details:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
