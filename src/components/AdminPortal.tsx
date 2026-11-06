import React, { useState } from "react";
import {
  ApplicationStatus,
  Applicant,
  Vacancy,
  Placement,
  SystemAuditLog,
} from "../types";
import {
  Search,
  Filter,
  ShieldCheck,
  Mail,
  MapPin,
  Building,
  ChevronRight,
  Check,
  X,
  FileText,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Download,
  Server,
  Trash2,
  MessageSquare,
  ArrowLeftRight,
  AlertTriangle,
  Award,
  Users,
  Send,
} from "lucide-react";
import AdminAnalytics from "./admin/AdminAnalytics";
import SubRegionalDashboard from "./SubRegionalDashboard";

interface AdminPortalProps {
  currentUser?: any;
  applicants: Applicant[];
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  vacancies: Vacancy[];
  setVacancies: React.Dispatch<React.SetStateAction<Vacancy[]>>;
  placements: Placement[];
  setPlacements: React.Dispatch<React.SetStateAction<Placement[]>>;
  onUpdateApplicantStatus: (
    applicantId: string,
    newStatus: ApplicationStatus,
    reviewNote: string,
    interviewDate?: string,
  ) => void;
  onSendMessage: (text: string) => void;
  auditLogs: SystemAuditLog[];
  onAddAuditLog: (
    action: string,
    details: string,
    severity: "info" | "warning" | "critical",
  ) => void;
  onClearAuditLogs: () => void;
}

const REGIONAL_SCHOOLS = [
  // Gaborone
  { name: "Ledumang Senior Secondary School", region: "Gaborone", subRegion: "Gaborone North Sub-Region" },
  { name: "Gaborone West Junior Secondary School", region: "Gaborone", subRegion: "Gaborone West Sub-Region" },
  { name: "Naledi Senior Secondary School", region: "Gaborone", subRegion: "Gaborone South Sub-Region" },
  { name: "Tola-Kgosi Secondary School", region: "Gaborone", subRegion: "Gaborone West Sub-Region" },
  
  // Central
  { name: "Shashe River Secondary School", region: "Central", subRegion: "Tonota Sub-Region" },
  { name: "Palapye District Secondary School", region: "Central", subRegion: "Palapye Sub-Region" },
  { name: "Mahalapye Professional School", region: "Central", subRegion: "Mahalapye Sub-Region" },
  { name: "Sefhare Junior Secondary School", region: "Central", subRegion: "Sefhare Sub-Region" },
  { name: "Serowe Primary School", region: "Central", subRegion: "Serowe Sub-Region" },
  
  // North West
  { name: "Maun General Primary School", region: "North West", subRegion: "Maun Sub-Region" },
  { name: "Gumare Junior Sec", region: "North West", subRegion: "Gumare Sub-Region" },
  { name: "Shakawe Secondary School", region: "North West", subRegion: "Okavango Sub-Region" },
  
  // Kgalagadi
  { name: "Tshabong Primary School", region: "Kgalagadi", subRegion: "Tshabong Sub-Region" },
  { name: "Kang Secondary School", region: "Kgalagadi", subRegion: "Kang Sub-Region" },
  { name: "Kgalagadi District School", region: "Kgalagadi", subRegion: "Hukuntsi Sub-Region" },
  
  // Chobe
  { name: "Chobe Secondary School", region: "Chobe", subRegion: "Kasane Sub-Region" },
  { name: "Kasane Junior School", region: "Chobe", subRegion: "Kasane Sub-Region" }
];

const MOCK_ACTIVE_TEACHERS = [
  // Ledumang Senior Secondary School (Gaborone North Sub-Region)
  {
    id: "TCR-201",
    fullName: "Kabelo Moeti",
    schoolName: "Ledumang Senior Secondary School",
    subRegion: "Gaborone North Sub-Region",
    region: "Gaborone",
    subjectSpec: "Mathematics",
    qualification: "BEd in Mathematics Education (UB)",
    experience: 12,
    yearsAtStation: 12.2,
    phoneNumber: "+267 71 294 102",
    email: "k.moeti@ledumang.edu.bw",
    contractType: "Permanent",
    dateOfFirstAppointment: "2014-02-15",
    gender: "Male"
  },
  {
    id: "TCR-202",
    fullName: "Tebogo Boikhutso",
    schoolName: "Ledumang Senior Secondary School",
    subRegion: "Gaborone North Sub-Region",
    region: "Gaborone",
    subjectSpec: "History & Humanities",
    qualification: "MA in Curriculum Studies",
    experience: 15,
    yearsAtStation: 14.4,
    phoneNumber: "+267 75 491 583",
    email: "t.boikhutso@ledumang.edu.bw",
    contractType: "Permanent",
    dateOfFirstAppointment: "2011-05-10",
    gender: "Male"
  },
  {
    id: "TCR-203",
    fullName: "Thabo K. Balopi",
    schoolName: "Ledumang Senior Secondary School",
    subRegion: "Gaborone North Sub-Region",
    region: "Gaborone",
    subjectSpec: "Setswana",
    qualification: "BEd (Setswana Languages)",
    experience: 9,
    yearsAtStation: 9.4,
    phoneNumber: "+267 71 829 401",
    email: "t.balopi@ledumang.edu.bw",
    contractType: "Permanent",
    dateOfFirstAppointment: "2017-01-20",
    gender: "Male"
  },
  {
    id: "TCR-204",
    fullName: "Sadi Keitumetse",
    schoolName: "Ledumang Senior Secondary School",
    subRegion: "Gaborone North Sub-Region",
    region: "Gaborone",
    subjectSpec: "English Language & Literature",
    qualification: "BA Humanities + PGDE (English)",
    experience: 3,
    yearsAtStation: 2.5,
    phoneNumber: "+267 74 115 109",
    email: "s.keitumetse@ledumang.edu.bw",
    contractType: "Permanent",
    dateOfFirstAppointment: "2023-09-01",
    gender: "Female"
  },
  {
    id: "TCR-205",
    fullName: "Neo Letsholo",
    schoolName: "Ledumang Senior Secondary School",
    subRegion: "Gaborone North Sub-Region",
    region: "Gaborone",
    subjectSpec: "Science: Chemistry & Physics",
    qualification: "BSc Physics (UB)",
    experience: 1,
    yearsAtStation: 1.2,
    phoneNumber: "+267 72 381 294",
    email: "n.letsholo@ledumang.edu.bw",
    contractType: "Temporary",
    dateOfFirstAppointment: "2025-01-15",
    gender: "Male"
  },

  // Gaborone West Junior Secondary School (Gaborone West Sub-Region)
  {
    id: "TCR-301",
    fullName: "James Phakedi",
    schoolName: "Gaborone West Junior Secondary School",
    subRegion: "Gaborone West Sub-Region",
    region: "Gaborone",
    subjectSpec: "Mathematics",
    qualification: "BEd in Secondary Mathematics",
    experience: 5,
    yearsAtStation: 4.3,
    phoneNumber: "+267 76 901 029",
    email: "j.phakedi@gwest.edu.bw",
    contractType: "Permanent",
    dateOfFirstAppointment: "2021-08-10",
    gender: "Male"
  },
  {
    id: "TCR-302",
    fullName: "One Mmoloki",
    schoolName: "Gaborone West Junior Secondary School",
    subRegion: "Gaborone West Sub-Region",
    region: "Gaborone",
    subjectSpec: "Setswana",
    qualification: "Diploma in Setswana Education",
    experience: 8,
    yearsAtStation: 7.8,
    phoneNumber: "+267 71 890 011",
    email: "o.mmoloki@gwest.edu.bw",
    contractType: "Permanent",
    dateOfFirstAppointment: "2018-03-12",
    gender: "Female"
  },
  {
    id: "TCR-303",
    fullName: "Tshepo Mokgosi",
    schoolName: "Gaborone West Junior Secondary School",
    subRegion: "Gaborone West Sub-Region",
    region: "Gaborone",
    subjectSpec: "Social Studies & Geography",
    qualification: "BA in Environmental Science",
    experience: 2,
    yearsAtStation: 1.1,
    phoneNumber: "+267 73 401 229",
    email: "t.mokgosi@gwest.edu.bw",
    contractType: "Temporary",
    dateOfFirstAppointment: "2025-02-10",
    gender: "Male"
  },
  {
    id: "TCR-304",
    fullName: "Gorata Phiri",
    schoolName: "Gaborone West Junior Secondary School",
    subRegion: "Gaborone West Sub-Region",
    region: "Gaborone",
    subjectSpec: "Early Childhood Education",
    qualification: "Diploma in Early Education",
    experience: 4,
    yearsAtStation: 3.5,
    phoneNumber: "+267 76 891 002",
    email: "g.phiri@gwest.edu.bw",
    contractType: "Permanent Teacher Aide",
    dateOfFirstAppointment: "2022-10-01",
    gender: "Female"
  },

  // Naledi Senior Secondary School (Gaborone South Sub-Region)
  {
    id: "TCR-401",
    fullName: "Gago Seretse",
    schoolName: "Naledi Senior Secondary School",
    subRegion: "Gaborone South Sub-Region",
    region: "Gaborone",
    subjectSpec: "Mathematics",
    qualification: "BSc Pure Mathematics (UB) + PGDE",
    experience: 11,
    yearsAtStation: 11.5,
    phoneNumber: "+267 72 491 585",
    email: "g.seretse@naledi.edu.bw",
    contractType: "Permanent",
    dateOfFirstAppointment: "2014-06-18",
    gender: "Female"
  },
  {
    id: "TCR-402",
    fullName: "Amantle Kgosi",
    schoolName: "Naledi Senior Secondary School",
    subRegion: "Gaborone South Sub-Region",
    region: "Gaborone",
    subjectSpec: "Biology & Agriculture",
    qualification: "BSc in Agricultural Education",
    experience: 3,
    yearsAtStation: 2.1,
    phoneNumber: "+267 75 801 112",
    email: "a.kgosi@naledi.edu.bw",
    contractType: "Permanent",
    dateOfFirstAppointment: "2024-01-10",
    gender: "Female"
  },
  {
    id: "TCR-403",
    fullName: "Botho Molefe",
    schoolName: "Naledi Senior Secondary School",
    subRegion: "Gaborone South Sub-Region",
    region: "Gaborone",
    subjectSpec: "English Language & Literature",
    qualification: "BEd English Literature",
    experience: 7,
    yearsAtStation: 6.4,
    phoneNumber: "+267 73 891 229",
    email: "b.molefe@naledi.edu.bw",
    contractType: "Permanent",
    dateOfFirstAppointment: "2019-10-14",
    gender: "Female"
  },

  // Tola-Kgosi Secondary School (Gaborone West Sub-Region)
  {
    id: "TCR-501",
    fullName: "Onneile Modise",
    schoolName: "Tola-Kgosi Secondary School",
    subRegion: "Gaborone West Sub-Region",
    region: "Gaborone",
    subjectSpec: "ICT & Computer Studies",
    qualification: "BEd in Computer Studies",
    experience: 4,
    yearsAtStation: 3.2,
    phoneNumber: "+267 72 201 445",
    email: "o.modise@tola.edu.bw",
    contractType: "Permanent",
    dateOfFirstAppointment: "2023-01-12",
    gender: "Female"
  },
  {
    id: "TCR-502",
    fullName: "Kenosi Tau",
    schoolName: "Tola-Kgosi Secondary School",
    subRegion: "Gaborone West Sub-Region",
    region: "Gaborone",
    subjectSpec: "Science: Chemistry & Physics",
    qualification: "BSc Physics",
    experience: 9,
    yearsAtStation: 8.5,
    phoneNumber: "+267 71 894 100",
    email: "k.tau@tola.edu.bw",
    contractType: "Permanent",
    dateOfFirstAppointment: "2017-04-10",
    gender: "Male"
  },
  {
    id: "TCR-503",
    fullName: "Lorato Sebele",
    schoolName: "Tola-Kgosi Secondary School",
    subRegion: "Gaborone West Sub-Region",
    region: "Gaborone",
    subjectSpec: "Setswana",
    qualification: "Diploma in Secondary Setswana Education",
    experience: 4,
    yearsAtStation: 4.0,
    phoneNumber: "+267 76 991 202",
    email: "l.sebele@tola.edu.bw",
    contractType: "Temporary",
    dateOfFirstAppointment: "2022-05-15",
    gender: "Female"
  }
];

export default function AdminPortal({
  currentUser,
  applicants,
  setApplicants,
  vacancies,
  setVacancies,
  placements,
  setPlacements,
  onUpdateApplicantStatus,
  onSendMessage,
  auditLogs,
  onAddAuditLog,
  onClearAuditLogs,
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<
    "applications" | "analytics" | "audit"
  >("applications");
  const [searchTerm, setSearchTerm] = useState("");

  const [deployCandidate, setDeployCandidate] = useState<Applicant | null>(null);
  const [targetDeploySchool, setTargetDeploySchool] = useState<string>("");
  const [deployNote, setDeployNote] = useState<string>("");

  // Sub-regional Official custom dashboard state
  const [subRegionFilter, setSubRegionFilter] = useState("All");
  const [subLevelFilter, setSubLevelFilter] = useState("All");
  const [subSubjectFilter, setSubSubjectFilter] = useState("All");
  const [subTenureFilter, setSubTenureFilter] = useState("All");
  const [subSearchQuery, setSubSearchQuery] = useState("");
  const [subActiveSection, setSubActiveSection] = useState<"placements" | "schools" | "shortages_overstays">("placements");
  const [selectedSchoolRoster, setSelectedSchoolRoster] = useState<string | null>(null);
  const [contactingSchoolName, setContactingSchoolName] = useState<string | null>(null);
  const [contactingTeacherName, setContactingTeacherName] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState("");

  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "info" } | null>(null);
  const showToast = (message: string, type: "success" | "warning" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const [activeScope, setActiveScope] = useState<string>(() => {
    if (currentUser?.role === "Sub-Regional Official") return "Gaborone";
    if (currentUser?.role === "Regional Official") return "Central";
    return "All";
  });

  const getSchoolRegion = (schoolName: string): string => {
    const name = schoolName.toLowerCase();
    if (
      name.includes("ledumang") ||
      name.includes("gaborone") ||
      name.includes("nala") ||
      name.includes("naledi")
    )
      return "Gaborone";
    if (
      name.includes("shashe") ||
      name.includes("palapye") ||
      name.includes("mahalapye") ||
      name.includes("sefhare") ||
      name.includes("serowe")
    )
      return "Central";
    if (
      name.includes("maun") ||
      name.includes("gumare") ||
      name.includes("shakawe")
    )
      return "North West";
    if (
      name.includes("tshabong") ||
      name.includes("kang") ||
      name.includes("kgalagadi")
    )
      return "Kgalagadi";
    if (name.includes("chobe") || name.includes("kasane")) return "Chobe";
    return "Other";
  };

  // Base applicants list filtered by geographic jurisdiction
  const scopeFilteredApplicants = applicants.filter((a) => {
    if (activeScope === "All") return true;
    if (activeScope === "Gaborone") {
      return (
        a.preferredRegion.toLowerCase().includes("gaborone") ||
        a.preferredRegion.toLowerCase().includes("south east")
      );
    }
    return a.preferredRegion.toLowerCase().includes(activeScope.toLowerCase());
  });

  // Auditing filters state
  const [auditSearch, setAuditSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<
    "all" | "info" | "warning" | "critical"
  >("all");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Filter application list
  const filteredApplicants = scopeFilteredApplicants.filter(
    (a) =>
      a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.omangNumber.includes(searchTerm) ||
      a.id.includes(searchTerm),
  );

  // Filter audit logs list
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.id.toLowerCase().includes(auditSearch.toLowerCase());

    const matchesSeverity =
      selectedSeverity === "all" || log.severity === selectedSeverity;
    const matchesAction =
      selectedAction === "all" || log.action === selectedAction;

    return matchesSearch && matchesSeverity && matchesAction;
  });

  // Unique actions in logs for filters
  const uniqueActions = ["all", ...new Set(auditLogs.map((l) => l.action))];

  // Stats derivation
  const warningCount = auditLogs.filter((l) => l.severity === "warning").length;
  const criticalCount = auditLogs.filter(
    (l) => l.severity === "critical",
  ).length;
  const successLoginCount = auditLogs.filter(
    (l) => l.action === "LOGIN",
  ).length;

  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      // Create element and click download for simulated system CSV export
      const headers =
        "ID,Timestamp,Actor,Email,Role,Action,Details,IP,Browser,Severity\n";
      const rows = filteredAuditLogs
        .map(
          (log) =>
            `"${log.id}","${log.timestamp}","${log.userName}","${log.userEmail}","${log.userRole}","${log.action}","${log.details.replace(/"/g, '""')}","${log.ipAddress}","${log.browser.replace(/"/g, '""')}","${log.severity}"`,
        )
        .join("\n");

      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute(
        "download",
        `moesd_audit_log_export_${new Date().toISOString().split("T")[0]}.csv`,
      );
      a.click();

      setExporting(false);
      setExportNotice("Audit log exported successfully as CSV file!");
      setTimeout(() => setExportNotice(null), 3000);
    }, 850);
  };

  const handleSimulateAttack = () => {
    onAddAuditLog(
      "SECURITY_SCAN",
      `SQL injection attempt blocked. Detected raw payload pattern "UNION SELECT" on database parameters. Action taken: Session terminated and IP rate-limited.`,
      "critical",
    );
  };

  const handleSimulateSync = () => {
    onAddAuditLog(
      "DB_REPLICATION",
      "Database replication sync lag exceeded limits (18.2 seconds behind primary node in Gaborone South DC). Initializing automatic state catch-up.",
      "warning",
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            {currentUser?.role === "Sub-Regional Official" &&
              "Sub-Regional Official Portal"}
            {currentUser?.role === "Regional Official" &&
              "Regional Administration Portal"}
            {(!currentUser?.role ||
              currentUser?.role === "Ministry Official") &&
              "Ministry Headquarters Portal"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {currentUser?.role === "Sub-Regional Official" &&
              "Manage sub-regional teacher recruitment and localized vacancies."}
            {currentUser?.role === "Regional Official" &&
              "Oversee regional teacher assignment and district-wide metrics."}
            {(!currentUser?.role ||
              currentUser?.role === "Ministry Official") &&
              "Nationwide supervisor deck with resource control across all regions."}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0 flex-wrap">
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "applications" ? "bg-sky-600 dark:bg-sky-500 text-white shadow-md" : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
          >
            {currentUser?.role === "Sub-Regional Official" ? "Regional Placements & Roster" : "Applications"}
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "analytics" ? "bg-sky-600 dark:bg-sky-500 text-white shadow-md" : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === "audit" ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md" : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            System Audits
          </button>
        </div>
      </div>

      {/* Scope Jurisdiction Banner */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/60 dark:from-slate-900/60 dark:to-slate-950/30 border border-slate-200 dark:border-slate-800/80 p-5 rounded-box flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-sm rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                currentUser?.role === "Ministry Official"
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                  : currentUser?.role === "Regional Official"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-sky-500/10 text-sky-600 dark:text-sky-450 border border-sky-500/20"
              }`}
            >
              📡 {currentUser?.role || "Ministry Official"} Access
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-400 font-bold select-all">
              User ID: {currentUser?.id || "USR-MINISTRY"}
            </span>
          </div>
          <p className="text-sm font-bold text-slate-850 dark:text-slate-200">
            Welcome back,{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
              {currentUser?.fullName || "Director Tshepo Phiri"}
            </span>
            .
          </p>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            {currentUser?.role === "Sub-Regional Official" &&
              `Filtering system data for Gaborone Sub-Region under South East regional jurisdiction.`}
            {currentUser?.role === "Regional Official" &&
              `Filtering system data for Central District Regional Jurisdiction.`}
            {(!currentUser?.role ||
              currentUser?.role === "Ministry Official") &&
              `Full Ministry clearance granted. You oversee national demographics. Use scope panels to switch geographic filters.`}
          </p>
        </div>

        {/* Dynamic scope switcher for Ministry, or static scope display for Regional/Sub-Regional */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 shrink-0">
          {!currentUser?.role || currentUser?.role === "Ministry Official" ? (
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <span className="text-[9px] font-mono font-bold uppercase text-slate-450 tracking-wider">
                Dynamic Jurisdiction Switcher:
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  "All",
                  "Gaborone",
                  "Central",
                  "North West",
                  "Kgalagadi",
                  "Chobe",
                ].map((scope) => (
                  <button
                    key={scope}
                    type="button"
                    onClick={() => setActiveScope(scope)}
                    className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                      activeScope === scope
                        ? "bg-indigo-605 text-white shadow font-extrabold"
                        : "bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 font-bold"
                    }`}
                  >
                    {scope === "All" ? "National (All)" : scope}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-3 rounded-xl flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="text-xs">
                <span className="font-bold text-slate-400 block uppercase text-[8px] tracking-wide">
                  Active Jurisdiction
                </span>
                <span className="font-extrabold text-slate-800 dark:text-slate-100">
                  {activeScope} Scope
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {activeTab === "applications" && (
        currentUser?.role === "Sub-Regional Official" ? (
          <SubRegionalDashboard
            MOCK_ACTIVE_TEACHERS={MOCK_ACTIVE_TEACHERS}
            vacancies={vacancies}
            placements={placements}
            REGIONAL_SCHOOLS={REGIONAL_SCHOOLS}
            subSearchQuery={subSearchQuery}
            setSubSearchQuery={setSubSearchQuery}
            subRegionFilter={subRegionFilter}
            setSubRegionFilter={setSubRegionFilter}
            subSubjectFilter={subSubjectFilter}
            setSubSubjectFilter={setSubSubjectFilter}
            subLevelFilter={subLevelFilter}
            setSubLevelFilter={setSubLevelFilter}
            subTenureFilter={subTenureFilter}
            setSubTenureFilter={setSubTenureFilter}
            subActiveSection={subActiveSection}
            setSubActiveSection={setSubActiveSection}
            selectedSchoolRoster={selectedSchoolRoster}
            setSelectedSchoolRoster={setSelectedSchoolRoster}
            contactingSchoolName={contactingSchoolName}
            setContactingSchoolName={setContactingSchoolName}
            contactingTeacherName={contactingTeacherName}
            setContactingTeacherName={setContactingTeacherName}
            draftMessage={draftMessage}
            setDraftMessage={setDraftMessage}
            showToast={showToast}
            onAddAuditLog={onAddAuditLog}
            onSendMessage={onSendMessage}
          />
        ) : (
          <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-800 flex items-center">
            <Search className="w-5 h-5 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name, ID number, or Application ID..."
              className="w-full text-slate-800 dark:text-slate-200 outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredApplicants.map((applicant) => (
              <div
                key={applicant.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">
                      {applicant.fullName}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        applicant.status === ApplicationStatus.RECEIVED
                          ? "bg-yellow-105 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300"
                          : applicant.status === ApplicationStatus.UNDER_REVIEW
                            ? "bg-sky-100 text-sky-800 dark:text-sky-300 dark:bg-sky-950/40"
                            : applicant.status === ApplicationStatus.SHORTLISTED
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
                              : applicant.status ===
                                  ApplicationStatus.INTERVIEW_SCHEDULED
                                ? "bg-orange-100 text-orange-850 dark:bg-orange-950/40 dark:text-orange-300"
                                : applicant.status ===
                                    ApplicationStatus.APPOINTED
                                  ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300"
                                  : "bg-red-105 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                      }`}
                    >
                      {applicant.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Subject:{" "}
                    {applicant.vacancySubject}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-4">
                    <MapPin className="w-3 h-3" /> Region:{" "}
                    {applicant.preferredRegion}
                  </p>
                </div>

                {currentUser?.role === "Sub-Regional Official" ? (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-left">
                    <span className="text-[10px] font-black text-amber-600 bg-amber-500/10 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-1 rounded-md flex items-center gap-1.5 w-fit">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Read-Only Copy (No Mandate)
                    </span>
                    <p className="text-[10px] text-slate-500 mt-2 font-semibold leading-normal">
                      Sub-region notifies of deployments in real-time. Direct appointment mandate belongs entirely to the Regional Director.
                    </p>
                  </div>
                ) : (
                  <>
                    {applicant.status === ApplicationStatus.RECEIVED && (
                      <button
                        onClick={() =>
                          onUpdateApplicantStatus(
                            applicant.id,
                            ApplicationStatus.UNDER_REVIEW,
                            "Documents are valid and being reviewed.",
                          )
                        }
                        className="mt-4 w-full bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-300 py-2 rounded text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        Start Reviewing
                      </button>
                    )}
                    {applicant.status === ApplicationStatus.UNDER_REVIEW && (
                      <div className="space-y-2 mt-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              onUpdateApplicantStatus(
                                applicant.id,
                                ApplicationStatus.SHORTLISTED,
                                "Candidate has been shortlisted for regional roles.",
                              )
                            }
                            className="flex-1 bg-green-50 dark:bg-green-900/30 hover:bg-green-150 text-green-700 dark:text-green-350 py-2 rounded text-xs font-bold transition-colors cursor-pointer"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() =>
                              onUpdateApplicantStatus(
                                applicant.id,
                                ApplicationStatus.REJECTED,
                                "Minimum qualifications not met.",
                              )
                            }
                            className="flex-1 bg-red-50 dark:bg-red-900/30 hover:bg-red-105 text-red-700 dark:text-red-350 py-2 rounded text-xs font-bold transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setDeployCandidate(applicant);
                            const preferredSchs = REGIONAL_SCHOOLS.filter(s =>
                              s.region.toLowerCase().includes(applicant.preferredRegion.toLowerCase()) ||
                              applicant.preferredRegion.toLowerCase().includes(s.region.toLowerCase())
                            );
                            setTargetDeploySchool(preferredSchs[0]?.name || REGIONAL_SCHOOLS[0].name);
                            setDeployNote("Direct appointment and deployment from review queue.");
                          }}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          📋 Direct Hire &amp; Deploy
                        </button>
                      </div>
                    )}
                    {(applicant.status === ApplicationStatus.SHORTLISTED ||
                      applicant.status === ApplicationStatus.INTERVIEW_SCHEDULED) && (
                      <button
                        onClick={() => {
                          setDeployCandidate(applicant);
                          const preferredSchs = REGIONAL_SCHOOLS.filter(s =>
                            s.region.toLowerCase().includes(applicant.preferredRegion.toLowerCase()) ||
                            applicant.preferredRegion.toLowerCase().includes(s.region.toLowerCase())
                          );
                          setTargetDeploySchool(preferredSchs[0]?.name || REGIONAL_SCHOOLS[0].name);
                          setDeployNote("Formally deployed following regional shortlist validation.");
                        }}
                        className="mt-4 w-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white py-2 rounded text-sm font-black transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        📋 Hire &amp; Deploy to School
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
            {filteredApplicants.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                No matching applications found.
              </div>
            )}
          </div>
          </div>
        )
      )}

      {activeTab === "analytics" && (
        <AdminAnalytics
          activeScope={activeScope}
          applicants={applicants}
          vacancies={vacancies}
          placements={placements}
        />
      )}

      {activeTab === "audit" && (
        <div className="space-y-6">
          {/* Notification Banner */}
          {exportNotice && (
            <div className="bg-emerald-500 text-white px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg animate-bounce">
              <Sparkles className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold">{exportNotice}</span>
            </div>
          )}

          {/* Audit Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Audits
                </p>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
                  {auditLogs.length}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Stored events in registry
                </p>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Server className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Critical Failures
                </p>
                <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                  {criticalCount}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  High severity blocks
                </p>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl animate-pulse">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Warnings Raised
                </p>
                <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                  {warningCount}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Pending protocol flags
                </p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
                <Filter className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Success Logins
                </p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {successLoginCount}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  User sessions today
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-slate-100/50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Admin Simulation Deck
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Simulate actual system exceptions and middleware events in
                real-time:
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSimulateSync}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 dark:bg-slate-850 dark:hover:bg-slate-800 text-[11px] font-bold text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-750 transition-colors rounded-lg cursor-pointer flex items-center gap-1"
              >
                <Filter className="w-3.5 h-3.5" /> Delay Warning
              </button>
              <button
                type="button"
                onClick={handleSimulateAttack}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 text-[11px] font-bold text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/50 transition-colors rounded-lg cursor-pointer flex items-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Force Attack Block
              </button>
            </div>
          </div>

          {/* Audit Controls Filters */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              {/* Search input */}
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter logs by details, username, email, ID..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                />
              </div>

              {/* Action and Severity filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-slate-400">
                  Severity:
                </span>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value as any)}
                  className="bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 pointer"
                >
                  <option value="all">All Severities</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>

                <span className="text-xs font-bold text-slate-400 ml-2">
                  Action:
                </span>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 pointer max-w-[155px]"
                >
                  {uniqueActions.map((act) => (
                    <option key={act} value={act}>
                      {act === "all" ? "All Actions" : act.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={exporting || filteredAuditLogs.length === 0}
                  className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  {exporting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  Export CSV ({filteredAuditLogs.length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to clear system audit log history?",
                      )
                    ) {
                      onClearAuditLogs();
                      onAddAuditLog(
                        "LOGS_CLEARED",
                        "Administrative logs cleared by Ministry Official",
                        "warning",
                      );
                    }
                  }}
                  className="p-1 px-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-650 dark:text-red-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Clear history log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Logs List Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-inner text-xs bg-slate-50/10">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-bold text-[10px] tracking-wider uppercase w-3"></th>
                    <th className="px-4 py-3 font-bold text-[10px] tracking-wider uppercase">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 font-bold text-[10px] tracking-wider uppercase">
                      Event Code
                    </th>
                    <th className="px-4 py-3 font-bold text-[10px] tracking-wider uppercase">
                      Actor Account
                    </th>
                    <th className="px-4 py-3 font-bold text-[10px] tracking-wider uppercase">
                      Operational details
                    </th>
                    <th className="px-4 py-3 font-bold text-[10px] tracking-wider uppercase text-right">
                      Severity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditLogs.map((log) => {
                    const isExpanded = expandedLogId === log.id;
                    return (
                      <React.Fragment key={log.id}>
                        <tr
                          onClick={() =>
                            setExpandedLogId(isExpanded ? null : log.id)
                          }
                          className={`border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-950/70 cursor-pointer transition-colors ${isExpanded ? "bg-indigo-50/10 dark:bg-indigo-950/5" : ""}`}
                        >
                          <td className="px-4 py-3.5 text-center relative">
                            {/* Color bar indicator for event severity */}
                            <span
                              className={`absolute left-0 top-0 bottom-0 w-1 ${
                                log.severity === "critical"
                                  ? "bg-rose-500"
                                  : log.severity === "warning"
                                    ? "bg-amber-500"
                                    : "bg-sky-505 dark:bg-sky-400"
                              }`}
                            ></span>
                            <ChevronRight
                              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                            />
                          </td>
                          <td className="px-4 py-3.5 font-mono text-[10px] text-slate-505 dark:text-slate-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString([], {
                              hour12: false,
                            })}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                                log.action === "AUTH_FAILURE" ||
                                log.action === "SECURITY_SCAN"
                                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                                  : log.action === "LOGIN" ||
                                      log.action === "PROFILE_COMPLETE"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350"
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 dark:text-slate-250 truncate max-w-[125px]">
                                {log.userName}
                              </span>
                              <span className="text-[10px] text-slate-500 truncate max-w-[125px]">
                                {log.userEmail}
                              </span>
                            </div>
                          </td>
                          <td
                            className="px-4 py-3.5 text-slate-650 dark:text-slate-350 font-medium max-w-xs md:max-w-md truncate"
                            title={log.details}
                          >
                            {log.details}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                log.severity === "critical"
                                  ? "bg-rose-500/15 text-rose-700 dark:text-rose-400"
                                  : log.severity === "warning"
                                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                                    : "bg-sky-500/15 text-sky-700 dark:text-sky-300"
                              }`}
                            >
                              {log.severity}
                            </span>
                          </td>
                        </tr>

                        {/* Collapsible row details with metadata block */}
                        {isExpanded && (
                          <tr className="bg-slate-100/30 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800">
                            <td
                              colSpan={6}
                              className="px-8 py-5 text-slate-650 dark:text-slate-350"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-1 md:col-span-3">
                                  <span className="font-bold uppercase tracking-wider text-[9px] text-indigo-505 dark:text-indigo-400 block mb-1">
                                    Detailed Log Report Payload
                                  </span>
                                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                                    {log.details}
                                  </p>
                                </div>
                                <div className="space-y-2 font-mono text-[10px] border-l border-slate-200 dark:border-slate-800 pl-4">
                                  <div>
                                    <span className="text-[9px] font-black uppercase text-slate-400 block">
                                      UUID ID
                                    </span>
                                    <span className="text-slate-650 dark:text-slate-300 select-all">
                                      {log.id}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-black uppercase text-slate-400 block">
                                      System IP Address
                                    </span>
                                    <span className="text-slate-650 dark:text-slate-300">
                                      {log.ipAddress}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-black uppercase text-slate-400 block">
                                      Operational Client UserAgent
                                    </span>
                                    <span
                                      className="text-slate-500 dark:text-slate-400 break-words block"
                                      title={log.browser}
                                    >
                                      {log.browser}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-black uppercase text-slate-400 block">
                                      Authorization Role
                                    </span>
                                    <span className="text-slate-650 dark:text-slate-300">
                                      [{log.userRole}]
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {filteredAuditLogs.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-12 text-center text-slate-400 text-xs"
                      >
                        No system audit data matches your active filter options.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>
                Showing {filteredAuditLogs.length} of {auditLogs.length}{" "}
                registered event logs
              </span>
              <span className="flex items-center gap-1 font-mono uppercase text-[9px]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                Live Security Service Operational
              </span>
            </div>
          </div>
        </div>
      )}

      {deployCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-[11px]">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn text-left">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 px-2.5 py-1 rounded-full">
                  Deployment Hub
                </span>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1.5">
                  Direct Appointment &amp; School Deployment
                </h3>
              </div>
              <button
                onClick={() => setDeployCandidate(null)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-150 dark:border-slate-850/60 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-xs text-slate-850 dark:text-slate-250">
                    {deployCandidate.fullName}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold mb-0.5">
                    Omang: {deployCandidate.omangNumber}
                  </p>
                  <span className="text-[9.5px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-sky-505" /> Preferred Region: {deployCandidate.preferredRegion}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 text-[9px] bg-indigo-50 text-indigo-650 dark:bg-slate-800 dark:text-slate-300 font-black rounded-md">
                    {deployCandidate.vacancySubject}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-505 block mb-1">
                  1. Select Institutional Placement School:
                </label>
                <select
                  value={targetDeploySchool}
                  onChange={(e) => setTargetDeploySchool(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 p-2.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                >
                  {REGIONAL_SCHOOLS.filter(s =>
                    s.region.toLowerCase().includes(deployCandidate.preferredRegion.toLowerCase()) ||
                    deployCandidate.preferredRegion.toLowerCase().includes(s.region.toLowerCase())
                  ).map(s => (
                    <option key={s.name} value={s.name}>
                      {s.name} ({s.subRegion})
                    </option>
                  ))}
                  {/* Backup: show all if none in preferred region */}
                  {REGIONAL_SCHOOLS.filter(s =>
                    !s.region.toLowerCase().includes(deployCandidate.preferredRegion.toLowerCase()) &&
                    !deployCandidate.preferredRegion.toLowerCase().includes(s.region.toLowerCase())
                  ).map(s => (
                    <option key={s.name} value={s.name}>
                      {s.name} ({s.region} - {s.subRegion})
                    </option>
                  ))}
                </select>
                <p className="text-[9px] text-slate-400 mt-1 italic">
                  *Candidate will be formalised as a primary/secondary level permanent educator at this station.
                </p>
              </div>

              <div>
                <label className="font-extrabold text-slate-505 block mb-1">
                  2. Official Appointment Notes &amp; Terms:
                </label>
                <textarea
                  value={deployNote}
                  onChange={(e) => setDeployNote(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 p-2.5 rounded-xl text-xs font-bold focus:outline-none h-16 resize-none text-slate-800 dark:text-slate-100"
                  placeholder="e.g. Cleared for direct deployment following credential verification. Approved by Regional Placement Command."
                />
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-2.5 space-y-1">
                <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
                  ⚙️ Sub-Regional System Notification Routing
                </span>
                <p className="text-[9px] text-slate-550 dark:text-slate-400 font-semibold leading-relaxed">
                  Sub-region [{(REGIONAL_SCHOOLS.find(s => s.name === targetDeploySchool) || REGIONAL_SCHOOLS[0]).subRegion}] has zero hiring mandate. Upon appointment, they will receive read-only registry sync telemetry logs directly.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  const schObj = REGIONAL_SCHOOLS.find(s => s.name === targetDeploySchool) || REGIONAL_SCHOOLS[0];
                  
                  // Update status
                  onUpdateApplicantStatus(
                    deployCandidate.id,
                    ApplicationStatus.APPOINTED,
                    deployNote || `Formally deployed to ${schObj.name} under MoESD placement protocols.`
                  );

                  // Create new interactive placement row
                  const newPlc: Placement = {
                    id: `PLC-${Math.floor(Math.random() * 900) + 100}`,
                    schoolName: schObj.name,
                    teacherId: deployCandidate.id,
                    teacherName: deployCandidate.fullName,
                    subject: deployCandidate.vacancySubject,
                    startDate: new Date().toISOString().split("T")[0],
                    endDate: "2026-12-15",
                    status: "Active"
                  };
                  setPlacements(prev => [newPlc, ...prev]);

                  // Update matching vacancy if exists
                  setVacancies(prev => prev.map(v => {
                    if (v.schoolName.toLowerCase() === schObj.name.toLowerCase() &&
                        v.subject.toLowerCase() === deployCandidate.vacancySubject.toLowerCase() &&
                        v.status === "Open") {
                      return {
                        ...v,
                        status: "Filled",
                        assignedTeacherId: deployCandidate.id,
                        assignedTeacherName: deployCandidate.fullName
                      };
                    }
                    return v;
                  }));

                  // SMS dispatch with notify metadata
                  onSendMessage(
                    `🔔 MoESD Regional Appointment Sync: Dear ${deployCandidate.fullName}, you have been APPOINTED and assigned to ${schObj.name} (${schObj.subRegion}) as a full-time permanent ${deployCandidate.vacancySubject} educator list. Sub-region notified. Present credentials on arrival.`
                  );

                  // Set logs
                  onAddAuditLog(
                    "RECRUITMENT_APPOINT",
                    `Direct regional appointment: ${deployCandidate.fullName} hired with station deploy to ${schObj.name}.`,
                    "info"
                  );
                  onAddAuditLog(
                    "SUB_REGION_NOTIFIED",
                    `Telemetry Notification: Sub-region [${schObj.subRegion}] holds zero-mandate lookup role and has been synced with deployment parameters for PLC-${newPlc.id}.`,
                    "info"
                  );

                  // Clean up
                  setDeployCandidate(null);
                  setDeployNote("");
                }}
                className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-all cursor-pointer text-center text-xs shadow-md shadow-indigo-500/10"
              >
                Confirm Deployment &amp; Hire
              </button>
              <button
                type="button"
                onClick={() => setDeployCandidate(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-705 dark:text-slate-300 font-extrabold rounded-xl transition-all cursor-pointer text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification Box */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-905 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 shadow-2xl max-w-sm flex items-center gap-3 animate-fade-in">
          <div className={`p-1.5 rounded-full ${
            toast.type === "success" ? "bg-emerald-500/15 text-emerald-500" :
            toast.type === "warning" ? "bg-amber-500/15 text-amber-500" : "bg-sky-500/15 text-sky-500"
          }`}>
            <Check className="w-4 h-4" />
          </div>
          <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100 leading-normal">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
