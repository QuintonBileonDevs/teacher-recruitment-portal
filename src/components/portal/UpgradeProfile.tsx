import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { User, ProfileUpgrade } from '../../types';

interface UpgradeProfileProps {
  currentUser: User;
  onUpdateUser: (fields: Partial<User>) => void;
}

const DEFAULT_UPGRADES: ProfileUpgrade[] = [
  {
    id: "UPG-2489",
    requestedScale: "D4",
    requestedLevel: "Junior Secondary",
    requestedPosition: "Senior Teacher (with portfolio)",
    motivation: "Seeking regularisation of salary scale corresponding to Head of Department duties assumed in January.",
    status: "Approved",
    submittedAt: "2026-03-12T08:00:00Z"
  }
];

export default function UpgradeProfile({ currentUser, onUpdateUser }: UpgradeProfileProps) {
  const [upgrades, setUpgrades] = useState<ProfileUpgrade[]>(() => {
    const saved = localStorage.getItem(`moesd_upgrades_${currentUser.id}`);
    if (saved) return JSON.parse(saved);
    return DEFAULT_UPGRADES;
  });

  const [requestedScale, setRequestedScale] = useState("D4");
  const [requestedLevel, setRequestedLevel] = useState("Primary");
  const [requestedPosition, setRequestedPosition] = useState("Senior Teacher (without portfolio)");
  const [motivation, setMotivation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    localStorage.setItem(`moesd_upgrades_${currentUser.id}`, JSON.stringify(upgrades));
  }, [upgrades, currentUser.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!motivation.trim() || motivation.length < 15) {
      setErrorMsg("Please provide a comprehensive motivation (minimum 15 characters).");
      return;
    }

    const newUpgrade: ProfileUpgrade = {
      id: "UPG-" + Math.floor(1000 + Math.random() * 9000),
      requestedScale,
      requestedLevel,
      requestedPosition,
      motivation: motivation.trim(),
      status: "Pending",
      submittedAt: new Date().toISOString()
    };

    setUpgrades(prev => [newUpgrade, ...prev]);
    setMotivation("");
    setSuccessMsg("Your profile upgrade request has been registered and sent to the Ministry Board of Promotability.");
  };

  const handleSimulateAction = (upgradeId: string, action: 'Approved' | 'Rejected') => {
    setUpgrades(prev => prev.map(upg => {
      if (upg.id === upgradeId) {
        if (action === 'Approved') {
          // Instantly update the user's primary attributes!
          onUpdateUser({
            salaryScale: upg.requestedScale,
            schoolLevel: upg.requestedLevel,
            currentPosition: upg.requestedPosition
          });
        }
        return { ...upg, status: action };
      }
      return upg;
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ArrowUpCircle className="w-6 h-6 text-emerald-500 animate-pulse" />
          Permanent Teacher Promotion / Profile Upgrade
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Apply for elevation in rank, change in assigned school level, or scale realignment based on completed service credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current status display cards */}
        <div className="lg:col-span-1 border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Assigned Grade</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-500">Service Position:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{currentUser.currentPosition || "Standard Teacher"}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-500">Salary Scale:</span>
              <span className="font-bold text-sky-600 font-mono text-base">{currentUser.salaryScale || "C3"}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-500">School Level:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{currentUser.schoolLevel || "Primary"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">First Appointment:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currentUser.dateOfFirstAppointment ? new Date(currentUser.dateOfFirstAppointment).toLocaleDateString([], { dateStyle: 'medium' }) : "Verified"}
              </span>
            </div>
          </div>

          <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1">
            <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Auto-Eligibility Scan</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Your profile is eligible for automatic assessment. Requests undergo peer alignment and circular publication benchmarks within 14 business days.
            </p>
          </div>
        </div>

        {/* Upgrade Form */}
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Target Salary Scale</label>
                <select
                  value={requestedScale}
                  onChange={(e) => setRequestedScale(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="C1">C1 (Principal Teacher)</option>
                  <option value="D4">D4 (Senior Teacher III)</option>
                  <option value="D3">D3 (Senior Teacher II)</option>
                  <option value="D2">D2 (Senior Teacher I)</option>
                  <option value="D1">D1 (Senior Education Officer)</option>
                  <option value="E2">E2 (Deputy Schoolhead)</option>
                  <option value="E1">E1 (Schoolhead)</option>
                  <option value="F2">F2 (Senior Regional Officer)</option>
                  <option value="F1">F1 (Director Education Management)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Target Level</label>
                <select
                  value={requestedLevel}
                  onChange={(e) => setRequestedLevel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Primary">Primary Education</option>
                  <option value="Junior Secondary">Junior Secondary Education</option>
                  <option value="Senior Secondary">Senior Secondary Education</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Target Position</label>
                <select
                  value={requestedPosition}
                  onChange={(e) => setRequestedPosition(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Teacher">Teacher</option>
                  <option value="Senior Teacher (without portfolio)">Senior Teacher (without portfolio)</option>
                  <option value="Senior Teacher (with portfolio)">Senior Teacher (with portfolio)</option>
                  <option value="Head of Department">Head of Department</option>
                  <option value="Deputy Principal / Deputy Schoolhead">Deputy Principal / Schoolhead</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Motivation & Reference Circular No.</label>
              <textarea
                rows={3}
                placeholder="Detail past achievements, completed courses, and specify Ministry reference circular if applying on published vacancies."
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl p-3.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-red-500 bg-red-500/5 border border-red-500/10 p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="text-xs text-emerald-600 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/10"
            >
              Submit Upgrade Proposal
            </button>
          </form>

          {/* Past Upgrade logs */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Past Upgrade Log History</h4>
            {upgrades.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No previous promotion applications.</p>
            ) : (
              <div className="space-y-2">
                {upgrades.map((upg) => (
                  <div key={upg.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-slate-950/20 relative">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                            {upg.id}
                          </span>
                          <span className="text-xs text-slate-400">
                            Requested {new Date(upg.submittedAt).toLocaleDateString([], { dateStyle: 'short' })}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">
                          Proposed Elevation: {upg.requestedPosition} ({upg.requestedScale})
                        </h5>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">“{upg.motivation}”</p>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          upg.status === 'Approved' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800' 
                            : upg.status === 'Rejected'
                              ? 'bg-red-50 text-red-650 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800'
                              : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800 animate-pulse'
                        }`}>
                          {upg.status}
                        </span>

                        {upg.status === 'Pending' && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleSimulateAction(upg.id, 'Approved')}
                              className="text-[10px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded shadow-sm transition-all"
                            >
                              Simulate Approve
                            </button>
                            <button
                              onClick={() => handleSimulateAction(upg.id, 'Rejected')}
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
