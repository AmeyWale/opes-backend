const Student = require('../models/studentModel'); // Assume you have a Student model

exports.createStudent = async (studentData) => {
  console.log("inside the studentReposity.js");
  console.log("creating the new student");
  const student = new Student(studentData);
  console.log("new student is created with "+ student.id);
  await student.save();
  console.log("new student saved");
  return student;
};
