import React, { useState } from 'react';
import { Vacancy, User, SchoolLeaderType } from '../../types';
import { Plus, Check, Landmark, ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';

interface DeclareVacancyProps {
  currentUser: User;
  onAddVacancy: (newVacancy: Vacancy) => void;
  onAddAuditLog?: (action: string, details: string, severity: 'info' | 'warning' | 'critical') => void;
  setView: (view: 'dashboard' | 'docs' | 'redirection' | 'swap' | 'leave' | 'logs' | 'declare-vacancy') => void;
}

export default function DeclareVacancy({
  currentUser,
  onAddVacancy,
  onAddAuditLog,
  setView
}: DeclareVacancyProps) {
  const isSchoolHead = currentUser.schoolLeaderType === SchoolLeaderType.SCHOOLHEAD;

  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState<'Primary' | 'Junior Secondary' | 'Senior Secondary'>(
    (currentUser.schoolLevel as 'Primary' | 'Junior Secondary' | 'Senior Secondary') || 'Senior Secondary'
  );
  const [vacancyType, setVacancyType] = useState<'Medical Leave' | 'Maternity' | 'Emergency Absence' | 'Permanent Vacancy Gap' | 'Resignation'>('Permanent Vacancy Gap');
  const [urgency, setUrgency] = useState<'High' | 'Medium' | 'Normal'>('High');
  const [duration, setDuration] = useState('Permanent');
  const [salary, setSalary] = useState('BWP 8,240 / month');
  const [customSchoolName, setCustomSchoolName] = useState(currentUser.schoolName || '');

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      setFeedback('Error: Please specify the vacancy subject speciality.');
      return;
    }

    const schoolToReport = (customSchoolName || currentUser.schoolName || 'Government Managed Secondary').trim();

    const generatedId = `VAC-NEW-${Math.floor(100 + Math.random() * 900)}`;
    const newVacancy: Vacancy = {
      id: generatedId,
      schoolName: schoolToReport,
      subject: subject.trim(),
      level,
      type: vacancyType,
      urgency,
      duration: duration.trim(),
      salary: salary.trim(),
      reportedAt: new Date().toISOString(),
      status: 'Open'
    };

    onAddVacancy(newVacancy);

    // Call audit log callback
    if (onAddAuditLog) {
      onAddAuditLog(
        'VACANCY_DECLARED',
        `School Leader ${currentUser.fullName} (${currentUser.schoolLeaderType || 'Admin'}) declared vacancy [${generatedId}] for ${subject} at ${schoolToReport}. Urgency: ${urgency}, Type: ${vacancyType}.`,
        'info'
      );
    }

    setFeedback('Success: Vacancy registered successfully and broadcasted to MoESD regional pool!');

    // Reset subject
    setSubject('');

    setTimeout(() => {
      setFeedback(null);
      setView('dashboard'); // Redirect to dashboard to see the vacancy
    }, 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <button
            type="button"
            onClick={() => setView('dashboard')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-850 dark:hover:text-slate-200 flex items-center gap-1 mb-2 group transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Dashboard
          </button>
          <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-805 dark:text-indigo-400 text-[9px] font-black uppercase tracking-wider rounded border border-indigo-500/20 inline-block mb-1">
            Official Ministry Channel
          </span>
          <h2 className="text-xl font-extrabold text-slate-805 dark:text-slate-100">Declare New Teacher Vacancy</h2>
          <p className="text-xs text-slate-400">MoESD Standard Form for reporting vacancy gaps, leaves, or substitute requirements.</p>
        </div>
        <Landmark className="w-8 h-8 text-indigo-500 shrink-0 hidden sm:block" />
      </div>

      {!isSchoolHead && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-400 rounded-2xl flex gap-2 text-xs">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-500" />
          <div className="leading-relaxed font-semibold">
            <p className="font-extrabold">Privilege Clarification Required</p>
            <p className="text-[11px] mt-0.5 text-slate-500 dark:text-slate-400">
              Only a verified <strong>Schoolhead</strong> should officially declare institutional vacancies. Since your profile registers as a <strong>{currentUser.schoolLeaderType || 'Deputy Schoolhead'}</strong>, this submission will be flagged for review under delegative authority.
            </p>
          </div>
        </div>
      )}

      {feedback && (
        <div className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold leading-relaxed shadow-sm transition-all duration-300 ${
          feedback.startsWith('Error') 
            ? 'bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/30' 
            : 'bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30'
        }`}>
          {feedback.startsWith('Error') ? (
            <ShieldAlert className="w-5 h-5 shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 shrink-0 text-emerald-500 animate-pulse" />
          )}
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-650 dark:text-slate-350">
        <div>
          <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Assigned School Name</label>
          <input
            type="text"
            required
            value={customSchoolName}
            onChange={(e) => setCustomSchoolName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g. Ledumang Senior Secondary School"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Required Subject / Speciality</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Physics & Chemistry"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Education Level Type</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="Primary">Primary School</option>
              <option value="Junior Secondary">Junior Secondary</option>
              <option value="Senior Secondary">Senior Secondary</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Vacancy Cause Type</label>
            <select
              value={vacancyType}
              onChange={(e) => setVacancyType(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="Permanent Vacancy Gap">Permanent Vacancy Gap</option>
              <option value="Resignation">Resignation</option>
              <option value="Maternity">Maternity Leave Cover</option>
              <option value="Medical Leave">Medical Leave Cover</option>
              <option value="Emergency Absence">Emergency Absence</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Vacancy Urgency Rating</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="High">🔴 High Priority (Immediate replacement required)</option>
              <option value="Medium">🟡 Medium Priority (Need within 30 days)</option>
              <option value="Normal">🟢 Normal Priority (Future strategic gap)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Expected Cover Duration</label>
            <input
              type="text"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. 4 months, 6 months, Permanent"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">Allocated Salary Estimate</label>
            <input
              type="text"
              required
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. BWP 8,240 / month"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setView('dashboard')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-350 rounded-xl transition-all cursor-pointer font-bold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer font-black text-xs"
          >
            <Plus className="w-4 h-4" /> Broadcast Vacancy
          </button>
        </div>
      </form>
    </div>
  );
}
