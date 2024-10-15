const Student = require('../models/studentModel');
exports.createStudent = async (studentData) => {
  console.log("inside the studentReposity.js");
  console.log("creating the new student");
  const student = new Student(studentData);
  console.log("new student is created with " + student.id);
  await student.save();
  console.log("new student saved");
  return student;
};


// Get all students
exports.getAllStudents = async () => {
  try {
    const students = await Student.find();
    console.log("Retrieved all students");
    return students;
  } catch (error) {
    console.error("Error fetching students: ", error);
    throw new Error("Error fetching students");
  }
};


exports.getStudentById = async (id) => {
  try {
    const student = await Student.findById(id);
    if (!student) {
      console.log("No student found with ID: " + id);
      return null;
    }
    console.log("Retrieved student with ID: " + id);
    return student;
  } catch (error) {
    console.error("Error fetching student: ", error);
    throw new Error("Error fetching student");
  }
};
