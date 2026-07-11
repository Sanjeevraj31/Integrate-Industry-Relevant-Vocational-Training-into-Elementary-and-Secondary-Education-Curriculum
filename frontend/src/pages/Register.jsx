import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Mail, Lock, User, School, Briefcase, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [schoolId, setSchoolId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await registerUser({
        name,
        email,
        password,
        role,
        schoolId: role === 'Student' || role === 'Teacher' ? schoolId : '',
        companyName: role === 'Industry Partner' ? companyName : ''
      });

      if (role === 'Student') {
        navigate('/dashboard');
      } else {
        setSuccessMsg('Account registered successfully! Please wait for an Administrator to approve your account before signing in.');
        setName('');
        setEmail('');
        setPassword('');
        setSchoolId('');
        setCompanyName('');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-2xl glass-panel animate-fade-in">
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-100">Create Account</h2>
            <p className="mt-1.5 text-xs text-slate-400">Join SkillBridge MERN vocational platform</p>
          </div>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-rose-600/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  required
                  placeholder="student1@school.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Role</label>
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)}
                className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 focus:border-indigo-500 focus:outline-none transition-all"
              >
                <option value="Student">Student Learner</option>
                <option value="Teacher">Course Teacher</option>
                <option value="Industry Partner">Industry Partner / Mentor</option>
              </select>
            </div>

            {(role === 'Student' || role === 'Teacher') && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">School License / Student ID</label>
                <div className="relative mt-1">
                  <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    required
                    placeholder="SCH-12345"
                    value={schoolId}
                    onChange={e => setSchoolId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {role === 'Industry Partner' && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company / Corporate Name</label>
                <div className="relative mt-1">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    required
                    placeholder="RoboTech Labs"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
