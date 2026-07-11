import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/StatCard';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  BookOpen, Award, CheckCircle, ShieldCheck, 
  Play, MessageSquare, ExternalLink, Download 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch enrollments
      const enrollList = await api.get('/courses/enrollments');
      setEnrollments(enrollList);

      // Fetch all courses
      const courseList = await api.get('/courses');
      setCourses(courseList);

      // Fetch certificates
      const certs = await api.get('/certificates');
      setCertificates(certs);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const completedEnrollments = enrollments.filter(e => e.completed);
  const enrolledCourses = enrollments.map(e => e.courseId);

  // SVG Chart Calculation
  // We'll render an SVG Circular Progress Ring representing overall average progress
  const averageProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)
    : 0;

  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (averageProgress / 100) * circumference;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-indigo-950/20 border border-indigo-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100">Welcome Back, {user.name}!</h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base">Track your vocational studies and check mentor evaluations.</p>
        </div>
        <Link 
          to="/courses"
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 self-start transition-all"
        >
          Browse Courses
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Enrolled Courses" value={enrollments.length} icon={BookOpen} color="indigo" />
        <StatCard title="Completed Courses" value={completedEnrollments.length} icon={CheckCircle} color="emerald" />
        <StatCard title="Certificates Earned" value={certificates.length} icon={Award} color="violet" />
        <StatCard title="Verifiable Badges" value={user.badges ? user.badges.length : 0} icon={ShieldCheck} color="amber" />
      </div>

      {/* Main Grid: Enrolled Courses & Progress Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Enrolled Courses list */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-200">My Vocational Classrooms</h2>
          
          {enrollments.length === 0 ? (
            <div className="text-center p-12 rounded-2xl bg-slate-900/10 border border-dashed border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="mt-4 text-xs text-slate-400">You are not enrolled in any vocational courses yet.</p>
              <Link to="/courses" className="mt-4 inline-block text-xs font-bold text-indigo-400 hover:underline">
                Explore Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {enrollments.map(enroll => {
                // Find matching course object
                const courseObj = courses.find(c => String(c._id) === String(enroll.courseId?._id || enroll.courseId));
                if (!courseObj) return null;
                return (
                  <CourseCard 
                    key={enroll._id} 
                    course={courseObj} 
                    enrollment={enroll}
                    actionText="Enter Classroom"
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: Progress Ring and Credentials Earned */}
        <div className="space-y-6">
          
          {/* Progress Analytics Chart */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-850 flex flex-col items-center text-center">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Overall Progress</h3>
            
            <div className="relative w-36 h-36 my-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-slate-800"
                  strokeWidth={stroke}
                  stroke="currentColor"
                  fill="transparent"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                <circle
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  strokeWidth={stroke}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
              </svg>
              <div className="absolute text-2xl font-black text-slate-100">
                {averageProgress}%
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Average syllabus completion rate across all your enrolled vocational modules.
            </p>
          </div>

          {/* Badges showcase */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-850">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Earned Badges</h3>
            {user.badges && user.badges.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {user.badges.map((badge, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 flex flex-col items-center text-center">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-200 mt-2 line-clamp-1">{badge.title}</p>
                    <p className="text-[8px] text-slate-500 mt-0.5 line-clamp-1">{badge.criteria}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">Finish course projects to earn verified credentials.</p>
            )}
          </div>

          {/* Download Certificates list */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-850 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Secured Credentials</h3>
            
            {certificates.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No certificates earned yet.</p>
            ) : (
              <div className="space-y-2">
                {certificates.map(cert => (
                  <div key={cert._id} className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-200">{cert.courseId?.title || 'Vocational Course'}</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5 select-all">{cert.certificateId}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link 
                        to={`/verify/${cert.certificateId}`}
                        className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400"
                        title="Verify Public Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <a 
                        href={cert.qrCodeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400"
                        title="View Certificate QR"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
