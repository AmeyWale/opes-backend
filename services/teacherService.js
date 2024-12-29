import Teacher from '../models/teacherModel.js';

export const findTeacherByEmail = async (email) => {
  return await Teacher.findOne({ email });
};

export const createTeacher = async (teacherData) => {
  return await Teacher.create(teacherData);
};

