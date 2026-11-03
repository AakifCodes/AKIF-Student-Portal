import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { PortalLogo } from '../PortalLogo';
import {
  LayoutDashboard,
  BookOpen,
  FileSpreadsheet,
  Banknote,
  Grid,
  ClipboardList,
  ChevronRight,
  ChevronDown,
  Calendar,
  CheckSquare,
  Clock,
  MessageSquare,
  Compass,
  GitBranch,
  KeyRound,
  Award,
  UserPlus,
  Users,
  Building,
  GraduationCap,
  BellRing,
  HelpCircle,
  FileCheck2,
  Ticket
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Accordion state
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    exam: true,
    fee: false,
    general: true,
    registration: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#f8fafc] border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 bg-white">
          <NavLink to={isAdmin ? '/admin' : '/student'} className="flex items-center gap-2">
            <PortalLogo alt="UIT University Logo" className="h-10 w-auto object-contain" />
          </NavLink>
          <button
            onClick={onToggle}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 text-xs font-medium space-y-1 scrollbar-thin">
          {isAdmin ? (
            /* =================== ADMIN NAVIGATION =================== */
            <div className="space-y-1">
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-blue-900/70">
                Administration Portal
              </div>

              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-900'
                  }`
                }
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard Overview</span>
              </NavLink>

              <NavLink
                to="/admin/students"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-900'
                  }`
                }
              >
                <Users className="h-4 w-4" />
                <span>Students Management</span>
              </NavLink>

              <NavLink
                to="/admin/courses"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-900'
                  }`
                }
              >
                <BookOpen className="h-4 w-4" />
                <span>Course Offerings</span>
              </NavLink>

              <NavLink
                to="/admin/attendance"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-900'
                  }`
                }
              >
                <Clock className="h-4 w-4" />
                <span>Attendance Registry</span>
              </NavLink>

              <NavLink
                to="/admin/results"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-900'
                  }`
                }
              >
                <Award className="h-4 w-4" />
                <span>Results & Grading</span>
              </NavLink>

              <NavLink
                to="/admin/assignments"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-900'
                  }`
                }
              >
                <ClipboardList className="h-4 w-4" />
                <span>Assignments</span>
              </NavLink>

              <NavLink
                to="/admin/announcements"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-900'
                  }`
                }
              >
                <BellRing className="h-4 w-4" />
                <span>Circulars & Broadcasts</span>
              </NavLink>
            </div>
          ) : (
            /* =================== STUDENT NAVIGATION (Matches Screenshots) =================== */
            <div className="space-y-1">
              {/* 1. Dashboard */}
              <NavLink
                to="/student"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-[#0b5c9e] text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-900'
                  }`
                }
              >
                <div className="flex h-5 w-5 items-center justify-center text-blue-500">
                  <span className="h-2.5 w-2.5 rotate-45 rounded-xs bg-current"></span>
                </div>
                <span>Dashboard</span>
              </NavLink>

              {/* 2. Course */}
              <NavLink
                to="/student/courses"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-[#0b5c9e] text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-900'
                  }`
                }
              >
                <BookOpen className="h-4 w-4 text-slate-500" />
                <span>Course</span>
              </NavLink>

              {/* 3. Exam Dropdown */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => toggleSection('exam')}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-slate-700 hover:bg-blue-50/80 hover:text-blue-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="h-4 w-4 text-slate-500" />
                    <span>Exam</span>
                  </div>
                  {openSections.exam ? (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>

                {openSections.exam && (
                  <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-200 space-y-1">
                    <NavLink
                      to="/student/results"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Assessment Result
                    </NavLink>
                    <NavLink
                      to="/student/exam-seating"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Exam Seating Plan
                    </NavLink>
                    <NavLink
                      to="/student/online-exam"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Online Exam
                    </NavLink>
                    <NavLink
                      to="/student/transcript"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Student Unofficial Transcript
                    </NavLink>
                    <NavLink
                      to="/student/admit-card"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Print Admit Card
                    </NavLink>
                    <NavLink
                      to="/student/lab-admit-card"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Print Lab Admit Card
                    </NavLink>
                  </div>
                )}
              </div>

              {/* 4. Fee Dropdown */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => toggleSection('fee')}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-slate-700 hover:bg-blue-50/80 hover:text-blue-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Banknote className="h-4 w-4 text-slate-500" />
                    <span>Fee</span>
                  </div>
                  {openSections.fee ? (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>

                {openSections.fee && (
                  <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-200 space-y-1">
                    <NavLink
                      to="/student/ledger"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • My General Ledger
                    </NavLink>
                    <NavLink
                      to="/student/advance-fee"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Student Advance Fee
                    </NavLink>
                  </div>
                )}
              </div>

              {/* 5. General Dropdown */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => toggleSection('general')}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-slate-700 hover:bg-blue-50/80 hover:text-blue-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Grid className="h-4 w-4 text-slate-500" />
                    <span>General</span>
                  </div>
                  {openSections.general ? (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>

                {openSections.general && (
                  <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-200 space-y-1">
                    <NavLink
                      to="/student/timetable"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Time Table
                    </NavLink>
                    <NavLink
                      to="/student/todos"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Todo List
                    </NavLink>
                    <NavLink
                      to="/student/attendance"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Attendance
                    </NavLink>
                    <NavLink
                      to="/student/communication"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • New Communication
                    </NavLink>
                    <NavLink
                      to="/student/roadmap"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Road Map
                    </NavLink>
                    <NavLink
                      to="/student/workflow"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Work Flow
                    </NavLink>
                    <NavLink
                      to="/student/change-password"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Change Password
                    </NavLink>
                    <NavLink
                      to="/student/plo"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Student Program Outcome (PLO) Attainment
                    </NavLink>
                  </div>
                )}
              </div>

              {/* 6. Registration Dropdown */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => toggleSection('registration')}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-slate-700 hover:bg-blue-50/80 hover:text-blue-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <UserPlus className="h-4 w-4 text-slate-500" />
                    <span>Registration</span>
                  </div>
                  {openSections.registration ? (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>

                {openSections.registration && (
                  <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-200 space-y-1">
                    <NavLink
                      to="/student/online-registration"
                      className={({ isActive }) =>
                        `block rounded-md px-2.5 py-1.5 transition-colors ${
                          isActive ? 'bg-blue-100/70 text-blue-900 font-semibold' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      • Register Online (For Regular)
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Portal Footer Version Info */}
        <div className="border-t border-slate-200 p-3 bg-white text-[11px] text-slate-500">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-blue-900">eDU SMARTZ</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">v3.0 RBAC</span>
          </div>
          <p className="mt-0.5 text-[10px] text-slate-400">UIT University System</p>
        </div>
      </aside>
    </>
  );
};
