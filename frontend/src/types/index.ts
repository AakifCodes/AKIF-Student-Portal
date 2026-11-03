export type UserRole = 'ADMIN' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at?: string;
}

export interface StudentProfile {
  id: string;
  user_id?: string;
  roll_no: string;
  name: string;
  email: string;
  enrollment_no: string;
  section: string;
  program: string;
  department: string;
  current_semester: string;
  semester_number: number;
  cgpa: number;
  registered_courses: number;
  average_attendance: number;
  current_balance: number;
  status: string;
  campus: string;
  phone?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credit_hours: string;
  faculty: string;
  timings: string;
  room: string;
  department: string;
  semester: string;
  attendance?: number;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  course_code: string;
  course_name: string;
  section_code: string;
  faculty: string;
  scheduled: number;
  conducted: number;
  attended: number;
  percentage: number;
}

export interface AssessmentResult {
  id: string;
  student_id: string;
  course_code: string;
  course_name: string;
  session: string;
  assessment_type: string;
  total_marks: number;
  passing_marks: number;
  obtained_marks: number;
  grade: string;
}

export interface AssignmentSubmission {
  student_id: string;
  submitted_at: string;
  file_name: string;
  status: string;
  score?: number | null;
  feedback?: string | null;
}

export interface Assignment {
  id: string;
  course_code: string;
  title: string;
  description: string;
  due_date: string;
  total_points: number;
  submissions: AssignmentSubmission[];
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  author: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export interface TimetableSlot {
  id?: string;
  day: string;
  time: string;
  course_code: string;
  course_name: string;
  room: string;
  faculty: string;
}

export interface LedgerEntry {
  id: string;
  student_id: string;
  fee_nature: string;
  session: string;
  date: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface TodoTask {
  id: string;
  student_id: string;
  task: string;
  due_date: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface WorkflowRequest {
  id: string;
  student_id: string;
  workflow_type: string;
  submission_date: string;
  status: string;
  remarks?: string;
}

export interface PloRecord {
  semester: string;
  course: string;
  class_event: string;
  faculty: string;
  credit_hours: string;
  po1: string;
  po2: string;
  po3: string;
  po4: string;
}

export interface ExamSeat {
  id: string;
  student_id: string;
  session: string;
  exam_type: string;
  date: string;
  start: string;
  end: string;
  course_code: string;
  course_name: string;
  room: string;
  seat: string;
}

export interface AdmitCard {
  session: string;
  exam_type: string;
  issued_on: string;
  controller: string;
  student: {
    name?: string;
    roll_no?: string;
    enrollment_no?: string;
    program?: string;
    section?: string;
    department?: string;
  };
  exams: ExamSeat[];
}

export interface ExamQuestion {
  id: string;
  prompt: string;
  options: string[];
}

export interface OnlineExam {
  id: string;
  survey: string;
  session: string;
  course_code: string;
  course: string;
  faculty: string;
  timing: string;
  duration_minutes: number;
  status: string;
  score?: number | null;
  questions?: ExamQuestion[];
}

export interface ExamSubmitResult {
  exam_id: string;
  score: number;
  total: number;
  correct: number;
  status: string;
  message: string;
}

export interface TranscriptCourse {
  code: string;
  title: string;
  credits: string;
  grade: string;
  points: string;
}

export interface TranscriptSemester {
  semester: string;
  gpa: string;
  credits: number;
  courses: TranscriptCourse[];
}

export interface Transcript {
  program: string;
  program_code: string;
  cgpa: number;
  total_credits: number;
  semesters: TranscriptSemester[];
}

export interface AdvanceReceipt {
  id: string;
  student_id: string;
  receipt_no: string;
  date: string;
  amount: number;
  status: string;
  mode: string;
}

export interface RoadmapCourse {
  code: string;
  name: string;
  pre: string;
  cr: string;
  status: string;
}

export interface RoadmapSemester {
  semester: string;
  status: string;
  courses: RoadmapCourse[];
}

export interface Roadmap {
  registration_no: string;
  candidate_name: string;
  program: string;
  enrollment_session: string;
  semesters: RoadmapSemester[];
}

export interface CommunicationMessage {
  id: string;
  student_id: string;
  student_name?: string;
  comm_type: string;
  faculty: string;
  category: string;
  course_code: string;
  message: string;
  follow_up: boolean;
  email_reminder: boolean;
  status: string;
  reply?: string | null;
  created_at: string;
}

export interface RegistrationOffering {
  id?: string;
  code: string;
  title: string;
  credits: number;
  type: string;
  faculty: string;
  semester: string;
}

export interface CourseRegistration {
  id: string;
  student_id: string;
  semester: string;
  course_codes: string[];
  total_credits: number;
  status: string;
  submitted_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
