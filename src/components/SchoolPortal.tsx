import React, { useState } from "react";
import { Vacancy, Applicant, Placement, User, SystemAuditLog, ApplicationStatus } from "../types";
import {
  Building,
  MapPin,
  Search,
  FileText,
  RefreshCw,
  ArrowLeftRight,
  Calendar,
  Landmark,
  Layers,
  ShieldCheck,
  PlusCircle,
  Users,
  AlertTriangle,
  UserCheck,
  Check,
  X,
  Sparkles,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Briefcase,
  HelpCircle,
  CheckCircle,
  Award,
  Activity,
  ChevronRight
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

// Import action views
import UpdateDocuments from "./portal/UpdateDocuments";
import DeclareVacancy from "./portal/DeclareVacancy";
import RequestRedirection from "./portal/RequestRedirection";
import RequestSwap from "./portal/RequestSwap";
import RequestLeave from "./portal/RequestLeave";
import UserActivityLogs from "./portal/UserActivityLogs";
import SchoolStaffRoster from "./portal/SchoolStaffRoster";

interface SchoolPortalProps {
  applicants: Applicant[];
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  vacancies: Vacancy[];
  setVacancies: React.Dispatch<React.SetStateAction<Vacancy[]>>;
  placements: Placement[];
  setPlacements: React.Dispatch<React.SetStateAction<Placement[]>>;
  onSendMessage: (text: string) => void;
  currentUser: User;
  onUpdateUser: (fields: Partial<User>) => void;
  auditLogs: SystemAuditLog[];
  onAddAuditLog?: (
    action: string,
    details: string,
    severity: "info" | "warning" | "critical",
  ) => void;
}

export default function SchoolPortal({
  vacancies,
  placements,
  currentUser,
  onUpdateUser,
  applicants,
  setApplicants,
  setVacancies,
  setPlacements,
  onSendMessage,
  auditLogs,
  onAddAuditLog,
}: SchoolPortalProps) {
  const [view, setView] = useState<
    | "dashboard"
    | "docs"
    | "redirection"
    | "swap"
    | "leave"
    | "logs"
    | "declare-vacancy"
    | "staff"
  >("dashboard");

  // State for Actionable Schoolhead Dashboard
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "info" } | null>(null);
  
  // Matched candidate flow
  const [activeInterviewCandidate, setActiveInterviewCandidate] = useState<Applicant | null>(null);
  const [interviewDateInput, setInterviewDateInput] = useState("");
  const [interviewTimeInput, setInterviewTimeInput] = useState("");
  
  // Emergency actions
  const [showSubstituteForm, setShowSubstituteForm] = useState(false);
  const [tempSubstituteSubject, setTempSubstituteSubject] = useState("Mathematics (Senior Secondary)");
  const [tempSubstituteDuration, setTempSubstituteDuration] = useState("3 months");
  const [tempSubstituteUrgency, setTempSubstituteUrgency] = useState<"High" | "Medium" | "Normal">("High");
  
  const [showShareForm, setShowShareForm] = useState(false);
  const [shareNeighborSchool, setShareNeighborSchool] = useState("Gaborone West Junior Secondary School");
  const [shareSubject, setShareSubject] = useState("Mathematics");
  const [shareDuration, setShareDuration] = useState("Term 2 (3 months)");

  // Succession planner local actions
  const [endorsedMoetiSwap, setEndorsedMoetiSwap] = useState(false);
  const [extendedBoikhutso, setExtendedBoikhutso] = useState(false);
  const [successionDeclaredForBalopi, setSuccessionDeclaredForBalopi] = useState(false);

  const [moetiSelectedAction, setMoetiSelectedAction] = useState("endorse_swap");
  const [boikhutsoSelectedAction, setBoikhutsoSelectedAction] = useState("extend_12");
  const [balopiSelectedAction, setBalopiSelectedAction] = useState("declare_preemptive");

  const [moetiConfirming, setMoetiConfirming] = useState(false);
  const [boikhutsoConfirming, setBoikhutsoConfirming] = useState(false);
  const [balopiConfirming, setBalopiConfirming] = useState(false);

  // Post conversions state for Actionable Schoolhead Dashboard
  const [convertFromPostType, setConvertFromPostType] = useState("Art & Design (Secondary)");
  const [convertToPostType, setConvertToPostType] = useState("Chemistry & Physics (Secondary - Shortage)");
  const [conversionLogs, setConversionLogs] = useState<{from: string, to: string, timestamp: string}[]>([]);

  // Trigger self-dismissing toast helper
  const showToast = (message: string, type: "success" | "warning" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar Navigation */}
      <div className="md:col-span-1 border-r border-slate-200 dark:border-slate-800 pr-4 space-y-1.5">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-4 mb-2">
          My School Command
        </p>

        <button
          onClick={() => setView("dashboard")}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === "dashboard"
              ? "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-450 border-l-4 border-sky-500 font-extrabold"
              : "text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
          }`}
        >
          <Landmark className="w-4 h-4 shrink-0 text-slate-400" />
          School Dashboard
        </button>

        <button
          onClick={() => setView("staff")}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === "staff"
              ? "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-450 border-l-4 border-sky-500 font-extrabold"
              : "text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
          }`}
          id="btn-school-staff-directory"
        >
          <Users className="w-4 h-4 shrink-0 text-indigo-505" />
          Staff Directory &amp; Demographics
        </button>

        <button
          onClick={() => setView("declare-vacancy")}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === "declare-vacancy"
              ? "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-450 border-l-4 border-sky-500 font-extrabold"
              : "text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
          }`}
        >
          <PlusCircle className="w-4 h-4 shrink-0 text-slate-405" />
          Declare Vacancy
        </button>

        <button
          onClick={() => setView("docs")}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === "docs"
              ? "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-450 border-l-4 border-sky-500 font-extrabold"
              : "text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
          }`}
        >
          <FileText className="w-4 h-4 shrink-0 text-slate-400" />
          Update Documents
        </button>

        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-4 pt-4 mb-2">
          Services & Motions
        </p>

        <button
          onClick={() => setView("redirection")}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === "redirection"
              ? "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-450 border-l-4 border-sky-500 font-extrabold"
              : "text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
          }`}
        >
          <RefreshCw className="w-4 h-4 shrink-0 text-slate-400" />
          Request Redirection
        </button>

        <button
          onClick={() => setView("swap")}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === "swap"
              ? "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-450 border-l-4 border-sky-500 font-extrabold"
              : "text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
          }`}
        >
          <ArrowLeftRight className="w-4 h-4 shrink-0 text-slate-400" />
          Request Swap
        </button>

        <button
          onClick={() => setView("leave")}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === "leave"
              ? "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-450 border-l-4 border-sky-500 font-extrabold"
              : "text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
          }`}
        >
          <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
          Request Leave (Smart)
        </button>

        <button
          onClick={() => setView("logs")}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === "logs"
              ? "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-450 border-l-4 border-sky-505 font-extrabold"
              : "text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
          }`}
        >
          <ShieldCheck className="w-4 h-4 shrink-0 text-slate-400" />
          Activity &amp; Security Logs
        </button>
      </div>

      {/* Main Content Area */}
      <div className="md:col-span-3">
        {view === "dashboard" && (
          <div className="space-y-8 animate-fade-in text-xs" id="schoolhead-actionable-dashboard">
            {/* Embedded self-dismissing Toast Alert banner */}
            {toast && (
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 shadow-lg transform transition-all duration-300 animate-fade-in ${
                toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300" :
                toast.type === "warning" ? "bg-amber-500/10 border-amber-500/30 text-amber-805 dark:text-amber-300" :
                "bg-indigo-500/10 border-indigo-500/30 text-indigo-800 dark:text-indigo-300"
              }`}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-550 shrink-0" />
                  <p className="font-bold text-[11px] leading-relaxed">{toast.message}</p>
                </div>
                <button onClick={() => setToast(null)} className="hover:opacity-70 p-1 font-bold">✕</button>
              </div>
            )}

            {/* School Profile Command Header */}
            {(() => {
              const mySchool = currentUser?.schoolName || "Ledumang Senior Secondary School";
              const myRegion = currentUser?.region || "South East (Gaborone)";
              const myVacancies = vacancies.filter(v => v.schoolName.toLowerCase() === mySchool.toLowerCase());
              const openGaps = myVacancies.filter(v => v.status === "Open");
              const filledGaps = myVacancies.filter(v => v.status === "Filled");
              
              // Local roster statistics (represented dynamically based on active vacancies and succession states)
              const hasMathFilled = myVacancies.some(v => v.subject.includes("Mathematics") && v.status === "Filled");
              
              // 10 core staff: 8 teachers, 2 aides (corresponding directly to the staff directory in SchoolStaffRoster)
              const baseStaffCount = 10;
              const currentActiveStaffCount = baseStaffCount + (hasMathFilled ? 1 : 0);
              
              // Required post positions by target framework allocation (Staffing budget)
              const budgetRequiredStaff = 12;
              const fteStaffingRatio = Math.round((currentActiveStaffCount / budgetRequiredStaff) * 100);

              // Subject Chart Data
              const subjectChartData = [
                { name: "Mathematics", required: 3, active: hasMathFilled ? 2 : 1, vacanciesCount: myVacancies.filter(v => v.subject.includes("Mathematics") && v.status === "Open").length },
                { name: "Science", required: 3, active: 2, vacanciesCount: myVacancies.filter(v => v.subject.includes("Chemistry") || v.subject.includes("Science") && v.status === "Open").length },
                { name: "English", required: 2, active: 2, vacanciesCount: 0 },
                { name: "Setswana", required: 1, active: successionDeclaredForBalopi ? 1 : 1, vacanciesCount: myVacancies.filter(v => v.subject.includes("Setswana") && v.status === "Open").length },
                { name: "Humanities", required: 2, active: 2, vacanciesCount: 0 },
                { name: "Aides", required: 2, active: 2, vacanciesCount: 0 },
              ];

              // succession triggers
              const handleEndorseMoetiSwap = () => {
                setEndorsedMoetiSwap(true);
                onAddAuditLog?.(
                  "STAFF_SWAP_ENDORSE",
                  `Schoolhead ${currentUser?.fullName} endorsed mutual math swap between Kabelo Moeti and James Phakedi.`,
                  "info"
                );
                showToast("Mutual placement swap for Mathematics teacher Kabelo Moeti with James Phakedi (Naledi Senior) endorsed successfully to region.", "success");
              };

              const handleExtendBoikhutso = () => {
                setExtendedBoikhutso(true);
                onAddAuditLog?.(
                  "STAFF_TENURE_EXTEND",
                  `Schoolhead ${currentUser?.fullName} requested 12-month station tenure extension for Tebogo Boikhutso.`,
                  "warning"
                );
                showToast("Exam critical 12-month tenure extension requested for Tebogo Boikhutso. Case file ref SD-EXT-9812 created.", "info");
              };

              const handleDeclareSuccessionVacancy = () => {
                setSuccessionDeclaredForBalopi(true);
                const newVac: Vacancy = {
                  id: `VAC-${Math.floor(Math.random() * 90) + 300}`,
                  schoolName: mySchool,
                  subject: "Setswana Language & Culture",
                  level: "Senior Secondary",
                  type: "Permanent Vacancy Gap",
                  urgency: "Normal",
                  duration: "12 months",
                  salary: "BWP 8,240 / month",
                  reportedAt: new Date().toISOString(),
                  status: "Open"
                };
                setVacancies([newVac, ...vacancies]);
                onAddAuditLog?.(
                  "VACANCY_SUCCESSION_CREATE",
                  `Schoolhead ${currentUser?.fullName} declared preemptive succession Setswana vacancy anticipating Thabo Balopi's 8y overstay cycling.`,
                  "info"
                );
                showToast("Setswana succession vacancy declared! Backlog match index scanning completed.", "success");
              };

              const handleAppointCandidate = (candidate: Applicant, vacancy: Vacancy) => {
                // Update applicant state in global App.tsx
                setApplicants(prev => prev.map(a => a.id === candidate.id ? {
                  ...a,
                  status: ApplicationStatus.APPOINTED,
                  logs: [
                    ...(a.logs || []),
                    {
                      status: ApplicationStatus.APPOINTED,
                      timestamp: new Date().toISOString(),
                      updatedBy: `Schoolhead ${currentUser?.fullName}`,
                      note: `Appointed to fill vacancy ${vacancy.id} (${vacancy.subject}) at ${mySchool}.`
                    }
                  ]
                } : a));

                // Update vacancy state in global App.tsx
                setVacancies(prev => prev.map(v => v.id === vacancy.id ? {
                  ...v,
                  status: "Filled",
                  assignedTeacherId: candidate.id,
                  assignedTeacherName: candidate.fullName
                } : v));

                // Insert dynamic active Placement
                const newPlacement: Placement = {
                  id: `PLC-${Math.floor(Math.random() * 900) + 100}`,
                  schoolName: mySchool,
                  teacherId: candidate.id,
                  teacherName: candidate.fullName,
                  subject: vacancy.subject,
                  startDate: new Date().toISOString().split("T")[0],
                  endDate: "2026-12-15",
                  status: "Active"
                };
                setPlacements([newPlacement, ...placements]);

                // SMS Notification webhook dispatch
                onSendMessage(
                  `🔔 MoESD Direct Appointment Alert: Congratulations ${candidate.fullName}! You have been formally APPOINTED as ${vacancy.subject} educator at ${mySchool} under payroll ref PLC-${newPlacement.id}. Present certificate file certified certified certified copies at sub-region on arrival.`
                );

                onAddAuditLog?.(
                  "RECRUITMENT_APPOINT",
                  `Direct appointment finalized by Schoolhead for ${candidate.fullName} (Omang: ${candidate.omangNumber}) filling ${vacancy.subject} vacancy.`,
                  "info"
                );

                showToast(`Congratulations! Candidate ${candidate.fullName} has been appointed to ${vacancy.subject} and deployed to roster!`, "success");
              };

              const handleOpenInterviewScheduler = (candidate: Applicant) => {
                setActiveInterviewCandidate(candidate);
                setInterviewDateInput("2026-06-16");
                setInterviewTimeInput("10:00");
              };

              const handleRegisterEmergencySubstitute = (e: React.FormEvent) => {
                e.preventDefault();
                const substituteId = `VAC-${Math.floor(Math.random() * 90) + 400}`;
                const newVac: Vacancy = {
                  id: substituteId,
                  schoolName: mySchool,
                  subject: tempSubstituteSubject,
                  level: "Senior Secondary",
                  type: "Emergency Absence",
                  urgency: tempSubstituteUrgency,
                  duration: tempSubstituteDuration,
                  salary: "BWP 6,850 / month",
                  reportedAt: new Date().toISOString(),
                  status: "Open"
                };
                setVacancies([newVac, ...vacancies]);
                onAddAuditLog?.(
                  "VACANCY_CREATE_EMERGENCY",
                  `Urgent emergency substitute vacancy requested for ${tempSubstituteSubject} at ${mySchool}.`,
                  "info"
                );
                showToast(`Emergency substitute request registered for ${tempSubstituteSubject}! Match backlog search is live.`, "success");
                setShowSubstituteForm(false);
              };

              const handleRegisterShareRequest = (e: React.FormEvent) => {
                e.preventDefault();
                onSendMessage(
                  `🤝 Inter-School Teacher Share Dispatch: Gaborone Schoolhead Group request sent from ${mySchool} to ${shareNeighborSchool} proposing a shared teacher allocation in subject ${shareSubject} for ${shareDuration}.`
                );
                onAddAuditLog?.(
                  "STAFF_SHARE_REQUEST",
                  `Inter-school teacher sharing proposed: ${mySchool} requested shared ${shareSubject} support from ${shareNeighborSchool}.`,
                  "info"
                );
                showToast(`Inter-school teacher share proposal successfully dispatched to ${shareNeighborSchool}!`, "success");
                setShowShareForm(false);
              };

              return (
                <div className="space-y-8">
                  {/* Title Banner Panel */}
                  <div className="bg-slate-900 border border-slate-805 dark:bg-slate-950 p-6 rounded-3xl text-left shadow-lg space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-indigo-600/10 h-32 w-32 rounded-full blur-2xl"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-indigo-500/15 text-indigo-400 text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded border border-indigo-500/20">
                            🏫 School Commander Desk
                          </span>
                          <span className="text-slate-500 font-bold">•</span>
                          <span className="text-slate-400 text-[10px] font-mono">{myRegion} Region</span>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
                          {mySchool}
                          {currentUser?.profileCompleted ? (
                            <span className="text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3 text-emerald-400" /> Active Profile
                            </span>
                          ) : (
                            <span className="text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded animate-pulse">
                              ⚠️ Profile Unverified
                            </span>
                          )}
                        </h2>
                        <p className="text-slate-400 text-[11px] font-medium mt-0.5">
                          Staff Roster Level: <strong className="text-slate-300 font-bold">Secondary (Category A)</strong>. National database connection: Established.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => setShowSubstituteForm(true)}
                          className="px-3.5 py-1.8 bg-amber-550 hover:bg-amber-600 text-white font-extrabold rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-sm text-[11px]"
                        >
                          <Clock className="w-3.5 h-3.5" /> Direct Substitute
                        </button>
                        <button
                          type="button"
                          onClick={() => setView("declare-vacancy")}
                          className="px-3.5 py-1.8 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-md text-[11px]"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Declare Vacancy
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Operational Actionable Metrics Hub */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Active Staff count Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Staff Coverage</span>
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
                          <Users className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-baseline gap-1.5">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{currentActiveStaffCount}</h3>
                          <span className="text-[10px] text-slate-400 font-semibold">/ {budgetRequiredStaff} target</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden flex">
                          <div className="bg-indigo-600 h-full" style={{ width: `${fteStaffingRatio}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-[10px] text-slate-505 font-bold">
                          <span>{fteStaffingRatio}% Budget Capacity</span>
                          <span className="text-amber-600 font-black flex items-center gap-0.5">
                            {budgetRequiredStaff - currentActiveStaffCount} Gaps Left
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Workload Intensity Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Teaching Load</span>
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
                          <Activity className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-baseline gap-1.5">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">21.8</h3>
                          <span className="text-[10px] text-slate-400 font-bold">periods / wk</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: "91%" }}></div>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500 font-bold">
                          <span className="text-emerald-500">Normal Range (Limit 24)</span>
                          <span className="text-slate-400 text-[9px] font-semibold">3 at limit danger</span>
                        </div>
                      </div>
                    </div>

                    {/* Overstays Card */}
                    <div className={`p-5 rounded-2xl shadow-sm text-left border ${
                      endorsedMoetiSwap && extendedBoikhutso && successionDeclaredForBalopi
                        ? "bg-emerald-50/20 border-emerald-200/50 dark:bg-emerald-950/10 dark:border-emerald-900/30 text-emerald-805"
                        : "bg-amber-50/30 border-amber-200 dark:bg-amber-950/10 dark:border-amber-900/30 text-amber-900"
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Longevity Overstays</span>
                        <div className="p-2 bg-amber-100 dark:bg-amber-950/50 text-amber-600 rounded-xl">
                          <AlertTriangle className="w-4 h-4 text-amber-620" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-150">
                            {3 - (endorsedMoetiSwap ? 1 : 0) - (extendedBoikhutso ? 1 : 0) - (successionDeclaredForBalopi ? 1 : 0)} Active Alerts
                          </h3>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5 font-bold leading-tight">
                          {endorsedMoetiSwap && extendedBoikhutso && successionDeclaredForBalopi 
                            ? "✓ All overstay exposures mitigated successfully."
                            : "Risk: Eligible for cycle rotation. Action required below."}
                        </p>
                      </div>
                    </div>

                    {/* Recruitment Action Pipeline */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recruitment Pipe</span>
                        <div className="p-2 bg-sky-50 dark:bg-sky-950 hover:bg-sky-105 text-sky-600 rounded-xl">
                          <Award className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-baseline gap-1.5">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                            {myVacancies.length} Active
                          </h3>
                          <span className="text-[10px] text-slate-400 font-bold">
                            ({openGaps.length} Open | {filledGaps.length} Filled)
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-550 font-bold mt-2 truncate">
                          💡 1 highly compatible candidate available in queue.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Required vs Active Staffing Analytics Chart */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                      <div>
                        <h4 className="font-extrabold text-[#111827] dark:text-white text-[13px] uppercase tracking-wide flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-indigo-500" />
                          Departmental Capacity &amp; FTE Gap Analysis
                        </h4>
                        <p className="text-[11px] text-slate-405 mt-0.5 leading-snug">
                          Visual Comparison of Approved Allocation Strength vs. On-Site Staff. Highlighted bars represent active roster gaps.
                        </p>
                      </div>
                      <span className="text-[10px] font-black uppercase text-indigo-605 bg-indigo-500/10 px-2.5 py-1 rounded">
                        Full-Time Equivalent (FTE) Metrics
                      </span>
                    </div>

                    <div className="w-full">
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                          <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                          <YAxis stroke="#888888" fontSize={10} tickLine={false} domain={[0, 4]} />
                          <Tooltip 
                            contentStyle={{ fontSize: "11px", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                            itemStyle={{ fontWeight: "700" }}
                          />
                          <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
                          <Bar dataKey="active" fill="#4f46e5" name="Active Staff" radius={[4, 4, 0, 0]}>
                            {subjectChartData.map((entry, index) => {
                              const isDeficit = entry.active < entry.required;
                              return <Cell key={`cell-${index}`} fill={isDeficit ? "#f59e0b" : "#4f46e5"} />;
                            })}
                          </Bar>
                          <Bar dataKey="required" fill="#94a3b8" name="Required Baseline Allocation" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Actionable Decisions Desk Header */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left space-y-6">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 px-2.5 py-0.5 rounded-full">
                        Interactive Action Room
                      </span>
                      <h4 className="font-extrabold text-[#111827] dark:text-white text-[13px] uppercase tracking-wide mt-1.5 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-indigo-500" />
                        Executive Decisions &amp; Institutional Adjustments
                      </h4>
                      <p className="text-[11px] text-slate-405 dark:text-slate-400 mt-0.5 leading-snug">
                        MoESD school heads do not just observe vacancy lists — choose key corrective workflows below to dynamically rebalance teacher workloads and convert staffing allocations.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Widget 1: Subject Load Mitigation */}
                      <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-500/15 px-2 py-0.5 rounded">
                            Step 1: Departmental Stress
                          </span>
                          <h5 className="font-extrabold text-xs text-slate-850 dark:text-slate-150">Alleviate High Teaching Workloads</h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
                            Mathematics is at <strong className="text-rose-500 font-bold">21.8 periods/wk</strong> due to unresolved shortages. Deploy an emergency substitute immediately to drop load to <strong className="text-emerald-500 font-bold">16.2 periods/wk</strong>.
                          </p>
                        </div>
                        <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/60">
                          <button
                            type="button"
                            onClick={() => {
                              setTempSubstituteSubject("Mathematics (Senior Secondary)");
                              setTempSubstituteDuration("3 months");
                              setTempSubstituteUrgency("High");
                              setShowSubstituteForm(true);
                            }}
                            className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-colors cursor-pointer text-[10px] flex items-center justify-center gap-1"
                          >
                            ⚡ Fast Request Sub Math
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTempSubstituteSubject("Pure Chemistry & Physics (STEM)");
                              setTempSubstituteDuration("6 months");
                              setTempSubstituteUrgency("High");
                              setShowSubstituteForm(true);
                            }}
                            className="w-full text-center py-2 bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-705 dark:text-slate-300 font-bold rounded-xl transition-colors cursor-pointer text-[10px]"
                          >
                            ⚡ Fast Request Sub Science
                          </button>
                        </div>
                      </div>

                      {/* Widget 2: Allocation Converter Form */}
                      <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded">
                            Step 2: Post Conversion
                          </span>
                          <h5 className="font-extrabold text-xs text-slate-850 dark:text-slate-150">Staffing Budget Reallocation</h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
                            Convert an empty, non-critical subject post allocation on your payroll to a critical STEM scarcity subject.
                          </p>
                        </div>
                        
                        <div className="space-y-2 pt-1 border-t border-slate-200/50 dark:border-slate-800/60">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block mb-0.5">Convert From Post:</span>
                            <select
                              value={convertFromPostType}
                              onChange={(e) => setConvertFromPostType(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-1.5 rounded text-[10px] font-bold focus:outline-none text-slate-800 dark:text-slate-100"
                            >
                              <option value="Art & Design (Secondary)">Art & Design (Secondary)</option>
                              <option value="Guidance & Counselling">Guidance & Counselling</option>
                              <option value="Music & Arts">Music & Arts</option>
                            </select>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block mb-0.5">Convert To Shortage:</span>
                            <select
                              value={convertToPostType}
                              onChange={(e) => setConvertToPostType(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-1.5 rounded text-[10px] font-bold focus:outline-none text-slate-800 dark:text-slate-100"
                            >
                              <option value="Chemistry & Physics (STEM)">Chemistry & Physics (STEM)</option>
                              <option value="Pure Mathematics">Pure Mathematics</option>
                              <option value="Computer Studies / ICT">Computer Studies / ICT</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const logEntry = {
                                from: convertFromPostType,
                                to: convertToPostType,
                                timestamp: new Date().toLocaleTimeString()
                              };
                              setConversionLogs([logEntry, ...conversionLogs]);
                              
                              // Create matching open vacancy to make it ACTUALLY reflect in vacancies!
                              const mySchool = currentUser?.schoolName || "Ledumang Senior Secondary School";
                              const newConversionVac: Vacancy = {
                                id: `VAC-${Math.floor(Math.random() * 90) + 500}`,
                                schoolName: mySchool,
                                subject: convertToPostType,
                                level: "Senior Secondary",
                                type: "STEM Vacancy Shortage conversion",
                                urgency: "High",
                                duration: "Permanent",
                                salary: "BWP 9,105 / month",
                                reportedAt: new Date().toISOString(),
                                status: "Open"
                              };
                              setVacancies([newConversionVac, ...vacancies]);
                              
                              onAddAuditLog?.(
                                "ALLOCATION_CONVERSION_SUBMIT",
                                `Submitted post allocation conversion converting spare ${convertFromPostType} allocation into critical ${convertToPostType} post to trigger direct recruitment matching.`,
                                "warning"
                              );
                              showToast(`Successfully reallocated [${convertFromPostType}] post to [${convertToPostType}]. Match pipeline active!`, "success");
                            }}
                            className="w-full py-1.8 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-[10px] transition-all cursor-pointer text-center"
                          >
                            ✓ Submit Post Conversion Plan
                          </button>
                        </div>
                      </div>

                      {/* Widget 3: Conversion Logs */}
                      <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                            Step 3: Live Sync
                          </span>
                          <h5 className="font-extrabold text-xs text-slate-850 dark:text-slate-150">Budget Allocation Conversions</h5>
                          <p className="text-[10px] text-slate-550 dark:text-slate-400 font-semibold leading-relaxed font-sans">
                            Authorized reallocations currently active in candidate pipeline matcher.
                          </p>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-32 text-[10px] space-y-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/60 font-mono text-slate-505 dark:text-slate-300">
                          {conversionLogs.length === 0 ? (
                            <div className="text-[9.5px] italic text-slate-405 text-center py-6 font-sans">
                              No active conversions. Select posts in column 2 to execute reallocation.
                            </div>
                          ) : (
                            conversionLogs.map((log, idx) => (
                              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-1.5 rounded-lg text-[9px] leading-tight space-y-0.5">
                                <span className="text-slate-400 font-bold block">{log.timestamp} - Reallocated</span>
                                <span className="text-red-500 block line-through">FROM: {log.from}</span>
                                <span className="text-emerald-505 font-extrabold block text-left">TO: {log.to}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overstay transfer & succession planner interactions panel */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl text-left space-y-4 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/60 pb-3">
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                          <Layers className="w-4 h-4 text-amber-500 shrink-0" />
                          Station Tenure Longevity &amp; Succession Planner
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                          Botswana MoESD regulations cycle staff after 8 years in a single station to maintain regional teacher balance. Plan succession paths below.
                        </p>
                      </div>
                      <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded">
                        Tenure Auditing
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Teacher 1 - Moeti */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100 block">Kabelo Moeti</span>
                            <span className="text-[10px] font-mono text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded font-black flex items-center gap-0.5">
                              12.2 yrs
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold">Mathematics Department Speciality</p>
                          <p className="text-[10px] text-slate-400 italic">
                            "Exceeds rotation limits by 4.2 years. High critical transition priority. Has a matching pending swap request."
                          </p>
                        </div>
                        
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
                          {endorsedMoetiSwap ? (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 font-extrabold text-[10px] p-2 rounded-xl text-center">
                              <span className="block font-black text-[11px] text-emerald-600">✓ ACTION APPLIED</span>
                              <span className="text-[9px] text-slate-500 mt-1 font-mono block">
                                {moetiSelectedAction === "endorse_swap" && "Mutual Swap Endorsed (James Phakedi)"}
                                {moetiSelectedAction === "defer_six" && "6-Month Hardship Deferral Requested"}
                                {moetiSelectedAction === "initiate_transfer" && "Standard Regional Transfer Initiated"}
                              </span>
                            </div>
                          ) : moetiConfirming ? (
                            <div className="bg-yellow-500/5 border border-yellow-500/25 p-3 rounded-xl space-y-2">
                              <p className="text-[10px] text-yellow-800 dark:text-yellow-400 font-black tracking-wide uppercase">
                                ⚠️ Confirm Action Intent?
                              </p>
                              <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                                Execute <strong className="text-slate-700 dark:text-slate-300">"{
                                  moetiSelectedAction === "endorse_swap" ? "Endorse Swap (James Phakedi)" :
                                  moetiSelectedAction === "defer_six" ? "6-Month Hardship Deferral" : "Standard Regional Transfer"
                                }"</strong>?
                              </p>
                              <div className="flex gap-2 pt-1 font-mono">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEndorsedMoetiSwap(true);
                                    setMoetiConfirming(false);
                                    if (moetiSelectedAction === "endorse_swap") {
                                      handleEndorseMoetiSwap();
                                    } else if (moetiSelectedAction === "defer_six") {
                                      onAddAuditLog?.("STAFF_DEFERRAL_REQUEST", "Requested 6-month hardship deferral for Kabelo Moeti.", "info");
                                      showToast("Hardship deferral for Kabelo Moeti requested successfully.", "success");
                                    } else {
                                      onAddAuditLog?.("STAFF_TRANSFER_INITIATE", "Initiated standard regional transfer cycle for Kabelo Moeti.", "info");
                                      showToast("Standard regional cycling transfer initialized.", "success");
                                    }
                                  }}
                                  className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9px] rounded transition-colors cursor-pointer text-center"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setMoetiConfirming(false)}
                                  className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-350 text-[9px] rounded font-bold transition-colors cursor-pointer text-center"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide block">Recommended Action:</span>
                              <select
                                value={moetiSelectedAction}
                                onChange={(e) => setMoetiSelectedAction(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded text-[10px] font-bold focus:outline-none"
                              >
                                <option value="endorse_swap">Endorse Swap (James Phakedi)</option>
                                <option value="defer_six">Request 6-Month Hardship Deferral</option>
                                <option value="initiate_transfer">Initiate Regional Transfer</option>
                              </select>
                              <button
                                onClick={() => setMoetiConfirming(true)}
                                className="w-full text-center py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg transition-colors cursor-pointer text-[10px] flex items-center justify-center gap-1"
                              >
                                <ArrowLeftRight className="w-3.5 h-3.5" /> Apply Action
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Teacher 2 - Boikhutso */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100 block">Tebogo Boikhutso</span>
                            <span className="text-[10px] font-mono text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded font-black flex items-center gap-0.5">
                              14.4 yrs
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold">History &amp; Humanities Specialist</p>
                          <p className="text-[10px] text-slate-400 italic">
                            "Currently guiding key national examination streams. Rotation would severely disrupt departmental student benchmarks."
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
                          {extendedBoikhutso ? (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 font-extrabold text-[10px] p-2  rounded-xl text-center">
                              <span className="block font-black text-[11px] text-emerald-600">✓ ACTION APPLIED</span>
                              <span className="text-[9px] text-slate-500 mt-1 font-mono block">
                                {boikhutsoSelectedAction === "extend_12" && "12-Month Exam Extension Requested"}
                                {boikhutsoSelectedAction === "cycle_transition" && "Immediate Cycle Transition Endorsed"}
                                {boikhutsoSelectedAction === "mentor_trainer" && "Mentor Trainer Deferral Initialized"}
                              </span>
                            </div>
                          ) : boikhutsoConfirming ? (
                            <div className="bg-yellow-500/5 border border-yellow-500/25 p-3 rounded-xl space-y-2">
                              <p className="text-[10px] text-yellow-800 dark:text-yellow-400 font-black tracking-wide uppercase">
                                ⚠️ Confirm Action Intent?
                              </p>
                              <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                                Execute <strong className="text-slate-700 dark:text-slate-300">"{
                                  boikhutsoSelectedAction === "extend_12" ? "Request 12-Month Extension" :
                                  boikhutsoSelectedAction === "cycle_transition" ? "Immediate Cycle Transition" : "Mentor Trainer Deferral"
                                }"</strong>?
                              </p>
                              <div className="flex gap-2 pt-1 font-mono">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExtendedBoikhutso(true);
                                    setBoikhutsoConfirming(false);
                                    if (boikhutsoSelectedAction === "extend_12") {
                                      handleExtendBoikhutso();
                                    } else if (boikhutsoSelectedAction === "cycle_transition") {
                                      onAddAuditLog?.("STAFF_CYCLE_ENDORSE", "Endorsed immediate cycles for Tebogo Boikhutso.", "warning");
                                      showToast("Immediate cycle transition endorsed for Tebogo Boikhutso.", "success");
                                    } else {
                                      onAddAuditLog?.("STAFF_MENTOR_DEFER", "Initiated mentor trainer deferral for Tebogo Boikhutso.", "info");
                                      showToast("Mentor trainer deferral initialized successfully.", "success");
                                    }
                                  }}
                                  className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9px] rounded transition-colors cursor-pointer text-center"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setBoikhutsoConfirming(false)}
                                  className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-350 text-[9px] rounded font-bold transition-colors cursor-pointer text-center"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide block">Recommended Action:</span>
                              <select
                                value={boikhutsoSelectedAction}
                                onChange={(e) => setBoikhutsoSelectedAction(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded text-[10px] font-bold focus:outline-none"
                              >
                                <option value="extend_12">Request 12-Month Extension</option>
                                <option value="cycle_transition">Endorse Immediate Cycle</option>
                                <option value="mentor_trainer">Initiate Mentor Trainer Deferral</option>
                              </select>
                              <button
                                onClick={() => setBoikhutsoConfirming(true)}
                                className="w-full text-center py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg transition-colors cursor-pointer text-[10px] flex items-center justify-center gap-1"
                              >
                                <FileText className="w-3.5 h-3.5" /> Apply Action
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Teacher 3 - Balopi */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100 block">Thabo K. Balopi</span>
                            <span className="text-[10px] font-mono text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded font-black flex items-center gap-0.5">
                              9.4 yrs
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-505 font-bold">Setswana Language educator</p>
                          <p className="text-[10px] text-slate-400 italic">
                            "Due for standard cycling transition to sub-regional schools. Pre-emptive vacancy declaration advised."
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
                          {successionDeclaredForBalopi ? (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 font-extrabold text-[10px] p-2  rounded-xl text-center">
                              <span className="block font-black text-[11px] text-emerald-600">✓ ACTION APPLIED</span>
                              <span className="text-[9px] text-slate-500 mt-1 font-mono block">
                                {balopiSelectedAction === "declare_preemptive" && "Succession Vacancy Declared"}
                                {balopiSelectedAction === "defer_exceptional" && "Exceptional Retainment Requested"}
                                {balopiSelectedAction === "assign_mentee" && "Succession Mentee Assigned"}
                              </span>
                            </div>
                          ) : balopiConfirming ? (
                            <div className="bg-yellow-500/5 border border-yellow-500/25 p-3 rounded-xl space-y-2">
                              <p className="text-[10px] text-yellow-800 dark:text-yellow-400 font-black tracking-wide uppercase">
                                ⚠️ Confirm Action Intent?
                              </p>
                              <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                                Execute <strong className="text-slate-700 dark:text-slate-300">"{
                                  balopiSelectedAction === "declare_preemptive" ? "Declare Pre-emptive Setswana" :
                                  balopiSelectedAction === "defer_exceptional" ? "Request Exceptional Retainment" : "Assign Succession Mentee"
                                }"</strong>?
                              </p>
                              <div className="flex gap-2 pt-1 font-mono">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSuccessionDeclaredForBalopi(true);
                                    setBalopiConfirming(false);
                                    if (balopiSelectedAction === "declare_preemptive") {
                                      handleDeclareSuccessionVacancy();
                                    } else if (balopiSelectedAction === "defer_exceptional") {
                                      onAddAuditLog?.("STAFF_RETAIN_REQUEST", "Requested exceptional retainment status for Thabo Balopi.", "warning");
                                      showToast("Exceptional retainment status requested for Thabo Balopi.", "warning");
                                    } else {
                                      onAddAuditLog?.("STAFF_MENTEE_ASSIGN", "Assigned succession mentee for Thabo Balopi.", "info");
                                      showToast("Succession mentee assigned successfully.", "success");
                                    }
                                  }}
                                  className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9px] rounded transition-colors cursor-pointer text-center"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setBalopiConfirming(false)}
                                  className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-350 text-[9px] rounded font-bold transition-colors cursor-pointer text-center"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide block">Recommended Action:</span>
                              <select
                                value={balopiSelectedAction}
                                onChange={(e) => setBalopiSelectedAction(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded text-[10px] font-bold focus:outline-none"
                              >
                                <option value="declare_preemptive">Declare Pre-emptive Setswana</option>
                                <option value="defer_exceptional">Request Exceptional Retainment</option>
                                <option value="assign_mentee">Assign Succession Mentee</option>
                              </select>
                              <button
                                onClick={() => setBalopiConfirming(true)}
                                className="w-full text-center py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg transition-colors cursor-pointer text-[10px] flex items-center justify-center gap-1"
                              >
                                <PlusCircle className="w-3.5 h-3.5" /> Apply Action
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* My Classified Gaps & Backlog Applicant Matching Pipeline */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-150 dark:border-slate-800/60 pb-4">
                      <div>
                        <h4 className="font-extrabold text-[#111827] dark:text-white text-[13px] uppercase tracking-wide flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-indigo-500" />
                          My Classified Vacancy &amp; Backlog Matching Pipeline
                        </h4>
                        <p className="text-[11px] text-slate-405 mt-0.5 leading-snug">
                          Live tracking of your school's declared vacancy posts aligned with matching applicant credentials from the national MoESD database.
                        </p>
                      </div>
                      <span className="text-[10px] font-black uppercase text-sky-620 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded">
                        District Auto-Match
                      </span>
                    </div>

                    <div className="space-y-5">
                      {myVacancies.map((vacancy) => {
                        // Scan national applicant list for subject matches
                        const subName = vacancy.subject.split(" ")[0].toLowerCase();
                        const matchedApps = applicants.filter(app => {
                          if (app.status === ApplicationStatus.APPOINTED) return false;
                          return app.vacancySubject.toLowerCase().includes(subName);
                        });

                        return (
                          <div key={vacancy.id} className="border border-slate-150 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-inner">
                            {/* Vacancy Card Top Details */}
                            <div className="bg-slate-50/70 dark:bg-slate-950/40 p-4 border-b border-slate-150 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-850 dark:text-slate-100 text-xs">{vacancy.subject}</span>
                                  <span className="text-slate-400 font-bold">•</span>
                                  <span className="text-[9px] font-mono select-all text-slate-400 font-bold">{vacancy.id}</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-500 whitespace-nowrap">
                                  <span className="px-1.5 py-0.2 bg-slate-200 dark:bg-slate-805 rounded text-slate-700 dark:text-slate-350">{vacancy.type}</span>
                                  <span>{vacancy.duration} duration</span>
                                  <span>•</span>
                                  <strong className="text-indigo-600 dark:text-indigo-400">{vacancy.salary}</strong>
                                </div>
                              </div>

                              <div className="flex gap-2 shrink-0">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                  vacancy.status === "Filled" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                                  vacancy.urgency === "High" ? "bg-rose-500/10 text-rose-600 border border-rose-500/20" :
                                  "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                }`}>
                                  {vacancy.status === "Filled" ? "✓ Filled & Placed" : `Open - ${vacancy.urgency} Urgency`}
                                </span>
                              </div>
                            </div>

                            {/* Matching Applicant Pipeline */}
                            <div className="p-4 bg-white dark:bg-slate-900 space-y-3">
                              {vacancy.status === "Filled" ? (
                                <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-950 rounded-lg text-emerald-600 font-bold">✓</div>
                                    <div className="text-left">
                                      <span className="font-extrabold text-slate-800 dark:text-slate-150 block text-[11px]">Roster Position Secured</span>
                                      <span className="text-[10px] text-slate-450">Assigned Educator: <strong className="text-slate-655 font-bold">{vacancy.assignedTeacherName}</strong></span>
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-400">Payroll Integration: Active</span>
                                </div>
                              ) : (
                                <div className="space-y-3 text-left">
                                  <span className="text-[9px] font-black uppercase text-indigo-505 dark:text-indigo-400 tracking-wider block flex items-center gap-0.5">
                                    ⚡ Automated Match Pipeline ({matchedApps.length} candidates in district backlog)
                                  </span>

                                  {matchedApps.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                      {matchedApps.map((candidate) => (
                                        <div key={candidate.id} className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800 rounded-xl/90 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors">
                                          <div>
                                            <div className="flex justify-between items-start">
                                              <div>
                                                <span className="font-extrabold text-slate-805 dark:text-slate-200 block text-[11px]">{candidate.fullName}</span>
                                                <span className="text-[9px] text-slate-400 font-bold">{candidate.highestQualification}</span>
                                              </div>
                                              <span className="text-[10px] font-black text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                                                ★ {candidate.performanceScore || 4.5} Score
                                              </span>
                                            </div>

                                            <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-404">
                                              <span>Exp: <strong className="text-slate-600 font-bold">{candidate.experienceYears} years</strong></span>
                                              <span>•</span>
                                              <span className="font-mono">ID: {candidate.id}</span>
                                              <span>•</span>
                                              <span className="font-bold underline cursor-pointer text-indigo-550">Certified Files</span>
                                            </div>
                                          </div>

                                          <div className="pt-2 border-t border-slate-100 dark:border-slate-850 w-full">
                                            <button
                                              onClick={() => handleAppointCandidate(candidate, vacancy)}
                                              className="w-full py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white font-black rounded-lg text-[10px] transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-1"
                                            >
                                              📋 Direct Appointment (Deploy Here)
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl text-center space-y-1 text-slate-505 font-medium">
                                      <p>Scanning district databases... currently searching backlog indices.</p>
                                      <p className="text-[9px] text-slate-400">If recruitment is slow, try adding an emergency substitution request on the top actions panel.</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {myVacancies.length === 0 && (
                        <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl text-center space-y-2 border border-dashed border-slate-200">
                          <Users className="w-8 h-8 text-indigo-500 mx-auto" />
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-slate-150 block text-xs">Roster Positions Fully Covered</span>
                            <span className="text-[10px] text-slate-500 mt-0.5 block max-w-sm mx-auto">
                              No live vacancy gaps recorded for {mySchool}. Staff capacity ratio is 100% compliant with Ministry regulations.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Secondary contingency Operations & Backup support Panel */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left space-y-4">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                      <h4 className="font-extrabold text-[#111827] dark:text-white text-[13px] uppercase tracking-wide flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-emerald-500" />
                        Interactive Emergency Operations &amp; Capacity Support
                      </h4>
                      <p className="text-[11px] text-slate-450 leading-relaxed mt-0.5">
                        Initiate localized, peer-driven operations tasks when standard formal recruitment pathways require contingency backup.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Interactive block 1 - Capacity share */}
                      <div className="p-4 bg-slate-50/50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-4 dark:border-slate-850">
                        <div className="space-y-1.5 flex-1">
                          <span className="text-[9px] font-black uppercase text-indigo-501 bg-indigo-550/10 px-2 py-0.5 rounded leading-tight inline-block mb-1">
                            Inter-School Share Request
                          </span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-100 block text-xs">Share Local Subject Surplus</span>
                          <p className="text-[10px] text-slate-500 leading-snug max-w-md">
                            Formally propose borrowing a portion of teacher capacity (e.g. 12 periods/week) from a neighboring schoolhead. Perfect for temporary understaffing.
                          </p>
                        </div>
                        
                        {showShareForm ? (
                          <form onSubmit={handleRegisterShareRequest} className="space-y-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-150 animate-fadeIn text-[10px]">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="font-bold text-slate-500 block mb-1">Prop Neighbor School:</label>
                                <select 
                                  value={shareNeighborSchool}
                                  onChange={e => setShareNeighborSchool(e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 p-1.5 rounded focus:outline-none"
                                >
                                  <option value="Gaborone West Junior Secondary School">Gaborone West Junior</option>
                                  <option value="Naledi Senior Secondary School">Naledi Senior Secondary</option>
                                  <option value="Tola-Kgosi Primary School">Tola-Kgosi Primary</option>
                                </select>
                              </div>
                              <div>
                                <label className="font-bold text-slate-500 block mb-1">Subject To Borrow:</label>
                                <select 
                                  value={shareSubject}
                                  onChange={e => setShareSubject(e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 p-1.5 rounded focus:outline-none"
                                >
                                  <option value="Mathematics">Mathematics</option>
                                  <option value="English Language">English Language</option>
                                  <option value="Setswana Language">Setswana Language</option>
                                  <option value="Science (General)">Science (General)</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                              <button type="button" onClick={() => setShowShareForm(false)} className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 rounded">Cancel</button>
                              <button type="submit" className="px-3 py-1.2 bg-indigo-650 hover:bg-indigo-700 text-white rounded font-bold">Submit Share Proposal</button>
                            </div>
                          </form>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowShareForm(true)}
                            className="text-center py-2 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-840 text-slate-650 dark:text-slate-300 font-extrabold rounded-lg transition-colors border border-slate-200 dark:border-slate-800 text-[10px] cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-500" /> Propose Inter-School Shared Capacity
                          </button>
                        )}
                      </div>

                      {/* Interactive block 2 - substitute substitute */}
                      <div className="p-4 bg-slate-50/50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-4 dark:border-slate-850 animate-fadeIn">
                        <div className="space-y-1.5 flex-1">
                          <span className="text-[9px] font-black uppercase text-amber-601 bg-amber-550/10 px-2 py-0.5 rounded leading-tight inline-block mb-1">
                            Emergency Substitutions
                          </span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-100 block text-xs">Request Emergency Substitute Cover</span>
                          <p className="text-[10px] text-slate-500 leading-snug">
                            Notify sub-regional HR registry to assign a short-term temporary contract helper from the standby backlog queue. Automatically opens a live substitute vacancy.
                          </p>
                        </div>

                        {showSubstituteForm ? (
                          <form onSubmit={handleRegisterEmergencySubstitute} className="space-y-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-150 text-[10px]">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="font-bold text-slate-500 block mb-1">Choose Subject:</label>
                                <select 
                                  value={tempSubstituteSubject}
                                  onChange={e => setTempSubstituteSubject(e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 p-1.5 rounded focus:outline-none"
                                >
                                  <option value="Mathematics (Senior Secondary)">Mathematics</option>
                                  <option value="English Language & Literature">English</option>
                                  <option value="Science: Chemistry & Physics">Chemistry/Physics</option>
                                  <option value="Setswana (Junior Secondary)">Setswana</option>
                                </select>
                              </div>
                              <div>
                                <label className="font-bold text-slate-500 block mb-1">Urgency:</label>
                                <select 
                                  value={tempSubstituteUrgency}
                                  onChange={e => setTempSubstituteUrgency(e.target.value as any)}
                                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 p-1.5 rounded focus:outline-none"
                                >
                                  <option value="High">Immediate - High</option>
                                  <option value="Medium">Medium Urgency</option>
                                  <option value="Normal">Routine Replacement</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                              <button type="button" onClick={() => setShowSubstituteForm(false)} className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 rounded">Cancel</button>
                              <button type="submit" className="px-3 py-1.2 bg-indigo-650 hover:bg-indigo-700 text-white rounded font-bold">Register Substitute Vacancy</button>
                            </div>
                          </form>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowSubstituteForm(true)}
                            className="text-center py-2 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-840 text-slate-650 dark:text-slate-300 font-extrabold rounded-lg transition-colors border border-slate-200 dark:border-slate-800 text-[10px] cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-500 hover:animate-spin" /> Declare Emergency Substitutes Cover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Candidate scheduler modal overlay component */}
                  {activeInterviewCandidate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-[11px]">
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-scaleIn">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase text-indigo-505 dark:text-indigo-400 block tracking-wider">MoESD Panel Interview</span>
                          <h4 className="text-sm font-black text-slate-800 dark:text-slate-105">Schedule Panel Interview</h4>
                          <p className="text-slate-500">
                            Candidate: <strong className="text-indigo-650 dark:text-indigo-400 font-extrabold">{activeInterviewCandidate.fullName}</strong>
                          </p>
                        </div>

                        <form onSubmit={(e) => {
                          e.preventDefault();
                          // Update applicant status
                          setApplicants(prev => prev.map(a => a.id === activeInterviewCandidate.id ? {
                            ...a,
                            status: ApplicationStatus.INTERVIEW_SCHEDULED,
                            interviewDate: `${interviewDateInput} @ ${interviewTimeInput}`,
                            logs: [
                              ...(a.logs || []),
                              {
                                status: ApplicationStatus.INTERVIEW_SCHEDULED,
                                timestamp: new Date().toISOString(),
                                updatedBy: `Schoolhead ${currentUser?.fullName}`,
                                note: `Panel interview scheduled on-site at ${mySchool} on ${interviewDateInput} at ${interviewTimeInput}.`
                              }
                            ]
                          } : a));

                          // Dispatch WhatsApp alerting candidate and panel members
                          onSendMessage(
                            `📅 MoESD Interview Registry Alert: Dear ${activeInterviewCandidate.fullName}, your on-site schoolhead panel interview for vacancy ${activeInterviewCandidate.vacancySubject} has been scheduled for ${interviewDateInput} at ${interviewTimeInput} at ${mySchool}. Present certified transcripts and identity documents.`
                          );

                          onAddAuditLog?.(
                            "RECRUITMENT_INTERVIEW",
                            `Panel interview scheduled for applicant ${activeInterviewCandidate.fullName} (Omang: ${activeInterviewCandidate.omangNumber}) on ${interviewDateInput} at ${interviewTimeInput}.`,
                            "info"
                          );

                          showToast(`Panel interview successfully scheduled for ${activeInterviewCandidate.fullName} on ${interviewDateInput} at ${interviewTimeInput}!`, "success");
                          setActiveInterviewCandidate(null);
                        }} className="space-y-4 text-left">
                          <div className="space-y-3">
                            <div>
                              <label className="font-bold text-slate-500 block mb-1">Select Interview Date:</label>
                              <input 
                                type="date" 
                                value={interviewDateInput}
                                onChange={e => setInterviewDateInput(e.target.value)}
                                required
                                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-2 rounded-xl text-xs font-bold focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="font-bold text-slate-500 block mb-1">Select Time Slot:</label>
                              <input 
                                type="time" 
                                value={interviewTimeInput}
                                onChange={e => setInterviewTimeInput(e.target.value)}
                                required
                                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-2 rounded-xl text-xs font-bold focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-850">
                            <button
                              type="button"
                              onClick={() => setActiveInterviewCandidate(null)}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors font-bold"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-black rounded-xl transition-all shadow-sm"
                            >
                              Schedule Slot
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              );
            })()}
          </div>
        )}

        {view === "staff" && (
          <SchoolStaffRoster
            currentUser={currentUser}
            onAddAuditLog={onAddAuditLog}
          />
        )}

        {view === "docs" && (
          <UpdateDocuments
            currentUser={currentUser}
            onUpdateUser={onUpdateUser}
          />
        )}
        {view === "redirection" && (
          <RequestRedirection
            currentUser={currentUser}
            onUpdateUser={onUpdateUser}
          />
        )}
        {view === "swap" && (
          <RequestSwap currentUser={currentUser} onUpdateUser={onUpdateUser} />
        )}
        {view === "leave" && (
          <RequestLeave currentUser={currentUser} onUpdateUser={onUpdateUser} />
        )}
        {view === "logs" && (
          <UserActivityLogs currentUser={currentUser} auditLogs={auditLogs} />
        )}
        {view === "declare-vacancy" && (
          <DeclareVacancy
            currentUser={currentUser}
            onAddVacancy={(newVacancy) => {
              setVacancies((prev) => [newVacancy, ...prev]);
            }}
            onAddAuditLog={onAddAuditLog}
            setView={setView}
          />
        )}
      </div>
    </div>
  );
}
