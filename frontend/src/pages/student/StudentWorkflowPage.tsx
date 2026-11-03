import React, { useState } from 'react';
import { useGetWorkflowsQuery, useCreateWorkflowMutation } from '../../services/apiSlice';
import { GitBranch, Plus, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const StudentWorkflowPage: React.FC = () => {
  const { data: workflows = [] } = useGetWorkflowsQuery();
  const [createWorkflow] = useCreateWorkflowMutation();

  const [showModal, setShowModal] = useState(false);
  const [workflowType, setWorkflowType] = useState('Student Leave Request');
  const [remarks, setRemarks] = useState('');

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    await createWorkflow({ workflow_type: workflowType, remarks });
    setShowModal(false);
    setRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Student Work Flow Applications</h1>
          <p className="text-xs text-slate-500">Official academic e-requests and administrative approvals</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
        >
          <Plus className="h-4 w-4" /> Apply New WorkFlow
        </button>
      </div>

      {/* Notice Strip (Matches Screenshot 14) */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs text-rose-800 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
        <span>
          <strong>Note:</strong> Delete and Edit will not be available once WorkFlow is Finally Submitted.
        </span>
      </div>

      {/* Workflow Applications Table (Matches Screenshot 14) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">Submitted WorkFlow Requests</span>
          <span className="text-xs text-blue-100">{workflows.length} Requests Recorded</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
            <tr>
              <th className="py-3 px-4">WorkFlow Type</th>
              <th className="py-3 px-4">Submission Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Remarks / Department Response</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {workflows.map((wf) => (
              <tr key={wf.id} className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold text-blue-900">{wf.workflow_type}</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{wf.submission_date}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      wf.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : wf.status === 'Processed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {wf.status === 'Approved' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {wf.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">{wf.remarks || 'Pending Review'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">Apply for Academic WorkFlow</h3>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  WorkFlow Type
                </label>
                <select
                  value={workflowType}
                  onChange={(e) => setWorkflowType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="Student Leave Request">Student Leave Request</option>
                  <option value="Duplicate ID Card Request">Duplicate ID Card Request</option>
                  <option value="Semester Fee Installment Request">Semester Fee Installment Request</option>
                  <option value="Examination Script Recheck">Examination Script Recheck</option>
                  <option value="Bonafide Certificate Request">Bonafide Certificate Request</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Reason &amp; Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Detail your request..."
                  rows={3}
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
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
