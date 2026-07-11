import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { Timer, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz(true); // auto submit when timer hits 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const fetchQuiz = async () => {
    try {
      const data = await api.get(`/quizzes/${id}`);
      setQuiz(data);
      setTimeLeft(data.duration * 60);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIdx, optIdx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = async (auto = false) => {
    if (submitted) return;
    setSubmitted(true);

    // Format answers map into flat array matching indices
    const answersArray = quiz.questions.map((_, idx) => {
      return answers[idx] !== undefined ? answers[idx] : null;
    });

    try {
      const data = await api.post(`/quizzes/${id}/submit`, { answers: answersArray });
      setResult(data);
    } catch (err) {
      alert(err.message || 'Error submitting quiz');
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-center p-12">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <p className="mt-4 text-slate-200">Quiz not found</p>
        <Link to="/courses" className="mt-4 inline-block text-indigo-400 font-bold hover:underline">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full">
        
        {/* Results view if submitted */}
        {submitted && result ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-6 glass-panel animate-fade-in">
            <CheckCircle className={`w-16 h-16 mx-auto ${result.passed ? 'text-emerald-500' : 'text-rose-500'}`} />
            
            <div>
              <h2 className="text-3xl font-black text-slate-100">
                {result.passed ? 'Congratulations!' : 'Quiz Completed'}
              </h2>
              <p className="text-sm text-slate-400 mt-1.5">
                {result.passed ? 'You passed the assessment.' : 'You did not pass. Feel free to review materials and retry.'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto py-6 border-t border-b border-slate-850">
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Score Earned</p>
                <p className="text-2xl font-black mt-1 text-slate-200">{result.score}/{result.maxScore}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Percentage</p>
                <p className="text-2xl font-black mt-1 text-slate-200">{result.percentage}%</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Correct</p>
                <p className="text-2xl font-black mt-1 text-emerald-400">{result.correctAnswers}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Incorrect</p>
                <p className="text-2xl font-black mt-1 text-rose-450">{result.incorrectAnswers}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link 
                to={`/courses/${quiz.courseId}`}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm text-white transition-all"
              >
                Return to Classroom
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header / Timer Info */}
            <div className="sticky top-20 z-40 p-4 rounded-2xl glass-panel border border-indigo-500/20 bg-slate-900/90 flex items-center justify-between shadow-2xl">
              <div>
                <h1 className="text-xl font-bold text-slate-100">{quiz.title}</h1>
                <p className="text-[10px] text-indigo-400 font-bold uppercase mt-0.5 tracking-wider">
                  Negative Marking: {quiz.negativeMarking} mark per wrong option
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/25 text-indigo-400">
                <Timer className="w-5 h-5 animate-pulse" />
                <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {quiz.questions.map((question, qIdx) => (
                <div key={question._id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-850 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 flex-shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-200 mt-1 leading-snug">
                      {qIdx + 1}. {question.questionText}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {question.options.map((option, optIdx) => {
                      const isSelected = answers[qIdx] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleOptionSelect(qIdx, optIdx)}
                          className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all ${
                            isSelected
                              ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300 shadow-md'
                              : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800'
                          }`}
                        >
                          <span className="inline-block mr-2 text-xs font-bold text-indigo-400 uppercase">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Submission button */}
            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={() => handleSubmitQuiz(false)}
                className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm text-white shadow-xl shadow-indigo-600/25 transition-all"
              >
                Submit Assessment
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
