import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, BookOpen } from 'lucide-react';

const CourseCatalog = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    'Robotics', 'Artificial Intelligence', 'Python Programming', 'Web Development', 
    'Graphic Design', 'Digital Marketing', 'Electrical Basics', 'Electronics', 
    'Agriculture', 'Fashion Design', 'Carpentry', 'Cooking', 'Entrepreneurship', 
    'Communication Skills'
  ];

  useEffect(() => {
    fetchCourses();
    if (user && user.role === 'Student') {
      fetchEnrollments();
    }
  }, [search, category]);

  const fetchCourses = async () => {
    try {
      let queryParams = [];
      if (search) queryParams.push(`search=${search}`);
      if (category) queryParams.push(`category=${category}`);
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      
      const data = await api.get(`/courses${queryString}`);
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const data = await api.get('/courses/enrollments');
      setEnrollments(data);
    } catch (err) {
      console.error('Error fetching enrollments:', err.message);
    }
  };

  const getEnrollmentForCourse = (courseId) => {
    return enrollments.find(e => String(e.courseId?._id || e.courseId) === String(courseId));
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-indigo-400" />
              <span>Vocational Course Catalog</span>
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm">Browse, search, and enroll in practical skill modules</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by course title or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-850 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-850 text-sm text-slate-350 focus:border-indigo-500 focus:outline-none transition-all"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="mt-10">
          {loading ? (
            <LoadingSpinner />
          ) : courses.length === 0 ? (
            <div className="text-center p-16 rounded-2xl bg-slate-900/10 border border-dashed border-slate-800">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="mt-4 text-slate-400 font-medium">No courses found matching your query.</p>
              <button 
                onClick={() => { setSearch(''); setCategory(''); }}
                className="mt-4 px-5 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => {
                const enrollment = getEnrollmentForCourse(course._id);
                return (
                  <CourseCard 
                    key={course._id} 
                    course={course} 
                    enrollment={enrollment}
                    actionText={enrollment ? 'Open Classroom' : 'View Course'}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseCatalog;
