import React, { useState, useEffect } from 'react';
import { RefreshCw, MapPin, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { User, RedirectionRequest } from '../../types';
import { REGIONS } from '../../sampleData';

interface RequestRedirectionProps {
  currentUser: User;
  onUpdateUser: (fields: Partial<User>) => void;
}

const DEFAULT_REDIRECTIONS: RedirectionRequest[] = [
  {
    id: "RED-1422",
    currentSchool: "Shoshong Junior School",
    targetRegion: "Gaborone",
    targetSchool: "Ledumang Senior School",
    reason: "Family relocation to the capital region.",
    status: "Approved",
    submittedAt: "2026-02-10T14:00:00Z"
  }
];

export default function RequestRedirection({ currentUser, onUpdateUser }: RequestRedirectionProps) {
  const [redirections, setRedirections] = useState<RedirectionRequest[]>(() => {
    const saved = localStorage.getItem(`moesd_redirections_${currentUser.id}`);
    if (saved) return JSON.parse(saved);
    return DEFAULT_REDIRECTIONS;
  });

  const [currentSchool, setCurrentSchool] = useState(currentUser.schoolName || 'Not Assigned');
  const [targetRegion, setTargetRegion] = useState(REGIONS[0] || 'Gaborone');
  const [targetSchool, setTargetSchool] = useState('');
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    localStorage.setItem(`moesd_redirections_${currentUser.id}`, JSON.stringify(redirections));
  }, [redirections, currentUser.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!targetSchool.trim()) {
      setErrorMsg("Please type in a target school station of choice.");
      return;
    }

    if (!reason.trim() || reason.length < 10) {
      setErrorMsg("Please provide a legitimate reason for redirection (minimum 10 characters).");
      return;
    }

    const newRed: RedirectionRequest = {
      id: "RED-" + Math.floor(1000 + Math.random() * 9000),
      currentSchool,
      targetRegion,
      targetSchool: targetSchool.trim(),
      reason: reason.trim(),
      status: "Pending",
      submittedAt: new Date().toISOString()
    };

    setRedirections(prev => [newRed, ...prev]);
    setTargetSchool('');
    setReason('');
    setSuccessMsg("Redirection transfer request generated. The Regional Education Directors will review logistics.");
  };

  const handleSimulateAction = (redirectionId: string, action: 'Approved' | 'Rejected') => {
    setRedirections(prev => prev.map(red => {
      if (red.id === redirectionId) {
        if (action === 'Approved') {
          // Instantly update user's school and region!
          onUpdateUser({
            schoolName: red.targetSchool,
            region: red.targetRegion
          });
          setCurrentSchool(red.targetSchool); // Update local state for input consistency
        }
        return { ...red, status: action };
      }
      return red;
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-sky-500 animate-spin-slow" />
          Redirection & Regional Transfer Application
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Apply to migrate your placement registration. Redirections are reviewed periodically during school break transitions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Relocation facts */}
        <div className="lg:col-span-1 border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Assigned Station</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-500">School Post:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]" title={currentSchool}>{currentSchool}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-500">Ministry Region:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{currentUser.region || "Unassigned Region"}</span>
            </div>
          </div>

          <div className="p-3 bg-sky-500/5 border border-sky-500/10 rounded-xl space-y-1">
            <h5 className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Transfer Guidelines
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Approved transfers will notify your respective administrative division, updating your digital credentials card immediately.
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Target Destination Region</label>
                <select
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
                >
                  {REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Target School Station</label>
                <input
                  type="text"
                  placeholder="e.g., Gaborone West Junior School"
                  value={targetSchool}
                  onChange={(e) => setTargetSchool(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Justification & Transfer Necessity</label>
              <textarea
                rows={3}
                placeholder="Declare circumstances such as medical requirements, matrimonial integration, or educational deployment alignment."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl p-3.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-red-500 bg-red-500/5 border border-red-500/10 p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="text-xs text-sky-650 bg-sky-500/5 border border-sky-500/10 p-3 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-sky-600/10"
            >
              Dispatch Redirection Claim
            </button>
          </form>

          {/* Transfers History layout */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Transfer & Redirection Log</h4>
            {redirections.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No previous transfer requests logged.</p>
            ) : (
              <div className="space-y-2">
                {redirections.map((red) => (
                  <div key={red.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-slate-950/20 relative">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                            {red.id}
                          </span>
                          <span className="text-xs text-slate-400">
                            Filed {new Date(red.submittedAt).toLocaleDateString([], { dateStyle: 'short' })}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">
                          Transfer Target: {red.targetSchool} ({red.targetRegion})
                        </h5>
                        <p className="text-xs mt-1 text-slate-400 font-medium">Source: {red.currentSchool}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">“{red.reason}”</p>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          red.status === 'Approved' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800' 
                            : red.status === 'Rejected'
                              ? 'bg-red-50 text-red-650 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800'
                              : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800 animate-pulse'
                        }`}>
                          {red.status}
                        </span>

                        {red.status === 'Pending' && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleSimulateAction(red.id, 'Approved')}
                              className="text-[10px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded shadow-sm transition-all"
                            >
                              Simulate Approve
                            </button>
                            <button
                              onClick={() => handleSimulateAction(red.id, 'Rejected')}
                              className="text-[10px] font-bold bg-red-500 hover:bg-red-650 text-white px-2 py-1 rounded shadow-sm transition-all"
                            >
                              Simulate Deny
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
