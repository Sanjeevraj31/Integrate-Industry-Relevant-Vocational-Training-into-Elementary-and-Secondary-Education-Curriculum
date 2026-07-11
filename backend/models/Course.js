const mongoose = require('mongoose');

const videoLessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, // Embedded URL
  duration: { type: String, default: '10 mins' }
});

const pdfNoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pdfUrl: { type: String, required: true }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Robotics', 'Artificial Intelligence', 'Python Programming', 'Web Development', 
      'Graphic Design', 'Digital Marketing', 'Electrical Basics', 'Electronics', 
      'Agriculture', 'Fashion Design', 'Carpentry', 'Cooking', 'Entrepreneurship', 
      'Communication Skills'
    ]
  },
  duration: { type: String, required: true }, // e.g. "6 weeks", "12 hours"
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnailImage: { type: String, default: '' },
  videoLessons: [videoLessonSchema],
  pdfNotes: [pdfNoteSchema],
  learningOutcomes: [{ type: String }],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
