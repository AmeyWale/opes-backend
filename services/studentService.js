const studentRepository = require('../repositories/studentRepository');

exports.createStudent = async (studentData) => {
  // we will add the other logic later here
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