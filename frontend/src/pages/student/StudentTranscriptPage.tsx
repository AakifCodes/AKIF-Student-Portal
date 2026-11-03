import React, { useState } from 'react';
import { useGetMyProfileQuery, useGetTranscriptQuery } from '../../services/apiSlice';
import { Printer } from 'lucide-react';
import { QueryState } from '../../components/QueryState';

export const StudentTranscriptPage: React.FC = () => {
  const { data: profile } = useGetMyProfileQuery();
  const { data: transcript, isLoading, error } = useGetTranscriptQuery();
  const [selectedProgram, setSelectedProgram] = useState('BS-SE');

  const semesters = transcript?.semesters || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Student Unofficial Transcript</h1>
          <p className="text-xs text-slate-500">Official academic transcript &amp; cumulative performance record</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
        >
          <Printer className="h-4 w-4" /> Print Transcript
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Academic Program
          </label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
          >
            <option value={transcript?.program_code || 'BS-SE'}>
              {transcript?.program || 'Bachelor of Science in Software Engineering (BS-SE)'}
            </option>
          </select>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Cumulative CGPA</span>
            <strong className="text-2xl font-black text-blue-700">{transcript?.cgpa ?? profile?.cgpa ?? '—'}</strong>
          </div>
          <div className="text-right border-l border-slate-200 pl-6">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Credits Earned</span>
            <strong className="text-2xl font-black text-slate-800">{transcript?.total_credits ?? 0}</strong>
          </div>
        </div>
      </div>

      <QueryState isLoading={isLoading} error={error} empty={semesters.length === 0}>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black tracking-wide text-blue-900 uppercase">
              UIT UNIVERSITY — OFFICIAL STUDENT TRANSCRIPT
            </h2>
            <p className="text-xs text-slate-500 mt-1">OFFICE OF THE REGISTRAR &amp; CONTROLLER OF EXAMINATIONS</p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-left bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div><span className="text-slate-400">Student Name:</span> <strong className="text-slate-800 block">{profile?.name}</strong></div>
              <div><span className="text-slate-400">Roll Number:</span> <strong className="text-slate-800 block">{profile?.roll_no}</strong></div>
              <div><span className="text-slate-400">Enrollment No:</span> <strong className="text-slate-800 block">{profile?.enrollment_no}</strong></div>
              <div><span className="text-slate-400">Program:</span> <strong className="text-slate-800 block">{profile?.program}</strong></div>
            </div>
          </div>

          <div className="space-y-6">
            {semesters.map((sem) => (
              <div key={sem.semester} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-[#0b5c9e] px-4 py-2 text-white flex items-center justify-between text-xs font-bold">
                  <span>{sem.semester}</span>
                  <span>GPA: {sem.gpa} • Credits: {sem.credits}</span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Course Code</th>
                      <th className="py-2 px-3">Course Title</th>
                      <th className="py-2 px-3 text-center">Credit Hours</th>
                      <th className="py-2 px-3 text-center">Grade</th>
                      <th className="py-2 px-3 text-right">Grade Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {sem.courses.map((c) => (
                      <tr key={`${sem.semester}-${c.code}`} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono font-bold text-blue-900">{c.code}</td>
                        <td className="py-2 px-3 font-medium text-slate-800">{c.title}</td>
                        <td className="py-2 px-3 text-center">{c.credits}</td>
                        <td className="py-2 px-3 text-center font-bold font-mono">{c.grade}</td>
                        <td className="py-2 px-3 text-right font-mono">{c.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </QueryState>
    </div>
  );
};
