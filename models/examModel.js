import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const QuestionSchema = new mongoose.Schema({
  question: { 
    type: String, 
    trim: true
  },
  type: { 
    type: String, 
    enum: ['mcq', 'image-based','essay'], 
    required: true 
  },
  image: { 
    type: String, 
    required: function() {
      return this.type === 'image-based';  // Only required for image-based questions
    }
  },
  options: {
    type: [String],
  },
  correctAnswer: {
    type: String,
  },
});

const StudentResponseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      studentAnswer: { type: Number, required: true }, // 1-based index
      isCorrect: { type: Boolean, default: false },
    },
  ],
  totalCorrect: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
});

const ExamSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    // duration: { type: String, required: true },
    randomizeQuestionSequence: { 
      type: Boolean, 
      required: true, 
      default: false // Default behavior: questions appear in the same order for all users
    },
    showResult: { 
      type: Boolean, 
      required: true, 
      default: false // Default behavior: results are not shown to users
    },
    passingScore: { 
      type: Number, 
      required: true, 
      validate: {
        validator: (v) => v >= 0, // Ensure the passing score is non-negative
        message: 'Passing score must be a non-negative number.'
      }
    },
    questions: {
      type: [QuestionSchema],
      validate: {
        validator: (v) => v.length > 0,  // Ensure there are questions in the exam
        message: 'An exam must have at least one question.'
      },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    assessmentId: {
      type: String,
      required: true,
      unique: true,
      default: () => `ASSESS-${uuidv4().slice(0, 8).toUpperCase()}`, // Generates a unique assessment ID
    },
    // responses: [StudentResponseSchema], Responses are stored as embedded documents
  },
  { timestamps: true }  // Automatically manage createdAt and updatedAt
);

export default mongoose.model('Exam', ExamSchema);
