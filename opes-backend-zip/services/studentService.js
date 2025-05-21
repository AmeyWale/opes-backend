import * as studentRepository from '../repositories/studentRepository.js';

export const createStudent = async (studentData) => {
  try {
    const student = await studentRepository.createStudent(studentData);
    return student;
  } catch (error) {
    throw error;
  }
};

export const getAllStudents = async () => {
  console.log("inside the student service: Getting all students.");
  try {
    return await studentRepository.getAllStudents();
  } catch (error) {
    throw new Error('Error fetching students: ' + error.message);
  }
};

export const getStudentById = async (id) => {
  try {
    return await studentRepository.getStudentById(id);
  } catch (error) {
    throw new Error('Error fetching student: ' + error.message);
  }
};

// Update a student by ID
export const updateStudent = async (id, updatedData) => {
  console.log("inside the update student service for id: " + id);
  try {
    const updatedStudent = await studentRepository.updateStudent(id, updatedData);
    if (!updatedStudent) {
      throw new Error('Student not found or update failed');
    }
    return updatedStudent;
  } catch (error) {
    throw new Error('Error updating student: ' + error.message);
  }
};

