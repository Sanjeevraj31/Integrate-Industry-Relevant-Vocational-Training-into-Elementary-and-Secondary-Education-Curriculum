import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'from-indigo-600/10 to-indigo-500/5 text-indigo-400 border-indigo-500/20',
    violet: 'from-violet-600/10 to-violet-500/5 text-violet-400 border-violet-500/20',
    emerald: 'from-emerald-600/10 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-600/10 to-amber-500/5 text-amber-400 border-amber-500/20',
    rose: 'from-rose-600/10 to-rose-500/5 text-rose-400 border-rose-500/20'
  };

  const bgClasses = colorMap[color] || colorMap.indigo;

  return (
    <div className={`p-6 rounded-2xl border bg-gradient-to-br ${bgClasses} flex items-center justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/5`}>
      <div>
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold mt-2 text-slate-100">{value}</p>
      </div>
      {Icon && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
