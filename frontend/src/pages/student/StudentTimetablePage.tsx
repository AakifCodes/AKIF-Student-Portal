import React, { useState } from 'react';
import { useGetTimetablesQuery } from '../../services/apiSlice';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

export const StudentTimetablePage: React.FC = () => {
  const { data: timetables = [], isLoading } = useGetTimetablesQuery();
  const [selectedDay, setSelectedDay] = useState<string>('All');

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const filteredSlots =
    selectedDay === 'All'
      ? timetables
      : timetables.filter((t) => t.day.toLowerCase() === selectedDay.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800">Weekly Class Timetable</h1>
        <p className="text-xs text-slate-500">
          Fall 2026 Semester • Department of Software Engineering (Section 24SP-SE-5A)
        </p>
      </div>

      {/* Day Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              selectedDay === day
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable Table (Matches Screenshot 16) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">Class Schedule &amp; Lab Allocations</span>
          <span className="text-xs text-blue-100 font-medium">Session Fall 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Timing Slot</th>
                <th className="py-3 px-4">Course Code</th>
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Room / Laboratory</th>
                <th className="py-3 px-4">Faculty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSlots.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No scheduled classes found for this day.
                  </td>
                </tr>
              ) : (
                filteredSlots.map((slot, index) => (
                  <tr key={slot.id || index} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{slot.day}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-blue-700 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-blue-500" />
                      {slot.time}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800 font-mono">
                        {slot.course_code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{slot.course_name}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="h-3 w-3 text-rose-500" />
                        {slot.room}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{slot.faculty}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
