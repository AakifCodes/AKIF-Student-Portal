import React, { useState } from 'react';
import {
  useGetAllStudentsQuery,
  useGetAllCoursesQuery,
  useGetMyResultsQuery,
  useAddResultMutation,
} from '../../services/apiSlice';
import { Award, Plus, CheckCircle2 } from 'lucide-react';

export const AdminResultsPage: React.FC = () => {
  const { data: students = [] } = useGetAllStudentsQuery();
  const { data: courses = [] } = useGetAllCoursesQuery();
  const { data: results = [] } = useGetMyResultsQuery();
  const [addResult] = useAddResultMutation();

  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const [studentId, setStudentId] = useState('student-akif');
  const [courseCode, setCourseCode] = useState('SE-311');
  const [assessmentType, setAssessmentType] = useState('Midterm Examination');
  const [totalMarks, setTotalMarks] = useState(30);
  const [passingMarks, setPassingMarks] = useState(15);
  const [obtainedMarks, setObtainedMarks] = useState(27);
  const [grade, setGrade] = useState('A');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const selCourse = courses.find((c) => c.code === courseCode);

    await addResult({
      student_id: studentId,
      course_code: courseCode,
      course_name: selCourse?.name || 'Data Warehousing and Data Mining',
      session: 'Fall 2026',
      assessment_type: assessmentType,
      total_marks: Number(totalMarks),
      passing_marks: Number(passingMarks),
      obtained_marks: Number(obtainedMarks),
      grade,
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Results &amp; Grading Management</h1>
          <p className="text-xs text-slate-500">Publish midterms, quizzes, and sessional evaluation marks</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
        >
          <Plus className="h-4 w-4" /> Add / Publish Result
        </button>
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Evaluation marks and letter grade published successfully!</span>
        </div>
      )}

      {/* Results Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-[#0b5c9e] px-6 py-3.5 text-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">Published Academic Scores</span>
          <span className="text-xs text-blue-100 font-medium">Session Fall 2026</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8fafc] text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
            <tr>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Assessment Type</th>
              <th className="py-3 px-4 text-center">Total Marks</th>
              <th className="py-3 px-4 text-center">Passing Marks</th>
              <th className="py-3 px-4 text-center">Obtained Marks</th>
              <th className="py-3 px-4 text-center">Grade</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {results.map((r) => (
              <tr key={r.id || r.course_code} className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  <div>{r.course_name}</div>
                  <span className="text-[11px] text-blue-700 font-semibold">{r.course_code}</span>
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-800">{r.assessment_type}</td>
                <td className="py-3.5 px-4 text-center font-semibold text-slate-600">{r.total_marks}</td>
                <td className="py-3.5 px-4 text-center font-semibold text-slate-600">{r.passing_marks}</td>
                <td className="py-3.5 px-4 text-center font-bold text-slate-900 text-sm">{r.obtained_marks}</td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-800">{r.grade}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    Published
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">Post Assessment Marks</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Candidate Student
                </label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="student-akif">MUHAMMAD AKIF ALVI (24SP-028-SE)</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.roll_no})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Course
                </label>
                <select
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                >
                  {courses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Assessment Type
                  </label>
                  <input
                    type="text"
                    value={assessmentType}
                    onChange={(e) => setAssessmentType(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Grade
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Total
                  </label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Passing
                  </label>
                  <input
                    type="number"
                    value={passingMarks}
                    onChange={(e) => setPassingMarks(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Obtained
                  </label>
                  <input
                    type="number"
                    value={obtainedMarks}
                    onChange={(e) => setObtainedMarks(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
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
                  Publish Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
