import React from 'react';
import { useGetPloRecordsQuery, useGetMyProfileQuery } from '../../services/apiSlice';
import { Award, Printer, Download, CheckCircle2 } from 'lucide-react';

export const StudentPloPage: React.FC = () => {
  const { data: ploList = [] } = useGetPloRecordsQuery();
  const { data: profile } = useGetMyProfileQuery();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Program Learning Outcome (PLO) Attainment</h1>
          <p className="text-xs text-slate-500">Outcome-Based Education (OBE) accreditation attainment matrix</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
        >
          <Printer className="h-4 w-4" /> Print OBE Report
        </button>
      </div>

      {/* Student Details Banner (Matches Screenshot 13) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-semibold">Student Identifier</span>
            <strong className="text-sm font-bold text-blue-900">{profile?.roll_no || '24SP-028-SE'}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-semibold">Student Name</span>
            <strong className="text-sm font-bold text-slate-800">{profile?.name || 'MUHAMMAD AKIF ALVI'}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-semibold">Academic Program</span>
            <strong className="text-sm font-bold text-slate-800">{profile?.program || 'BS Software Engineering'}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-semibold">OBE Framework</span>
            <strong className="text-sm font-bold text-emerald-700">PEC / HEC Standard</strong>
          </div>
        </div>
      </div>

      {/* PLO Attainment Matrix Table (Matches Screenshot 13) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">Course-Wise PLO Attainment Percentages</span>
          <span className="text-xs text-blue-100">Cumulative Progress</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
              <tr>
                <th className="py-3 px-3">Semester &amp; Course</th>
                <th className="py-3 px-3">Class Event</th>
                <th className="py-3 px-3">Faculty</th>
                <th className="py-3 px-3 text-center">Credit Hrs</th>
                <th className="py-3 px-3 text-center font-bold text-blue-900">PLO 1 (Knowledge)</th>
                <th className="py-3 px-3 text-center font-bold text-blue-900">PLO 2 (Analysis)</th>
                <th className="py-3 px-3 text-center font-bold text-blue-900">PLO 3 (Design)</th>
                <th className="py-3 px-3 text-center font-bold text-blue-900">PLO 4 (Investigation)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {ploList.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    <div>{p.course}</div>
                    <span className="text-[10px] text-blue-700 font-bold">{p.semester}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">{p.class_event}</td>
                  <td className="py-3 px-3 text-slate-700">{p.faculty}</td>
                  <td className="py-3 px-3 text-center font-medium">{p.credit_hours}</td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-700">{p.po1}</td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-700">{p.po2}</td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600">{p.po3}</td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600">{p.po4}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-blue-50/80 font-bold text-blue-950 text-xs border-t border-blue-200">
              <tr>
                <td colSpan={4} className="py-3 px-3 text-right uppercase">Semester Wise Attained Total:</td>
                <td className="py-3 px-3 text-center font-mono text-emerald-800">100.00%</td>
                <td className="py-3 px-3 text-center font-mono text-emerald-800">100.00%</td>
                <td className="py-3 px-3 text-center font-mono text-emerald-800">100.00%</td>
                <td className="py-3 px-3 text-center font-mono text-emerald-800">100.00%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
