import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetMyProfileQuery,
  useGetMyCoursesQuery,
  useGetMyAttendanceQuery,
  useGetAnnouncementsQuery,
  useGetTodosQuery,
  useToggleTodoMutation,
  useGetStudentLedgerQuery,
} from '../../services/apiSlice';
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  UserCheck,
  Sparkles,
  X,
  CreditCard,
  ListTodo
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: profile } = useGetMyProfileQuery();
  const { data: courses = [] } = useGetMyCoursesQuery();
  const { data: attendance = [] } = useGetMyAttendanceQuery();
  const { data: announcements = [] } = useGetAnnouncementsQuery();
  const { data: todos = [] } = useGetTodosQuery();
  const { data: ledger = [] } = useGetStudentLedgerQuery();
  const [toggleTodo] = useToggleTodoMutation();

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);

  // Compute average attendance
  const avgAttendance =
    attendance.length > 0
      ? (attendance.reduce((sum, a) => sum + a.percentage, 0) / attendance.length).toFixed(1)
      : (profile?.average_attendance || 90.61).toString();

  return (
    <div className="space-y-6">
      {/* =========================================================================
          TOP BANNER / STUDENT IDENTITY STRIP (Matches Screenshot 12 & 19)
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#003b73] via-[#005b96] to-[#0b5c9e] p-6 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            UIT University • Active Semester Session Fall 2026
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Welcome back, {profile?.name || 'MUHAMMAD AKIF ALVI'}!
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blue-100 font-medium">
            <span>Roll No: <strong className="text-white">{profile?.roll_no || '24SP-028-SE'}</strong></span>
            <span>•</span>
            <span>Enrollment: <strong className="text-white">{profile?.enrollment_no || 'UITU-24SP-UGRAD-00430'}</strong></span>
            <span>•</span>
            <span>Program: <strong className="text-white">{profile?.program || 'BS Software Engineering'}</strong></span>
            <span>•</span>
            <span>Section: <strong className="text-white">{profile?.section || 'A'}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/student/transcript')}
            className="flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur transition-all border border-white/20"
          >
            <Award className="h-4 w-4" /> Unofficial Transcript
          </button>
          <button
            onClick={() => navigate('/student/timetable')}
            className="flex items-center gap-1.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 px-3.5 py-2 text-xs font-bold shadow-xs transition-all"
          >
            <Clock className="h-4 w-4" /> Timetable
          </button>
        </div>
      </div>

      {/* =========================================================================
          MY STATS CARDS (Matches Screenshots 12, 19, 20 with precise colors)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sessional / Financial Balance (Amber / Orange) */}
        <div
          onClick={() => navigate('/student/ledger')}
          className="cursor-pointer rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">
              Current Dues / Balance
            </span>
            <div className="rounded-lg bg-white/20 p-2">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight">
            Rs {profile?.current_balance ? Number(profile.current_balance).toLocaleString() : '59,789.00'}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-amber-100">
            <span>Semester V Charges</span>
            <span className="flex items-center font-medium underline">View Ledger →</span>
          </div>
        </div>

        {/* Card 2: CGPA (Cyan / Royal Blue) */}
        <div
          onClick={() => navigate('/student/results')}
          className="cursor-pointer rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
              Cumulative GPA
            </span>
            <div className="rounded-lg bg-white/20 p-2">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black tracking-tight">
            {profile?.cgpa || '3.14'}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-blue-100">
            <span>Overall Academic Standing</span>
            <span className="font-semibold bg-white/20 px-2 py-0.5 rounded">Good Standing</span>
          </div>
        </div>

        {/* Card 3: Registered Courses (Rose / Coral) */}
        <div
          onClick={() => navigate('/student/courses')}
          className="cursor-pointer rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-5 text-white shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-100">
              Registered Courses
            </span>
            <div className="rounded-lg bg-white/20 p-2">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black tracking-tight">
            {courses.length || profile?.registered_courses || '7.00'}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-rose-100">
            <span>Fall 2026 Semester</span>
            <span className="font-semibold bg-white/20 px-2 py-0.5 rounded">All Regular</span>
          </div>
        </div>

        {/* Card 4: Average Attendance (Teal / Emerald) */}
        <div
          onClick={() => navigate('/student/attendance')}
          className="cursor-pointer rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 p-5 text-white shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-100">
              Average Attendance
            </span>
            <div className="rounded-lg bg-white/20 p-2">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black tracking-tight">
            {avgAttendance}%
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-teal-100">
            <span>Threshold &gt; 75% met</span>
            <span className="font-semibold bg-white/20 px-2 py-0.5 rounded">Eligible</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN 2-COLUMN SECTION: MY COURSES & SIDE PANELS (Matches Screenshot 12 & 19)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): My Courses List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">My Courses</h3>
                <p className="text-xs text-slate-500">Currently enrolled course roster and class timings</p>
              </div>
              <button
                onClick={() => navigate('/student/courses')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View Catalog <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {courses.map((c) => (
                <div key={c.id || c.code} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                          {c.code}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800">{c.name}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>Instructor: <strong className="text-slate-700">{c.faculty}</strong></span>
                        <span>•</span>
                        <span>Room: <strong className="text-slate-700">{c.room}</strong></span>
                        <span>•</span>
                        <span>Credits: <strong className="text-slate-700">{c.credit_hours}</strong></span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        Timings: {c.timings}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      <button
                        onClick={() => navigate('/student/attendance')}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-colors shadow-2xs"
                      >
                        Attendance
                      </button>
                      <button
                        onClick={() => navigate('/student/results')}
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        Result
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Ledger Summary Table (Matches Screenshot 19) */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Financial Ledger Summary</h3>
                <p className="text-xs text-slate-500">Recent fee debits, credits, and current standing</p>
              </div>
              <button
                onClick={() => navigate('/student/ledger')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Full Statement <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Fee Nature</th>
                    <th className="py-2.5 px-4">Session</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4 text-right">Debit (PKR)</th>
                    <th className="py-2.5 px-4 text-right">Credit (PKR)</th>
                    <th className="py-2.5 px-4 text-right">Current Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {ledger.slice(-4).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-4 font-semibold text-blue-900">{item.fee_nature}</td>
                      <td className="py-2.5 px-4 text-slate-500">{item.session}</td>
                      <td className="py-2.5 px-4 text-slate-500">{item.date}</td>
                      <td className="py-2.5 px-4 text-right">{item.debit.toLocaleString()}</td>
                      <td className="py-2.5 px-4 text-right text-emerald-600 font-medium">{item.credit.toLocaleString()}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                        {item.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Widgets (Matches Screenshots 19 & 20) */}
        <div className="space-y-6">
          {/* Degree Completion Circular Gauge (Matches Screenshot 19) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center">
            <h3 className="text-sm font-bold text-slate-800">Degree Completion</h3>
            <p className="text-xs text-slate-500 mb-4">Software Engineering Road Map Progress</p>

            <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
              {/* Circular SVG gauge */}
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600"
                  strokeDasharray="62, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black text-slate-800">62%</span>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Completed</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Earned Credits</span>
                <strong className="text-sm text-slate-800">84 / 136</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Remaining Semesters</span>
                <strong className="text-sm text-slate-800">3 Semesters</strong>
              </div>
            </div>
            <button
              onClick={() => navigate('/student/roadmap')}
              className="mt-3 w-full rounded-xl bg-blue-50 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
            >
              View Full Road Map
            </button>
          </div>

          {/* Directorate / Regents Notice Card (Matches Screenshot 19) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-4 w-4 text-blue-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Regents &amp; Academic Affairs
              </h4>
            </div>
            <div className="rounded-xl bg-blue-50/60 p-3.5 border border-blue-100 text-xs space-y-1.5">
              <p className="font-bold text-blue-900">Aamir Siddiqui</p>
              <p className="text-slate-600 text-[11px]">Registrar and Director Academic Operations</p>
              <p className="text-slate-500 text-[11px]">UIT University • ST-13, Block 7, Gulshan-e-Iqbal, Karachi</p>
              <div className="pt-2 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-slate-400" />
                  <span>UAN: 92 (21) 111-978-275 | Ext: 3221</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-slate-400" />
                  <span>academics@uitu.edu.pk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Todo Tasks Widget (Matches Screenshot 20) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800">Academic Todo List</h4>
              </div>
              <button
                onClick={() => navigate('/student/todos')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2">
              {todos.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTodo(t.id)}
                  className="flex items-start gap-2.5 rounded-lg border border-slate-100 p-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={t.status === 'Completed'}
                    onChange={() => {}}
                    className="mt-0.5 h-3.5 w-3.5 rounded text-blue-600 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p
                      className={`text-xs ${
                        t.status === 'Completed' ? 'line-through text-slate-400' : 'font-medium text-slate-800'
                      }`}
                    >
                      {t.task}
                    </p>
                    <span className="text-[10px] text-slate-400">Due: {t.due_date}</span>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                      t.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* My Activity Login History (Matches Screenshot 20) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800">My Activity</h4>
              <span className="text-[11px] font-medium text-slate-400">Audit Logs</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                <div>
                  <p className="font-semibold text-slate-800">Student Logged In</p>
                  <span className="text-[10px] text-slate-400">30-10-2026 15:35 | Web Portal</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-300"></span>
                <div>
                  <p className="font-medium text-slate-600">Student Logged Out</p>
                  <span className="text-[10px] text-slate-400">29-10-2026 18:45</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-300"></span>
                <div>
                  <p className="font-medium text-slate-600">Student Logged In</p>
                  <span className="text-[10px] text-slate-400">29-10-2026 11:40</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements Drawer / Modal (Matches Screenshot 20) */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                {selectedAnnouncement.category}
              </span>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{selectedAnnouncement.title}</h3>
            <p className="mt-1 text-xs text-slate-400">Published on {selectedAnnouncement.date} by {selectedAnnouncement.author}</p>
            <div className="mt-4 text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {selectedAnnouncement.content}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
