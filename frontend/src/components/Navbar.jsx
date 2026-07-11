import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon, LogOut, Award } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser, darkMode, toggleDarkMode } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-all">
          <Award className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
          SkillBridge
        </span>
      </Link>

      {/* Action Links */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-indigo-400 hover:border-indigo-500/30 transition-all"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {user ? (
          <>
            {/* Dashboard Redirect */}
            <Link 
              to="/dashboard"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-sm font-semibold text-slate-300 hover:text-indigo-400 hover:border-indigo-500/30 transition-all"
            >
              Dashboard
            </Link>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-200 line-clamp-1">{user.name}</p>
                <p className="text-[10px] text-indigo-400 font-bold uppercase">{user.role}</p>
              </div>
            </div>

            {/* Logout button */}
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link 
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-indigo-400 transition-all"
            >
              Login
            </Link>
            <Link 
              to="/register"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
