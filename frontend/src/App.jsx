import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Public pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CertificateVerify from './pages/CertificateVerify';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetails from './pages/CourseDetails';
import QuizPage from './pages/QuizPage';

// Protected pages
import DashboardLayout from './layouts/DashboardLayout';
import DashboardRouter from './pages/DashboardRouter';
import ChatPage from './pages/ChatPage';

// Simple Wrapper Components for Sidebar links, making it easier to render sub-pages:
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const { user } = useContext(AuthContext);

  // Helper route selectors
  const AssignmentsRoute = () => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'Student') {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-slate-100">My Assignment Submissions</h1>
          <StudentDashboard />
        </div>
      );
    }
    if (user.role === 'Teacher') {
      return <TeacherDashboard />;
    }
    if (user.role === 'Industry Partner') {
      return <MentorDashboard />;
    }
    return <AdminDashboard />;
  };

  const CoursesRoute = () => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'Teacher') return <TeacherDashboard />;
    if (user.role === 'Super Admin') return <AdminDashboard />;
    return <Navigate to="/courses" replace />;
  };

  const CertificatesRoute = () => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'Student') {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-slate-100">My Certificates</h1>
          <StudentDashboard />
        </div>
      );
    }
    return <AdminDashboard />;
  };

  const UsersRoute = () => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'Super Admin') return <AdminDashboard />;
    return <Navigate to="/dashboard" replace />;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/courses" element={<CourseCatalog />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
      <Route path="/quiz/:id" element={<QuizPage />} />
      
      {/* Public verify certificate link */}
      <Route path="/verify/:key" element={<CertificateVerify />} />
      <Route path="/verify" element={<CertificateVerify />} />

      {/* Role-protected dashboard routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardRouter />} />
        <Route path="chat" element={<ChatPage />} />
        
        {/* Helper sub-routes that match the Sidebar menus */}
        <Route path="assignments" element={<AssignmentsRoute />} />
        <Route path="courses" element={<CoursesRoute />} />
        <Route path="certificates" element={<CertificatesRoute />} />
        <Route path="users" element={<UsersRoute />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
