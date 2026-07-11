import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import IndustryDashboard from './IndustryDashboard';
import AdminDashboard from './AdminDashboard';

const DashboardRouter = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('skillbridge_token');

  if (!token) return <Navigate to="/login" replace />;
  if (!user) return null; // Wait for context load

  switch (user.role) {
    case 'Student': 
      return <StudentDashboard />;
    case 'Teacher': 
      return <TeacherDashboard />;
    case 'Industry Partner': 
      return <IndustryDashboard />;
    case 'Super Admin': 
      return <AdminDashboard />;
    default: 
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRouter;
