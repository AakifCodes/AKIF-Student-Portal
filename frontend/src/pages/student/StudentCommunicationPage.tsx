import React, { useEffect, useState } from 'react';
import {
  useGetMyCoursesQuery,
  useGetCommunicationsQuery,
  useSendCommunicationMutation,
} from '../../services/apiSlice';
import { Send, CheckCircle2 } from 'lucide-react';
import { QueryState } from '../../components/QueryState';

export const StudentCommunicationPage: React.FC = () => {
  const { data: courses = [] } = useGetMyCoursesQuery();
  const { data: messages = [], isLoading, error } = useGetCommunicationsQuery();
  const [sendCommunication, { isLoading: isSending }] = useSendCommunicationMutation();

  const [commType, setCommType] = useState('Query');
  const [faculty, setFaculty] = useState('');
  const [category, setCategory] = useState('Academic');
  const [course, setCourse] = useState('');
  const [message, setMessage] = useState('');
  const [followUp, setFollowUp] = useState(true);
  const [emailReminder, setEmailReminder] = useState(false);
  const [sentSuccess, setSentSuccess] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!courses.length) return;
    if (!course) {
      setCourse(courses[0].code);
      setFaculty(courses[0].faculty);
    }
  }, [courses, course]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (message.trim().length < 10) {
      setFormError('Please write at least 10 characters so faculty can understand your request.');
      return;
    }
    try {
      await sendCommunication({
        comm_type: commType,
        faculty,
        category,
        course_code: course,
        message: message.trim(),
        follow_up: followUp,
        email_reminder: emailReminder,
      }).unwrap();
      setSentSuccess('Your message has been securely delivered to the faculty in-box.');
      setMessage('');
    } catch (err: any) {
      setFormError(err?.data?.detail || 'Unable to send communication.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800">New Communication</h1>
        <p className="text-xs text-slate-500">Official academic messaging channel to faculty members and department heads</p>
      </div>

      {sentSuccess && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{sentSuccess}</span>
        </div>
      )}
      {formError && (
        <div className="rounded-xl bg-rose-50 p-4 border border-rose-200 text-xs text-rose-800">{formError}</div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <form onSubmit={handleSend} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Communication Type
              </label>
              <select
                value={commType}
                onChange={(e) => setCommType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
              >
                <option value="Query">Query / Question</option>
                <option value="Feedback">Feedback</option>
                <option value="Assignment Inquiry">Assignment Inquiry</option>
                <option value="Appointment Request">Office Hours Appointment</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Faculty Recipient
              </label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
              >
                {courses.map((item) => (
                  <option key={`${item.code}-faculty`} value={item.faculty}>
                    {item.faculty} ({item.code})
                  </option>
                ))}
              </select>
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
                <option value="Attendance">Attendance</option>
                <option value="Laboratory">Laboratory Work</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Related Course
              </label>
              <select
                value={course}
                onChange={(e) => {
                  const next = e.target.value;
                  setCourse(next);
                  const match = courses.find((item) => item.code === next);
                  if (match) setFaculty(match.faculty);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
              >
                {courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Communication Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message details regarding course topics, quiz doubts, or assignment guidance..."
              rows={4}
              required
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={followUp} onChange={(e) => setFollowUp(e.target.checked)} className="rounded text-blue-600" />
                <span>Follow Up Task</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={emailReminder} onChange={(e) => setEmailReminder(e.target.checked)} className="rounded text-blue-600" />
                <span>Set Email Reminder</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs disabled:opacity-60"
            >
              <Send className="h-4 w-4" /> {isSending ? 'Sending…' : 'Send Communication'}
            </button>
          </div>
        </form>
      </div>

      <QueryState isLoading={isLoading} error={error} empty={messages.length === 0} emptyText="No previous communications.">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="bg-[#0b5c9e] px-6 py-3.5 text-white text-xs font-bold uppercase tracking-wider">
            Communication History
          </div>
          <div className="divide-y divide-slate-100">
            {messages.map((item) => (
              <div key={item.id} className="p-4 text-xs space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-slate-800">{item.comm_type} • {item.course_code} • {item.faculty}</strong>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{item.status}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{item.message}</p>
                {item.reply && <p className="rounded-lg bg-blue-50 border border-blue-100 p-2 text-blue-900"><strong>Reply:</strong> {item.reply}</p>}
              </div>
            ))}
          </div>
        </div>
      </QueryState>
    </div>
  );
};
