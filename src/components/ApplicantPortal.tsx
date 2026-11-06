import React, { useState } from 'react';
import { Applicant, ApplicationStatus, Vacancy, Placement, User, TeacherType, SystemAuditLog } from '../types';
import ApplicantWelcome from './applicant/ApplicantWelcome';
import ApplicantRegister from './applicant/ApplicantRegister';
import ApplicantTrack from './applicant/ApplicantTrack';

// Import our rich action assets
import UpdateDocuments from './portal/UpdateDocuments';
import UpgradeProfile from './portal/UpgradeProfile';
import RequestRedirection from './portal/RequestRedirection';
import RequestSwap from './portal/RequestSwap';
import RequestLeave from './portal/RequestLeave';
import UserActivityLogs from './portal/UserActivityLogs';

import { 
  FileText, ArrowUpCircle, RefreshCw, ArrowLeftRight, Calendar,
  User as UserIcon, ClipboardList, PenTool, ShieldCheck
} from 'lucide-react';

interface ApplicantPortalProps {
  onAddApplicant: (a: Applicant) => void;
  applicants: Applicant[];
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  activeTrackOmang: string;
  setActiveTrackOmang: React.Dispatch<React.SetStateAction<string>>;
  vacancies: Vacancy[];
  setVacancies: React.Dispatch<React.SetStateAction<Vacancy[]>>;
  placements: Placement[];
  setPlacements: React.Dispatch<React.SetStateAction<Placement[]>>;
  onSendMessage: (text: string) => void;
  currentUser: User;
  onUpdateUser: (fields: Partial<User>) => void;
  auditLogs: SystemAuditLog[];
}

export default function ApplicantPortal({
  onAddApplicant,
  applicants,
  activeTrackOmang,
  setActiveTrackOmang,
  onSendMessage,
  currentUser,
  onUpdateUser,
  auditLogs
}: ApplicantPortalProps) {
  const [view, setView] = useState<'welcome' | 'register' | 'track' | 'docs' | 'upgrade' | 'redirection' | 'swap' | 'leave' | 'logs'>('welcome');

  // Determine if permanent teacher to show Upgrade Profile tab
  const isPermanentTeacher = currentUser?.teacherType === TeacherType.PERMANENT || currentUser?.teacherType === TeacherType.PERMANENT_TEACHER_AIDE;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar Navigation */}
      <div className="md:col-span-1 border-r border-slate-200 dark:border-slate-800 pr-4 space-y-1.5">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-4 mb-2">My Service Desk</p>
        
        <button 
          onClick={() => setView('welcome')} 
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === 'welcome' 
              ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-l-4 border-sky-500 font-extrabold' 
              : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <UserIcon className="w-4 h-4 shrink-0 text-slate-400" />
          Welcome Board
        </button>

        <button 
          onClick={() => setView('register')} 
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === 'register' 
              ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-l-4 border-sky-500 font-extrabold' 
              : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <PenTool className="w-4 h-4 shrink-0 text-slate-400" />
          Submit Application
        </button>

        <button 
          onClick={() => setView('track')} 
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === 'track' 
              ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-l-4 border-sky-500 font-extrabold' 
              : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <ClipboardList className="w-4 h-4 shrink-0 text-slate-400" />
          Track Status
        </button>

        <button 
          onClick={() => setView('docs')} 
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === 'docs' 
              ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-l-4 border-sky-500 font-extrabold' 
              : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0 text-slate-400" />
          Update Documents
        </button>

        {isPermanentTeacher && (
          <button 
            onClick={() => setView('upgrade')} 
            className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              view === 'upgrade' 
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-505 font-extrabold' 
                : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4 shrink-0 text-slate-400" />
            Upgrade Profile
          </button>
        )}

        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-4 pt-4 mb-2">Service Motions</p>

        <button 
          onClick={() => setView('redirection')} 
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === 'redirection' 
              ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-l-4 border-sky-500 font-extrabold' 
              : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <RefreshCw className="w-4 h-4 shrink-0 text-slate-400" />
          Request Redirection
        </button>

        <button 
          onClick={() => setView('swap')} 
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === 'swap' 
              ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-l-4 border-sky-500 font-extrabold' 
              : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4 shrink-0 text-slate-400" />
          Request Swap
        </button>

        <button 
          onClick={() => setView('leave')} 
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === 'leave' 
              ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-450 border-l-4 border-sky-500 font-extrabold' 
              : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
          Request Leave (Smart)
        </button>

        <button 
          onClick={() => setView('logs')} 
          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            view === 'logs' 
              ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-450 border-l-4 border-sky-505 font-extrabold' 
              : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <ShieldCheck className="w-4 h-4 shrink-0 text-slate-400" />
          Activity &amp; Security Logs
        </button>
      </div>

      {/* Main Content Area */}
      <div className="md:col-span-3">
        {view === 'welcome' && <ApplicantWelcome setView={setView} currentUser={currentUser} />}
        {view === 'register' && <ApplicantRegister onAddApplicant={onAddApplicant} setView={setView} onSendMessage={onSendMessage} />}
        {view === 'track' && <ApplicantTrack applicants={applicants} activeTrackOmang={activeTrackOmang} setActiveTrackOmang={setActiveTrackOmang} />}
        {view === 'docs' && <UpdateDocuments currentUser={currentUser} onUpdateUser={onUpdateUser} />}
        {view === 'upgrade' && <UpgradeProfile currentUser={currentUser} onUpdateUser={onUpdateUser} />}
        {view === 'redirection' && <RequestRedirection currentUser={currentUser} onUpdateUser={onUpdateUser} />}
        {view === 'swap' && <RequestSwap currentUser={currentUser} onUpdateUser={onUpdateUser} />}
        {view === 'leave' && <RequestLeave currentUser={currentUser} onUpdateUser={onUpdateUser} />}
        {view === 'logs' && <UserActivityLogs currentUser={currentUser} auditLogs={auditLogs} />}
      </div>
    </div>
  );
}
