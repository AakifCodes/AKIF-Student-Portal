import React from 'react';
import { useGetMyProfileQuery, useGetExamSeatingQuery } from '../../services/apiSlice';
import { MapPin, Printer } from 'lucide-react';
import { QueryState } from '../../components/QueryState';

export const StudentExamSeatingPage: React.FC = () => {
  const { data: profile } = useGetMyProfileQuery();
  const { data: seatingData = [], isLoading, error } = useGetExamSeatingQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Exam Seating Plan</h1>
          <p className="text-xs text-slate-500">
            Fall 2026 Midterm Examination Seating Allocation for {profile?.name} ({profile?.roll_no})
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
        >
          <Printer className="h-4 w-4" /> Print Seating Plan
        </button>
      </div>

      <QueryState isLoading={isLoading} error={error} empty={seatingData.length === 0} emptyText="No seating plan has been published yet.">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Midterm Examination Hall Allotments</span>
            <span className="text-xs text-blue-100 font-medium">Session Fall 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Exam Date</th>
                  <th className="py-3 px-4">Start Time</th>
                  <th className="py-3 px-4">End Time</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Room</th>
                  <th className="py-3 px-4 text-center">Seat No</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {seatingData.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.date}</td>
                    <td className="py-3.5 px-4 font-mono text-blue-700">{item.start}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{item.end}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.course_name} ({item.course_code})
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        {item.room}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800 font-mono">
                        {item.seat}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </QueryState>

      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-800 leading-relaxed">
        <strong>Important Exam Instructions:</strong> All students must be present in the designated examination room at least 15 minutes prior to the start time with their original UIT Student ID card and printed Admit Card. No mobile phones or smartwatches permitted.
      </div>
    </div>
  );
};
