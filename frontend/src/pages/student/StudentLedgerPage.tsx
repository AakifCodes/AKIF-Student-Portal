import React from 'react';
import { useGetStudentLedgerQuery, useGetMyProfileQuery } from '../../services/apiSlice';
import { Printer, Download, CreditCard, ShieldCheck } from 'lucide-react';

export const StudentLedgerPage: React.FC = () => {
  const { data: ledger = [] } = useGetStudentLedgerQuery();
  const { data: profile } = useGetMyProfileQuery();

  const totalDebit = ledger.reduce((acc, cur) => acc + cur.debit, 0);
  const totalCredit = ledger.reduce((acc, cur) => acc + cur.credit, 0);
  const currentBalance = totalDebit - totalCredit;

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Student General Ledger</h1>
          <p className="text-xs text-slate-500">Official fee ledger account and financial transaction statements</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <Printer className="h-4 w-4" /> Print Ledger Report
          </button>
        </div>
      </div>

      {/* Official Report Card (Matches Screenshot 17) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        {/* Report Header */}
        <div className="text-center border-b border-slate-200 pb-4">
          <h2 className="text-lg font-black tracking-wide text-blue-900 uppercase">
            STUDENT GENERAL LEDGER REPORT
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">REPORT DATE: 30-Oct-2026 00:00:43</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-slate-700">
            <span>Student: <strong className="text-blue-950 font-bold">{profile?.roll_no || '24SP-028-SE'} / {profile?.name || 'MUHAMMAD AKIF ALVI'}</strong></span>
            <span>Program Structure: <strong className="text-slate-900 font-bold">BS Software Engineering - 4 YR</strong></span>
            <span>Current Balance: <strong className="text-rose-600 font-bold">PKR {Number(profile?.current_balance || currentBalance).toLocaleString()}.00</strong></span>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-[#0b5c9e] text-white font-semibold">
              <tr>
                <th className="py-2.5 px-3 border border-blue-900">FEE NATURE</th>
                <th className="py-2.5 px-3 border border-blue-900">SESSION</th>
                <th className="py-2.5 px-3 border border-blue-900">DATE</th>
                <th className="py-2.5 px-3 border border-blue-900 text-right">DEBIT (PKR)</th>
                <th className="py-2.5 px-3 border border-blue-900 text-right">CREDIT (PKR)</th>
                <th className="py-2.5 px-3 border border-blue-900 text-right">CURRENT BALANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700 font-sans">
              {ledger.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 border border-slate-200 font-semibold text-blue-950">{item.fee_nature}</td>
                  <td className="py-2.5 px-3 border border-slate-200 text-slate-600">{item.session}</td>
                  <td className="py-2.5 px-3 border border-slate-200 text-slate-600">{item.date}</td>
                  <td className="py-2.5 px-3 border border-slate-200 text-right font-mono font-medium">
                    {item.debit > 0 ? item.debit.toLocaleString() : '-'}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-200 text-right font-mono font-medium text-emerald-700">
                    {item.credit > 0 ? item.credit.toLocaleString() : '-'}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                    {item.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 font-bold text-slate-800 text-xs">
              <tr>
                <td colSpan={3} className="py-3 px-3 text-right">Total Aggregate (PKR):</td>
                <td className="py-3 px-3 text-right font-mono">{totalDebit.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono text-emerald-700">{totalCredit.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono text-rose-700">
                  {currentBalance.toLocaleString()}.00
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="text-[11px] text-slate-400 italic">
          * Note: This is a system-generated official ledger report verified by the UIT University Finance Directorate.
        </div>
      </div>
    </div>
  );
};
