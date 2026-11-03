import React from 'react';
import { useGetMyCoursesQuery } from '../../services/apiSlice';
import { BookOpen, User, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export const StudentCoursesPage: React.FC = () => {
  const { data: courses = [], isLoading } = useGetMyCoursesQuery();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800">Enrolled Courses</h1>
        <p className="text-xs text-slate-500">Curriculum course registry and faculty instructions for Fall 2026</p>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((c) => (
          <div
            key={c.id || c.code}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-900 font-mono">
                  {c.code}
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  Enrolled Regular
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{c.department}</p>

              <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>Faculty: <strong className="text-slate-800">{c.faculty}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  <span>Credit Hours: <strong className="text-slate-800">{c.credit_hours}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>Room: <strong className="text-slate-800">{c.room}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="font-mono text-[11px] text-slate-500">{c.timings}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Semester V • Fall 2026</span>
              <span className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                Syllabus &amp; Outline →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
