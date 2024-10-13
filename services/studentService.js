const studentRepository = require('../repositories/studentRepository');

exports.createStudent = async (studentData) => {
  // we will add the other logic later here
  console.log("creating the new student");
  return await studentRepository.createStudent(studentData);
};
