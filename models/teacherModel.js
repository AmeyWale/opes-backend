import mongoose from 'mongoose';

//the schema for teachers
const teacherSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // department: { type: String, required: true },
  },
  { timestamps: true }
);

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
