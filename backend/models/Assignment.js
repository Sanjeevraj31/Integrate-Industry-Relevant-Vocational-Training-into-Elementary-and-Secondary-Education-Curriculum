const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String, default: '' }, // Path or link to uploaded PDF/image project
  marks: { type: Number, default: null }, // Graded score
  feedback: { type: String, default: '' }, // Teacher feedback
  status: { 
    type: String, 
    enum: ['Submitted', 'Graded', 'Resubmission Required'], 
    default: 'Submitted' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
