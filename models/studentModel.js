import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  
  //  Assessment ID reference to validate exam association
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  uniqueId: { type: String, required: true },
  name: { type: String, required: true },
  branch: { type: String, required: true },
  class: { type: String, required: true },
  yearOfStudy: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  collegeName: { type: String, required: true },

  //Studne Responses for exam
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: false },
      studentAnswer: { type: String, required: true }, 
      isCorrect: { type: Boolean, default: false },
    },
  ],
  //total marks for assessment
  totalMarks: { type: Number, default: 0 },
  //marks obtained by student in assesment
  totalCorrect: { type: Number, default: 0 },

  // Violations count
  violationsCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);