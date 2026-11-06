import React, { useState } from 'react';
import { User, SystemAuditLog } from '../../types';
import { ShieldCheck, Search, Clock, Smartphone, Globe, Lock, ShieldAlert } from 'lucide-react';

interface UserActivityLogsProps {
  currentUser: User;
  auditLogs: SystemAuditLog[];
}

export default function UserActivityLogs({ currentUser, auditLogs }: UserActivityLogsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter for logs belonging to the current logged-in user
  const myLogs = auditLogs.filter(log => 
    log.userEmail.toLowerCase() === currentUser.email.toLowerCase() &&
    (searchTerm === '' || 
     log.details.toLowerCase().includes(searchTerm.toLowerCase()) || 
     log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            My Security &amp; Activity History
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Review a comprehensive timeline of security events, profile updates, and login sessions for your MoESD identity.</p>
        </div>
      </div>

      {/* Security Tip Box */}
      <div className="bg-slate-55/40 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex gap-3 text-xs text-slate-650 dark:text-slate-450 items-start">
        <Lock className="w-5 h-5 text-indigo-505 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-slate-800 dark:text-slate-200 block mb-0.5">Protect Your Teacher Account Credentials</span>
          Your Omang National ID and credentials authorize your official placements. If you recognize any unrecognized login locations, strange IP addresses, or updates in this activity history log, please report it immediately to Ministry Administration.
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Filter history log details or key phrases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-850 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-700 dark:text-slate-200"
        />
      </div>

      {/* Log Feed */}
      <div className="space-y-4">
        {myLogs.map((log) => (
          <div 
            key={log.id} 
            className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/20 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors text-xs items-start"
          >
            <div className={`p-2 rounded-lg shrink-0 ${
              log.action === 'AUTH_FAILURE' ? 'bg-red-50 dark:bg-red-950/20 text-red-655 dark:text-red-400' :
              log.action === 'LOGIN' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-450' :
              log.action === 'STATUS_CHANGE' ? 'bg-indigo-55 dark:bg-indigo-955/20 text-indigo-650 dark:text-indigo-450' :
              'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400'
            }`}>
              {log.action === 'AUTH_FAILURE' ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-150">
                  {log.action.replace(/_/g, " ")} 
                  {log.action === 'AUTH_FAILURE' && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[8px] bg-red-50 text-red-700 font-bold border border-red-200">Warning Flag</span>
                  )}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              <p className="text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">{log.details}</p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[10px] text-slate-405 font-mono">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 opacity-60" /> IP Address: {log.ipAddress}
                </span>
                <span className="flex items-center gap-1 min-w-0">
                  <Smartphone className="w-3.5 h-3.5 opacity-60 shrink-0" /> App Client: 
                  <span className="truncate max-w-[200px]" title={log.browser}>{log.browser}</span>
                </span>
                <span className="text-slate-500 font-mono">Ref: {log.id}</span>
              </div>
            </div>
          </div>
        ))}

        {myLogs.length === 0 && (
          <div className="py-12 text-center text-slate-500 dark:text-slate-450 font-medium space-y-2">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-xs">No matching system activity records found for your account identity.</p>
          </div>
        )}
      </div>
    </div>
  );
}
