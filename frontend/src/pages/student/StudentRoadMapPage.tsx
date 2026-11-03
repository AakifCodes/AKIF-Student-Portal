import React from 'react';
import { useGetMyProfileQuery, useGetRoadmapQuery } from '../../services/apiSlice';
import { QueryState } from '../../components/QueryState';

export const StudentRoadMapPage: React.FC = () => {
  const { data: profile } = useGetMyProfileQuery();
  const { data: roadmap, isLoading, error } = useGetRoadmapQuery();
  const roadmapData = roadmap?.semesters || [];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800">Academic Curriculum Road Map</h1>
        <p className="text-xs text-slate-500">Degree audit progression guide through 8 semesters</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block text-[11px] uppercase">Registration No</span>
            <strong className="text-sm text-blue-900 font-bold">{roadmap?.registration_no || profile?.roll_no}</strong>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[11px] uppercase">Candidate Name</span>
            <strong className="text-sm text-slate-800 font-bold">{roadmap?.candidate_name || profile?.name}</strong>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[11px] uppercase">Program</span>
            <strong className="text-sm text-slate-800 font-bold">{roadmap?.program || profile?.program}</strong>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[11px] uppercase">Enrollment Session</span>
            <strong className="text-sm text-slate-800 font-bold">{roadmap?.enrollment_session || 'Spring 2024'}</strong>
          </div>
        </div>
      </div>

      <QueryState isLoading={isLoading} error={error} empty={roadmapData.length === 0}>
        <div className="space-y-6">
          {roadmapData.map((sem) => (
            <div key={sem.semester} className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="bg-[#0b5c9e] px-6 py-3 text-white flex items-center justify-between text-xs font-bold">
                <span>{sem.semester}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                  sem.status === 'Completed' ? 'bg-emerald-500 text-white' : sem.status === 'In Progress' ? 'bg-amber-400 text-slate-900' : 'bg-slate-300 text-slate-800'
                }`}>
                  {sem.status}
                </span>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4">Course Code</th>
                    <th className="py-2.5 px-4">Course Title</th>
                    <th className="py-2.5 px-4">Pre-requisite</th>
                    <th className="py-2.5 px-4 text-center">Credit Hours</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {sem.courses.map((c) => (
                    <tr key={c.code} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-4 font-mono font-bold text-blue-900">{c.code}</td>
                      <td className="py-2.5 px-4 font-medium text-slate-800">{c.name}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-500">{c.pre}</td>
                      <td className="py-2.5 px-4 text-center font-semibold">{c.cr}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          c.status === 'PASS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'IN PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </QueryState>
    </div>
  );
};
