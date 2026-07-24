import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { 
  Play, FileText, CheckCircle, Award, 
  HelpCircle, Upload, Check, AlertCircle 
} from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lesson state
  const [activeVideo, setActiveVideo] = useState(null);
  
  // Assignment upload form state
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projUrl, setProjUrl] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const courseData = await api.get(`/courses/${id}`);
      setCourse(courseData);

      if (user && user.role === 'Student') {
        const enrolls = await api.get('/courses/enrollments');
        const userEnrollment = enrolls.find(e => String(e.courseId?._id || e.courseId) === String(id));
        setEnrollment(userEnrollment || null);

        // Fetch course quizzes
        const quizList = await api.get(`/quizzes/course/${id}`);
        setQuizzes(quizList);

        // Fetch course assignments
        const assignList = await api.get('/assignments');
        const userAssigns = assignList.filter(a => String(a.courseId?._id || a.courseId) === String(id));
        setAssignments(userAssigns);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);
      fetchCourseDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCompleteLesson = async (lessonId) => {
    try {
      await api.post(`/courses/${id}/progress`, { lessonId });
      fetchCourseDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assignments', {
        courseId: id,
        title: projTitle,
        description: projDesc,
        fileUrl: projUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      });
      setUploadSuccess(true);
      setProjTitle('');
      setProjDesc('');
      setProjUrl('');
      fetchCourseDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-center p-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <p className="mt-4 text-slate-200">Course not found</p>
        <Link to="/courses" className="mt-4 inline-block text-indigo-400 font-bold hover:underline">Back to Catalog</Link>
      </div>
    );
  }

  const isEnrolled = !!enrollment;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Course Syllabus / Video View */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Video Player */}
          {isEnrolled && activeVideo ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
              <div className="aspect-video w-full">
                <iframe 
                  className="w-full h-full"
                  src={activeVideo.videoUrl} 
                  title={activeVideo.title}
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-5 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-200">{activeVideo.title}</h2>
                <button
                  onClick={() => handleCompleteLesson(activeVideo._id)}
                  disabled={enrollment.completedLessons.includes(activeVideo._id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    enrollment.completedLessons.includes(activeVideo._id)
                      ? 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-400'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{enrollment.completedLessons.includes(activeVideo._id) ? 'Completed' : 'Mark as Completed'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img 
                src={course.thumbnailImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'} 
                alt={course.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-slate-950 to-transparent">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-600 text-white mb-4">
                  {course.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-slate-100">{course.title}</h1>
                <p className="text-slate-300 mt-2 text-sm max-w-lg">{course.description}</p>
                
                {!isEnrolled && user?.role === 'Student' && (
                  <button 
                    onClick={handleEnroll}
                    className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
                  >
                    Enroll in Course
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Lessons List */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-850">
            <h3 className="text-lg font-bold text-slate-200">Syllabus Video Lessons</h3>
            
            <div className="mt-4 space-y-3">
              {course.videoLessons && course.videoLessons.map((lesson, idx) => {
                const isCompleted = enrollment?.completedLessons ? enrollment.completedLessons.includes(lesson._id) : false;
                return (
                  <div 
                    key={lesson._id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      activeVideo?._id === lesson._id
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-600/10 text-emerald-400' : 'bg-slate-900 text-slate-500'}`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{lesson.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{lesson.duration} • Lesson {idx + 1}</p>
                      </div>
                    </div>

                    {isEnrolled && (
                      <button
                        onClick={() => setActiveVideo(lesson)}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all"
                      >
                        Play
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PDF Materials */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-850">
            <h3 className="text-lg font-bold text-slate-200">Study Guides & PDF Notes</h3>
            <div className="mt-4 space-y-3">
              {course.pdfNotes && course.pdfNotes.map((note) => (
                <div key={note._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-850">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-600/10 text-rose-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{note.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">PDF Document</p>
                    </div>
                  </div>

                  <a 
                    href={note.pdfUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:border-indigo-500/20 hover:text-indigo-400 transition-all"
                  >
                    Open
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Assessments & Projects */}
        <div className="space-y-6">
          
          {/* Learning Outcomes */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-850">
            <h3 className="text-lg font-bold text-slate-200">What you will learn</h3>
            <ul className="mt-4 space-y-3">
              {course.learningOutcomes && course.learningOutcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {isEnrolled && (
            <>
              {/* Assessments / Quizzes */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-850">
                <h3 className="text-lg font-bold text-slate-200">Course Assessments</h3>
                <div className="mt-4 space-y-3">
                  {quizzes.length === 0 ? (
                    <p className="text-xs text-slate-500">No quizzes configured for this course yet.</p>
                  ) : (
                    quizzes.map(quiz => (
                      <div key={quiz._id} className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-200">{quiz.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{quiz.questions.length} Questions • {quiz.duration} mins</p>
                        </div>
                        <Link 
                          to={`/quiz/${quiz._id}`}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all flex items-center gap-1"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Start</span>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Assignment Submissions */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-850 space-y-4">
                <h3 className="text-lg font-bold text-slate-200">Practical Project Upload</h3>

                {/* Submissions List */}
                {assignments.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submissions history</p>
                    {assignments.map(a => (
                      <div key={a._id} className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-200">{a.title}</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            a.status === 'Graded'
                              ? 'bg-emerald-600/10 text-emerald-400'
                              : a.status === 'Resubmission Required'
                              ? 'bg-rose-600/10 text-rose-450'
                              : 'bg-amber-600/10 text-amber-400'
                          }`}>
                            {a.status}
                          </span>
                        </div>
                        {a.marks !== null && (
                          <div className="text-xs text-slate-400">
                            <span className="font-bold text-slate-300">Marks:</span> {a.marks}/100
                            {a.feedback && <p className="mt-1 text-slate-450 italic">"{a.feedback}"</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Project Upload Form */}
                <form onSubmit={handleAssignmentSubmit} className="space-y-3 pt-3 border-t border-slate-850">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submit new project</p>
                  
                  {uploadSuccess && (
                    <div className="p-3 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      Project uploaded for evaluation!
                    </div>
                  )}

                  <div>
                    <input 
                      type="text" 
                      required
                      placeholder="Project Title"
                      value={projTitle}
                      onChange={e => setProjTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <textarea 
                      rows="3"
                      required
                      placeholder="Brief project description & outcomes..."
                      value={projDesc}
                      onChange={e => setProjDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                    ></textarea>
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Project File URL (e.g. Google Drive link)"
                      value={projUrl}
                      onChange={e => setProjUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Project</span>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetails;
