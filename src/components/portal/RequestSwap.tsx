import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Search, PlusCircle, AlertCircle, CheckCircle, PhoneCall, Mail } from 'lucide-react';
import { User, SwapRequest } from '../../types';
import { REGIONS } from '../../sampleData';

interface RequestSwapProps {
  currentUser: User;
  onUpdateUser: (fields: Partial<User>) => void;
}

const PEER_SWAPS: SwapRequest[] = [
  {
    id: "SWP-9011",
    teacherName: "Onkabetse Mokgware",
    teacherEmail: "onkabetse.m@gov.bw",
    currentSchool: "Kanye Primary School",
    currentRegion: "Southern",
    subject: "Mathematics / Science",
    targetRegion: "Gaborone",
    targetSchool: "Block 8 Primary School",
    contactPhone: "+267 71492044",
    status: "Active",
    submittedAt: "2026-05-10T09:00:00Z"
  },
  {
    id: "SWP-3810",
    teacherName: "Lesedi Nkwe",
    teacherEmail: "lesedi.l@gov.bw",
    currentSchool: "Shashe River School",
    currentRegion: "Francistown",
    subject: "Design and Technology",
    targetRegion: "Kgatleng",
    targetSchool: "Molefi Secondary School",
    contactPhone: "+267 76110992",
    status: "Active",
    submittedAt: "2026-05-20T12:30:00Z"
  }
];

export default function RequestSwap({ currentUser, onUpdateUser }: RequestSwapProps) {
  const [swaps, setSwaps] = useState<SwapRequest[]>(() => {
    const saved = localStorage.getItem(`moesd_user_swaps_${currentUser.id}`);
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [allSwaps, setAllSwaps] = useState<SwapRequest[]>(() => {
    const savedGlobal = localStorage.getItem(`moesd_all_swaps`);
    if (savedGlobal) return JSON.parse(savedGlobal);
    return [...PEER_SWAPS, ...swaps];
  });

  const [activeTab, setActiveTab] = useState<'board' | 'post'>('board');
  const [currentSchool, setCurrentSchool] = useState(currentUser.schoolName || '');
  const [currentRegion, setCurrentRegion] = useState(currentUser.region || REGIONS[0] || 'Gaborone');
  const [subject, setSubject] = useState(currentUser.subjectSpeciality || 'Primary General');
  const [targetRegion, setTargetRegion] = useState(REGIONS[0] || 'Gaborone');
  const [targetSchool, setTargetSchool] = useState('');
  const [contactPhone, setContactPhone] = useState(currentUser.phoneNumber || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Persist edits
  useEffect(() => {
    localStorage.setItem(`moesd_user_swaps_${currentUser.id}`, JSON.stringify(swaps));
  }, [swaps, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(`moesd_all_swaps`, JSON.stringify(allSwaps));
  }, [allSwaps]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentSchool.trim()) {
      setErrorMsg("Please specify your current assigned school station.");
      return;
    }
    if (!targetSchool.trim()) {
      setErrorMsg("Please state your target school station of choice.");
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMsg("A contact phone number is required to receive swap expressions of interest.");
      return;
    }

    const newSwap: SwapRequest = {
      id: "SWP-" + Math.floor(1000 + Math.random() * 9000),
      teacherName: currentUser.fullName,
      teacherEmail: currentUser.email,
      currentSchool: currentSchool.trim(),
      currentRegion,
      subject,
      targetRegion,
      targetSchool: targetSchool.trim(),
      contactPhone: contactPhone.trim(),
      status: "Active",
      submittedAt: new Date().toISOString()
    };

    setSwaps(prev => [newSwap, ...prev]);
    setAllSwaps(prev => [newSwap, ...prev]);
    setTargetSchool('');
    setSuccessMsg("Your Swap listing is active on the Public Peer Bulletin.");
    setTimeout(() => {
      setActiveTab('board');
      setSuccessMsg('');
    }, 1500);
  };

  const handleProposeMatch = (peerSwap: SwapRequest) => {
    // Show a mock match pop up
    alert(`Proposal Sent!\n\nAn official swap matching request has been generated between you and ${peerSwap.teacherName}.\n\nAn automated verification email has been dispatched to both parties:\n- ${peerSwap.teacherEmail}\n- ${currentUser.email}\n\nUpon mutual formal acceptance, the physical credentials transfer is updated.`);
    
    // Set status to Matched in view
    setAllSwaps(prev => prev.map(s => {
      if (s.id === peerSwap.id) {
        return { ...s, status: 'Matched' as const };
      }
      return s;
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-sky-500" />
            Peer-to-Peer Teacher Swap Exchange
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Exchange school stations directly with other certified educators. Find mutual regional swap combinations.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'board'
                ? 'bg-white dark:bg-slate-850 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-850'
            }`}
          >
            Bulletin Board
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'post'
                ? 'bg-white dark:bg-slate-850 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-850'
            }`}
          >
            Post My Swap Opportunity
          </button>
        </div>
      </div>

      {activeTab === 'board' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-sky-500/5 border border-sky-500/10 rounded-xl">
            <Search className="w-5 h-5 text-sky-500 shrink-0" />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Listing all active peer swap opportunities across standard disciplines. Initiate exchange matching request directly below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allSwaps.map((swp) => (
              <div key={swp.id} className="p-5 border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950/20 rounded-2xl flex flex-col justify-between shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded">
                      {swp.subject}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      swp.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-250 dark:bg-emerald-950/10'
                        : 'bg-amber-50 text-amber-600 border-amber-250 dark:bg-amber-950/10'
                    }`}>
                      {swp.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Present Station Hub</h4>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{swp.currentSchool}</p>
                    <p className="text-xs text-slate-505">{swp.currentRegion} Region</p>
                  </div>

                  <div className="flex items-center justify-center p-1.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl my-2">
                    <ArrowLeftRight className="w-5 h-5 text-slate-400 animate-pulse" />
                  </div>

                  <div>
                    <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Desired Destination Target</h4>
                    <p className="text-sm font-extrabold text-slate-801 dark:text-slate-200 mt-0.5">{swp.targetSchool || "Any Station"}</p>
                    <p className="text-xs text-slate-505">{swp.targetRegion} Region</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-300">{swp.teacherName}</p>
                    <span className="text-[10px] font-medium text-slate-400">Posted {new Date(swp.submittedAt).toLocaleDateString([], { dateStyle: 'short' })}</span>
                  </div>

                  {swp.teacherEmail === currentUser.email ? (
                    <span className="text-[11px] font-black text-sky-500">Your Listing</span>
                  ) : swp.status === 'Active' ? (
                    <button
                      onClick={() => handleProposeMatch(swp)}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition-all"
                    >
                      Propose Swap / Match
                    </button>
                  ) : (
                    <span className="text-[11px] font-black text-amber-500">Match Initiated</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Post Swap Listing Form</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500">My Present Allocated School</label>
              <input
                type="text"
                placeholder="e.g., Block 3 Primary"
                value={currentSchool}
                onChange={(e) => setCurrentSchool(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500">My Allocated Region</label>
              <select
                value={currentRegion}
                onChange={(e) => setCurrentRegion(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
              >
                {REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500">My Teaching Major / Specialty</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500">Target Region Wanted</label>
              <select
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
              >
                {REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500">Target Preferred School (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Ledumang Senior, or leave blank details"
                value={targetSchool}
                onChange={(e) => setTargetSchool(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500">Contact Telephone Number</label>
              <input
                type="text"
                placeholder="e.g., +267 7XXXXXXX"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>
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
            className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-sky-600/10"
          >
            <PlusCircle className="w-4 h-4" /> Publish Swap Opportunity
          </button>
        </form>
      )}
    </div>
  );
}
