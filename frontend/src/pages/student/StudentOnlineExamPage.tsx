import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  useGetOnlineExamsQuery,
  useLazyGetOnlineExamQuery,
  useSubmitOnlineExamMutation,
} from '../../services/apiSlice';
import type { OnlineExam } from '../../types';
import { Laptop, PlayCircle, CheckCircle2, Clock3 } from 'lucide-react';
import { QueryState } from '../../components/QueryState';

const formatClock = (seconds: number) => {
  const mins = Math.floor(Math.max(0, seconds) / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.max(0, seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
};

export const StudentOnlineExamPage: React.FC = () => {
  const { data: exams = [], isLoading, error } = useGetOnlineExamsQuery();
  const [loadExam] = useLazyGetOnlineExamQuery();
  const [submitExam, { isLoading: isSubmitting }] = useSubmitOnlineExamMutation();

  const [activeExam, setActiveExam] = useState<OnlineExam | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(-1);
  const [resultMessage, setResultMessage] = useState('');
  const [formError, setFormError] = useState('');
  const submitLock = useRef(false);

  const currentQuestion = activeExam?.questions?.[questionIndex];
  const totalQuestions = activeExam?.questions?.length || 0;
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  useEffect(() => {
    if (!activeExam) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeExam?.id]);

  useEffect(() => {
    if (activeExam && secondsLeft === 0) {
      void handleSubmit(true);
    }
  }, [secondsLeft, activeExam]);

  const startExam = async (examId: string) => {
    setFormError('');
    setResultMessage('');
    try {
      const exam = await loadExam(examId).unwrap();
      submitLock.current = false;
      setActiveExam(exam);
      setAnswers({});
      setQuestionIndex(0);
      setSecondsLeft((exam.duration_minutes || 30) * 60);
    } catch (err: any) {
      setFormError(err?.data?.detail || 'This assessment cannot be started right now.');
    }
  };

  const handleSubmit = async (auto = false) => {
    if (!activeExam || isSubmitting || submitLock.current) return;
    submitLock.current = true;
    try {
      const res = await submitExam({ examId: activeExam.id, answers }).unwrap();
      setResultMessage(auto ? `Time expired. ${res.message}` : res.message);
      setActiveExam(null);
    } catch (err: any) {
      setFormError(err?.data?.detail || 'Unable to submit the exam.');
      submitLock.current = false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800">Online Examination Portal</h1>
        <p className="text-xs text-slate-500">Computer-based testing and real-time assessments</p>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-blue-900 flex items-center gap-2.5">
        <Laptop className="h-4 w-4 shrink-0 text-blue-700" />
        <span>
          <strong>Note:</strong> Use a laptop or desktop with Google Chrome. Answers are scored on the server and cannot be resubmitted.
        </span>
      </div>

      {resultMessage && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{resultMessage}</span>
        </div>
      )}
      {formError && (
        <div className="rounded-xl bg-rose-50 p-4 border border-rose-200 text-xs text-rose-800">{formError}</div>
      )}

      <QueryState isLoading={isLoading} error={error} empty={exams.length === 0} emptyText="No online assessments have been published.">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Scheduled Online Tests</span>
            <span className="text-xs text-blue-100 font-medium">Fall 2026</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Assessment / Survey</th>
                <th className="py-3 px-4">Session</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{exam.survey}</td>
                  <td className="py-3.5 px-4 text-slate-600">{exam.session}</td>
                  <td className="py-3.5 px-4 font-semibold text-blue-900">{exam.course}</td>
                  <td className="py-3.5 px-4 text-slate-700">{exam.faculty}</td>
                  <td className="py-3.5 px-4 font-mono font-medium">{exam.timing}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        exam.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : exam.status === 'Completed'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {exam.status === 'Available' ? (
                      <button
                        onClick={() => startExam(exam.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700 shadow-2xs"
                      >
                        <PlayCircle className="h-3.5 w-3.5" /> Start Exam
                      </button>
                    ) : exam.status === 'Completed' ? (
                      <span className="text-[11px] font-semibold text-slate-500">
                        {exam.score != null ? `Score ${exam.score}%` : 'Submitted'}
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-amber-700">Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </QueryState>

      {activeExam && currentQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                {activeExam.survey}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-600">
                <Clock3 className="h-3.5 w-3.5" /> {formatClock(secondsLeft)}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">{activeExam.course}</h3>
            <p className="text-xs text-slate-500 mb-4">
              Question {questionIndex + 1} of {totalQuestions} • Answered {answeredCount}/{totalQuestions}
            </p>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-800 mb-4 leading-relaxed">
              <strong>Q:</strong> {currentQuestion.prompt}
            </div>
            <div className="space-y-2 mb-6 text-xs text-slate-700">
              {currentQuestion.options.map((opt, i) => (
                <label key={opt} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-blue-50 cursor-pointer">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    checked={answers[currentQuestion.id] === i}
                    onChange={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: i }))}
                    className="text-blue-600"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setQuestionIndex((idx) => Math.max(0, idx - 1))}
                disabled={questionIndex === 0}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              {questionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setQuestionIndex((idx) => Math.min(totalQuestions - 1, idx + 1))}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Exam'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
