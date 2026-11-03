import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4">
      {/* Container matching Screenshot 17 official error style */}
      <div className="w-full max-w-2xl bg-white border border-slate-300 rounded-lg p-6 shadow-xs font-sans">
        <h2 className="text-xl font-bold text-red-700 border-b border-slate-200 pb-2">
          Server Error
        </h2>
        <div className="mt-4 p-4 border border-rose-200 bg-rose-50/50 rounded text-xs text-slate-800 leading-relaxed">
          <h3 className="font-bold text-red-800 text-sm mb-1">
            404 - File or directory not found.
          </h3>
          <p className="text-slate-600">
            The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
          <button
            onClick={() => navigate('/student')}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors"
          >
            <Home className="h-4 w-4" /> Portal Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
