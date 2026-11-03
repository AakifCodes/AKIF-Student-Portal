import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

// Layout
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute, AdminRoute, StudentRoute } from './Guards';

// Pages
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Student Pages
import { StudentDashboardPage } from '../pages/student/StudentDashboardPage';
import { StudentCoursesPage } from '../pages/student/StudentCoursesPage';
import { StudentAttendancePage } from '../pages/student/StudentAttendancePage';
import { StudentResultsPage } from '../pages/student/StudentResultsPage';
import { StudentAssignmentsPage } from '../pages/student/StudentAssignmentsPage';
import { StudentTimetablePage } from '../pages/student/StudentTimetablePage';
import { StudentExamSeatingPage } from '../pages/student/StudentExamSeatingPage';
import { StudentOnlineExamPage } from '../pages/student/StudentOnlineExamPage';
import { StudentTranscriptPage } from '../pages/student/StudentTranscriptPage';
import { StudentAdmitCardPage } from '../pages/student/StudentAdmitCardPage';
import { StudentLedgerPage } from '../pages/student/StudentLedgerPage';
import { StudentAdvanceFeePage } from '../pages/student/StudentAdvanceFeePage';
import { StudentRoadMapPage } from '../pages/student/StudentRoadMapPage';
import { StudentWorkflowPage } from '../pages/student/StudentWorkflowPage';
import { StudentCommunicationPage } from '../pages/student/StudentCommunicationPage';
import { StudentTodoListPage } from '../pages/student/StudentTodoListPage';
import { StudentChangePasswordPage } from '../pages/student/StudentChangePasswordPage';
import { StudentPloPage } from '../pages/student/StudentPloPage';
import { StudentOnlineRegistrationPage } from '../pages/student/StudentOnlineRegistrationPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminStudentsPage } from '../pages/admin/AdminStudentsPage';
import { AdminCoursesPage } from '../pages/admin/AdminCoursesPage';
import { AdminAttendancePage } from '../pages/admin/AdminAttendancePage';
import { AdminResultsPage } from '../pages/admin/AdminResultsPage';
import { AdminAssignmentsPage } from '../pages/admin/AdminAssignmentsPage';
import { AdminAnnouncementsPage } from '../pages/admin/AdminAnnouncementsPage';

export const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/student'} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Root Redirection */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/student'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Authenticated Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* ================= STUDENT ROUTES ================= */}
          <Route element={<StudentRoute />}>
            <Route path="/student" element={<StudentDashboardPage />} />
            <Route path="/student/courses" element={<StudentCoursesPage />} />
            <Route path="/student/attendance" element={<StudentAttendancePage />} />
            <Route path="/student/results" element={<StudentResultsPage />} />
            <Route path="/student/assignments" element={<StudentAssignmentsPage />} />
            <Route path="/student/timetable" element={<StudentTimetablePage />} />
            <Route path="/student/exam-seating" element={<StudentExamSeatingPage />} />
            <Route path="/student/online-exam" element={<StudentOnlineExamPage />} />
            <Route path="/student/transcript" element={<StudentTranscriptPage />} />
            <Route path="/student/admit-card" element={<StudentAdmitCardPage />} />
            <Route path="/student/lab-admit-card" element={<StudentAdmitCardPage />} />
            <Route path="/student/ledger" element={<StudentLedgerPage />} />
            <Route path="/student/advance-fee" element={<StudentAdvanceFeePage />} />
            <Route path="/student/roadmap" element={<StudentRoadMapPage />} />
            <Route path="/student/workflow" element={<StudentWorkflowPage />} />
            <Route path="/student/communication" element={<StudentCommunicationPage />} />
            <Route path="/student/todos" element={<StudentTodoListPage />} />
            <Route path="/student/change-password" element={<StudentChangePasswordPage />} />
            <Route path="/student/plo" element={<StudentPloPage />} />
            <Route path="/student/online-registration" element={<StudentOnlineRegistrationPage />} />
          </Route>

          {/* ================= ADMIN ROUTES ================= */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/attendance" element={<AdminAttendancePage />} />
            <Route path="/admin/results" element={<AdminResultsPage />} />
            <Route path="/admin/assignments" element={<AdminAssignmentsPage />} />
            <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
