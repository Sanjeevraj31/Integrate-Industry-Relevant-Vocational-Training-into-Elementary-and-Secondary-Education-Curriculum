const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // Exactly 4 options
  correctOption: { type: Number, required: true }, // Index 0-3 of the correct option
  marks: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  duration: { type: Number, default: 15 }, // Time limit in minutes
  negativeMarking: { type: Number, default: 0 }, // Score penalty (e.g. 0.25) per incorrect option
  questions: [quizQuestionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
