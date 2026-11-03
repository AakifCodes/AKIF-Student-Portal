import React from 'react';
import { useGetAdmitCardQuery } from '../../services/apiSlice';
import { Printer } from 'lucide-react';
import { QueryState } from '../../components/QueryState';
import { PortalLogo } from '../../components/PortalLogo';

export const StudentAdmitCardPage: React.FC = () => {
  const { data: card, isLoading, error } = useGetAdmitCardQuery();
  const student = card?.student;
  const exams = card?.exams || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Print Admit Card</h1>
          <p className="text-xs text-slate-500">Official Midterm Examination Admit Card &amp; Clearance Pass</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
        >
          <Printer className="h-4 w-4" /> Print Official Slip
        </button>
      </div>

      <QueryState isLoading={isLoading} error={error} empty={!card} emptyText="Admit card is not available yet.">
        <div className="max-w-3xl mx-auto rounded-2xl border-2 border-slate-300 bg-white p-6 sm:p-8 shadow-md space-y-6 print:border-none print:shadow-none">
          <div className="flex items-center justify-between border-b-2 border-blue-900 pb-4">
            <div className="flex items-center gap-3">
              <PortalLogo alt="UIT Logo" className="h-12 w-auto" />
              <div>
                <h2 className="text-lg font-black tracking-wider text-blue-950 uppercase">UIT UNIVERSITY</h2>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Controller of Examinations • Academic Affairs</p>
              </div>
            </div>
            <div className="text-right">
              <span className="rounded bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-900">
                {card?.session} {card?.exam_type?.toUpperCase()} PASS
              </span>
              <div className="text-[10px] font-mono text-slate-400 mt-1">ISSUED: {card?.issued_on}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-700 flex-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Name</span>
                <strong className="text-sm font-bold text-slate-900">{student?.name}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Roll Number</span>
                <strong className="text-sm font-bold text-blue-900">{student?.roll_no}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrollment No</span>
                <strong className="font-semibold text-slate-800">{student?.enrollment_no}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Degree Program</span>
                <strong className="font-semibold text-slate-800">{student?.program}</strong>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center h-28 w-24 rounded-lg border-2 border-dashed border-slate-300 bg-white p-2 text-center text-[10px] text-slate-400">
              <span className="font-bold text-slate-500">PHOTO</span>
              <span>Candidate Attested Picture</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Approved Examination Schedule
            </h4>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-[#0b5c9e] text-white">
                <tr>
                  <th className="py-2 px-3">Course Code</th>
                  <th className="py-2 px-3">Course Name</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Timing</th>
                  <th className="py-2 px-3">Room</th>
                  <th className="py-2 px-3 text-center">Seat</th>
                  <th className="py-2 px-3 text-center">Invigilator Sign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {exams.map((ex) => (
                  <tr key={ex.id}>
                    <td className="py-2 px-3 font-mono font-bold text-blue-900">{ex.course_code}</td>
                    <td className="py-2 px-3 font-medium">{ex.course_name}</td>
                    <td className="py-2 px-3">{ex.date}</td>
                    <td className="py-2 px-3 font-mono">{ex.start} - {ex.end}</td>
                    <td className="py-2 px-3">{ex.room}</td>
                    <td className="py-2 px-3 text-center font-bold text-blue-800">{ex.seat}</td>
                    <td className="py-2 px-3 text-center border-l border-slate-200">_________</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-8 flex items-end justify-between text-xs text-slate-600 border-t border-slate-200">
            <div className="text-center">
              <div className="h-8 border-b border-slate-400 w-36 mb-1"></div>
              <span>Student Signature</span>
            </div>
            <div className="text-center">
              <div className="font-serif italic text-blue-900 text-sm mb-1 font-bold">{card?.controller}</div>
              <div className="border-t border-slate-400 w-44 pt-1">
                <span>Controller of Examinations</span>
              </div>
            </div>
          </div>
        </div>
      </QueryState>
    </div>
  );
};
