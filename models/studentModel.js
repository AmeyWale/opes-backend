import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true },
  name: { type: String, required: true },
  branch: { type: String, required: true },
  class: { type: String, required: true },
  yearOfStudy: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  collegeName: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
