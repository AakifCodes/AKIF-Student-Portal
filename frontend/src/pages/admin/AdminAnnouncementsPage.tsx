import React, { useState } from 'react';
import { useGetAnnouncementsQuery, useCreateAnnouncementMutation, useDeleteAnnouncementMutation } from '../../services/apiSlice';
import { Plus, CheckCircle2, Calendar, Trash2 } from 'lucide-react';

export const AdminAnnouncementsPage: React.FC = () => {
  const { data: announcements = [] } = useGetAnnouncementsQuery();
  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();

  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic');
  const [content, setContent] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAnnouncement({
      title,
      category,
      content,
      author: 'Office of the Registrar',
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setShowModal(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Circulars &amp; Announcements</h1>
          <p className="text-xs text-slate-500">Broadcast university notifications, notices, and exam schedules</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
        >
          <Plus className="h-4 w-4" /> Broadcast Circular
        </button>
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Circular successfully broadcasted to all students!</span>
        </div>
      )}

      {/* Announcements Feed */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-900">
                {ann.category}
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>{ann.date}</span>
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">{ann.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {ann.content}
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>
                Issued by: <strong className="text-slate-700">{ann.author}</strong>
              </span>
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm('Remove this circular?')) return;
                  await deleteAnnouncement(ann.id);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2 py-1 font-semibold text-rose-700 hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">Post Portal Broadcast</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule for Course Withdrawal Without Penalty"
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
                  <option value="Academic">Academic Notice</option>
                  <option value="Examination">Examination Division</option>
                  <option value="Administration">Administration &amp; Transport</option>
                  <option value="Finance">Student Accounts &amp; Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Notice Details
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detail the circular content..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden leading-relaxed"
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
                  Broadcast Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
