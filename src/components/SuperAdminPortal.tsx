import React, { useState, useEffect } from 'react';
import { User, UserRole, TeacherType, SchoolLeaderType, SystemAuditLog, Vacancy, Placement } from '../types';
import { 
  Users, Settings, Database, Activity, ShieldCheck, Trash2, Edit, Plus, Search, 
  RefreshCw, Sliders, DollarSign, Check, X, Briefcase, Key, Layers, Wifi, 
  Terminal, Download, UploadCloud, Clock, AlertTriangle, ShieldAlert, Sparkles, Filter
} from 'lucide-react';

interface SuperAdminPortalProps {
  currentUser: User;
  onUpdateUser: (fields: Partial<User>) => void;
  auditLogs: SystemAuditLog[];
  onAddAuditLog: (action: string, details: string, severity: 'info' | 'warning' | 'critical') => void;
  onClearAuditLogs: () => void;
  vacancies: Vacancy[];
  placements: Placement[];
  onSendMessage: (text: string) => void;
}

interface BackupHistoryItem {
  id: string;
  timestamp: string;
  size: string;
  checksum: string;
  actor: string;
  status: 'Healthy' | 'Corrupt' | 'Restored';
}

export default function SuperAdminPortal({
  currentUser,
  onUpdateUser,
  auditLogs,
  onAddAuditLog,
  onClearAuditLogs,
  vacancies,
  placements,
  onSendMessage
}: SuperAdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'settings' | 'audit'>('dashboard');

  // Load and manage registered users in local storage
  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('moesd_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const syncUsersToStorage = (updatedList: any[]) => {
    setRegisteredUsers(updatedList);
    localStorage.setItem('moesd_registered_users', JSON.stringify(updatedList));
  };

  // User Administration State
  const [userSearchText, setUserSearchText] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  // Create / Edit user form fields
  const [formEmail, setFormEmail] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formRole, setFormRole] = useState<UserRole>(UserRole.TEACHER);
  const [formTeacherType, setFormTeacherType] = useState<TeacherType>(TeacherType.PERMANENT);
  const [formLeaderType, setFormLeaderType] = useState<SchoolLeaderType>(SchoolLeaderType.SCHOOLHEAD);
  const [formRegion, setFormRegion] = useState('Gaborone');
  const [formSchoolName, setFormSchoolName] = useState('');
  const [formSalaryScale, setFormSalaryScale] = useState('C3');
  const [formPosition, setFormPosition] = useState('Senior Teacher');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userAdminFeedback, setUserAdminFeedback] = useState<string | null>(null);

  // Global Parameters and Settings
  const [minExperienceThreshold, setMinExperienceThreshold] = useState<number>(() => {
    const saved = localStorage.getItem('moesd_sys_min_experience');
    return saved ? parseInt(saved, 10) : 2;
  });
  const [minQualification, setMinQualification] = useState<string>(() => {
    const saved = localStorage.getItem('moesd_sys_min_qualification');
    return saved || 'Degree in Secondary Education';
  });
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('moesd_sys_maintenance_mode');
    return saved === 'true';
  });
  const [enableWhatsAppSimulation, setEnableWhatsAppSimulation] = useState<boolean>(() => {
    const saved = localStorage.getItem('moesd_sys_whatsapp_simulation');
    return saved !== 'false';
  });
  const [recruitmentBudget, setRecruitmentBudget] = useState<number>(() => {
    const saved = localStorage.getItem('moesd_sys_recruitment_budget');
    return saved ? parseInt(saved, 10) : 15000000;
  });
  const [configFeedback, setConfigFeedback] = useState<string | null>(null);

  // Backup & Restore State representation
  const [backups, setBackups] = useState<BackupHistoryItem[]>(() => {
    const saved = localStorage.getItem('moesd_sys_backups');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      { id: 'BAK-20260609-001', timestamp: '2026-06-09T14:24:00Z', size: '1.42 MB', checksum: 'sha256-a94f6e1', actor: 'Neo Molosi', status: 'Healthy' },
      { id: 'BAK-20260603-002', timestamp: '2026-06-03T02:11:15Z', size: '1.39 MB', checksum: 'sha256-2b19e44', actor: 'Neo Molosi', status: 'Healthy' }
    ];
  });
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupNotice, setBackupNotice] = useState<string | null>(null);

  // Network / Hardware heartbeats representation
  const [heartbeatStats, setHeartbeatStats] = useState({
    activeSessions: 142,
    dbLagSec: 0.18,
    memoryUsage: '34.8%',
    cpuLoad: '12.4%',
    apiResponseMs: 14,
    cacheHitRatio: '98.9%'
  });

  // Randomize telemetry statistics slightly to look immersive and authentic
  useEffect(() => {
    const timer = setInterval(() => {
      setHeartbeatStats(prev => ({
        activeSessions: Math.max(90, prev.activeSessions + Math.floor(Math.random() * 7) - 3),
        dbLagSec: parseFloat(Math.max(0.04, prev.dbLagSec + (Math.random() * 0.08) - 0.04).toFixed(2)),
        memoryUsage: (parseFloat(prev.memoryUsage) + (Math.random() * 0.4) - 0.2).toFixed(1) + '%',
        cpuLoad: (parseFloat(prev.cpuLoad) + (Math.random() * 2) - 1).toFixed(1) + '%',
        apiResponseMs: Math.max(8, prev.apiResponseMs + Math.floor(Math.random() * 5) - 2),
        cacheHitRatio: (parseFloat(prev.cacheHitRatio) + (Math.random() * 0.1) - 0.05).toFixed(2) + '%'
      }));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Save Config parameters Helper
  const handleSaveConfigParameters = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('moesd_sys_min_experience', minExperienceThreshold.toString());
    localStorage.setItem('moesd_sys_min_qualification', minQualification);
    localStorage.setItem('moesd_sys_maintenance_mode', maintenanceMode.toString());
    localStorage.setItem('moesd_sys_whatsapp_simulation', enableWhatsAppSimulation.toString());
    localStorage.setItem('moesd_sys_recruitment_budget', recruitmentBudget.toString());

    onAddAuditLog(
      "CONFIGURATION_UPDATE", 
      `Super Admin adjusted portal rules: Maintenance=${maintenanceMode}, Required Exp=${minExperienceThreshold} yrs, Min Cert=${minQualification}, Budget=BWP ${recruitmentBudget.toLocaleString()}`, 
      "warning"
    );

    setConfigFeedback("Verification Guidelines updated on Botswana Central Gaborone node!");
    setTimeout(() => setConfigFeedback(null), 3000);
  };

  // User Actions (CRUD)
  const handleEditUserClick = (usr: any) => {
    setEditingUserId(usr.id);
    setFormEmail(usr.email);
    setFormFullName(usr.fullName);
    setFormRole(usr.role);
    setFormTeacherType(usr.teacherType || TeacherType.PERMANENT);
    setFormLeaderType(usr.schoolLeaderType || SchoolLeaderType.SCHOOLHEAD);
    setFormRegion(usr.region || 'Gaborone');
    setFormSchoolName(usr.schoolName || '');
    setFormSalaryScale(usr.salaryScale || 'C3');
    setFormPosition(usr.currentPosition || 'Senior Teacher');
    setIsAddingUser(false);
  };

  const handleAddNewUserClick = () => {
    setEditingUserId(null);
    setFormEmail('');
    setFormFullName('');
    setFormRole(UserRole.TEACHER);
    setFormTeacherType(TeacherType.TEMPORARY);
    setFormLeaderType(SchoolLeaderType.SCHOOLHEAD);
    setFormRegion('Gaborone');
    setFormSchoolName('');
    setFormSalaryScale('C3');
    setFormPosition('Teacher');
    setIsAddingUser(true);
  };

  const handleSaveUserForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim() || !formFullName.trim()) {
      setUserAdminFeedback("Please enter email and full name");
      return;
    }

    if (isAddingUser) {
      const duplicateExists = registeredUsers.some(u => u.email.toLowerCase() === formEmail.trim().toLowerCase());
      if (duplicateExists) {
        setUserAdminFeedback("Account matching that email address already exists.");
        return;
      }

      const generatedId = `USR-ADD-${Date.now().toString().substring(8)}`;
      const newUser = {
        id: generatedId,
        email: formEmail.trim().toLowerCase(),
        password: 'pass123', // Default standard sandbox password
        fullName: formFullName.trim(),
        role: formRole,
        teacherType: formRole === UserRole.TEACHER ? formTeacherType : undefined,
        schoolLeaderType: formRole === UserRole.SCHOOL_LEADER ? formLeaderType : undefined,
        region: (formRole === UserRole.OFFICIAL_REGIONAL || formRole === UserRole.OFFICIAL_SUB_REGIONAL) ? formRegion : undefined,
        schoolName: formRole === UserRole.SCHOOL_LEADER ? formSchoolName || 'Government Managed Secondary' : undefined,
        salaryScale: formSalaryScale,
        currentPosition: formRole === UserRole.TEACHER ? formPosition : undefined,
        profileCompleted: true,
        securityQuestion: 'What was your first school?',
        securityAnswer: 'Botswana Primary',
      };

      const updatedUsers = [newUser, ...registeredUsers];
      syncUsersToStorage(updatedUsers);

      onAddAuditLog(
        "USER_CREATION", 
        `Super Admin created account for: ${newUser.fullName} (${newUser.role}) - ID: ${newUser.id}`, 
        "info"
      );

      setUserAdminFeedback("Successfully registered new user with standard credentials.");
      setTimeout(() => {
        setIsAddingUser(false);
        setUserAdminFeedback(null);
      }, 1500);

    } else if (editingUserId) {
      const updatedUsers = registeredUsers.map(usr => {
        if (usr.id === editingUserId) {
          return {
            ...usr,
            email: formEmail.trim().toLowerCase(),
            fullName: formFullName.trim(),
            role: formRole,
            teacherType: formRole === UserRole.TEACHER ? formTeacherType : undefined,
            schoolLeaderType: formRole === UserRole.SCHOOL_LEADER ? formLeaderType : undefined,
            region: (formRole === UserRole.OFFICIAL_REGIONAL || formRole === UserRole.OFFICIAL_SUB_REGIONAL) ? formRegion : undefined,
            schoolName: formRole === UserRole.SCHOOL_LEADER ? formSchoolName : undefined,
            salaryScale: formSalaryScale,
            currentPosition: formRole === UserRole.TEACHER ? formPosition : undefined,
          };
        }
        return usr;
      });

      syncUsersToStorage(updatedUsers);

      onAddAuditLog(
        "USER_MODIFICATION", 
        `Super Admin modified account elements of: ${formFullName} (Target UUID: ${editingUserId})`, 
        "warning"
      );

      setUserAdminFeedback("User information updated in active server node.");
      
      // Update our logged in profile if modifying own credentials
      if (editingUserId === currentUser.id) {
        onUpdateUser({
          email: formEmail.trim().toLowerCase(),
          fullName: formFullName.trim(),
          role: formRole,
          salaryScale: formSalaryScale,
          currentPosition: formRole === UserRole.TEACHER ? formPosition : undefined
        });
      }

      setTimeout(() => {
        setEditingUserId(null);
        setUserAdminFeedback(null);
      }, 1500);
    }
  };

  const handleDeleteUser = (usrId: string, usrName: string) => {
    if (usrId === currentUser.id) {
      alert("Security Block: You cannot delete your own active super-admin session node.");
      return;
    }

    if (window.confirm(`Are you completely sure you want to revoke and delete ${usrName}'s authentication record?`)) {
      const filtered = registeredUsers.filter(u => u.id !== usrId);
      syncUsersToStorage(filtered);

      onAddAuditLog(
        "USER_DELETION", 
        `Administrative deletion: Revoked login privileges and removed data for ${usrName} (ID: ${usrId})`, 
        "critical"
      );

      setUserAdminFeedback("User session and registry revoked.");
      setTimeout(() => setUserAdminFeedback(null), 3000);
    }
  };

  // Backups generation helper
  const handleTriggerBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newBackup: BackupHistoryItem = {
        id: `BAK-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toISOString(),
        size: '1.43 MB',
        checksum: `sha256-${Math.random().toString(16).substring(2, 9)}`,
        actor: currentUser.fullName,
        status: 'Healthy'
      };

      const revisedBackups = [newBackup, ...backups];
      setBackups(revisedBackups);
      localStorage.setItem('moesd_sys_backups', JSON.stringify(revisedBackups));

      onAddAuditLog(
        "SYSTEM_BACKUP", 
        `Manual snapshot generation triggered. Database payload size: 1.43 MB. Checksum verified successfully. Status: Healthy.`, 
        "info"
      );

      setIsBackingUp(false);
      setBackupNotice("System Registry Backup captured successfully!");
      setTimeout(() => setBackupNotice(null), 3000);
    }, 1500);
  };

  const handleRestoreBackup = (bId: string) => {
    if (window.confirm(`Are you sure you want to rollback or align the entire system state with database checkpoint ${bId}?`)) {
      setBackups(prev => prev.map(item => {
        if (item.id === bId) return { ...item, status: 'Restored' };
        return item;
      }));

      onAddAuditLog(
        "DATABASE_RESTORE", 
        `System state rolled back to checkpoint snapshot: ${bId}. Actor identity: ${currentUser.fullName}. Refreshing memory layers.`, 
        "critical"
      );

      setBackupNotice(`Successfully aligned state layers with checkpoint backup ${bId}.`);
      setTimeout(() => setBackupNotice(null), 4000);
    }
  };

  // Filter application users
  const filteredUsersList = registeredUsers.filter(u => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(userSearchText.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchText.toLowerCase()) ||
      u.id.toLowerCase().includes(userSearchText.toLowerCase());

    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate live recruitment budget details
  // Basic calculation: sum up appointed teacher's monthly payouts (using placeholder average salaries)
  const budgetedCommittedMonthly = placements.reduce((acc, current) => {
    // Basic scale estimation
    return acc + 12500;
  }, 0) * 12;

  const budgetUsedPct = Math.min((budgetedCommittedMonthly / recruitmentBudget) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-md border border-emerald-500/20 inline-block mb-1.5 animate-pulse">
            Super Administrator Portal
          </span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Overseer System Control Deck</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage user authorization layers, configure guidelines, roll-back databases, and audit system-wide telemetry.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0 flex-wrap">
          <button 
            type="button"
            onClick={() => setActiveTab('dashboard')} 
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-400'}`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            Health &amp; Snapshots
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('users')} 
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-400'}`}
          >
            <Users className="w-4 h-4 shrink-0" />
            Users Registry ({registeredUsers.length})
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('settings')} 
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-400'}`}
          >
            <Sliders className="w-4 h-4 shrink-0" />
            Parameter Configurations
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('audit')} 
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'audit' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-400'}`}
          >
            <Terminal className="w-4 h-4 shrink-0" />
            Administrative Logs
          </button>
        </div>
      </div>

      {backupNotice && (
        <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg">
          <Sparkles className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold">{backupNotice}</span>
        </div>
      )}

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Heartbeat Status Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Live Connections</span>
              <p className="text-lg font-black text-slate-850 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {heartbeatStats.activeSessions}
              </p>
              <div className="text-[9px] text-slate-400 mt-1.5">Concurrent TCP users</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">DB Replica Lag</span>
              <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1">{heartbeatStats.dbLagSec}s</p>
              <div className="text-[9px] text-slate-400 mt-1.5">Sync with Gaborone South</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Memory Alloc</span>
              <p className="text-lg font-black text-slate-850 dark:text-slate-100 mt-1">{heartbeatStats.memoryUsage}</p>
              <div className="text-[9px] text-slate-400 mt-1.5">Container cache pool</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">CPU Utilization</span>
              <p className="text-lg font-black text-slate-850 dark:text-slate-100 mt-1">{heartbeatStats.cpuLoad}</p>
              <div className="text-[9px] text-slate-400 mt-1.5">Auto-scaling group active</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Latency Average</span>
              <p className="text-lg font-black text-emerald-600 mt-1">{heartbeatStats.apiResponseMs} ms</p>
              <div className="text-[9px] text-slate-400 mt-1.5">API Gateway routes</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Cache Pool Hits</span>
              <p className="text-lg font-black text-sky-500 mt-1">{heartbeatStats.cacheHitRatio}</p>
              <div className="text-[9px] text-slate-400 mt-1.5">Redis Layer efficiency</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Backup snapshot Controller */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-sky-500" />
                    State Backup &amp; Recovery Registry
                  </h3>
                  <p className="text-[11px] text-slate-400">Manual registry snapshots mapping Botswana Teacher deployments and security rule files.</p>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerBackup}
                  disabled={isBackingUp}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 shrink-0 disabled:opacity-40"
                >
                  {isBackingUp ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> snapshots...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" /> Capture Snapshot
                    </>
                  )}
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs bg-slate-50/10">
                  <thead className="bg-slate-100/50 dark:bg-slate-950 font-bold text-slate-400">
                    <tr>
                      <th className="px-4 py-2.5">Snapshot ID</th>
                      <th className="px-4 py-2.5">Captured Time</th>
                      <th className="px-4 py-2.5">Files Size</th>
                      <th className="px-4 py-2.5">SHA Checksum</th>
                      <th className="px-4 py-2.5">Actor</th>
                      <th className="px-4 py-2.5 text-right">Alignment Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800/60">
                    {backups.map(item => (
                      <tr key={item.id} className="hover:bg-slate-100/20 dark:hover:bg-slate-950/30">
                        <td className="px-4 py-3 font-mono font-bold text-[10px] text-slate-700 dark:text-slate-300">
                          {item.id}
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-[10px]">
                          {new Date(item.timestamp).toLocaleString([], { hour12: false })}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-405 font-mono text-[10px]">
                          {item.size}
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-[10px]">
                          {item.checksum}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-350 italic">
                          {item.actor}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {item.status === 'Restored' ? (
                            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold uppercase text-[9px] rounded-lg border border-indigo-200">
                              Active Align
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRestoreBackup(item.id)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 text-slate-650 hover:text-red-700 dark:bg-slate-850 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-205 transition-colors"
                            >
                              Restore state
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Metrics of App Activity */}
            <div className="bg-indigo-950/20 dark:bg-indigo-950/40 border border-slate-250 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider">Superuser System Summary</h4>
                  <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-1">Status: Operational</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-650 dark:text-slate-350">
                    <span>Active Placements:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-205">{placements.length} teachers</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-650 dark:text-slate-350">
                    <span>Pending Open Gaps:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-205">{vacancies.filter(v => v.status === 'Open').length} vacancies</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-650 dark:text-slate-350">
                    <span>Ministry Budget (FY26):</span>
                    <span className="font-mono text-slate-800 dark:text-slate-205">BWP {recruitmentBudget.toLocaleString()}</span>
                  </div>
                </div>

                {/* Live visual budget ratio bar */}
                <div className="space-y-1 pt-3">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>Committed budget:</span>
                    <span>{budgetUsedPct.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-550 dark:bg-indigo-405 h-full transition-all duration-1000"
                      style={{ width: `${budgetUsedPct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 italic">Target average salary of BWP 12,500/mo inclusive for placements.</p>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 mt-4 flex items-center justify-between text-[11px] text-indigo-400">
                <span className="flex items-center gap-1 font-mono uppercase text-[9px] font-black">
                  <Wifi className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Edge Nodes Green
                </span>
                <span>Active Core: Gaborone</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB - FULL CRUD DIRECTORY */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* List of active accounts in directory */}
          <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Botswana Unified Teacher Identity Registry (CRUD)
                </h3>
                <p className="text-[11px] text-slate-400">Directly manage local credentials, role authority levels, and assigned administrative regions.</p>
              </div>
              <button
                type="button"
                onClick={handleAddNewUserClick}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Add User Account
              </button>
            </div>

            {/* Dynamic filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter users by email, full name, or register ID..."
                  value={userSearchText}
                  onChange={(e) => setUserSearchText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black border border-slate-205 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-705 dark:text-slate-200"
                />
              </div>

              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="bg-slate-50 dark:bg-black border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-black text-slate-700 dark:text-slate-300 min-w-[150px] focus:outline-none"
              >
                <option value="all">All Roles</option>
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Registered Users list table */}
            <div className="border border-slate-205 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-inner text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100/50 dark:bg-slate-950 font-bold text-slate-500 dark:text-slate-400 border-b border-slate-205 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-2.5">Identity profile</th>
                    <th className="px-4 py-2.5">System Email</th>
                    <th className="px-4 py-2.5">Assigned Role</th>
                    <th className="px-4 py-2.5">Meta attributes</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800/60 font-medium">
                  {filteredUsersList.map(usr => (
                    <tr key={usr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-800 dark:text-slate-150 flex items-center gap-1">
                            {usr.fullName}
                            {usr.id === currentUser.id && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] bg-indigo-100 text-indigo-700 font-bold leading-none">Self</span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{usr.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{usr.email}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          usr.role === UserRole.SUPER_ADMIN ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-350' :
                          usr.role === UserRole.TEACHER ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-350' :
                          usr.role === UserRole.SCHOOL_LEADER ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-355' :
                          'bg-amber-100 text-amber-805 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                        {usr.role === UserRole.TEACHER && (
                          <span>Category: <strong className="text-slate-650">{usr.teacherType || 'Standard'}</strong></span>
                        )}
                        {usr.role === UserRole.SCHOOL_LEADER && (
                          <span>School: <strong className="text-slate-650">{usr.schoolName || 'Not Assigned'}</strong></span>
                        )}
                        {(usr.role === UserRole.OFFICIAL_REGIONAL || usr.role === UserRole.OFFICIAL_SUB_REGIONAL) && (
                          <span>Scope: <strong className="text-slate-650">{usr.region || 'National HQ'}</strong></span>
                        )}
                        {usr.role === UserRole.SUPER_ADMIN && (
                          <span>Scale: <strong className="text-slate-650">{usr.salaryScale || 'E1'} (Overseer)</strong></span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditUserClick(usr)}
                          className="p-1 px-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 rounded-lg text-[11px] font-bold border border-slate-205 transition-colors"
                        >
                          Modify
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(usr.id, usr.fullName)}
                          disabled={usr.id === currentUser.id}
                          className="p-1 px-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                          title="Revoke and Delete account record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsersList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-slate-400 leading-relaxed font-semibold">
                        No certified users found matching active query criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Side panel (Add or Edit User) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-slate-800 dark:text-slate-150 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                {editingUserId ? <Edit className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-emerald-500" />}
                {editingUserId ? 'Modify User Profile' : 'Register New Sandbox Account'}
              </h4>
              {(editingUserId || isAddingUser) && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingUserId(null);
                    setIsAddingUser(false);
                  }}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {userAdminFeedback && (
              <div className="p-3 bg-sky-50 dark:bg-sky-950/20 border border-sky-100 text-sky-700 dark:text-sky-305 text-xs rounded-xl flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="font-semibold">{userAdminFeedback}</span>
              </div>
            )}

            {!(editingUserId || isAddingUser) ? (
              <div className="py-12 text-center text-slate-400 space-y-2.5">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold leading-relaxed">Select any active account on the directory map to modify credentials, roles, scale values, or register a new one manually.</p>
                <button
                  type="button"
                  onClick={handleAddNewUserClick}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                >
                  Setup New Account
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveUserForm} className="space-y-4 text-xs font-bold text-slate-650 dark:text-slate-350">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    className="w-full bg-slate-55/60 dark:bg-black border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-755 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    placeholder="e.g. Segomotso Ditsele"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Email address</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-slate-55/60 dark:bg-black border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-755 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    placeholder="e.g. sditsele@gov.bw"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Account System Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full bg-slate-55/60 dark:bg-black border border-slate-205 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-755 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {Object.values(UserRole).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* Sub-form options based on role selection */}
                {formRole === UserRole.TEACHER && (
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Teacher Category</label>
                      <select
                        value={formTeacherType}
                        onChange={(e) => setFormTeacherType(e.target.value as TeacherType)}
                        className="w-full bg-slate-55/60 dark:bg-black border border-slate-205 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-750"
                      >
                        {Object.values(TeacherType).map(item => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Current Position</label>
                      <input
                        type="text"
                        value={formPosition}
                        onChange={(e) => setFormPosition(e.target.value)}
                        className="w-full bg-slate-55/60 dark:bg-black border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-755 font-medium"
                        placeholder="e.g. Senior Teacher II"
                      />
                    </div>
                  </div>
                )}

                {formRole === UserRole.SCHOOL_LEADER && (
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Leader Designation</label>
                      <select
                        value={formLeaderType}
                        onChange={(e) => setFormLeaderType(e.target.value as SchoolLeaderType)}
                        className="w-full bg-slate-55/60 dark:bg-black border border-slate-205 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-750"
                      >
                        {Object.values(SchoolLeaderType).map(item => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Assigned School Name</label>
                      <input
                        type="text"
                        required
                        value={formSchoolName}
                        onChange={(e) => setFormSchoolName(e.target.value)}
                        className="w-full bg-slate-55/60 dark:bg-black border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-755 font-medium"
                        placeholder="e.g. Ledumang Senior Secondary"
                      />
                    </div>
                  </div>
                )}

                {(formRole === UserRole.OFFICIAL_REGIONAL || formRole === UserRole.OFFICIAL_SUB_REGIONAL) && (
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Assigned Region / Sub-Region</label>
                      <input
                        type="text"
                        required
                        value={formRegion}
                        onChange={(e) => setFormRegion(e.target.value)}
                        className="w-full bg-slate-55/60 dark:bg-black border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-755 font-medium"
                        placeholder="e.g. Gaborone South or Kweneng District"
                      />
                    </div>
                  </div>
                )}

                {/* Shared Salary Scale config */}
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-400 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> Salary Scale Point
                  </label>
                  <select
                    value={formSalaryScale}
                    onChange={(e) => setFormSalaryScale(e.target.value)}
                    className="w-full bg-slate-55/60 dark:bg-black border border-slate-205 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-750"
                  >
                    <option value="F0">F0 (Permanent Secretary)</option>
                    <option value="E1">E1 (Director HQ)</option>
                    <option value="D1">D1 (Schoolhead)</option>
                    <option value="D2">D2 (Deputy Schoolhead)</option>
                    <option value="C1">C1 (Senior Teacher I)</option>
                    <option value="C2">C2 (Senior Teacher II)</option>
                    <option value="C3">C3 (Teacher)</option>
                    <option value="C4">C4 (Newly Employed Teacher)</option>
                    <option value="B3">B3 (Teacher Aide)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUserId(null);
                      setIsAddingUser(false);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rules and Guidelines block */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-sky-500" />
                Unified Recruitment Thresholds &amp; Parameters
              </h3>
              <p className="text-[11px] text-slate-400">Configure global parameters which filter and prioritize regional candidate shortlists automatically.</p>
            </div>

            {configFeedback && (
              <div className="p-3 bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md animate-pulse">
                <Check className="w-5 h-5" />
                <span>{configFeedback}</span>
              </div>
            )}

            <form onSubmit={handleSaveConfigParameters} className="space-y-4 text-xs font-bold text-slate-650 dark:text-slate-350">
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Required Minimum Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={minExperienceThreshold}
                  onChange={(e) => setMinExperienceThreshold(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400 font-medium">Applicants with less than {minExperienceThreshold} years won't be prioritised for regional shortages.</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Assigned Minimum Academic Qualification
                </label>
                <select
                  value={minQualification}
                  onChange={(e) => setMinQualification(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-slate-800"
                >
                  <option value="Diploma in Secondary Education">Diploma in Secondary Education</option>
                  <option value="Degree in Secondary Education">Degree in Secondary Education</option>
                  <option value="Degree in Primary Education">Degree in Primary Education</option>
                  <option value="Master of Secondary Education (M.Ed)">Master of Secondary Education (M.Ed)</option>
                  <option value="Doctorate in Educational Management">Doctorate in Educational Management (PhD)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Ministry Recruitment Budget Fiscal Allocation (BWP)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-500 font-bold font-mono">BWP</span>
                  <input
                    type="number"
                    step="500000"
                    required
                    value={recruitmentBudget}
                    onChange={(e) => setRecruitmentBudget(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl pl-12 pr-4 py-2.5 text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-extrabold text-slate-700 dark:text-slate-300 block">Simulation: WhatsApp receipts</span>
                    <span className="text-[10px] text-slate-405 font-medium block mt-0.5">Simulate instant automated WhatsApp text receipts when status changes.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableWhatsAppSimulation(!enableWhatsAppSimulation)}
                    className={`w-12 h-6.5 rounded-full p-1 transition-colors relative cursor-pointer ${enableWhatsAppSimulation ? 'bg-sky-505 dark:bg-sky-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white block transition-transform ${enableWhatsAppSimulation ? 'translate-x-5.5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs uppercase tracking-wider font-extrabold text-slate-700 dark:text-slate-300">System Maintenance status</span>
                      {maintenanceMode && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] bg-amber-500 text-white font-bold leading-none animate-bounce">Live Banner</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-405 font-medium block mt-0.5">Toggle maintenance simulation mode across regional endpoints.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`w-12 h-6.5 rounded-full p-1 transition-colors relative cursor-pointer ${maintenanceMode ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white block transition-transform ${maintenanceMode ? 'translate-x-5.5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
                >
                  Save Active Configurations
                </button>
              </div>
            </form>
          </div>

          {/* Incident and Simulation deck */}
          <div className="bg-slate-50/20 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  Administrative Simulation Deck
                </h3>
                <p className="text-[11px] text-slate-405">Simulate system exceptions, replication node failures, and security incident logs manually.</p>
              </div>

              <div className="bg-slate-100/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-black uppercase text-indigo-455 tracking-wider block">Security Incidents &amp; Sync Logs</span>
                
                <div className="space-y-2">
                  <div className="flex gap-2.5 items-start text-xs">
                    <ServerIconBadge text="Node Lag" color="amber" />
                    <div className="text-[11px] font-medium leading-relaxed">
                      <span className="font-extrabold text-slate-700 dark:text-slate-300 block">Database Synchronization Warning</span>
                      Merafhe Data Center replica node of Gaborone North lagged behind 28.1 seconds. Triggered self-healing sequence.
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start text-xs border-t border-slate-100 dark:border-slate-800 pt-2">
                    <ServerIconBadge text="IP Block" color="rose" />
                    <div className="text-[11px] font-medium leading-relaxed">
                      <span className="font-extrabold text-slate-700 dark:text-slate-300 block">DDoS Rate Limit Exceeded</span>
                      Blocked IP 168.167.45.182 originating in Francistown for making 85 requests/sec on authentication endpoints.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Simulate exceptions triggers:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onAddAuditLog(
                        "REPLICATION_STALL", 
                        "Replication sync lag exceeded critical threshold (42.4s skew) on Francistown backup node.", 
                        "warning"
                      );
                      alert("Simulated database sync stall warning added to logs.");
                    }}
                    className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-[11px] font-bold text-amber-800 transition-colors cursor-pointer"
                  >
                    Sync Warning flag
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onAddAuditLog(
                        "IP_BLACKLIST_TRIGGER", 
                        "Suspicious authentication retry loop. Retried 12 times in 4.5 seconds for: admin@gov.bw. Terminated access layer and whitelisted Gaborone South gateway.", 
                        "critical"
                      );
                      alert("Simulated SQL/Bruteforce attack block added to logs.");
                    }}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-[11px] font-bold text-rose-800 transition-colors cursor-pointer"
                  >
                    Attack Attempt block
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 opacity-60" /> Standard System Time
              </span>
              <span className="font-mono text-[10px]">2026-06-10 07:54 UTC</span>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOG EVENTS STREAM */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 gap-3">
            <div>
              <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-505" />
                Administrative Superuser Security Registry Logs
              </h3>
              <p className="text-[11px] text-slate-400">Review a persistent chronicle of user management edits, profile revisions, logins, backups, and security alerts.</p>
            </div>
            
            <button
              onClick={() => {
                if (window.confirm("Purge administrative log entries?")) {
                  onClearAuditLogs();
                  onAddAuditLog("LOGS_PURGED", "Super-admin manually initialized telemetry registry purge checklist.", "warning");
                }
              }}
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/50 rounded-xl text-xs font-black transition-colors cursor-pointer"
            >
              Purge Live Registry
            </button>
          </div>

          <div className="border border-slate-205 dark:border-slate-800 rounded-2xl overflow-hidden shadow-inner text-xs">
            <table className="w-full text-left bg-slate-50/10">
              <thead className="bg-slate-50 dark:bg-slate-950 font-bold text-slate-400">
                <tr>
                  <th className="px-4 py-2.5">Time Stamp</th>
                  <th className="px-4 py-2.5">Action Code</th>
                  <th className="px-4 py-2.5">Origin User Account</th>
                  <th className="px-4 py-2.5">Operation Details &amp; Payload Info</th>
                  <th className="px-4 py-2.5 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800/60 font-medium">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-100/20 dark:hover:bg-slate-950/20">
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-505 truncate" style={{ minWidth: '130px' }}>
                      {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                        log.severity === 'critical' ? 'bg-red-50 text-red-700 dark:bg-rose-950/50 dark:text-rose-400' :
                        log.severity === 'warning' ? 'bg-amber-50 text-amber-700 dark:bg-amber-955/50 dark:text-amber-400' :
                        'bg-sky-50 text-sky-700 dark:bg-sky-955/50 dark:text-sky-400'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                      <div className="flex flex-col">
                        <span className="font-extrabold">{log.userName}</span>
                        <span className="text-[10px] text-slate-405 font-mono">{log.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-655 dark:text-slate-350 leading-relaxed font-semibold">
                      {log.details}
                      <span className="block text-[9px] text-slate-400 font-mono mt-0.5">Ref: {log.id} • IP: {log.ipAddress}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        log.severity === 'critical' ? 'bg-rose-500/15 text-rose-550 dark:text-rose-430 font-black' :
                        log.severity === 'warning' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                        'bg-sky-500/15 text-sky-600 dark:text-sky-305'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
                {auditLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-400 leading-relaxed font-semibold">
                      Telemetry registers are clean. No administrative events recorded since purge.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Subordinate Badge helper for incidents
function ServerIconBadge({ text, color }: { text: string; color: 'amber' | 'rose' }) {
  return (
    <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-black shrink-0 ${
      color === 'rose' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
    }`}>
      {text}
    </span>
  );
}
