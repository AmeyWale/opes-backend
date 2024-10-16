const studentRepository = require('../repositories/studentRepository');

exports.createStudent = async (studentData) => {
  console.log("creating the new student");
  return await studentRepository.createStudent(studentData);
};

exports.getAllStudents = async () => {
  console.log("inside the student service: Getting the all studnet.")
  try {
    return await studentRepository.getAllStudents(); 
  } catch (error) {
    throw new Error('Error fetching students: ' + error.message);
  }
};

exports.getStudentById = async (id) => {
  try {
    return await studentRepository.getStudentById(id); ID
  } catch (error) {
    throw new Error('Error fetching student: ' + error.message);
  }
};

// Update a student by ID
exports.updateStudent = async (id, updatedData) => {
  console.log("inside the update student service for id : "+id);
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