import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Cpu, Brain, Code, Palette, Share2, 
  Lightbulb, Zap, UserCheck, ShieldAlert,
  ArrowRight, ShieldCheck, Mail, Phone, MapPin
} from 'lucide-react';

const LandingPage = () => {
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setContactData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const categories = [
    { name: 'Robotics', icon: Cpu, desc: 'Understand kinematics, motors, and microcontrollers.', count: 4 },
    { name: 'Artificial Intelligence', icon: Brain, desc: 'Introductory neural networks & model training.', count: 3 },
    { name: 'Python Programming', icon: Code, desc: 'Learn programming fundamentals with simple scripts.', count: 5 },
    { name: 'Web Development', icon: Palette, desc: 'HTML, CSS, JavaScript basics for school children.', count: 6 }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse-subtle"></div>
        
        <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
          Smart India Hackathon Initiative
        </span>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-slate-100 animate-fade-in">
          Integrate Vocational Training into <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
            School Curriculums
          </span>
        </h1>
        
        <p className="mt-6 text-base md:text-lg text-slate-400 max-w-3xl leading-relaxed animate-fade-in">
          SkillBridge bridges the gap between traditional school education (Grades 6–12) and industry-relevant trades. Study Robotics, AI, Coding, Sustainable Farming, and more, with guidance from industry corporate mentors.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md animate-fade-in">
          <Link 
            to="/register"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/courses"
            className="px-8 py-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 font-bold text-slate-300 hover:text-indigo-400 transition-all hover:scale-105 active:scale-95"
          >
            Explore Courses
          </Link>
        </div>
      </section>

      {/* Project Objectives */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-slate-100">Project Objectives</h2>
            <p className="mt-4 text-slate-400 text-sm md:text-base">
              Aligning primary and secondary school classrooms with NEP 2020 mandates to build practical vocational exposure early in the academic journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-200">Practical Familiarity</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Replace purely theoretical worksheets with real trade exploration like robotics circuits, fashion sketches, and smart garden building.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6">
                <UserCheck className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-200">Corporate Mentors</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Bridge local schools with industry partners who evaluate practical student portfolio project uploads and provide live feedback.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-200">Verifiable Credentials</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Student certificate ID verification pages prevent credentials fraud and create portable portfolios showing skill competence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vocational Categories */}
      <section className="py-20 border-t border-slate-900 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-100">Vocational Categories</h2>
              <p className="mt-2 text-slate-400 text-sm">
                Explore different industrial trade paths and find your interest.
              </p>
            </div>
            <Link to="/courses" className="mt-4 md:mt-0 flex items-center gap-1.5 text-sm font-bold text-indigo-400 hover:text-indigo-300">
              <span>View all categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.name} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-indigo-500/30 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/10 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <Icon className="w-5 h-5 text-indigo-400 group-hover:text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-200">{c.name}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-slate-100">Frequently Asked Questions</h2>
          
          <div className="mt-12 space-y-6">
            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-850">
              <h4 className="text-base font-bold text-slate-200">How does the Offline Database Fallback layer work?</h4>
              <p className="mt-2 text-sm text-slate-400">
                In locations with poor internet, if connection to the cloud database is lost, the server automatically reads and writes to local JSON storage files on the server's disk, guaranteeing zero downtime.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-850">
              <h4 className="text-base font-bold text-slate-200">Who evaluates student projects?</h4>
              <p className="mt-2 text-sm text-slate-400">
                Course teachers grade quizzes and syllabus questions, while Industry Mentors review uploaded final project portfolios to award verified skill badges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 border-t border-slate-900 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-black text-slate-100">Contact SkillBridge</h2>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              Have questions about integrating vocational courses into your school syllabus? Contact our educational support office.
            </p>

            <div className="mt-8 space-y-4 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <span>support@skillbridge.gov.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-400" />
                <span>+91 11-23456789</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-400" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="p-8 rounded-2xl bg-slate-900/40 border border-slate-850 space-y-4">
            {submitted && (
              <div className="p-4 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                Message submitted! We will respond shortly.
              </div>
            )}
            
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Your Name</label>
              <input 
                type="text" 
                required
                value={contactData.name}
                onChange={e => setContactData({ ...contactData, name: e.target.value })}
                className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Your Email</label>
              <input 
                type="email" 
                required
                value={contactData.email}
                onChange={e => setContactData({ ...contactData, email: e.target.value })}
                className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Message</label>
              <textarea 
                rows="4"
                required
                value={contactData.message}
                onChange={e => setContactData({ ...contactData, message: e.target.value })}
                className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-900/60 bg-slate-950 text-center text-xs text-slate-500 px-6">
        <p>© 2026 SkillBridge. MERN vocational project aligned with India NEP 2020 initiatives.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
