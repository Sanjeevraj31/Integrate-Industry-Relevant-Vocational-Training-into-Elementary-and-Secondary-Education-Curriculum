import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, FileCheck, MessageSquare, Clipboard, ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const MentorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Grading Modal
  const [selectedSub, setSelectedSub] = useState(null);
  const [gradeForm, setGradeForm] = useState({ marks: 90, feedback: '', status: 'Graded' });
  const [showGradeModal, setShowGradeModal] = useState(false);

  useEffect(() => {
    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      const data = await api.get('/assignments');
      // For industry partners, they evaluate all submissions that represent vocational projects
      setSubmissions(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/assignments/${selectedSub._id}`, gradeForm);
      setShowGradeModal(false);
      setSelectedSub(null);
      fetchMentorData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  const pendingSubs = submissions.filter(s => s.status === 'Submitted');
  const gradedSubs = submissions.filter(s => s.status === 'Graded');

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Header */}
      <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100">Industry Mentor Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Evaluate school-going learners' practical portfolios and project uploads for {user.companyName || 'Corporate Partner'}
          </p>
        </div>
        <Link 
          to="/dashboard/chat"
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 self-start transition-all"
        >
          Open Chat Inbox
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Assigned Portfolios" value={submissions.length} icon={Clipboard} color="indigo" />
        <StatCard title="Awaiting Feedback" value={pendingSubs.length} icon={FileCheck} color="rose" />
        <StatCard title="Graded & Endorsed" value={gradedSubs.length} icon={Users} color="emerald" />
      </div>

      {/* Main Grid: Student Portfolios Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Submissions list */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-200">Learner Portfolio Evaluator</h2>

          {submissions.length === 0 ? (
            <div className="text-center p-12 bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl">
              <Clipboard className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="mt-4 text-xs text-slate-400 font-semibold">No student projects uploaded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map(sub => (
                <div key={sub._id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-850 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-600/10 text-indigo-400 uppercase">
                        {sub.courseId?.category || 'Vocational'}
                      </span>
                      <h3 className="text-base font-bold text-slate-200 mt-2">{sub.title}</h3>
                      <p className="text-xs text-slate-450 mt-1">{sub.description}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase ${
                      sub.status === 'Graded'
                        ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/10'
                        : 'bg-amber-600/10 text-amber-400 border border-amber-500/10'
                    }`}>
                      {sub.status}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <p className="text-slate-500 font-semibold">
                      Student: <span className="text-slate-350">{sub.studentId?.name || 'Learner'}</span>
                    </p>

                    <div className="flex gap-3">
                      {sub.fileUrl && (
                        <a 
                          href={sub.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-indigo-400 flex items-center gap-1"
                        >
                          <span>Review Work</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      
                      {sub.status !== 'Graded' && (
                        <button
                          onClick={() => {
                            setSelectedSub(sub);
                            setShowGradeModal(true);
                          }}
                          className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white shadow-md shadow-indigo-600/20 transition-all"
                        >
                          Grade & Endorse
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Mentorship support */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-850 space-y-4 self-start">
          <div className="p-4 rounded-xl bg-indigo-600/5 border border-indigo-500/10 text-indigo-400 text-xs leading-relaxed">
            <p className="font-bold text-slate-200">How to Evaluate Portfolios:</p>
            <ol className="list-decimal list-inside space-y-1.5 mt-2 text-slate-400">
              <li>Inspect student project document links.</li>
              <li>Provide feedback detailing structural and industry application.</li>
              <li>Set marks and status. If marks &gt;= 50%, students are awarded graduation badges.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* --- EVALUATION MODAL --- */}
      {showGradeModal && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-2xl space-y-6 text-xs animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-slate-900">
              <h3 className="text-base font-bold text-slate-200">Industry Mentor Endorsement</h3>
              <button onClick={() => setShowGradeModal(false)} className="p-1 text-slate-500 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="font-bold text-slate-400 uppercase">Assessment Status</label>
                <select
                  value={gradeForm.status} onChange={e => setGradeForm({ ...gradeForm, status: e.target.value })}
                  className="w-full mt-1.5 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-350"
                >
                  <option value="Graded">Approve & Endorse (Issue Certificate & Badge)</option>
                  <option value="Resubmission Required">Requires Revision</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase">Competence Rating (Marks 0-100)</label>
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
                <label className="font-bold text-slate-400 uppercase">Mentorship Review Feedback</label>
                <textarea
                  rows="4" required placeholder="Excellent implementation. To improve, try sourcing low-cost sensors..."
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
                  Approve Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
