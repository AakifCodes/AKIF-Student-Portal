import React, { useState } from 'react';
import { useGetAllStudentsQuery, useCreateStudentMutation, useDeleteStudentMutation } from '../../services/apiSlice';
import { Plus, Search, CheckCircle2, Trash2 } from 'lucide-react';

export const AdminStudentsPage: React.FC = () => {
  const { data: students = [] } = useGetAllStudentsQuery();
  const [createStudent] = useCreateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  // Form states
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Student@123');
  const [program, setProgram] = useState('BS Software Engineering');
  const [section, setSection] = useState('A');
  const [semester, setSemester] = useState('Fall 2026');

  const filteredStudents = students.filter(
    (st) =>
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.roll_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    await createStudent({
      roll_no: rollNo,
      name,
      email,
      enrollment_no: `UITU-${rollNo.replace('-', '')}-001`,
      section,
      program,
      department: 'Department of Software Engineering',
      current_semester: semester,
      semester_number: 1,
      cgpa: 0.0,
      registered_courses: 5.0,
      average_attendance: 100.0,
      current_balance: 0.0,
      status: 'Active / Regular',
      campus: 'Main Campus, Karachi',
      password,
    });

    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 3000);
    setShowAddModal(false);
    setRollNo('');
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Students Management</h1>
          <p className="text-xs text-slate-500">Official student admission records, enrollments, and accounts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
        >
          <Plus className="h-4 w-4" /> Register New Student
        </button>
      </div>

      {successNotice && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>New student enrolled and portal credentials generated successfully!</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by Roll Number (e.g. 24SP-028-SE), Name, or Email..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-4 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">Registered Students Directory</span>
          <span className="text-xs text-blue-100">{filteredStudents.length} Students</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Student Profile</th>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Program &amp; Section</th>
                <th className="py-3 px-4 text-center">Semester</th>
                <th className="py-3 px-4 text-center">CGPA</th>
                <th className="py-3 px-4 text-center">Attendance</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.map((st) => (
                <tr key={st.id || st.roll_no} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <div className="font-bold text-slate-900">{st.name}</div>
                    <span className="text-[11px] text-slate-400">{st.email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-900">{st.roll_no}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{st.program}</div>
                    <span className="text-[11px] text-slate-500">Section {st.section}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{st.current_semester}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900 text-sm">{st.cgpa}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-semibold text-emerald-700">{st.average_attendance}%</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      {st.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm(`Remove ${st.name} from the portal?`)) return;
                        await deleteStudent(st.id);
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
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">Register New Student</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. 24SP-099-SE"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Syed Hamza Ali"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. hamza.24sp099@student.uitu.edu.pk"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Program
                  </label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="BS Software Engineering">BS Software Engineering</option>
                    <option value="BS Computer Science">BS Computer Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="Fall 2026">Fall 2026</option>
                    <option value="Spring 2026">Spring 2026</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Default Portal Password
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Register Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
