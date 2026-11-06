import React, { useState } from 'react';
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
      <div className="bg-white dark:bg-black p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Track Your Status</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Enter your 9-digit Omang ID..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 pl-10 pr-4 py-2.5 rounded text-left outline-none focus:ring-2 focus:ring-sky-500"
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
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 p-6 rounded-xl text-center">
          <p className="text-red-700 font-semibold mb-1">No Application Found</p>
          <p className="text-red-600 text-sm">We could not find an application linked to ID: {searchedId}</p>
        </div>
      )}

      {matched && (
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="bg-sky-50 dark:bg-sky-900/30 p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-2xl text-slate-800 dark:text-slate-200">{matched.fullName}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Applying for: <span className="font-semibold text-slate-700 dark:text-slate-300">{matched.vacancySubject} Teacher</span></p>
          </div>
          <div className="p-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-6 uppercase text-xs tracking-wider">Application Timeline</h4>
            <div className="space-y-6">
              {matched.logs.map((log: any, index: number) => (
                <div key={index} className="flex gap-4 relative">
                  {index !== matched.logs.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-slate-200"></div>
                  )}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 ${index === 0 ? 'bg-sky-500 ring-4 ring-sky-100' : 'bg-slate-200'}`}>
                  </div>
                  <div className="pb-4">
                    <p className={`font-semibold ${index === 0 ? 'text-slate-800 dark:text-slate-200 text-base' : 'text-slate-500 dark:text-slate-400 text-sm'}`}>
                      {log.status.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                    {log.note && (
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-100 dark:border-slate-800">
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
