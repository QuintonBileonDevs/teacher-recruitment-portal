import fs from 'fs';

const applicantWelcome = `import React from 'react';
import { ChevronRight, FileText, Search } from 'lucide-react';

export default function ApplicantWelcome({ setView }: { setView: (view: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Welcome Teacher</h2>
        <p className="text-blue-800 text-sm">
          Submit your application to the Ministry to be matched with schools across the country. Make sure you have your Omang card ready.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div 
          onClick={() => setView('register')}
          className="bg-white border border-slate-200 hover:border-blue-300 p-6 rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1">New Application</h3>
          <p className="text-sm text-slate-500 mb-4">Register your qualifications and preferred regions.</p>
          <div className="text-blue-600 text-sm font-semibold flex items-center gap-1">
            Start Form <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => setView('track')}
          className="bg-white border border-slate-200 hover:border-blue-300 p-6 rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:scale-110 transition-transform">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1">Track Application</h3>
          <p className="text-sm text-slate-500 mb-4">View the status of an existing application using your ID.</p>
          <div className="text-blue-600 text-sm font-semibold flex items-center gap-1">
            Check Status <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
`;

const applicantRegister = `import React, { useState } from 'react';
import { Applicant, ApplicationStatus } from '../../types';
import { CheckCircle } from 'lucide-react';

export default function ApplicantRegister({ onAddApplicant, setView, onSendMessage }: any) {
  const [formData, setFormData] = useState({
    fullName: '',
    omangNumber: '',
    vacancySubject: 'Mathematics',
    preferredRegion: 'Gaborone',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newApp: Applicant = {
        id: "APP-" + Math.floor(1000 + Math.random() * 9000),
        ...formData,
        status: ApplicationStatus.SUBMITTED,
        logs: [
          {
            status: ApplicationStatus.SUBMITTED,
            timestamp: new Date().toISOString(),
            note: "Application submitted successfully.",
            updatedBy: "System",
          }
        ]
      };
      onAddApplicant(newApp);
      setIsSubmitting(false);
      setSuccess(true);
    }, 1200);
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center flex flex-col items-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-green-800 mb-2">Application Received</h2>
        <p className="text-green-700 mb-6 max-w-md">
          Your profile has been registered in the database. Please check the 'Track Application' tab to see updates.
        </p>
        <button 
          onClick={() => setView('track')}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
        >
          Track Progress
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border text-left border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Teacher Registration Form</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
          <input 
            type="text" 
            required 
            placeholder="John Doe"
            className="w-full bg-slate-50 border border-slate-300 text-slate-800 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            value={formData.fullName}
            onChange={e => setFormData({...formData, fullName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">ID Number (Omang)</label>
          <input 
            type="text" 
            required 
            pattern="[1-2][0-9]{8}"
            title="9 digit number starting with 1 or 2"
            placeholder="e.g. 172481923"
            className="w-full bg-slate-50 border border-slate-300 text-slate-800 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            value={formData.omangNumber}
            onChange={e => setFormData({...formData, omangNumber: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Subject Speciality</label>
            <select 
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.vacancySubject}
              onChange={e => setFormData({...formData, vacancySubject: e.target.value})}
            >
              <option>Mathematics</option>
              <option>Science</option>
              <option>Setswana</option>
              <option>English</option>
              <option>Agriculture</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Preferred Region</label>
            <select 
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.preferredRegion}
              onChange={e => setFormData({...formData, preferredRegion: e.target.value})}
            >
              <option>Gaborone</option>
              <option>Francistown</option>
              <option>Maun</option>
              <option>Kweneng</option>
              <option>Central District</option>
            </select>
          </div>
        </div>
        <button 
          disabled={isSubmitting}
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-6 shadow-md transition-colors disabled:opacity-70 disabled:cursor-wait"
        >
          {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
`;

const applicantTrack = `import React, { useState } from 'react';
import { Applicant } from '../../types';
import { Search } from 'lucide-react';

export default function ApplicantTrack({ applicants, activeTrackOmang, setActiveTrackOmang }: any) {
  const [searchInput, setSearchInput] = useState(activeTrackOmang);
  const [searchedId, setSearchedId] = useState(activeTrackOmang);

  const matched = applicants.find((a: Applicant) => a.omangNumber === searchedId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(searchInput);
    setActiveTrackOmang(searchInput);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Track Your Status</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Enter your 9-digit Omang ID..."
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 pl-10 pr-4 py-2.5 rounded text-left outline-none focus:ring-2 focus:ring-blue-500"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white px-6 font-semibold rounded transition-colors shadow">
            Lookup
          </button>
        </form>
      </div>

      {searchedId && !matched && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center">
          <p className="text-red-700 font-semibold mb-1">No Application Found</p>
          <p className="text-red-600 text-sm">We could not find an application linked to ID: {searchedId}</p>
        </div>
      )}

      {matched && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-blue-50/50 p-6 border-b border-slate-200">
            <h3 className="font-bold text-2xl text-slate-800">{matched.fullName}</h3>
            <p className="text-slate-500 text-sm mt-1">Applying for: <span className="font-semibold text-slate-700">{matched.vacancySubject} Teacher</span></p>
          </div>
          <div className="p-6">
            <h4 className="font-bold text-slate-800 mb-6 uppercase text-xs tracking-wider">Application Timeline</h4>
            <div className="space-y-6">
              {matched.logs.map((log: any, index: number) => (
                <div key={index} className="flex gap-4 relative">
                  {index !== matched.logs.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-slate-200"></div>
                  )}
                  <div className={\`w-6 h-6 rounded-full flex items-center justify-center relative z-10 \${index === 0 ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-slate-200'}\`}>
                  </div>
                  <div className="pb-4">
                    <p className={\`font-semibold \${index === 0 ? 'text-slate-800 text-base' : 'text-slate-500 text-sm'}\`}>
                      {log.status.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                    {log.note && (
                      <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                        {log.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

const adminAnalytics = `import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function AdminAnalytics({ REGIONAL_VACANCY_DATA, QUALIFICATION_DISTRIBUTION, TURNAROUND_TIME_TREND, BUDGET_BREAKDOWN_DATA }: any) {
  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Regional Vacancies</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGIONAL_VACANCY_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="open" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} name="Open" />
                <Bar dataKey="filled" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} name="Filled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Avg Processing Time (Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TURNAROUND_TIME_TREND} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="days" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('./src/components/applicant/ApplicantWelcome.tsx', applicantWelcome);
fs.writeFileSync('./src/components/applicant/ApplicantRegister.tsx', applicantRegister);
fs.writeFileSync('./src/components/applicant/ApplicantTrack.tsx', applicantTrack);
fs.writeFileSync('./src/components/admin/AdminAnalytics.tsx', adminAnalytics);
