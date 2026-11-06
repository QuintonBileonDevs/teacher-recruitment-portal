import fs from 'fs';
import path from 'path';

const adminPortal = `import React, { useState } from 'react';
import { ApplicationStatus, Applicant, Vacancy, Placement } from '../types';
import { Search, Filter, ShieldCheck, Mail, MapPin, Building, ChevronRight, Check, X, FileText } from 'lucide-react';
import AdminAnalytics from './admin/AdminAnalytics';

interface AdminPortalProps {
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
    interviewDate?: string
  ) => void;
  onSendMessage: (text: string) => void;
}

export default function AdminPortal({ applicants, onUpdateApplicantStatus }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'applications' | 'analytics'>('applications');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplicants = applicants.filter(a => 
    a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.omangNumber.includes(searchTerm) ||
    a.id.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ministry Dashboard</h2>
          <p className="text-sm text-slate-500">Manage applications and view system analytics.</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button 
            onClick={() => setActiveTab('applications')} 
            className={\`px-4 py-2 rounded-md font-medium \${activeTab === 'applications' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}\`}
          >
            Applications
          </button>
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={\`px-4 py-2 rounded-md font-medium \${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}\`}
          >
            Analytics
          </button>
        </div>
      </div>

      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow border border-slate-200 flex items-center">
            <Search className="w-5 h-5 text-slate-400 mr-2" />
            <input 
              type="text"
              placeholder="Search by name, ID number, or Application ID..."
              className="w-full text-slate-800 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredApplicants.map(applicant => (
              <div key={applicant.id} className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800">{applicant.fullName}</h3>
                    <span className={\`text-xs font-semibold px-2 py-1 rounded \${
                      applicant.status === ApplicationStatus.SUBMITTED ? 'bg-yellow-100 text-yellow-800' :
                      applicant.status === ApplicationStatus.UNDER_REVIEW ? 'bg-blue-100 text-blue-800' :
                      applicant.status === ApplicationStatus.SHORTLISTED ? 'bg-purple-100 text-purple-800' :
                      applicant.status === ApplicationStatus.INTERVIEW_SCHEDULED ? 'bg-orange-100 text-orange-800' :
                      applicant.status === ApplicationStatus.HIRED ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }\`}>
                      {applicant.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Subject: {applicant.vacancySubject}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mb-4">
                    <MapPin className="w-3 h-3" /> Region: {applicant.preferredRegion}
                  </p>
                </div>

                {applicant.status === ApplicationStatus.SUBMITTED && (
                  <button 
                    onClick={() => onUpdateApplicantStatus(applicant.id, ApplicationStatus.UNDER_REVIEW, "Documents are valid and being reviewed.")}
                    className="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Start Reviewing
                  </button>
                )}
                {applicant.status === ApplicationStatus.UNDER_REVIEW && (
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => onUpdateApplicantStatus(applicant.id, ApplicationStatus.SHORTLISTED, "Candidate has been shortlisted for regional roles.")}
                      className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Shortlist
                    </button>
                    <button 
                      onClick={() => onUpdateApplicantStatus(applicant.id, ApplicationStatus.REJECTED, "Minimum qualifications not met.")}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {(applicant.status === ApplicationStatus.SHORTLISTED || applicant.status === ApplicationStatus.INTERVIEW_SCHEDULED) && (
                  <button 
                    onClick={() => onUpdateApplicantStatus(applicant.id, ApplicationStatus.HIRED, "Successfully placed in school.")}
                    className="mt-4 w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded text-sm font-medium transition-colors"
                  >
                    Mark as Hired
                  </button>
                )}
              </div>
            ))}
            {filteredApplicants.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                No matching applications found.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <AdminAnalytics 
          REGIONAL_VACANCY_DATA={[]} 
          QUALIFICATION_DISTRIBUTION={[]} 
          TURNAROUND_TIME_TREND={[]} 
          BUDGET_BREAKDOWN_DATA={[]} 
        />
      )}
    </div>
  );
}
`;

const applicantPortal = `import React, { useState } from 'react';
import { Applicant, ApplicationStatus, Vacancy, Placement } from '../types';
import ApplicantWelcome from './applicant/ApplicantWelcome';
import ApplicantRegister from './applicant/ApplicantRegister';
import ApplicantTrack from './applicant/ApplicantTrack';

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
}

export default function ApplicantPortal({
  onAddApplicant,
  applicants,
  activeTrackOmang,
  setActiveTrackOmang,
  onSendMessage
}: ApplicantPortalProps) {
  const [view, setView] = useState<'welcome' | 'register' | 'track'>('welcome');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar Navigation */}
      <div className="md:col-span-1 border-r border-slate-200 pr-4 space-y-2">
        <button 
          onClick={() => setView('welcome')} 
          className={\`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors \${view === 'welcome' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}
        >
          Welcome
        </button>
        <button 
          onClick={() => setView('register')} 
          className={\`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors \${view === 'register' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}
        >
          Submit Application
        </button>
        <button 
          onClick={() => setView('track')} 
          className={\`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors \${view === 'track' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}\`}
        >
          Track Status
        </button>
      </div>

      {/* Main Content Area */}
      <div className="md:col-span-3">
        {view === 'welcome' && <ApplicantWelcome setView={setView} />}
        {view === 'register' && <ApplicantRegister onAddApplicant={onAddApplicant} setView={setView} onSendMessage={onSendMessage} />}
        {view === 'track' && <ApplicantTrack applicants={applicants} activeTrackOmang={activeTrackOmang} setActiveTrackOmang={setActiveTrackOmang} />}
      </div>
    </div>
  );
}
`;

const schoolPortal = `import React from 'react';
import { Vacancy, Applicant, Placement } from '../types';
import { Building, MapPin, Search } from 'lucide-react';

interface SchoolPortalProps {
  applicants: Applicant[];
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  vacancies: Vacancy[];
  setVacancies: React.Dispatch<React.SetStateAction<Vacancy[]>>;
  placements: Placement[];
  setPlacements: React.Dispatch<React.SetStateAction<Placement[]>>;
  onSendMessage: (text: string) => void;
}

export default function SchoolPortal({ vacancies, placements }: SchoolPortalProps) {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">School Dashboard</h2>
        <p className="text-slate-500">View current open vacancies across all regions.</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" /> Open Vacancies
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vacancies.filter(v => v.status === 'OPEN').map(vacancy => (
            <div key={vacancy.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-lg text-slate-800">{vacancy.subject} Teacher</h4>
              <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1 mb-3">
                <Building className="w-4 h-4 text-slate-400" /> {vacancy.schoolName}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1 text-slate-600"><MapPin className="w-4 h-4 text-blue-500"/> {vacancy.region}</span>
                <span className="text-blue-700 bg-blue-50 font-bold px-2 py-1 rounded">Qty: {vacancy.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Placements</h3>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">Teacher</th>
                <th className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">School</th>
                <th className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">Subject</th>
              </tr>
            </thead>
            <tbody>
              {placements.map(p => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{p.applicantName}</td>
                  <td className="px-4 py-3 text-slate-600 flex items-center gap-2"><MapPin className="w-3 h-3"/> {p.schoolName}</td>
                  <td className="px-4 py-3 text-slate-600">{p.subject}</td>
                </tr>
              ))}
              {placements.length === 0 && (
                 <tr>
                   <td colSpan={3} className="px-4 py-6 text-center text-slate-500">No placements found.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('./src/components/AdminPortal.tsx', adminPortal);
fs.writeFileSync('./src/components/ApplicantPortal.tsx', applicantPortal);
fs.writeFileSync('./src/components/SchoolPortal.tsx', schoolPortal);
