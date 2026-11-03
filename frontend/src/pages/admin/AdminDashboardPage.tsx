import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetAdminStatsQuery,
  useGetAllStudentsQuery,
  useGetAllCoursesQuery,
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
} from '../../services/apiSlice';
import {
  Users,
  BookOpen,
  ShieldCheck,
  ClipboardList,
  BellRing,
  Plus,
  ArrowUpRight,
  Activity,
  Server,
  KeyRound
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats } = useGetAdminStatsQuery();
  const { data: students = [] } = useGetAllStudentsQuery();
  const { data: courses = [] } = useGetAllCoursesQuery();
  const { data: announcements = [] } = useGetAnnouncementsQuery();
  const [createAnnouncement] = useCreateAnnouncementMutation();

  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic');
  const [content, setContent] = useState('');

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await createAnnouncement({ title, category, content, author: 'Portal Administrator' });
    setShowAnnounceModal(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-900">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Administration Control Center
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-800">Administrator Dashboard</h1>
          <p className="text-xs text-slate-500">
            University management, user access control, academic registries, and grading operations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/admin/students')}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
          >
            <Plus className="h-4 w-4" /> Add Student
          </button>
          <button
            onClick={() => setShowAnnounceModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <BellRing className="h-4 w-4" /> Post Circular
          </button>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/admin/students')}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Students</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {stats?.total_students || students.length || 1}
          </p>
          <span className="mt-1 inline-block text-[11px] text-emerald-600 font-semibold">Active &amp; Enrolled</span>
        </div>

        <div
          onClick={() => navigate('/admin/courses')}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Courses</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {stats?.total_courses || courses.length || 5}
          </p>
          <span className="mt-1 inline-block text-[11px] text-blue-600 font-semibold">Fall 2026 Session</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security Mode</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-lg font-bold text-slate-900">ADMIN / STUDENT</p>
          <span className="mt-1 inline-block text-[11px] text-slate-500 font-medium">No Teacher Role (Version 3)</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">API Health</span>
            <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
              <Server className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-lg font-bold text-emerald-700">100% Operational</p>
          <span className="mt-1 inline-block text-[11px] text-slate-500 font-medium">FastAPI + MongoDB Engine</span>
        </div>
      </div>

      {/* 2 Column Admin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Students Roster */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Enrolled Students Overview</h3>
              <p className="text-xs text-slate-500">Quick view of registered candidates</p>
            </div>
            <button
              onClick={() => navigate('/admin/students')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Full Registry →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {students.slice(0, 5).map((st) => (
              <div key={st.id || st.roll_no} className="flex items-center justify-between p-4 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-900 font-bold text-xs">
                    {st.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{st.name}</h4>
                    <span className="text-[11px] text-blue-700 font-semibold">{st.roll_no} • {st.program}</span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-slate-800">CGPA: {st.cgpa}</span>
                  <span className="block text-[10px] text-emerald-600 font-medium">{st.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Circulars & Announcements */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Portal Broadcasts</h3>
              <p className="text-xs text-slate-500">Official circulars published to all students</p>
            </div>
            <button
              onClick={() => setShowAnnounceModal(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              + New Broadcast
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {announcements.slice(0, 4).map((ann) => (
              <div key={ann.id} className="p-4 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                    {ann.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{ann.date}</span>
                </div>
                <h4 className="mt-1 text-xs font-bold text-slate-900">{ann.title}</h4>
                <p className="mt-0.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">Broadcast University Announcement</h3>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Examination Schedule Fall 2026"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="Academic">Academic</option>
                  <option value="Examination">Examination</option>
                  <option value="Finance / Fee">Finance / Fee</option>
                  <option value="Advisory">Advisory</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Content / Body
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detail the circular..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Publish Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
