import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileCheck, 
  MessageSquare, 
  FileText, 
  Users, 
  FolderLock, 
  LogOut,
  Award
} from 'lucide-react';

const Sidebar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  if (!user) return null;

  // Define sidebar navigation items based on role
  const getNavItems = () => {
    switch (user.role) {
      case 'Student':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Browse Courses', path: '/courses', icon: BookOpen },
          { name: 'My Assignments', path: '/dashboard/assignments', icon: FileCheck },
          { name: 'Mentor Chat', path: '/dashboard/chat', icon: MessageSquare },
          { name: 'My Certificates', path: '/dashboard/certificates', icon: Award }
        ];
      case 'Teacher':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Manage Courses', path: '/dashboard/courses', icon: BookOpen },
          { name: 'Grading Queue', path: '/dashboard/assignments', icon: FileCheck },
          { name: 'Student Chat', path: '/dashboard/chat', icon: MessageSquare }
        ];
      case 'Industry Partner':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Project Portfolios', path: '/dashboard/assignments', icon: FileCheck },
          { name: 'Mentorship Chat', path: '/dashboard/chat', icon: MessageSquare }
        ];
      case 'Super Admin':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Manage Users', path: '/dashboard/users', icon: Users },
          { name: 'Course Audit', path: '/dashboard/courses', icon: BookOpen },
          { name: 'Verification Logs', path: '/dashboard/certificates', icon: FileText }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col min-h-[calc(100vh-73px)]">
      {/* User info banner */}
      <div className="p-6 border-b border-slate-900/60 bg-slate-900/10">
        <p className="text-sm font-semibold text-slate-200">{user.name}</p>
        <p className="text-xs text-indigo-400 font-bold uppercase mt-0.5">{user.role}</p>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Platform Mode</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer logout */}
      <div className="p-4 border-t border-slate-900">
        <button
          onClick={logoutUser}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-600/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
