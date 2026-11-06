import React, { useState, useEffect } from 'react';
import { Calendar, Calculator, CheckCircle, AlertCircle, Clock, Info } from 'lucide-react';
import { User, LeaveRequest } from '../../types';

interface RequestLeaveProps {
  currentUser: User;
  onUpdateUser: (fields: Partial<User>) => void;
}

const DEFAULT_LEAVES: LeaveRequest[] = [
  {
    id: "LEV-5100",
    leaveType: "Annual",
    startDate: "2026-04-10",
    endDate: "2026-04-14",
    workingDays: 3, // Fri, Mon, Tue (Sat/Sun skipped)
    reason: "Easter family visit.",
    status: "Approved",
    submittedAt: "2026-03-25T11:00:00Z"
  }
];

export default function RequestLeave({ currentUser }: RequestLeaveProps) {
  // Determine Annual Leave Allowance based on Salary Scale
  const getAllowanceByScale = (scale?: string): number => {
    if (!scale) return 15; // default/temporary
    const base = scale.toUpperCase().charAt(0);
    switch (base) {
      case 'F': return 36;
      case 'E': return 32;
      case 'D': return 30;
      case 'C': return 24;
      case 'B': return 21;
      case 'A': return 18;
      default: return 15;
    }
  };

  const scaleAllowance = getAllowanceByScale(currentUser.salaryScale);

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(`moesd_leaves_${currentUser.id}`);
    if (saved) return JSON.parse(saved);
    return DEFAULT_LEAVES;
  });

  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [liveWorkingDays, setLiveWorkingDays] = useState(0);
  const [liveWeekendDays, setLiveWeekendDays] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(`moesd_leaves_${currentUser.id}`, JSON.stringify(leaves));
  }, [leaves, currentUser.id]);

  // Dynamic live tracking of working days
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end >= start) {
        let workDaysCount = 0;
        let weekendCount = 0;
        const current = new Date(start);
        
        while (current <= end) {
          const dayOfWeek = current.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekendCount++;
          } else {
            workDaysCount++;
          }
          current.setDate(current.getDate() + 1);
        }
        
        setLiveWorkingDays(workDaysCount);
        setLiveWeekendDays(weekendCount);
      } else {
        setLiveWorkingDays(0);
        setLiveWeekendDays(0);
      }
    } else {
      setLiveWorkingDays(0);
      setLiveWeekendDays(0);
    }
  }, [startDate, endDate]);

  // Calculate current counters
  const totalDaysApproved = leaves
    .filter(l => l.status === 'Approved' && (l.leaveType === 'Annual' || l.leaveType === 'Casual'))
    .reduce((sum, current) => sum + current.workingDays, 0);

  const remainingBalance = Math.max(0, scaleAllowance - totalDaysApproved);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!startDate || !endDate) {
      setErrorMsg("Please select both a Start Date and an End Date.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setErrorMsg("Leave End Date cannot precede the Start Date.");
      return;
    }

    if (liveWorkingDays === 0) {
      setErrorMsg("Your selected date span consists entirely of non-working weekend days.");
      return;
    }

    if ((leaveType === 'Annual' || leaveType === 'Casual') && liveWorkingDays > remainingBalance) {
      setErrorMsg(`Insufficient leave balance. You requested ${liveWorkingDays} working days, but only have ${remainingBalance} remaining.`);
      return;
    }

    if (!reason.trim()) {
      setErrorMsg("Please summarize your reason for requesting leave.");
      return;
    }

    const newRequest: LeaveRequest = {
      id: "LEV-" + Math.floor(1000 + Math.random() * 9000),
      leaveType,
      startDate,
      endDate,
      workingDays: liveWorkingDays,
      reason: reason.trim(),
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };

    setLeaves(prev => [newRequest, ...prev]);
    setStartDate('');
    setEndDate('');
    setReason('');
    setSuccessMsg(`Leave request submitted. Accurately calculated ${liveWorkingDays} working days (skipping ${liveWeekendDays} weekend days).`);
  };

  const handleSimulateStatus = (id: string, action: 'Approved' | 'Rejected') => {
    setLeaves(prev => prev.map(lev => {
      if (lev.id === id) {
        return { ...lev, status: action };
      }
      return lev;
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-805 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-sky-500" />
            Smart Leave & Accrual Calculator
          </h3>
          <p className="text-sm text-slate-505 dark:text-slate-400 mt-0.5">
            Annual leave allowances are calibrated to official Botswana civil service salary scale thresholds.
          </p>
        </div>

        {/* Current Salary Scale display badge */}
        <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-150 dark:border-slate-800 px-4 py-2 rounded-xl">
          <Calculator className="w-4.5 h-4.5 text-slate-400" />
          <div className="text-left">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">My Salary scale</p>
            <p className="text-xs font-black text-slate-800 dark:text-teal-400">{currentUser.salaryScale || "C3 (Temporary/Unassigned)"}</p>
          </div>
        </div>
      </div>

      {/* Accrual Gauge Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/30 dark:to-slate-900/30 border border-slate-150 dark:border-slate-850 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Accrued Annual Allowance</h4>
            <p className="text-sm text-slate-500 mt-1">Working days per year</p>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mt-4 leading-none font-sans">
            {scaleAllowance} <span className="text-xs font-semibold text-slate-450">Days</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100/55 dark:from-slate-950/30 dark:to-slate-900/30 border border-slate-150 dark:border-slate-850 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Deducted / Approved Leave</h4>
            <p className="text-sm text-slate-500 mt-1">Allocated annual/casual days</p>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 dark:text-orange-400 mt-4 leading-none font-sans">
            {totalDaysApproved} <span className="text-xs font-semibold text-slate-450">Days</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-sky-500/10 to-sky-600/5 dark:from-sky-950/20 dark:to-sky-900/10 border border-sky-500/10 dark:border-sky-850/40 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">Available Remaining Balance</h4>
            <p className="text-sm text-sky-700/60 dark:text-sky-400/60 mt-1">Ready for current requests</p>
          </div>
          <p className="text-4xl font-extrabold text-sky-700 dark:text-sky-305 mt-4 leading-none font-sans animate-subtle">
            {remainingBalance} <span className="text-xs font-semibold text-sky-500">Days</span>
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Submit Leave Application Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 space-y-4 border-t lg:border-t-0 lg:border-r border-slate-100 dark:border-slate-850 pt-6 lg:pt-0 lg:pr-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Request Leave Form</h4>
          
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-500">Leave Categorization</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveRequest['leaveType'])}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-805 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
            >
              <option value="Annual">Annual Leave (Deductible)</option>
              <option value="Casual">Casual Leave (Deductible)</option>
              <option value="Sick">Sick Leave</option>
              <option value="Maternity">Maternity Leave</option>
              <option value="Study">Study Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Smart feedback indicator */}
          {liveWorkingDays > 0 && (
            <div className="bg-sky-500/5 border border-sky-500/10 rounded-xl p-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-sky-650 dark:text-sky-400">
                <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Working Days calculated:</span>
                <span className="font-extrabold text-sm">{liveWorkingDays} Days</span>
              </div>
              {liveWeekendDays > 0 && (
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  * Automatically excluded {liveWeekendDays} Saturday/Sunday weekend {liveWeekendDays === 1 ? 'day' : 'days'} from deduction limits.
                </p>
              )}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-500">Justify Absence</label>
            <textarea
              rows={2}
              placeholder="e.g., Personal / Health engagement details"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl p-3 outline-none font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500"
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
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-sky-600/10 cursor-pointer text-center"
          >
            File Leave Request
          </button>
        </form>

        {/* Leave Requests Log history */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leave Transaction logbook</h4>
          {leaves.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6">No previous leave entries recorded.</p>
          ) : (
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto">
              {leaves.map((lev) => (
                <div key={lev.id} className="p-4 border border-slate-100 dark:border-slate-805 rounded-xl bg-slate-50/20 dark:bg-slate-950/20 relative flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                        {lev.id}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Filed {new Date(lev.submittedAt).toLocaleDateString([], { dateStyle: 'short' })}
                      </span>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                        {lev.leaveType} Leave • <span className="text-sky-600 dark:text-sky-400">{lev.workingDays} Working Days</span>
                      </h5>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">
                        Span: {new Date(lev.startDate).toLocaleDateString([], { dateStyle: 'medium' })} to {new Date(lev.endDate).toLocaleDateString([], { dateStyle: 'medium' })}
                      </p>
                      <p className="text-xs text-slate-500 mt-1.5 italic">“{lev.reason}”</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end gap-2 shrink-0 self-end md:self-stretch">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      lev.status === 'Approved' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-250 dark:bg-emerald-950/15 dark:text-emerald-400' 
                        : lev.status === 'Rejected'
                          ? 'bg-red-50 text-red-650 border-red-250 dark:bg-red-950/15 dark:text-red-400'
                          : 'bg-amber-50 text-amber-600 border-amber-250 dark:bg-amber-950/15 dark:text-amber-400 animate-pulse'
                    }`}>
                      {lev.status}
                    </span>

                    {lev.status === 'Pending' && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleSimulateStatus(lev.id, 'Approved')}
                          className="text-[10px] font-extrabold bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded shadow-sm transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleSimulateStatus(lev.id, 'Rejected')}
                          className="text-[10px] font-extrabold bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow-sm transition-all"
                        >
                          Deny
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
