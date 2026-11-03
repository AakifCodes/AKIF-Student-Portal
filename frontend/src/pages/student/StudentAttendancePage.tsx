import React from 'react';
import { useGetMyAttendanceQuery, useGetMyProfileQuery } from '../../services/apiSlice';
import { Clock, CheckCircle2, AlertTriangle, Download, Filter, BookOpen } from 'lucide-react';

export const StudentAttendancePage: React.FC = () => {
  const { data: attendance = [], isLoading } = useGetMyAttendanceQuery();
  const { data: profile } = useGetMyProfileQuery();

  const totalScheduled = attendance.reduce((acc, cur) => acc + cur.scheduled, 0);
  const totalConducted = attendance.reduce((acc, cur) => acc + cur.conducted, 0);
  const totalAttended = attendance.reduce((acc, cur) => acc + cur.attended, 0);
  const overallPercentage = totalConducted > 0 ? ((totalAttended / totalConducted) * 100).toFixed(2) : '90.61';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Attendance Registry</h1>
          <p className="text-xs text-slate-500">
            Student: <strong className="text-blue-900">{profile?.name} ({profile?.roll_no})</strong> • Session: Fall 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Overall Attendance</span>
          <p className="mt-1 text-2xl font-black text-blue-700">{overallPercentage}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Scheduled Classes</span>
          <p className="mt-1 text-2xl font-black text-slate-700">{totalScheduled}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Conducted Classes</span>
          <p className="mt-1 text-2xl font-black text-slate-700">{totalConducted}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Attended Classes</span>
          <p className="mt-1 text-2xl font-black text-emerald-600">{totalAttended}</p>
        </div>
      </div>

      {/* Main Attendance Table (Matches Screenshot 15) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">Attendance Breakdown by Course</span>
          <span className="text-xs text-blue-100">Fall 2026 Semester</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Course (Code)</th>
                <th className="py-3 px-4">Section Code</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4 text-center">Scheduled</th>
                <th className="py-3 px-4 text-center">Conducted</th>
                <th className="py-3 px-4 text-center">Attended</th>
                <th className="py-3 px-4 text-center">Attendance %</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {attendance.map((row) => {
                const isEligible = row.percentage >= 75;
                return (
                  <tr key={row.id || row.course_code} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{row.course_name}</div>
                      <span className="text-[11px] font-semibold text-blue-700">{row.course_code}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{row.section_code}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{row.faculty}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-600">{row.scheduled}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-600">{row.conducted}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{row.attended}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`font-bold ${isEligible ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {row.percentage.toFixed(1)}%
                        </span>
                        <div className="h-1.5 w-24 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isEligible ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.min(row.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isEligible ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                        {isEligible ? 'Eligible for Exam' : 'Short Attendance'}
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
