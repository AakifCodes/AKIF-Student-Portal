import React, { useState } from 'react';
import { useGetTodosQuery, useCreateTodoMutation, useToggleTodoMutation } from '../../services/apiSlice';
import { Plus, CheckSquare, Trash2, Calendar, AlertCircle } from 'lucide-react';

export const StudentTodoListPage: React.FC = () => {
  const { data: todos = [], isLoading } = useGetTodosQuery();
  const [createTodo] = useCreateTodoMutation();
  const [toggleTodo] = useToggleTodoMutation();

  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-05');
  const [priority, setPriority] = useState('High');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    await createTodo({ task, due_date: dueDate, priority });
    setTask('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800">Todo List &amp; Task Tracker</h1>
        <p className="text-xs text-slate-500">Organize coursework assignments, project milestones, and exam revisions</p>
      </div>

      {/* Task Creation Form (Matches Screenshot 16) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Create New Task</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Task Description
            </label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Complete SE-314 Repository Pattern Assignment"
              required
              className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Priority
            </label>
            <div className="flex gap-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tasks Table (Matches Screenshot 16) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">Scheduled Tasks &amp; Milestones</span>
          <span className="text-xs text-blue-100">{todos.length} Active Items</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
            <tr>
              <th className="py-3 px-4">Task</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {todos.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-800">
                  <span className={t.status === 'Completed' ? 'line-through text-slate-400' : ''}>
                    {t.task}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-500">{t.due_date}</td>
                <td className="py-3 px-4">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      t.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {t.priority}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => toggleTodo(t.id)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                  >
                    {t.status === 'Completed' ? 'Reopen' : 'Mark Done'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
