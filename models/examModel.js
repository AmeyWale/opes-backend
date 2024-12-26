import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const QuestionSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: function() {
      return this.type === 'descriptive';  // Only required for descriptive type
    },
    trim: true
  },
  type: { 
    type: String, 
    enum: ['descriptive', 'image-based'], 
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
    validate: {
      validator: function(v) {
        // Validate that exactly 4 options are provided, only for multiple-choice questions
        return this.type === 'image-based' || this.type === 'descriptive' || (v && v.length === 4);
      },
      message: 'A question must have exactly 4 options for multiple-choice questions.'
    }
  },
  correctAnswer: {
    type: Number, // 1-based index
    required: function() {
      return this.options && this.options.length === 4; // Only required for multiple-choice questions
    },
    validate: {
      validator: function(v) {
        return v >= 1 && v <= 4;  // Ensure correctAnswer is between 1 and 4
      },
      message: 'Correct answer must be a number between 1 and 4.'
    }
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
    date: { type: Date, required: true },
    duration: { type: String, required: true },
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
    responses: [StudentResponseSchema], // Responses are stored as embedded documents
  },
  { timestamps: true }  // Automatically manage createdAt and updatedAt
);

export default mongoose.model('Exam', ExamSchema);
