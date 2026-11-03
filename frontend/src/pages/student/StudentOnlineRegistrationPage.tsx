import React, { useEffect, useMemo, useState } from 'react';
import {
  useGetRegistrationOfferingsQuery,
  useGetMyRegistrationQuery,
  useSubmitRegistrationMutation,
} from '../../services/apiSlice';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { QueryState } from '../../components/QueryState';

export const StudentOnlineRegistrationPage: React.FC = () => {
  const { data: offerings = [], isLoading, error } = useGetRegistrationOfferingsQuery();
  const { data: existing } = useGetMyRegistrationQuery();
  const [submitRegistration, { isLoading: isSaving }] = useSubmitRegistrationMutation();

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (initialized) return;
    if (existing?.course_codes?.length) {
      setSelectedCourses(existing.course_codes);
      setInitialized(true);
      return;
    }
    if (offerings.length) {
      setSelectedCourses(offerings.filter((item) => item.type !== 'Elective').map((item) => item.code));
      setInitialized(true);
    }
  }, [existing, offerings, initialized]);

  const totalCredits = useMemo(
    () =>
      offerings
        .filter((course) => selectedCourses.includes(course.code))
        .reduce((sum, course) => sum + course.credits, 0),
    [offerings, selectedCourses]
  );

  const toggleCourse = (code: string) => {
    setSelectedCourses((prev) =>
      prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
    );
  };

  const handleRegister = async () => {
    setFormError('');
    setSuccessMessage('');
    try {
      const res = await submitRegistration({
        course_codes: selectedCourses,
        semester: 'Spring 2027',
      }).unwrap();
      setSuccessMessage(
        `Enrollment saved: ${res.course_codes.length} courses (${res.total_credits} credit hours) for ${res.semester}.`
      );
    } catch (err: any) {
      setFormError(err?.data?.detail || 'Unable to complete course registration.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800">Online Semester Course Registration</h1>
        <p className="text-xs text-slate-500">Regular course enrollment for upcoming academic term</p>
      </div>

      {successMessage && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}
      {formError && (
        <div className="rounded-xl bg-rose-50 p-4 border border-rose-200 text-xs text-rose-800">{formError}</div>
      )}
      {existing?.status === 'Registered' && !successMessage && (
        <div className="rounded-xl bg-blue-50 p-4 border border-blue-200 text-xs text-blue-900">
          You already submitted a Spring 2027 registration on {new Date(existing.submitted_at).toLocaleString()}. You can update the selection and save again.
        </div>
      )}

      <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-rose-900 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-rose-950">Registration Notice for Regular Students</h4>
          <p className="leading-relaxed">
            Please ensure you have cleared outstanding fees before the window closes. Credit hours must stay between 12 and 21.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-wrap items-center justify-between gap-6 text-xs">
        <div>
          <span className="text-slate-400 font-semibold block text-[11px] uppercase">Enrolling Semester</span>
          <strong className="text-base text-blue-900 font-bold">SEMESTER VI (Spring 2027)</strong>
        </div>
        <div>
          <span className="text-slate-400 font-semibold block text-[11px] uppercase">Min Credit Hours</span>
          <strong className="text-base text-slate-800 font-bold">12</strong>
        </div>
        <div>
          <span className="text-slate-400 font-semibold block text-[11px] uppercase">Max Credit Hours</span>
          <strong className="text-base text-slate-800 font-bold">21</strong>
        </div>
        <div>
          <span className="text-slate-400 font-semibold block text-[11px] uppercase">Total Selected Credits</span>
          <strong className={`text-xl font-black ${totalCredits >= 12 && totalCredits <= 21 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {totalCredits}
          </strong>
        </div>
      </div>

      <QueryState isLoading={isLoading} error={error} empty={offerings.length === 0} emptyText="No course offerings are open for registration.">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Available Courses for Selection</span>
            <span className="text-xs text-blue-100 font-medium">Spring 2027 Offering</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4 text-center">Select</th>
                <th className="py-3 px-4">Course Code</th>
                <th className="py-3 px-4">Course Title</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4 text-center">Credits</th>
                <th className="py-3 px-4">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {offerings.map((course) => {
                const isSelected = selectedCourses.includes(course.code);
                return (
                  <tr key={course.code} className={`hover:bg-slate-50 ${isSelected ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCourse(course.code)}
                        className="h-4 w-4 rounded text-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">{course.code}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{course.title}</td>
                    <td className="py-3.5 px-4 text-slate-600">{course.faculty}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{course.credits}</td>
                    <td className="py-3.5 px-4">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        {course.type}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Selected: <strong className="text-slate-800">{selectedCourses.length} courses</strong> ({totalCredits} credit hours)
            </span>
            <button
              onClick={handleRegister}
              disabled={isSaving || totalCredits < 12 || totalCredits > 21}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? 'Saving…' : 'Confirm & Register Courses'}
            </button>
          </div>
        </div>
      </QueryState>
    </div>
  );
};
