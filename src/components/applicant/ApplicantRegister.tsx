import React, { useState } from 'react';
import { Applicant, ApplicationStatus } from '../../types';
import { CheckCircle } from 'lucide-react';
import { REGIONS, SUB_REGIONS_BY_REGION } from '../../sampleData';

export default function ApplicantRegister({ onAddApplicant, setView, onSendMessage }: any) {
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0] || 'Central');
  const subRegionsForSelected = SUB_REGIONS_BY_REGION[selectedRegion] || [];
  const [selectedSubRegion, setSelectedSubRegion] = useState(subRegionsForSelected[0] || 'Bobirwa');

  const [formData, setFormData] = useState({
    fullName: '',
    omangNumber: '',
    vacancySubject: 'Mathematics',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // When selected region changes, reset sub-region to the first available in that region
  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    const subs = SUB_REGIONS_BY_REGION[newRegion] || [];
    if (subs.length > 0) {
      setSelectedSubRegion(subs[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newApp: Applicant = {
        id: "APP-" + Math.floor(1000 + Math.random() * 9000),
        ...formData,
        preferredRegion: `${selectedSubRegion} (${selectedRegion})`,
        status: ApplicationStatus.RECEIVED,
        logs: [
          {
            status: ApplicationStatus.RECEIVED,
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
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 rounded-xl p-8 text-center flex flex-col items-center">
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
    <div className="bg-white dark:bg-black border text-left border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Teacher Registration Form</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
          <input 
            type="text" 
            required 
            placeholder="John Doe"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded focus:ring-2 focus:ring-sky-500 outline-none transition-shadow"
            value={formData.fullName}
            onChange={e => setFormData({...formData, fullName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">ID Number (Omang)</label>
          <input 
            type="text" 
            required 
            pattern="[1-2][0-9]{8}"
            title="9 digit number starting with 1 or 2"
            placeholder="e.g. 172481923"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded focus:ring-2 focus:ring-sky-500 outline-none transition-shadow"
            value={formData.omangNumber}
            onChange={e => setFormData({...formData, omangNumber: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Speciality</label>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded focus:ring-2 focus:ring-sky-500 outline-none"
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
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Preferred Education Region</label>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded focus:ring-2 focus:ring-sky-500 outline-none"
              value={selectedRegion}
              onChange={e => handleRegionChange(e.target.value)}
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Preferred Sub-Region</label>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded focus:ring-2 focus:ring-sky-500 outline-none"
              value={selectedSubRegion}
              onChange={e => setSelectedSubRegion(e.target.value)}
            >
              {subRegionsForSelected.map((sr) => (
                <option key={sr} value={sr}>{sr}</option>
              ))}
            </select>
          </div>
        </div>
        <button 
          disabled={isSubmitting}
          type="submit" 
          className="w-full bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-400 text-white font-semibold py-3 rounded-lg mt-6 shadow-md transition-colors disabled:opacity-70 disabled:cursor-wait"
        >
          {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
