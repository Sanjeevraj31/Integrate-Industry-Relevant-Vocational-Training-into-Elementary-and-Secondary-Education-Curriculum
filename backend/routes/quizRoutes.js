const express = require('express');
const router = express.Router();
const { createQuiz, getQuizById, submitQuiz, getQuizResultsByStudent, getQuizzesByCourse } = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Teacher', 'Super Admin'), createQuiz);
router.get('/:id', protect, getQuizById);
router.post('/:id/submit', protect, authorize('Student'), submitQuiz);
router.get('/course/:courseId', protect, getQuizzesByCourse);
router.get('/student/results', protect, authorize('Student'), getQuizResultsByStudent);

module.exports = router;
