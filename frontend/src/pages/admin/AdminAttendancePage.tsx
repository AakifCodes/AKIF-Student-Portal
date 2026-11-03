import React, { useState } from 'react';
import {
  useGetAllStudentsQuery,
  useGetAllCoursesQuery,
  useRecordAttendanceMutation,
  useGetMyAttendanceQuery,
} from '../../services/apiSlice';
import { Clock, Plus, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AdminAttendancePage: React.FC = () => {
  const { data: students = [] } = useGetAllStudentsQuery();
  const { data: courses = [] } = useGetAllCoursesQuery();
  const { data: attendance = [] } = useGetMyAttendanceQuery();
  const [recordAttendance] = useRecordAttendanceMutation();

  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const [studentId, setStudentId] = useState('student-akif');
  const [courseCode, setCourseCode] = useState('SE-311');
  const [scheduled, setScheduled] = useState(36);
  const [conducted, setConducted] = useState(34);
  const [attended, setAttended] = useState(32);

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const selCourse = courses.find((c) => c.code === courseCode);
    const selStudent = students.find((s) => s.id === studentId || s.roll_no === studentId);

    const percentage = conducted > 0 ? (attended / conducted) * 100 : 100;

    await recordAttendance({
      student_id: studentId,
      course_code: courseCode,
      course_name: selCourse?.name || 'Data Warehousing and Data Mining',
      section_code: '24SP-SE-5A',
      faculty: selCourse?.faculty || 'Syed Imran Jami',
      scheduled: Number(scheduled),
      conducted: Number(conducted),
      attended: Number(attended),
      percentage: Number(percentage.toFixed(2)),
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Attendance Registry Management</h1>
          <p className="text-xs text-slate-500">Record, update, and audit student lecture and laboratory attendances</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
        >
          <Plus className="h-4 w-4" /> Record / Update Attendance
        </button>
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Attendance figures successfully recorded and recalculated!</span>
        </div>
      )}

      {/* Attendance Sheet Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">Student Attendance Audits</span>
          <span className="text-xs text-blue-100 font-medium">Session Fall 2026</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
            <tr>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Section</th>
              <th className="py-3 px-4">Faculty</th>
              <th className="py-3 px-4 text-center">Scheduled</th>
              <th className="py-3 px-4 text-center">Conducted</th>
              <th className="py-3 px-4 text-center">Attended</th>
              <th className="py-3 px-4 text-center">Attendance %</th>
              <th className="py-3 px-4 text-center">Eligibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {attendance.map((att) => {
              const eligible = att.percentage >= 75;
              return (
                <tr key={att.id || att.course_code} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{att.course_name}</div>
                    <span className="text-[11px] text-blue-700 font-semibold">{att.course_code}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{att.section_code}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{att.faculty}</td>
                  <td className="py-3.5 px-4 text-center font-semibold">{att.scheduled}</td>
                  <td className="py-3.5 px-4 text-center font-semibold">{att.conducted}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900">{att.attended}</td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    <span className={eligible ? 'text-emerald-700' : 'text-rose-600'}>
                      {att.percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        eligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {eligible ? 'Eligible' : 'Short'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">Record Student Attendance</h3>
            <form onSubmit={handleRecord} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Candidate Student
                </label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="student-akif">MUHAMMAD AKIF ALVI (24SP-028-SE)</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.roll_no})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Course
                </label>
                <select
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                >
                  {courses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Scheduled
                  </label>
                  <input
                    type="number"
                    value={scheduled}
                    onChange={(e) => setScheduled(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Conducted
                  </label>
                  <input
                    type="number"
                    value={conducted}
                    onChange={(e) => setConducted(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Attended
                  </label>
                  <input
                    type="number"
                    value={attended}
                    onChange={(e) => setAttended(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
