const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 }, // 0 to 100
  completedLessons: [{ type: String }], // Array of videoLesson._id values
  completed: { type: Boolean, default: false },
  completedDate: { type: Date }
}, { timestamps: true });

// Ensure a student can only enroll once in a course
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
