import React, { useState } from 'react';
import { useGetMyResultsQuery, useGetMyCoursesQuery } from '../../services/apiSlice';
import { Award, Filter, Download, CheckCircle2 } from 'lucide-react';

export const StudentResultsPage: React.FC = () => {
  const { data: results = [], isLoading } = useGetMyResultsQuery();
  const { data: courses = [] } = useGetMyCoursesQuery();
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [selectedSession, setSelectedSession] = useState<string>('Fall 2026');

  const filteredResults =
    selectedCourse === 'All'
      ? results
      : results.filter((r) => r.course_code === selectedCourse);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Assessment Results</h1>
          <p className="text-xs text-slate-500">
            Official midterms, sessionals, and lab examination results
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs self-start"
        >
          <Download className="h-4 w-4" /> Export Results
        </button>
      </div>

      {/* Filter Row (Matches Screenshot 19) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Academic Session
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
          >
            <option value="Fall 2026">Fall 2026 (Current)</option>
            <option value="Spring 2026">Spring 2026</option>
            <option value="Fall 2025">Fall 2025</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Course Filter
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
          >
            <option value="All">All Registered Courses</option>
            {courses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Table (Matches Screenshot 19) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">Assessment Scores Matrix</span>
          <span className="text-xs text-blue-100">Fall 2026 Term</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Course (Code)</th>
                <th className="py-3 px-4">Assessment Type</th>
                <th className="py-3 px-4">Session</th>
                <th className="py-3 px-4 text-center">Total Marks</th>
                <th className="py-3 px-4 text-center">Passing Marks</th>
                <th className="py-3 px-4 text-center">Obtained Marks</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredResults.map((r) => {
                const passed = r.obtained_marks >= r.passing_marks;
                return (
                  <tr key={r.id || r.course_code} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{r.course_name}</div>
                      <span className="text-[11px] font-semibold text-blue-700">{r.course_code}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{r.assessment_type}</td>
                    <td className="py-3.5 px-4 text-slate-600">{r.session}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{r.total_marks}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{r.passing_marks}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900 text-sm">
                      {r.obtained_marks}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="rounded bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800 font-mono">
                        {r.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {passed ? <CheckCircle2 className="h-3 w-3" /> : null}
                        {passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
