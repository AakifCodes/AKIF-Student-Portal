import React, { useState } from 'react';
import { useGetAssignmentsQuery, useSubmitAssignmentMutation } from '../../services/apiSlice';
import { ClipboardList, Upload, CheckCircle2, Clock, FileText, Check } from 'lucide-react';

export const StudentAssignmentsPage: React.FC = () => {
  const { data: assignments = [], isLoading } = useGetAssignmentsQuery();
  const [submitAssignment] = useSubmitAssignmentMutation();

  const [selectedAsg, setSelectedAsg] = useState<any | null>(null);
  const [fileName, setFileName] = useState('');
  const [comments, setComments] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    await submitAssignment({
      assignmentId: selectedAsg.id,
      file_name: fileName,
      comments,
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setSelectedAsg(null);
      setFileName('');
      setComments('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800">Coursework Assignments</h1>
        <p className="text-xs text-slate-500">Submit homework, laboratory problem sets, and review grading evaluations</p>
      </div>

      {successMsg && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Assignment solution uploaded and submitted successfully!</span>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((asg) => {
          const hasSubmitted = asg.submissions && asg.submissions.length > 0;
          const sub = hasSubmitted ? asg.submissions[0] : null;

          return (
            <div
              key={asg.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900 font-mono">
                      {asg.course_code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{asg.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Due: <strong className="text-slate-700">{new Date(asg.due_date).toLocaleDateString()}</strong>
                    </span>
                    <span>•</span>
                    <span>Total Marks: <strong className="text-slate-700">{asg.total_points} Pts</strong></span>
                  </div>
                </div>

                <div className="sm:self-center">
                  {hasSubmitted ? (
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        <Check className="h-3.5 w-3.5" /> Submitted
                      </span>
                      {sub?.score !== null && sub?.score !== undefined && (
                        <div className="mt-1 text-xs font-black text-blue-900">
                          Score: {sub.score} / {asg.total_points}
                        </div>
                      )}
                      {sub?.feedback && (
                        <p className="mt-1 text-[11px] text-slate-500 italic">"{sub.feedback}"</p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedAsg(asg)}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
                    >
                      <Upload className="h-4 w-4" /> Submit Solution
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Solution Modal */}
      {selectedAsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Submit Solution: {selectedAsg.title}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{selectedAsg.course_code}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  File Attachment Name / Link
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Akif_24SP028_Assignment1.zip"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Submission Comments / GitHub URL
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Include any notes for the instructor..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAsg(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Upload &amp; Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
