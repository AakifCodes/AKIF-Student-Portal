import React, { useState } from 'react';
import { useGetAllCoursesQuery, useCreateCourseMutation, useDeleteCourseMutation } from '../../services/apiSlice';
import { Plus, CheckCircle2, Trash2 } from 'lucide-react';

export const AdminCoursesPage: React.FC = () => {
  const { data: courses = [] } = useGetAllCoursesQuery();
  const [createCourse] = useCreateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [creditHours, setCreditHours] = useState('3+1');
  const [faculty, setFaculty] = useState('');
  const [timings, setTimings] = useState('Mon 09:30 - 10:25');
  const [room, setRoom] = useState('R-301');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCourse({
      code,
      name,
      credit_hours: creditHours,
      faculty,
      timings,
      room,
      department: 'Department of Software Engineering',
      semester: 'Fall 2026',
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setShowModal(false);
    setCode('');
    setName('');
    setFaculty('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Course Offerings Management</h1>
          <p className="text-xs text-slate-500">Configure academic catalog, lecture halls, and faculty instructors</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
        >
          <Plus className="h-4 w-4" /> Add New Course
        </button>
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Course successfully added to university catalog!</span>
        </div>
      )}

      {/* Courses Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">University Courses Catalog</span>
          <span className="text-xs text-blue-100">{courses.length} Active Courses</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
            <tr>
              <th className="py-3 px-4">Course Code</th>
              <th className="py-3 px-4">Course Name</th>
              <th className="py-3 px-4 text-center">Credit Hours</th>
              <th className="py-3 px-4">Faculty Instructor</th>
              <th className="py-3 px-4">Room Allocations</th>
              <th className="py-3 px-4">Timings</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {courses.map((c) => (
              <tr key={c.id || c.code} className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-mono font-bold text-blue-900">{c.code}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                <td className="py-3.5 px-4 text-center font-semibold">{c.credit_hours}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">{c.faculty}</td>
                <td className="py-3.5 px-4 font-medium text-slate-600">{c.room}</td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{c.timings}</td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm(`Delete course ${c.code}?`)) return;
                      await deleteCourse(c.id);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">Add Course Offering</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. SE-315"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Credit Hours
                  </label>
                  <select
                    value={creditHours}
                    onChange={(e) => setCreditHours(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="3+0">3+0 (Theory only)</option>
                    <option value="3+1">3+1 (Theory + Lab)</option>
                    <option value="2+0">2+0</option>
                    <option value="0+1">0+1 (Lab)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cloud Computing Architecture"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Faculty Instructor
                  </label>
                  <input
                    type="text"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    placeholder="e.g. Dr. Muhammad Tariq"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Room / Lab
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. R-402"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Timings Slot
                </label>
                <input
                  type="text"
                  value={timings}
                  onChange={(e) => setTimings(e.target.value)}
                  placeholder="e.g. Mon 11:30 - 12:25, Wed 14:30 - 15:25"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                />
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
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
