import React, { useState } from 'react';
import {
  useGetAssignmentsQuery,
  useGetAllCoursesQuery,
  useCreateAssignmentMutation,
} from '../../services/apiSlice';
import { ClipboardList, Plus, CheckCircle2, Clock, UserCheck } from 'lucide-react';

export const AdminAssignmentsPage: React.FC = () => {
  const { data: assignments = [], isLoading } = useGetAssignmentsQuery();
  const { data: courses = [] } = useGetAllCoursesQuery();
  const [createAssignment] = useCreateAssignmentMutation();

  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const [courseCode, setCourseCode] = useState('SE-311');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-20T23:59:59Z');
  const [points, setPoints] = useState(100);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAssignment({
      course_code: courseCode,
      title,
      description,
      due_date: dueDate,
      total_points: Number(points),
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setShowModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Assignments &amp; Submissions Review</h1>
          <p className="text-xs text-slate-500">Create coursework assignments and evaluate candidate student submissions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
        >
          <Plus className="h-4 w-4" /> Create Assignment
        </button>
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Assignment published to student portal successfully!</span>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-6">
        {assignments.map((asg) => (
          <div key={asg.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900 font-mono">
                    {asg.course_code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{asg.description}</p>
                <div className="mt-2 text-xs text-slate-400">
                  Due: <strong className="text-slate-700">{new Date(asg.due_date).toLocaleDateString()}</strong> • Total Points: {asg.total_points}
                </div>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                {asg.submissions?.length || 0} Submissions
              </span>
            </div>

            {/* Submissions Table */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Candidate Submissions
              </h4>
              {asg.submissions && asg.submissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="py-2 px-3">Student</th>
                        <th className="py-2 px-3">Submitted File</th>
                        <th className="py-2 px-3">Submission Time</th>
                        <th className="py-2 px-3 text-center">Score</th>
                        <th className="py-2 px-3">Instructor Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {asg.submissions.map((sub, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-semibold text-blue-900">{sub.student_id}</td>
                          <td className="py-2 px-3 font-mono">{sub.file_name}</td>
                          <td className="py-2 px-3 text-slate-500">{new Date(sub.submitted_at).toLocaleString()}</td>
                          <td className="py-2 px-3 text-center font-bold text-emerald-700">{sub.score ?? 'Pending'}</td>
                          <td className="py-2 px-3 text-slate-600 italic">{sub.feedback || 'None'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-2">No submissions recorded yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">Create Coursework Assignment</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Course Code
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
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Raft Algorithm"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Instructions &amp; Problem Set
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail instructions for students..."
                  rows={4}
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
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
