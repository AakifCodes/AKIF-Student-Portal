import React from 'react';

interface QueryStateProps {
  isLoading?: boolean;
  error?: unknown;
  empty?: boolean;
  emptyText?: string;
  children: React.ReactNode;
}

export const QueryState: React.FC<QueryStateProps> = ({
  isLoading,
  error,
  empty,
  emptyText = 'No records found.',
  children,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500 shadow-xs">
        Loading academic records…
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-xs text-rose-800">
        Unable to load this page. Please refresh or sign in again.
      </div>
    );
  }
  if (empty) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500 shadow-xs">
        {emptyText}
      </div>
    );
  }
  return <>{children}</>;
};
