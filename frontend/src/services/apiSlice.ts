import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  User,
  StudentProfile,
  Course,
  AttendanceRecord,
  AssessmentResult,
  Assignment,
  Announcement,
  NotificationItem,
  TimetableSlot,
  LedgerEntry,
  TodoTask,
  WorkflowRequest,
  PloRecord,
  ExamSeat,
  AdmitCard,
  OnlineExam,
  ExamSubmitResult,
  Transcript,
  AdvanceReceipt,
  Roadmap,
  CommunicationMessage,
  RegistrationOffering,
  CourseRegistration,
} from '../types';
import { API_BASE_URL } from './apiConfig';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('uit_portal_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'User',
    'Student',
    'Courses',
    'Attendance',
    'Results',
    'Assignments',
    'Announcements',
    'Notifications',
    'Timetable',
    'Ledger',
    'Todos',
    'Workflows',
    'Plo',
    'AdminStats',
    'ExamSeating',
    'OnlineExams',
    'Transcript',
    'AdvanceFees',
    'Roadmap',
    'Communications',
    'Registration',
  ],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<
      { access_token: string; token_type: string; user: User },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    changePassword: builder.mutation<
      { message: string },
      { old_password?: string; new_password: string; confirm_password: string }
    >({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
    }),

    // Student Profile
    getMyProfile: builder.query<StudentProfile, void>({
      query: () => '/students/me',
      providesTags: ['Student'],
    }),

    getAllStudents: builder.query<StudentProfile[], void>({
      query: () => '/students',
      providesTags: ['Student'],
    }),

    createStudent: builder.mutation<StudentProfile, Partial<StudentProfile> & { password?: string }>({
      query: (body) => ({
        url: '/students',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Student', 'AdminStats'],
    }),

    deleteStudent: builder.mutation<{ message: string; id?: string }, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student', 'AdminStats'],
    }),

    // Courses
    getMyCourses: builder.query<Course[], void>({
      query: () => '/courses/my-courses',
      providesTags: ['Courses'],
    }),

    getAllCourses: builder.query<Course[], void>({
      query: () => '/courses',
      providesTags: ['Courses'],
    }),

    createCourse: builder.mutation<Course, Partial<Course>>({
      query: (body) => ({
        url: '/courses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Courses', 'AdminStats'],
    }),

    deleteCourse: builder.mutation<{ message: string; id?: string }, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courses', 'AdminStats'],
    }),

    // Attendance
    getMyAttendance: builder.query<AttendanceRecord[], void>({
      query: () => '/attendance/my-attendance',
      providesTags: ['Attendance'],
    }),

    recordAttendance: builder.mutation<AttendanceRecord, Partial<AttendanceRecord>>({
      query: (body) => ({
        url: '/attendance',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Results
    getMyResults: builder.query<AssessmentResult[], void>({
      query: () => '/results/my-results',
      providesTags: ['Results'],
    }),

    addResult: builder.mutation<AssessmentResult, Partial<AssessmentResult>>({
      query: (body) => ({
        url: '/results',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Results'],
    }),

    // Assignments
    getAssignments: builder.query<Assignment[], void>({
      query: () => '/assignments',
      providesTags: ['Assignments'],
    }),

    createAssignment: builder.mutation<Assignment, Partial<Assignment>>({
      query: (body) => ({
        url: '/assignments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Assignments', 'AdminStats'],
    }),

    submitAssignment: builder.mutation<
      Assignment,
      { assignmentId: string; file_name: string; comments?: string }
    >({
      query: ({ assignmentId, ...body }) => ({
        url: `/assignments/${assignmentId}/submit`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Assignments'],
    }),

    // Announcements
    getAnnouncements: builder.query<Announcement[], void>({
      query: () => '/announcements',
      providesTags: ['Announcements'],
    }),

    createAnnouncement: builder.mutation<Announcement, Partial<Announcement>>({
      query: (body) => ({
        url: '/announcements',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Announcements', 'AdminStats'],
    }),

    deleteAnnouncement: builder.mutation<{ message: string; id?: string }, string>({
      query: (id) => ({
        url: `/announcements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Announcements', 'AdminStats'],
    }),

    // Notifications
    getNotifications: builder.query<NotificationItem[], void>({
      query: () => '/notifications',
      providesTags: ['Notifications'],
    }),

    markNotificationRead: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Timetable
    getTimetables: builder.query<TimetableSlot[], void>({
      query: () => '/timetables',
      providesTags: ['Timetable'],
    }),

    // Fees / Ledger
    getStudentLedger: builder.query<LedgerEntry[], void>({
      query: () => '/fees/ledger',
      providesTags: ['Ledger'],
    }),

    // Todos
    getTodos: builder.query<TodoTask[], void>({
      query: () => '/todos',
      providesTags: ['Todos'],
    }),

    createTodo: builder.mutation<TodoTask, { task: string; due_date: string; priority: string }>({
      query: (body) => ({
        url: '/todos',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Todos'],
    }),

    toggleTodo: builder.mutation<TodoTask, string>({
      query: (id) => ({
        url: `/todos/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Todos'],
    }),

    // Workflows
    getWorkflows: builder.query<WorkflowRequest[], void>({
      query: () => '/workflows',
      providesTags: ['Workflows'],
    }),

    createWorkflow: builder.mutation<WorkflowRequest, { workflow_type: string; remarks?: string }>({
      query: (body) => ({
        url: '/workflows',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Workflows'],
    }),

    // PLO Attainment
    getPloRecords: builder.query<PloRecord[], void>({
      query: () => '/plo',
      providesTags: ['Plo'],
    }),

    // Admin Stats & Users
    getAdminStats: builder.query<{
      total_students: number;
      total_courses: number;
      total_users: number;
      total_assignments: number;
      total_announcements: number;
      active_semester: string;
      system_status: string;
      security_mode: string;
    }, void>({
      query: () => '/admin/stats',
      providesTags: ['AdminStats'],
    }),

    getAdminUsers: builder.query<User[], void>({
      query: () => '/admin/users',
      providesTags: ['AdminStats'],
    }),

    deleteTodo: builder.mutation<{ message: string; id?: string }, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todos'],
    }),

    getExamSeating: builder.query<ExamSeat[], void>({
      query: () => '/exams/seating',
      providesTags: ['ExamSeating'],
    }),

    getAdmitCard: builder.query<AdmitCard, void>({
      query: () => '/exams/admit-card',
      providesTags: ['ExamSeating'],
    }),

    getOnlineExams: builder.query<OnlineExam[], void>({
      query: () => '/exams/online',
      providesTags: ['OnlineExams'],
    }),

    getOnlineExam: builder.query<OnlineExam, string>({
      query: (id) => `/exams/online/${id}`,
      providesTags: ['OnlineExams'],
    }),

    submitOnlineExam: builder.mutation<ExamSubmitResult, { examId: string; answers: Record<string, number> }>({
      query: ({ examId, answers }) => ({
        url: `/exams/online/${examId}/submit`,
        method: 'POST',
        body: { answers },
      }),
      invalidatesTags: ['OnlineExams'],
    }),

    getTranscript: builder.query<Transcript, void>({
      query: () => '/transcripts/me',
      providesTags: ['Transcript'],
    }),

    getAdvanceReceipts: builder.query<AdvanceReceipt[], void>({
      query: () => '/fees/advance-receipts',
      providesTags: ['AdvanceFees'],
    }),

    getRoadmap: builder.query<Roadmap, void>({
      query: () => '/roadmap',
      providesTags: ['Roadmap'],
    }),

    getCommunications: builder.query<CommunicationMessage[], void>({
      query: () => '/communications',
      providesTags: ['Communications'],
    }),

    sendCommunication: builder.mutation<
      CommunicationMessage,
      {
        comm_type: string;
        faculty: string;
        category: string;
        course_code: string;
        message: string;
        follow_up?: boolean;
        email_reminder?: boolean;
      }
    >({
      query: (body) => ({
        url: '/communications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Communications'],
    }),

    getRegistrationOfferings: builder.query<RegistrationOffering[], void>({
      query: () => '/registration/offerings',
      providesTags: ['Registration'],
    }),

    getMyRegistration: builder.query<CourseRegistration | null, void>({
      query: () => '/registration/me',
      providesTags: ['Registration'],
    }),

    submitRegistration: builder.mutation<CourseRegistration, { course_codes: string[]; semester?: string }>({
      query: (body) => ({
        url: '/registration',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Registration'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useChangePasswordMutation,
  useGetMyProfileQuery,
  useGetAllStudentsQuery,
  useCreateStudentMutation,
  useDeleteStudentMutation,
  useGetMyCoursesQuery,
  useGetAllCoursesQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetMyAttendanceQuery,
  useRecordAttendanceMutation,
  useGetMyResultsQuery,
  useAddResultMutation,
  useGetAssignmentsQuery,
  useCreateAssignmentMutation,
  useSubmitAssignmentMutation,
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useGetTimetablesQuery,
  useGetStudentLedgerQuery,
  useGetTodosQuery,
  useCreateTodoMutation,
  useToggleTodoMutation,
  useGetWorkflowsQuery,
  useCreateWorkflowMutation,
  useGetPloRecordsQuery,
  useGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useDeleteTodoMutation,
  useGetExamSeatingQuery,
  useGetAdmitCardQuery,
  useGetOnlineExamsQuery,
  useLazyGetOnlineExamQuery,
  useSubmitOnlineExamMutation,
  useGetTranscriptQuery,
  useGetAdvanceReceiptsQuery,
  useGetRoadmapQuery,
  useGetCommunicationsQuery,
  useSendCommunicationMutation,
  useGetRegistrationOfferingsQuery,
  useGetMyRegistrationQuery,
  useSubmitRegistrationMutation,
} = apiSlice;
