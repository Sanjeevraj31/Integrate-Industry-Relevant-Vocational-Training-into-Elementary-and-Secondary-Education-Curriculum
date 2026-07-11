const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  criteria: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Student', 'Teacher', 'Industry Partner', 'Super Admin'], 
    default: 'Student' 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Pending', 'Suspended'], 
    default: 'Active' 
  },
  schoolId: { type: String, default: '' },
  companyName: { type: String, default: '' },
  badges: [badgeSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
