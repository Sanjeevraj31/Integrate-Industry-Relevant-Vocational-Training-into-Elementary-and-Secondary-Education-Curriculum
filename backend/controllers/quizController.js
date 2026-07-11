const db = require('../utils/db');

const createQuiz = async (req, res) => {
  const { courseId, title, duration, negativeMarking, questions } = req.body;

  if (!courseId || !title || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ message: 'Invalid quiz payload data' });
  }

  try {
    const quiz = await db.Quiz.create({
      courseId,
      title,
      duration: duration || 15,
      negativeMarking: negativeMarking || 0,
      questions
    });
    res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating quiz' });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await db.Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Strip out the correct answers if the requesting user is a Student
    if (req.user.role === 'Student') {
      const sanitizedQuestions = quiz.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        marks: q.marks
      }));
      
      const sanitizedQuiz = {
        _id: quiz._id,
        courseId: quiz.courseId,
        title: quiz.title,
        duration: quiz.duration,
        negativeMarking: quiz.negativeMarking,
        questions: sanitizedQuestions
      };
      
      return res.json(sanitizedQuiz);
    }

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching quiz' });
  }
};

const submitQuiz = async (req, res) => {
  const { answers } = req.body; // Array of numbers corresponding to correctOption indices
  
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'Please provide answers array' });
  }

  try {
    // Fetch quiz with full options (which has correctOption)
    const quiz = await db.Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((question, index) => {
      const studentAnswer = answers[index];
      if (studentAnswer === undefined) {
        // Unanswered question
        return;
      }
      
      if (studentAnswer === question.correctOption) {
        correctAnswers++;
        score += question.marks;
      } else {
        incorrectAnswers++;
        score -= quiz.negativeMarking; // Deduct penalty
      }
    });

    // Ensure score doesn't drop below zero
    if (score < 0) score = 0;

    const maxScore = quiz.questions.reduce((acc, q) => acc + q.marks, 0);
    const passThreshold = maxScore * 0.5; // 50% to pass
    const passed = score >= passThreshold;

    const result = await db.QuizResult.create({
      studentId: req.user._id,
      quizId: quiz._id,
      score,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      passed
    });

    res.json({
      resultId: result._id,
      score,
      maxScore,
      correctAnswers,
      incorrectAnswers,
      passed,
      percentage: Math.round((score / maxScore) * 100)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during quiz evaluation' });
  }
};

const getQuizResultsByStudent = async (req, res) => {
  try {
    const results = await db.QuizResult.find({ studentId: req.user._id });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await db.Quiz.find({ courseId: req.params.courseId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createQuiz, getQuizById, submitQuiz, getQuizResultsByStudent, getQuizzesByCourse };
