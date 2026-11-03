import React from 'react';
import { useGetAdvanceReceiptsQuery } from '../../services/apiSlice';
import { Printer, Eye, Download } from 'lucide-react';
import { QueryState } from '../../components/QueryState';

const formatAmount = (amount: number) =>
  amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const StudentAdvanceFeePage: React.FC = () => {
  const { data: advanceReceipts = [], isLoading, error } = useGetAdvanceReceiptsQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Student Advance Fee Receipts</h1>
          <p className="text-xs text-slate-500">Official university advance deposits and bank challan acknowledgment</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
        >
          <Download className="h-4 w-4" /> Download Statement
        </button>
      </div>

      <QueryState isLoading={isLoading} error={error} empty={advanceReceipts.length === 0} emptyText="No advance fee receipts found.">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Deposited Advance Fee History</span>
            <span className="text-xs text-blue-100 font-medium">Official Audit Record</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-4">Receipt Number</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4">Payment Channel</th>
                  <th className="py-3 px-4 text-right">Advance Amount (PKR)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {advanceReceipts.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">{rec.receipt_no}</td>
                    <td className="py-3.5 px-4 text-slate-600">{rec.date}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{rec.mode}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                      {formatAmount(rec.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => window.print()} className="rounded p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100" title="View Receipt">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => window.print()} className="rounded p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100" title="Print Challan Slip">
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </QueryState>
    </div>
  );
};
