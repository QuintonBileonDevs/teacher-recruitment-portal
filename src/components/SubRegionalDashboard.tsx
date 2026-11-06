import React from "react";
import { Applicant, Vacancy, Placement } from "../types";
import {
  Search,
  Filter,
  MapPin,
  Building,
  X,
  FileText,
  ShieldAlert,
  RefreshCw,
  MessageSquare,
  ArrowLeftRight,
  AlertTriangle,
  Award,
  Users,
  Send
} from "lucide-react";

interface SubRegionalDashboardProps {
  MOCK_ACTIVE_TEACHERS: any[];
  vacancies: Vacancy[];
  placements: Placement[];
  REGIONAL_SCHOOLS: any[];
  subSearchQuery: string;
  setSubSearchQuery: (val: string) => void;
  subRegionFilter: string;
  setSubRegionFilter: (val: string) => void;
  subSubjectFilter: string;
  setSubSubjectFilter: (val: string) => void;
  subLevelFilter: string;
  setSubLevelFilter: (val: string) => void;
  subTenureFilter: string;
  setSubTenureFilter: (val: string) => void;
  subActiveSection: "placements" | "schools" | "shortages_overstays";
  setSubActiveSection: (val: "placements" | "schools" | "shortages_overstays") => void;
  selectedSchoolRoster: string | null;
  setSelectedSchoolRoster: (val: string | null) => void;
  contactingSchoolName: string | null;
  setContactingSchoolName: (val: string | null) => void;
  contactingTeacherName: string | null;
  setContactingTeacherName: (val: string | null) => void;
  draftMessage: string;
  setDraftMessage: (val: string) => void;
  showToast: (msg: string, type?: "success" | "warning" | "info") => void;
  onAddAuditLog?: (action: string, details: string, severity: "info" | "warning" | "critical") => void;
  onSendMessage?: (text: string) => void;
}

export default function SubRegionalDashboard({
  MOCK_ACTIVE_TEACHERS,
  vacancies,
  placements,
  REGIONAL_SCHOOLS,
  subSearchQuery,
  setSubSearchQuery,
  subRegionFilter,
  setSubRegionFilter,
  subSubjectFilter,
  setSubSubjectFilter,
  subLevelFilter,
  setSubLevelFilter,
  subTenureFilter,
  setSubTenureFilter,
  subActiveSection,
  setSubActiveSection,
  selectedSchoolRoster,
  setSelectedSchoolRoster,
  contactingSchoolName,
  setContactingSchoolName,
  contactingTeacherName,
  setContactingTeacherName,
  draftMessage,
  setDraftMessage,
  showToast,
  onAddAuditLog,
  onSendMessage,
}: SubRegionalDashboardProps) {

  const totalTeachers = MOCK_ACTIVE_TEACHERS.filter(t => t.region === "Gaborone").length;
  const overstaysCount = MOCK_ACTIVE_TEACHERS.filter(t => t.region === "Gaborone" && t.yearsAtStation > 8).length;
  const shortagesCount = vacancies.filter(v => v.status === "Open" && REGIONAL_SCHOOLS.some(rs => rs.name === v.schoolName && rs.region === "Gaborone")).length;

  return (
    <div id="subregion-official-board" className="space-y-6 text-left">
      {/* Dynamic Header Badge Section */}
      <div className="bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#475569] p-6 rounded-3xl text-white shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="bg-sky-500/20 text-sky-305 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-sky-500/30">
                Gaborone Sub-Region Coordination Hub
              </span>
              <span className="bg-emerald-500/10 text-emerald-305 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Live Notifications Feed
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">
              Decisional Placements &amp; Active Roster Ledger
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-semibold">
              Under National MoESD Statutes, direct appointment authority resides strictly in the regional office. 
              Sub-regional officials oversee live placement notifications, query institutional rosters, 
              monitor overstays, and maintain direct coordination channels with school leadership.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="p-3 bg-slate-800/40 border border-slate-700 rounded-2xl text-slate-100 flex flex-col items-center justify-center min-w-[75px]">
              <span className="text-lg font-black">{totalTeachers}</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Total FTEs</span>
            </div>
            <div className="p-3 bg-[#eab308]/10 border border-[#eab308]/20 rounded-2xl text-[#fef08a] flex flex-col items-center justify-center min-w-[75px]">
              <span className="text-lg font-black">{overstaysCount}</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-amber-300">Overstays</span>
            </div>
            <div className="p-3 bg-[#ec4899]/10 border border-[#ec4899]/20 rounded-2xl text-[#fbcfe8] flex flex-col items-center justify-center min-w-[75px]">
              <span className="text-lg font-black">{shortagesCount}</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-pink-300">Shortages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Switches and Filtration Dashboard */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          {/* Main sub section state triggers */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit gap-1 border border-slate-200/50 dark:border-slate-800">
            <button
              onClick={() => {
                setSubActiveSection("placements");
                setSelectedSchoolRoster(null);
              }}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                subActiveSection === "placements"
                  ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-sky-500" />
              Regional Placements
            </button>
            <button
              onClick={() => {
                setSubActiveSection("schools");
                setSelectedSchoolRoster(null);
              }}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                subActiveSection === "schools"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <Building className="w-3.5 h-3.5 text-indigo-500" />
              Institutions &amp; Roster
            </button>
            <button
              onClick={() => {
                setSubActiveSection("shortages_overstays");
                setSelectedSchoolRoster(null);
              }}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                subActiveSection === "shortages_overstays"
                  ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Vacancies &amp; Rotation Cycles
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Sub-Region Filters</span>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {/* Text search */}
          <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search name, school, or subject..."
              value={subSearchQuery}
              onChange={(e) => setSubSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold bg-transparent outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>

          {/* Sub Region */}
          <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-center text-left">
            <span className="text-[8px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">Sub-Region Area</span>
            <select
              value={subRegionFilter}
              onChange={(e) => setSubRegionFilter(e.target.value)}
              className="w-full bg-transparent outline-none text-xs font-black text-slate-705 dark:text-slate-350 cursor-pointer mt-0.5"
            >
              <option value="All">All Sub-Regions</option>
              <option value="Gaborone North Sub-Region">Gaborone North</option>
              <option value="Gaborone West Sub-Region">Gaborone West</option>
              <option value="Gaborone South Sub-Region">Gaborone South</option>
            </select>
          </div>

          {/* Subject specialty */}
          <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-center text-left">
            <span className="text-[8px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">Discipline Specialty</span>
            <select
              value={subSubjectFilter}
              onChange={(e) => setSubSubjectFilter(e.target.value)}
              className="w-full bg-transparent outline-none text-xs font-black text-slate-705 dark:text-slate-350 cursor-pointer mt-0.5"
            >
              <option value="All">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Setswana">Setswana</option>
              <option value="English Language & Literature">English</option>
              <option value="Science">Chemistry &amp; Pure Science</option>
              <option value="History & Humanities">History / Humanities</option>
              <option value="ICT & Computer Studies">Computers &amp; Tech</option>
            </select>
          </div>

          {/* Stream level */}
          <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border border-[#e2e8f0]/65 dark:border-slate-800 flex flex-col justify-center text-left">
            <span className="text-[8px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">Stream Level</span>
            <select
              value={subLevelFilter}
              onChange={(e) => setSubLevelFilter(e.target.value)}
              className="w-full bg-transparent outline-none text-xs font-black text-slate-705 dark:text-slate-350 cursor-pointer mt-0.5"
            >
              <option value="All">All Levels</option>
              <option value="Primary">Primary Stream</option>
              <option value="Junior Secondary">Junior Sec (JSS)</option>
              <option value="Senior Secondary">Senior Sec (SCS)</option>
            </select>
          </div>

          {/* Longevity warn */}
          <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-center text-left">
            <span className="text-[8px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">Tenure Threshold</span>
            <select
              value={subTenureFilter}
              onChange={(e) => setSubTenureFilter(e.target.value)}
              className="w-full bg-transparent outline-none text-xs font-black text-slate-705 dark:text-slate-355 cursor-pointer mt-0.5"
            >
              <option value="All">All Exposures</option>
              <option value="8">Tenure &gt; 8 Years</option>
              <option value="10">Tenure &gt; 10 Years (Alert)</option>
              <option value="12">Tenure &gt; 12 Years (Rotation)</option>
            </select>
          </div>
        </div>
      </div>

      {/* CORE ACTIVE VIEWPORT */}
      {subActiveSection === "placements" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-850 p-2 rounded-2xl">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 ml-2">
              <Award className="text-sky-550 w-4 h-4" /> Live Decisions Dispatch Loop
            </span>
            <span className="text-[10px] font-bold text-slate-400 font-mono">
              Filtered Placements: {placements.filter(p => {
                const parent = REGIONAL_SCHOOLS.find(s => s.name.toLowerCase() === p.schoolName.toLowerCase());
                return parent && parent.region === "Gaborone";
              }).length} Entries Notified
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(() => {
              const matches = placements.filter(p => {
                const s = REGIONAL_SCHOOLS.find(sch => sch.name.toLowerCase() === p.schoolName.toLowerCase());
                if (!s || s.region !== "Gaborone") return false;
                if (subRegionFilter !== "All" && s.subRegion !== subRegionFilter) return false;
                if (subLevelFilter !== "All" && !s.name.toLowerCase().includes(subLevelFilter.toLowerCase().replace(" school", ""))) return false;
                if (subSubjectFilter !== "All" && p.subject.toLowerCase() !== subSubjectFilter.toLowerCase()) return false;
                
                const q = subSearchQuery.toLowerCase();
                if (q) return p.teacherName?.toLowerCase().includes(q) || p.schoolName.toLowerCase().includes(q);
                return true;
              });

              if (matches.length === 0) {
                return (
                  <div className="col-span-full bg-slate-50 border border-slate-200/55 p-12 rounded-3xl text-center italic text-xs font-bold text-slate-400">
                    No placement notifications match current filtration parameters.
                  </div>
                );
              }

              return matches.map(p => (
                <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-200 p-5 rounded-3xl hover:border-sky-505 hover:shadow-md transition-all flex flex-col justify-between text-left">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{p.teacherName}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">Assignment Identifier: {p.id}</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-805 dark:bg-emerald-950/40 text-[9px] font-black uppercase px-2.5 py-1 rounded">
                        Assigned
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-500 rounded-xl">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block pb-0.5">Deployment Target</span>
                        <strong className="text-xs text-slate-800 dark:text-slate-100">{p.schoolName}</strong>
                        <span className="block text-[9px] text-slate-400 font-bold">{REGIONAL_SCHOOLS.find(sch => sch.name === p.schoolName)?.subRegion}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 ml-1 text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Post Subject: <span className="text-indigo-600 font-black">{p.subject}</span></span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setContactingSchoolName(p.schoolName);
                      setContactingTeacherName(p.teacherName || "new recruit assignment");
                      setDraftMessage(`ADMINISTRATIVE COMPLIANCE NOTIFICATION\nTo: Schoolhead, ${p.schoolName}\nFrom: Gaborone Sub-Region Coordination Cabinet\n\nUnder MoESD mandate, we represent the official notification of Regional Direct Assignment: Educator ${p.teacherName} is deployed to your facility for the ${p.subject} position under Reference ${p.id}. Proceed with onboarding and submit integration reports.`);
                    }}
                    className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 border border-slate-200"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Dispatch Coordination Memo
                  </button>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {subActiveSection === "schools" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-850 p-2 rounded-2xl">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 ml-2">
              <Building className="text-indigo-505 w-4 h-4" /> Institutional Directories &amp; Live FTEs
            </span>
            <span className="text-[10px] font-bold text-slate-400">Gaborone Managed Stream</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {REGIONAL_SCHOOLS.filter(s => {
              if (s.region !== "Gaborone") return false;
              if (subRegionFilter !== "All" && s.subRegion !== subRegionFilter) return false;
              if (subLevelFilter !== "All" && !s.name.toLowerCase().includes(subLevelFilter.toLowerCase().replace(" school", ""))) return false;
              
              const q = subSearchQuery.toLowerCase();
              if (q) return s.name.toLowerCase().includes(q) || s.subRegion.toLowerCase().includes(q);
              return true;
            }).map(school => {
              const activeFte = MOCK_ACTIVE_TEACHERS.filter(t => t.schoolName === school.name);
              const shortages = vacancies.filter(v => v.schoolName === school.name && v.status === "Open");
              const overstays = activeFte.filter(t => t.yearsAtStation > 8);
              const capacity = activeFte.length + shortages.length > 0
                ? Math.round((activeFte.length / (activeFte.length + shortages.length)) * 100)
                : 100;

              return (
                <div key={school.name} className="bg-white dark:bg-slate-900 border border-slate-200 p-5 rounded-3xl flex flex-col justify-between text-left shadow-sm hover:border-indigo-500 transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-[#111827] dark:text-white text-sm">{school.name}</h4>
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-black tracking-wide px-2 py-0.5 rounded mt-1 inline-block">{school.subRegion}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded ${
                        capacity >= 90 ? "bg-emerald-50 text-emerald-700 font-bold" :
                        capacity >= 75 ? "bg-amber-50 text-amber-700 font-bold" : "bg-red-50 text-red-700 font-bold"
                      }`}>
                        {capacity}% Active Staffing
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-2xl border border-slate-100 text-center">
                      <div>
                        <span className="block text-[8px] font-black text-slate-400 uppercase">Live FTEs</span>
                        <strong className="text-xs font-black text-slate-800 dark:text-slate-100">{activeFte.length}</strong>
                      </div>
                      <div className="border-l border-r border-slate-200 dark:border-slate-800">
                        <span className="block text-[8px] font-black text-amber-500 uppercase">Shortages</span>
                        <strong className="text-xs font-black text-amber-600">{shortages.length} Gaps</strong>
                      </div>
                      <div>
                        <span className="block text-[8px] font-black text-red-405 uppercase">Overstays</span>
                        <strong className="text-xs font-black text-red-650">{overstays.length} Alerts</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setSelectedSchoolRoster(school.name)}
                      className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] rounded-lg cursor-pointer flex items-center justify-center gap-1 transition-all"
                    >
                      <Users className="w-3.5 h-3.5" /> Full Staff Directory
                    </button>
                    <button
                      onClick={() => {
                        setContactingSchoolName(school.name);
                        setContactingTeacherName("Schoolhead Administration Office");
                        setDraftMessage(`MEMORANDUM\nTo: Headmaster, ${school.name}\nFrom: Gaborone Sub-Region Coordination Hub\n\nWe are executing our quarterly institutional roster verification cycles. Please verify the active staffing directory profiles, confirm that shortages are reported correctly, and catalog any staff currently holding overstay thresholds exceeding 8 years.`);
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-lg cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400 hover:text-indigo-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Roster Table Drawer Overlay */}
          {selectedSchoolRoster && (
            <div className="bg-slate-50 dark:bg-slate-905 border border-slate-200 p-5 rounded-3xl animate-fade-in text-left space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <div>
                  <h4 className="font-extrabold text-xs uppercase tracking-wide flex items-center gap-2">
                    <Users className="text-indigo-500 w-4.5 h-4.5" />
                    Roster Audit: <span className="text-sky-650 font-black">{selectedSchoolRoster}</span>
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold">Comprehensive staff coordinates, credentials, and warning metrics.</p>
                </div>
                <button
                  onClick={() => setSelectedSchoolRoster(null)}
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-[10px] font-bold rounded-xl cursor-pointer"
                >
                  Close Directory
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8fafc] dark:bg-slate-900 border-b border-slate-200 text-slate-400 text-[8px] uppercase font-black">
                    <tr>
                      <th className="p-2.5">Educator Credential Points</th>
                      <th className="p-2.5">Academic Specialty</th>
                      <th className="p-2.5">Qualifications Matrix</th>
                      <th className="p-2.5 text-center">Station Tenure</th>
                      <th className="p-2.5">Contract Classification</th>
                      <th className="p-2.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold">
                    {MOCK_ACTIVE_TEACHERS.filter(t => t.schoolName === selectedSchoolRoster).map(t => (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="p-2.5">
                          <div>
                            <span className="block text-slate-800 dark:text-slate-200 font-black">{t.fullName}</span>
                            <span className="text-[8px] text-slate-405 font-mono">{t.id} • {t.gender}</span>
                          </div>
                        </td>
                        <td className="p-2.5 text-indigo-650 font-black text-xs">{t.subjectSpec}</td>
                        <td className="p-2.5 text-[10px] text-slate-500 max-w-[150px] truncate" title={t.qualification}>{t.qualification}</td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                            t.yearsAtStation >= 8 ? "bg-amber-100 text-amber-705" : "bg-emerald-50 text-emerald-700"
                          }`}>
                            {t.yearsAtStation} Years
                          </span>
                        </td>
                        <td className="p-2.5 text-[10px] text-slate-500 uppercase font-bold">{t.contractType}</td>
                        <td className="p-2.5">
                          <button
                            onClick={() => {
                              setContactingSchoolName(selectedSchoolRoster);
                              setContactingTeacherName(t.fullName);
                              setDraftMessage(`MEMORANDUM RE: ${t.fullName} (${t.subjectSpec})\nTo: Headmaster, ${selectedSchoolRoster}\n\nOur Gaborone sub-regional coordinates show that educator ${t.fullName} has completed ${t.yearsAtStation} station years. In accordance with MoESD rotational rules, please initialize transition counseling sessions and submit formal compliance logs.`);
                            }}
                            className="text-xs text-indigo-600 hover:text-indigo-805 cursor-pointer font-black"
                          >
                            Inquire Transition
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {subActiveSection === "shortages_overstays" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-850 p-2 rounded-2xl">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 ml-2">
              <AlertTriangle className="text-amber-505 w-4 h-4" /> Indepth Capacity Gaps &amp; Tenure Overstay Analysis
            </span>
            <span className="text-[10px] font-black uppercase text-[#ef4444] bg-[#fee2e2]/60 px-2 py-0.5 rounded font-mono animate-pulse">Critical Rotation Cycles Active</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Vacancy Gaps list */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 p-5 rounded-3xl space-y-3 shadow-sm text-left">
              <h5 className="font-extrabold text-xs uppercase text-pink-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Award className="w-4 h-4 text-pink-500" /> Active Departmental Shortages
              </h5>
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-[11px] font-bold">
                  <thead className="bg-[#f8fafc] text-[8px] text-slate-400 uppercase font-black">
                    <tr>
                      <th className="p-2">Target School</th>
                      <th className="p-2">Subject Gap</th>
                      <th className="p-2 text-center">Urgency</th>
                      <th className="p-2 text-center">Mitigate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-705">
                    {(() => {
                      const list = vacancies.filter(v => {
                        const s = REGIONAL_SCHOOLS.find(sch => sch.name === v.schoolName);
                        if (!s || s.region !== "Gaborone") return false;
                        if (v.status !== "Open") return false;
                        if (subRegionFilter !== "All" && s.subRegion !== subRegionFilter) return false;
                        if (subSubjectFilter !== "All" && v.subject.toLowerCase() !== subSubjectFilter.toLowerCase()) return false;
                        return true;
                      });

                      if (list.length === 0) {
                        return (
                          <tr>
                            <td colSpan={4} className="p-4 text-center italic text-slate-400 text-xs">No open vacancies match filtration criteria.</td>
                          </tr>
                        );
                      }

                      return list.map(v => (
                        <tr key={v.id} className="hover:bg-slate-50/50">
                          <td className="p-2 text-slate-800 truncate max-w-[120px]">{v.schoolName}</td>
                          <td className="p-2 text-indigo-600">{v.subject}</td>
                          <td className="p-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                              v.urgency === "High" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-500"
                            }`}>
                              {v.urgency}
                            </span>
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => {
                                onAddAuditLog?.(
                                  "SHORTAGE_MATCH_REQUEST",
                                  `Sub-Regional requested expedited candidate matching support from Ministry Hub for ${v.subject} post gap at ${v.schoolName}.`,
                                  "info"
                                );
                                showToast(`Dispatched Ministry candidate matching protocol for ${v.schoolName}!`, "success");
                              }}
                              className="text-xs hover:scale-110 transition-all cursor-pointer font-black grayscale hover:grayscale-0"
                              title="Solicit Matching Queue"
                            >
                              🔄
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Overstays lists */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 p-5 rounded-3xl space-y-3 shadow-sm text-left">
              <h5 className="font-extrabold text-xs uppercase text-amber-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Users className="w-4 h-4 text-amber-500" /> Critical Station Overstays (&gt;8y Tenure)
              </h5>
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-[11px] font-bold">
                  <thead className="bg-[#f8fafc] text-[8px] text-slate-400 uppercase font-black">
                    <tr>
                      <th className="p-2">Educator Name</th>
                      <th className="p-2">Current School</th>
                      <th className="p-2 text-center">Station Years</th>
                      <th className="p-2 text-center">Consult</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-705">
                    {(() => {
                      const list = MOCK_ACTIVE_TEACHERS.filter(t => {
                        if (t.region !== "Gaborone") return false;
                        if (t.yearsAtStation <= 8) return false;
                        if (subRegionFilter !== "All" && t.subRegion !== subRegionFilter) return false;
                        if (subSubjectFilter !== "All" && t.subjectSpec.toLowerCase() !== subSubjectFilter.toLowerCase()) return false;
                        if (subTenureFilter !== "All" && t.yearsAtStation < parseFloat(subTenureFilter)) return false;
                        return true;
                      });

                      if (list.length === 0) {
                        return (
                          <tr>
                            <td colSpan={4} className="p-4 text-center italic text-slate-400 text-xs">No educator overstays warnings match current thresholds.</td>
                          </tr>
                        );
                      }

                      return list.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/50">
                          <td className="p-2 text-slate-800">{t.fullName}</td>
                          <td className="p-2 text-slate-405 truncate max-w-[120px]">{t.schoolName}</td>
                          <td className="p-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${
                              t.yearsAtStation >= 11 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {t.yearsAtStation} yrs
                            </span>
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => {
                                setContactingSchoolName(t.schoolName);
                                setContactingTeacherName(t.fullName);
                                setDraftMessage(`STATION ALIGNMENT ADVISORY\nTo: Headmaster, ${t.schoolName}\nFrom: Gaborone Sub-Region Coordination Cabinet\n\nEducator ${t.fullName} exceeds the mandated MoESD 8-year tenure cycle limit with a station occupancy length of ${t.yearsAtStation} years. Please conduct rotation counseling sessions and prepare deployment dossiers.`);
                              }}
                              className="text-[10px] text-indigo-650 hover:underline cursor-pointer font-black uppercase"
                            >
                              Talk
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECURE COMMUNICATION DRAWER PANEL */}
      {contactingSchoolName && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative">
            <button
              onClick={() => {
                setContactingSchoolName(null);
                setContactingTeacherName(null);
                setDraftMessage("");
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-105 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-3 mb-4 text-left">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 rounded-2xl w-fit">
                <MessageSquare className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-sm uppercase text-[#111827] dark:text-white">
                  Transmit Secure Dispatch Advisory
                </h4>
                <p className="text-[10px] text-slate-400 font-bold leading-normal mt-0.5">
                  Direct official compliance channel to headmaster leadership at <strong className="text-sky-605">{contactingSchoolName}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1 text-left">
              {contactingTeacherName && (
                <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-2xl border border-slate-150 text-[9px] text-slate-500 font-bold flex justify-between">
                  <span>SUBJECT REFERENCE: <strong className="text-slate-850 dark:text-slate-200">{contactingTeacherName}</strong></span>
                  <span className="text-slate-400 font-mono">MOESD-DISPATCH</span>
                </div>
              )}

              <div className="space-y-1.5 text-left">
                <span className="text-[9px] font-black uppercase text-slate-450 block tracking-wide">Advisory Message Body:</span>
                <textarea
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                  className="w-full h-32 bg-slate-100 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 p-3 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-600 outline-none"
                  placeholder="Draft institutional compliance instruction or directive here..."
                />
              </div>

              <div className="flex justify-between items-center bg-sky-50 dark:bg-sky-950/20 p-3 rounded-2xl border border-sky-100/50">
                <span className="text-[9px] font-black text-sky-705 dark:text-sky-350 pr-2 leading-relaxed">
                  💡 Fast dispatch formal MoESD compliance memo format
                </span>
                <button
                  onClick={() => {
                    setDraftMessage(`OFFICIAL ADVISORY MEMORANDUM\nTo: Headmaster, ${contactingSchoolName}\nFrom: Gaborone Sub-Region Coordination Cabinet\nDate: ${new Date().toLocaleDateString()}\nSubject: Staffing Audit Alignments (${contactingTeacherName || " Roster Verification"})\n\nThis communication represents an administrative directive to audit the alignment profile of: ${contactingTeacherName || "General Staffing"}. Please verify active credentials, confirm overstay warn rotations index compliance, and coordinate integration reports.`);
                  }}
                  className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white font-black text-[8px] uppercase tracking-wide rounded-lg cursor-pointer flex-shrink-0"
                >
                  Draft Memo
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setContactingSchoolName(null);
                    setContactingTeacherName(null);
                    setDraftMessage("");
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-805 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!draftMessage.trim()) return;

                    onAddAuditLog?.(
                      "SUB_REGION_COMMUNICATION",
                      `Sub-regional advisory dispatched to ${contactingSchoolName} regarding ${contactingTeacherName || "General"}.`,
                      "info"
                    );

                    onSendMessage?.(
                      `[SUB-REGIONAL ADVISORY dispatched to headmaster at ${contactingSchoolName}] Ref context ${contactingTeacherName || "General"}. Details: ${draftMessage}`
                    );

                    showToast(`Official coordination memo dispatched to ${contactingSchoolName}!`, "success");
                    setContactingSchoolName(null);
                    setContactingTeacherName(null);
                    setDraftMessage("");
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Transmit Dispatch Securely
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
