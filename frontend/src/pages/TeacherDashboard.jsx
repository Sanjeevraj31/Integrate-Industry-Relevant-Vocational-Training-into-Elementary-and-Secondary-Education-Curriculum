import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  BookOpen, Users, ClipboardList, HelpCircle, 
  Plus, Edit, Trash, Check, X, Award, ExternalLink 
} from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals/Forms state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  
  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: '', description: '', category: 'Robotics', duration: '6 weeks',
    thumbnailImage: '', videoLessons: [], pdfNotes: [], learningOutcomes: []
  });
  const [lessonInput, setLessonInput] = useState({ title: '', videoUrl: '', duration: '15 mins' });
  const [noteInput, setNoteInput] = useState({ title: '', pdfUrl: '' });
  const [outcomeInput, setOutcomeInput] = useState('');
  
  // Quiz form state
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [quizForm, setQuizForm] = useState({
    title: '', duration: 15, negativeMarking: 0, questions: []
  });
  const [questionInput, setQuestionInput] = useState({
    questionText: '', options: ['', '', '', ''], correctOption: 0, marks: 5
  });

  // Grading form state
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [gradeForm, setGradeForm] = useState({ marks: 80, feedback: '', status: 'Graded' });

  const categories = [
    'Robotics', 'Artificial Intelligence', 'Python Programming', 'Web Development', 
    'Graphic Design', 'Digital Marketing', 'Electrical Basics', 'Electronics', 
    'Agriculture', 'Fashion Design', 'Carpentry', 'Cooking', 'Entrepreneurship', 
    'Communication Skills'
  ];

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const courseList = await api.get('/courses');
      // Filter only courses managed by this teacher
      const myCourses = courseList.filter(c => String(c.instructor?._id || c.instructor) === String(user._id));
      setCourses(myCourses);

      const assignList = await api.get('/assignments');
      // Filter assignments belonging to this teacher's courses
      const myCourseIds = myCourses.map(c => String(c._id));
      const myCourseAssignments = assignList.filter(a => myCourseIds.includes(String(a.courseId?._id || a.courseId)));
      setAssignments(myCourseAssignments);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = () => {
    if (!lessonInput.title || !lessonInput.videoUrl) return;
    setCourseForm(prev => ({
      ...prev,
      videoLessons: [...prev.videoLessons, { ...lessonInput }]
    }));
    setLessonInput({ title: '', videoUrl: '', duration: '15 mins' });
  };

  const handleAddNote = () => {
    if (!noteInput.title || !noteInput.pdfUrl) return;
    setCourseForm(prev => ({
      ...prev,
      pdfNotes: [...prev.pdfNotes, { ...noteInput }]
    }));
    setNoteInput({ title: '', pdfUrl: '' });
  };

  const handleAddOutcome = () => {
    if (!outcomeInput) return;
    setCourseForm(prev => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, outcomeInput]
    }));
    setOutcomeInput('');
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', courseForm);
      setShowCourseModal(false);
      setCourseForm({
        title: '', description: '', category: 'Robotics', duration: '6 weeks',
        thumbnailImage: '', videoLessons: [], pdfNotes: [], learningOutcomes: []
      });
      fetchTeacherData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${courseId}`);
      fetchTeacherData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddQuizQuestion = () => {
    if (!questionInput.questionText || questionInput.options.some(o => !o)) return;
    setQuizForm(prev => ({
      ...prev,
      questions: [...prev.questions, { ...questionInput }]
    }));
    setQuestionInput({
      questionText: '', options: ['', '', '', ''], correctOption: 0, marks: 5
    });
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    try {
      await api.post('/quizzes', {
        courseId: selectedCourseId,
        ...quizForm
      });
      setShowQuizModal(false);
      setQuizForm({ title: '', duration: 15, negativeMarking: 0, questions: [] });
      fetchTeacherData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/assignments/${activeAssignment._id}`, gradeForm);
      setShowGradeModal(false);
      setActiveAssignment(null);
      fetchTeacherData();
    } catch (err) {
      alert(err.message);
    }
  };

  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledStudents ? c.enrolledStudents.length : 0), 0);
  const pendingAssignments = assignments.filter(a => a.status === 'Submitted');

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100">Teacher Classroom Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage vocational syllabus lectures, assessments, and grade submissions</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowCourseModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
          
          <button
            onClick={() => {
              if (courses.length === 0) {
                alert('Please create a course before adding quizzes.');
                return;
              }
              setSelectedCourseId(courses[0]._id);
              setShowQuizModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-indigo-400 hover:border-indigo-500/25 transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Add Quiz</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Courses" value={courses.length} icon={BookOpen} color="indigo" />
        <StatCard title="Enrolled Students" value={totalStudents} icon={Users} color="violet" />
        <StatCard title="Total Project Submissions" value={assignments.length} icon={ClipboardList} color="amber" />
        <StatCard title="Pending Grading" value={pendingAssignments.length} icon={ClipboardList} color="rose" />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Course Management List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-200">My Vocational Offerings</h2>

          {courses.length === 0 ? (
            <div className="text-center p-12 bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl">
              <BookOpen className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="mt-4 text-xs text-slate-400">You haven't authored any courses yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map(course => (
                <div key={course._id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600/10 text-indigo-400 uppercase">
                      {course.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-200 mt-2">{course.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">
                      Duration: {course.duration} • Enrolled: {course.enrolledStudents ? course.enrolledStudents.length : 0} Students
                    </p>
                  </div>

                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => handleDeleteCourse(course._id)}
                      className="p-2 rounded-xl bg-rose-600/10 border border-rose-500/20 text-rose-450 hover:bg-rose-650 hover:text-white transition-all"
                      title="Delete Course"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Grading Queue */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-200">Submissions Grading Queue</h2>

          {pendingAssignments.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-850 text-center text-xs text-slate-500">
              No pending portfolio assignments to evaluate.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAssignments.map(a => (
                <div key={a._id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-200">{a.title}</p>
                      <p className="text-[9px] text-slate-500 font-semibold mt-0.5">
                        By {a.studentId?.name || 'Student'} • {a.courseId?.title || 'Course'}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-amber-500/10 text-amber-400 uppercase">
                      Pending
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <a 
                      href={a.fileUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>View File</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    
                    <button
                      onClick={() => {
                        setActiveAssignment(a);
                        setShowGradeModal(true);
                      }}
                      className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white transition-all"
                    >
                      Evaluate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- CREATE COURSE MODAL --- */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-900">
              <h3 className="text-lg font-bold text-slate-200">Author New Vocational Course</h3>
              <button onClick={() => setShowCourseModal(false)} className="p-1 text-slate-500 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-400 uppercase">Course Title</label>
                  <input 
                    type="text" required placeholder="Robotics Workshop"
                    value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 uppercase">Category</label>
                  <select 
                    value={courseForm.category} onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-300 focus:outline-none"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase">Description</label>
                <textarea 
                  required rows="3" placeholder="Syllabus overview..."
                  value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full mt-1.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-400 uppercase">Duration</label>
                  <input 
                    type="text" required placeholder="e.g. 6 weeks"
                    value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 uppercase">Thumbnail Image URL</label>
                  <input 
                    type="text" placeholder="https://..."
                    value={courseForm.thumbnailImage} onChange={e => setCourseForm({ ...courseForm, thumbnailImage: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200"
                  />
                </div>
              </div>

              {/* Add Video Lessons */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 space-y-3">
                <p className="font-bold text-slate-200">Video Lesson Sequencer</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input 
                    type="text" placeholder="Lesson Title"
                    value={lessonInput.title} onChange={e => setLessonInput({ ...lessonInput, title: e.target.value })}
                    className="px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-250"
                  />
                  <input 
                    type="text" placeholder="YouTube Embed Link"
                    value={lessonInput.videoUrl} onChange={e => setLessonInput({ ...lessonInput, videoUrl: e.target.value })}
                    className="px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-250"
                  />
                  <button 
                    type="button" onClick={handleAddLesson}
                    className="py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-500"
                  >
                    Add Lesson
                  </button>
                </div>

                {courseForm.videoLessons.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {courseForm.videoLessons.map((l, idx) => (
                      <p key={idx} className="text-[10px] text-indigo-400 font-semibold">✓ {l.title} ({l.duration})</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Add PDF Notes */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 space-y-3">
                <p className="font-bold text-slate-200">Syllabus PDF Worksheets</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input 
                    type="text" placeholder="Document Title"
                    value={noteInput.title} onChange={e => setNoteInput({ ...noteInput, title: e.target.value })}
                    className="px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-250"
                  />
                  <input 
                    type="text" placeholder="File PDF URL"
                    value={noteInput.pdfUrl} onChange={e => setNoteInput({ ...noteInput, pdfUrl: e.target.value })}
                    className="px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-250"
                  />
                  <button 
                    type="button" onClick={handleAddNote}
                    className="py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-500"
                  >
                    Add Note
                  </button>
                </div>

                {courseForm.pdfNotes.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {courseForm.pdfNotes.map((n, idx) => (
                      <p key={idx} className="text-[10px] text-indigo-400 font-semibold">✓ {n.title}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Outcomes */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 space-y-3">
                <p className="font-bold text-slate-200">Learning Outcomes</p>
                <div className="flex gap-2">
                  <input 
                    type="text" placeholder="e.g. Master soldering techniques"
                    value={outcomeInput} onChange={e => setOutcomeInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-250"
                  />
                  <button 
                    type="button" onClick={handleAddOutcome}
                    className="px-4 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-500"
                  >
                    Add
                  </button>
                </div>

                {courseForm.learningOutcomes.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {courseForm.learningOutcomes.map((o, idx) => (
                      <p key={idx} className="text-[10px] text-indigo-400 font-semibold">• {o}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-900 flex justify-end gap-2 text-sm">
                <button 
                  type="button" onClick={() => setShowCourseModal(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD QUIZ MODAL --- */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-900">
              <h3 className="text-lg font-bold text-slate-200">Assemble Course Quiz</h3>
              <button onClick={() => setShowQuizModal(false)} className="p-1 text-slate-500 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="font-bold text-slate-400 uppercase">Target Course</label>
                  <select 
                    value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-300"
                  >
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-400 uppercase">Quiz Title</label>
                  <input 
                    type="text" required placeholder="Lesson Assessment"
                    value={quizForm.title} onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-250"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-400 uppercase">Duration (Minutes)</label>
                  <input 
                    type="number" required
                    value={quizForm.duration} onChange={e => setQuizForm({ ...quizForm, duration: Number(e.target.value) })}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-250"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 uppercase">Negative Marking Penalty</label>
                  <input 
                    type="number" step="0.25" required
                    value={quizForm.negativeMarking} onChange={e => setQuizForm({ ...quizForm, negativeMarking: Number(e.target.value) })}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-250"
                  />
                </div>
              </div>

              {/* Add Question Box */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 space-y-3">
                <p className="font-bold text-slate-200">Draft MCQ Question</p>
                <input 
                  type="text" placeholder="Question prompt..."
                  value={questionInput.questionText} onChange={e => setQuestionInput({ ...questionInput, questionText: e.target.value })}
                  className="w-full px-3 py-2.5 rounded bg-slate-950 border border-slate-800 text-slate-250"
                />

                <div className="grid grid-cols-2 gap-2">
                  {questionInput.options.map((opt, oIdx) => (
                    <input 
                      key={oIdx} type="text" placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                      value={opt} onChange={e => {
                        const newOpts = [...questionInput.options];
                        newOpts[oIdx] = e.target.value;
                        setQuestionInput({ ...questionInput, options: newOpts });
                      }}
                      className="px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-250"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Correct Option Index</label>
                    <select
                      value={questionInput.correctOption} onChange={e => setQuestionInput({ ...questionInput, correctOption: Number(e.target.value) })}
                      className="w-full mt-1.5 px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-350"
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>

                  <button 
                    type="button" onClick={handleAddQuizQuestion}
                    className="py-2.5 mt-4 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-500"
                  >
                    Add Question
                  </button>
                </div>

                {quizForm.questions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {quizForm.questions.map((q, idx) => (
                      <p key={idx} className="text-[10px] text-indigo-400 font-semibold">✓ Question {idx + 1}: {q.questionText}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-900 flex justify-end gap-2 text-sm">
                <button 
                  type="button" onClick={() => setShowQuizModal(false)}
                  className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-355 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                >
                  Publish Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EVALUATION / GRADING MODAL --- */}
      {showGradeModal && activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in text-xs">
            <div className="flex justify-between items-center pb-4 border-b border-slate-900">
              <h3 className="text-base font-bold text-slate-200">Evaluate Portfolio Project</h3>
              <button onClick={() => setShowGradeModal(false)} className="p-1 text-slate-500 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="font-bold text-slate-400">Student Submission Detail</p>
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-850 mt-1.5 text-[11px] space-y-1">
                <p><span className="font-bold text-slate-350">Title:</span> {activeAssignment.title}</p>
                <p><span className="font-bold text-slate-350">Description:</span> {activeAssignment.description}</p>
              </div>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="font-bold text-slate-400 uppercase">Status Decision</label>
                <select
                  value={gradeForm.status} onChange={e => setGradeForm({ ...gradeForm, status: e.target.value })}
                  className="w-full mt-1.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-350"
                >
                  <option value="Graded">Graded (Award Badges & Certificates if complete)</option>
                  <option value="Resubmission Required">Resubmission Required</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase">Marks Awarded (0-100)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="0" max="100"
                    value={gradeForm.marks} onChange={e => setGradeForm({ ...gradeForm, marks: Number(e.target.value) })}
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="font-bold text-sm text-slate-200">{gradeForm.marks}%</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase">Evaluator Comments & Feedback</label>
                <textarea
                  rows="3" required placeholder="Great execution of carpentry joints..."
                  value={gradeForm.feedback} onChange={e => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                  className="w-full mt-1.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-200"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-900 flex justify-end gap-2 text-sm">
                <button 
                  type="button" onClick={() => setShowGradeModal(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-350 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg"
                >
                  Submit Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
