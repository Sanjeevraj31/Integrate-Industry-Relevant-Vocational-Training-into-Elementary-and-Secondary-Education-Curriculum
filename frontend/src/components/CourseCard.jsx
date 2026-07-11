import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, User } from 'lucide-react';

const CourseCard = ({ course, enrollment, actionText = 'View Course' }) => {
  const { _id, title, description, category, duration, instructor, thumbnailImage } = course;

  return (
    <div className="flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1 group">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img 
          src={thumbnailImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-600/90 text-white backdrop-blur-sm">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-400 mt-2 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Course Details Info */}
        <div className="flex items-center gap-4 mt-4 py-3 border-t border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>{instructor?.name || 'Instructor'}</span>
          </div>
        </div>

        {/* Enrollment Progress */}
        {enrollment && (
          <div className="mt-4">
            <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
              <span>Learning Progress</span>
              <span className="text-indigo-400 font-bold">{enrollment.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500" 
                style={{ width: `${enrollment.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-5">
          <Link 
            to={`/courses/${_id}`}
            className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-[0.98]"
          >
            {actionText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
