import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  ShieldCheck, AlertTriangle, Users, MapPin, 
  Award, Clock, Activity, Building, TrendingUp, Sparkles, AlertCircle 
} from 'lucide-react';
import { Applicant, Vacancy, Placement } from '../../types';

interface AdminAnalyticsProps {
  activeScope: string;
  applicants: Applicant[];
  vacancies: Vacancy[];
  placements: Placement[];
}

// Helper to match a school name to a region scope
const getSchoolRegion = (schoolName: string) => {
  const name = schoolName.toLowerCase();
  if (name.includes('ledumang') || name.includes('gaborone') || name.includes('nala') || name.includes('naledi')) return 'Gaborone';
  if (name.includes('shashe') || name.includes('palapye') || name.includes('mahalapye') || name.includes('sefhare') || name.includes('serowe')) return 'Central';
  if (name.includes('maun') || name.includes('gumare') || name.includes('shakawe')) return 'North West';
  if (name.includes('tshabong') || name.includes('kang') || name.includes('kgalagadi')) return 'Kgalagadi';
  if (name.includes('chobe') || name.includes('kasane')) return 'Chobe';
  return 'Other';
};

export default function AdminAnalytics({ activeScope, applicants, vacancies, placements }: AdminAnalyticsProps) {
  const COLORS = ['#4f46e5', '#ff9f0a', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];

  const filteredVacancies = vacancies.filter(v => {
    if (activeScope === 'All') return true;
    return getSchoolRegion(v.schoolName) === activeScope;
  });

  const filteredPlacements = placements.filter(p => {
    if (activeScope === 'All') return true;
    return getSchoolRegion(p.schoolName) === activeScope;
  });

  // 1. Core comparative chart data source
  let vacancyChartData: { name: string; required: number; active: number; overstays: number }[] = [];

  if (activeScope === 'All') {
    // Ministry National view - aggregate regions
    const regions = ['Gaborone', 'Central', 'North West', 'Kgalagadi', 'Chobe'];
    vacancyChartData = regions.map((r, idx) => {
      // Aggregate simulated staffing configurations
      const required = r === 'Gaborone' ? 16 : r === 'Central' ? 24 : r === 'North West' ? 12 : r === 'Kgalagadi' ? 8 : 6;
      const open = vacancies.filter(v => getSchoolRegion(v.schoolName) === r && v.status === 'Open').length;
      const placementsCount = placements.filter(p => getSchoolRegion(p.schoolName) === r).length;
      
      // Calculate overstays: Gaborone has 3, Central has 4, others have smaller counts
      const overstays = r === 'Gaborone' ? 3 : r === 'Central' ? 4 : r === 'North West' ? 2 : 1;
      const active = required - open;

      return {
        name: r === 'Gaborone' ? 'South East' : r,
        required,
        active: active > 0 ? active : required - 1,
        overstays
      };
    });
  } else if (activeScope === 'Central') {
    // Central District Regional Official View - aggregate Central Schools
    const centralSchools = [
      { name: 'Shashe River', required: 8, active: 7, overstays: 2 },
      { name: 'Palapye Sec', required: 6, active: 5, overstays: 1 },
      { name: 'Sefhare Jr', required: 4, active: 3, overstays: 1 },
      { name: 'Serowe Primary', required: 6, active: 6, overstays: 0 }
    ];
    vacancyChartData = centralSchools;
  } else {
    // Gaborone Sub-Region Official View - aggregate Gaborone Schools
    const gaboroneSchools = [
      { name: 'Ledumang Sec', required: 12, active: 11, overstays: 3 },
      { name: 'Gaborone West', required: 8, active: 7, overstays: 1 },
      { name: 'Naledi Senior', required: 10, active: 9, overstays: 2 },
      { name: 'Tola-Kgosi', required: 6, active: 6, overstays: 0 }
    ];
    vacancyChartData = gaboroneSchools;
  }

  // 2. Specialty Subject gaps
  const subjectGroups: Record<string, number> = {};
  filteredVacancies.forEach(v => {
    const compactSubject = v.subject.split(' ')[0];
    subjectGroups[compactSubject] = (subjectGroups[compactSubject] || 0) + 1;
  });

  const subjectChartData = Object.entries(subjectGroups).map(([subject, count]) => ({
    name: subject,
    value: count
  })).slice(0, 5);

  const finalSubjectChartData = subjectChartData.length > 0 ? subjectChartData : [
    { name: 'Mathematics', value: 3 },
    { name: 'Science', value: 2 },
    { name: 'English', value: 1 },
    { name: 'Setswana', value: 1 },
    { name: 'Special Needs', value: 1 }
  ];

  // SLA Turnaround times
  const TURNAROUND_TIME_TREND = [
    { month: 'Jan', days: activeScope === 'All' ? 14 : activeScope === 'Gaborone' ? 11 : 16 },
    { month: 'Feb', days: activeScope === 'All' ? 12 : activeScope === 'Gaborone' ? 9 : 14 },
    { month: 'Mar', days: activeScope === 'All' ? 9 : activeScope === 'Gaborone' ? 7 : 11 },
    { month: 'Apr', days: activeScope === 'All' ? 7 : activeScope === 'Gaborone' ? 5 : 8 },
    { month: 'May', days: activeScope === 'All' ? 4 : activeScope === 'Gaborone' ? 3 : 5 }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-xs" id="admin-actionable-analytics">
      
      {/* 1. Dynamic welcome & scope focus card */}
      <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-3xl border border-slate-805 text-left shadow-lg text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-indigo-500/15 text-indigo-400 text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded border border-indigo-500/20">
                📊 Actionable Intelligence Command
              </span>
              <span className="text-slate-600 font-bold">•</span>
              <span className="text-slate-400 text-[10px] font-semibold">Active Scope Tracking</span>
            </div>
            
            <h2 className="text-xl font-bold mt-1.5 text-white tracking-tight flex items-center gap-2">
              {activeScope === 'All' && "National HQ Staffing &amp; Distribution Command"}
              {activeScope === 'Central' && "Central District Region Education Command"}
              {activeScope === 'Gaborone' && "South East Region • Gaborone Sub-District Portal Office"}
            </h2>
            <p className="text-slate-400 text-[11px] font-medium mt-0.5 max-w-2xl">
              {activeScope === 'All' && "Oversight of all 10 educational regions. Monitoring national teacher distribution equity, overstay transfers, and cross-district placement backlogs."}
              {activeScope === 'Central' && "Oversight of Central District schools. Auditing regional staff longevity, managing direct local replacement allocations, and resolving vacancy deficits."}
              {activeScope === 'Gaborone' && "Oversight of South East Gaborone clusters. Matching immediate standby educator profiles with active local schoolhead shortages and approving transits."}
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/25">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Live Data Synchronized
          </div>
        </div>
      </div>

      {/* 2. Specialized KPIs Grid based on Active Administrator Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1 - Localized Coverage Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
              {activeScope === 'All' ? "National Coverage Rate" : "Jurisdiction Coverage"}
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl font-black text-slate-805 dark:text-slate-100">
                {activeScope === 'All' ? "96.1%" : activeScope === 'Central' ? "92.0%" : "94.2%"}
              </h3>
              <span className="text-[10px] text-slate-400 font-bold">of target</span>
            </div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden flex">
              <div className="bg-indigo-600 h-full" style={{ width: activeScope === 'All' ? '96%' : activeScope === 'Central' ? '92%' : '94%' }}></div>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 font-semibold leading-none">
              {activeScope === 'All' && "1,250 of 1,300 budget slots filled"}
              {activeScope === 'Central' && "46 of 50 regional slots stationed"}
              {activeScope === 'Gaborone' && "33 of 35 sub-region slots stationed"}
            </div>
          </div>
        </div>

        {/* KPI 2 - Active Vacancy Shortfalls */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Active Open Shortfalls</span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950 text-rose-600 rounded-xl">
              <AlertSquareWrapper />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl font-black text-slate-805 dark:text-slate-100">
                {filteredVacancies.filter(v => v.status === 'Open').length} Gaps
              </h3>
              <span className="text-[10px] text-rose-500 font-black">Urgent Focus</span>
            </div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-rose-500 h-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 font-semibold">
              {activeScope === 'All' && "Cross-district urgent teacher requisitions"}
              {activeScope === 'Central' && "Critical: Math & Chemistry deficit in 2 schools"}
              {activeScope === 'Gaborone' && "1 Math gap at Ledumang, 1 English gap"}
            </div>
          </div>
        </div>

        {/* KPI 3 - Overstay Rotation Risk Exceeders */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
              {activeScope === 'All' ? "National Overstays (8y+)" : "Jurisdiction Overstays"}
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl font-black text-slate-805 dark:text-slate-150 text-amber-600 dark:text-amber-500">
                {activeScope === 'All' ? "11.2%" : activeScope === 'Central' ? "15.3%" : "3 Educators"}
              </h3>
              <span className="text-[9px] font-black uppercase bg-amber-500/10 text-amber-600 px-1 py-0.2 rounded">
                Cycling Trigger
              </span>
            </div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: activeScope === 'All' ? '11%' : '15%' }}></div>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 font-bold">
              {activeScope === 'All' && "146 educators exceed duty station limits"}
              {activeScope === 'Central' && "4 staff require tenure cycles Serowe/Palapye"}
              {activeScope === 'Gaborone' && "3 teachers overstaying at Ledumang Sec"}
            </div>
          </div>
        </div>

        {/* KPI 4 - Direct Match Pipeline Backlog */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Standby Backlog Pool</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-xl">
              <Award className="w-4 h-4 hover:animate-bounce" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl font-black text-slate-805 dark:text-slate-100">
                {activeScope === 'All' ? applicants.length : applicants.filter(a => a.preferredRegion.toLowerCase().includes(activeScope.toLowerCase())).length} Profiles
              </h3>
              <span className="text-[10px] text-emerald-500 font-bold">Validated</span>
            </div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-850 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: '85%' }}></div>
            </div>
            <div className="mt-2 text-[10px] text-slate-550 font-semibold truncate">
              {activeScope === 'All' && "Unemployed graduate registry connected"}
              {activeScope === 'Central' && "12 certified candidates in Palapye backlog"}
              {activeScope === 'Gaborone' && "25 South-East matched specialists"}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Actionable Smart Alerts / Directives Console */}
      <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-left">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold uppercase text-[10px] text-amber-600 dark:text-amber-400 block tracking-wider">
            ⚠️ Decisive Jurisdictional Directives {activeScope === 'All' ? '(National Level)' : `(${activeScope} Scope)`}
          </span>
          <p className="text-slate-650 dark:text-slate-300 leading-normal text-[11px] font-medium">
            {activeScope === 'All' && "Policy Directive: Overstay counts in South East (Gaborone) and Central represent 82% of national excesses. Regional Directors are requested to endorse pending mutual trade swaps to cycle long-standing staff without reducing schoolhead roster sizes."}
            {activeScope === 'Central' && "Regional Alert: Palapye Secondary and Sefhare Jr Secondary are under-staffed by 1 teacher in core STEM directions. Two matched applicants are in the standby registries. Click directly on 'Applications' tab to dispatch immediate appointment offers."}
            {activeScope === 'Gaborone' && "Sub-District Case Task: Ledumang Senior Secondary has 1 open Mathematics vacancy and 3 extreme longevity overstays. Math teacher Kabelo Moeti has a mutual trade swap pending with Naledi Senior. Approve this swap to secure roster headcount."}
          </p>
        </div>
      </div>

      {/* 4. Comparative Charts Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Comparative Distribution Graph */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-left space-y-4">
          <div>
            <h4 className="font-extrabold text-[#111827] dark:text-white text-[13px] uppercase tracking-wide flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              {activeScope === 'All' && "Regional Resource Discrepancy & Overstay Distribution"}
              {activeScope === 'Central' && "Central District Schools Allocations vs On-Site Staff"}
              {activeScope === 'Gaborone' && "Gaborone Cluster Schools Budget vs. Active Staff"}
            </h4>
            <p className="text-[11px] text-slate-450 leading-snug">
              Approved Staff Budget Allocation vs Active Stationed Teachers &amp; Overstay Exposures.
            </p>
          </div>

          <div className="w-full">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={vacancyChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} />
                <YAxis stroke="#888888" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '10px' }} />
                <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
                
                <Bar dataKey="active" fill="#4f46e5" name="Active Stationed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="required" fill="#94a3b8" name="Approved Budget Baseline" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overstays" fill="#f59e0b" name="Exceeding Tenure (8y+)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA and specialty demands */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-left flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-extrabold text-[#111827] dark:text-white text-[13px] uppercase tracking-wide flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500" />
              Administrative SLA Processing Trend (Days)
            </h4>
            <p className="text-[11px] text-slate-450 leading-snug">
              Average turnaround days from Schoolhead vacancy declaration to Regional deployment.
            </p>
          </div>

          <div className="w-full">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={TURNAROUND_TIME_TREND} margin={{ top: 10, right: 15, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-850" />
                <XAxis dataKey="month" stroke="#888888" fontSize={9} tickLine={false} />
                <YAxis stroke="#888888" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="days" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Avg SLA Days" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 5. Custom Overstays Location Cluster Audit Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left space-y-4">
        <div>
          <h4 className="font-extrabold text-[#111827] dark:text-white text-[13px] uppercase tracking-wide flex items-center gap-1.5">
            <Building className="w-4 h-4 text-indigo-500" />
            {activeScope === 'All' && "National Overstays (8y+) Location Clustering & Risk Matrix"}
            {activeScope === 'Central' && "Central District Region Overstays Station Clusters"}
            {activeScope === 'Gaborone' && "South East Gaborone overstays Station Clusters"}
          </h4>
          <p className="text-[11px] text-slate-450 leading-snug mt-0.5">
            Detailed auditing of overstay profiles exceeding statutory service limits in their respective jurisdiction.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-rose-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-2.5 font-extrabold text-[10px] uppercase tracking-wider">Duty Station School</th>
                <th className="px-4 py-2.5 font-extrabold text-[10px] uppercase tracking-wider">Staff Count</th>
                <th className="px-4 py-2.5 font-extrabold text-[10px] uppercase tracking-wider">Exceeding Limit (8y+)</th>
                <th className="px-4 py-2.5 font-extrabold text-[10px] uppercase tracking-wider">Longest Stay tenure</th>
                <th className="px-4 py-2.5 font-extrabold text-[10px] uppercase tracking-wider">Transition Danger Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
              {activeScope === 'All' ? (
                <>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950">
                    <td className="px-4 py-3 font-extrabold text-slate-800 dark:text-slate-200">Central District Region (Serowe Directorate)</td>
                    <td className="px-4 py-3">46 educators</td>
                    <td className="px-4 py-3 font-semibold text-rose-600">8 teachers</td>
                    <td className="px-4 py-3 font-mono">14.4 yrs (Tebogo Boikhutso)</td>
                    <td className="px-4 py-3"><span className="text-[9px] font-black uppercase text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded leading-none">Critical</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950">
                    <td className="px-4 py-3 font-extrabold text-slate-800 dark:text-slate-200">South East region (Gaborone Sub-District)</td>
                    <td className="px-4 py-3">33 educators</td>
                    <td className="px-4 py-3 font-semibold text-rose-600">3 teachers</td>
                    <td className="px-4 py-3 font-mono">12.2 yrs (Kabelo Moeti)</td>
                    <td className="px-4 py-3"><span className="text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded leading-none">High</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950">
                    <td className="px-4 py-3 font-extrabold text-slate-800 dark:text-slate-200">North West Region (Maun Directorate)</td>
                    <td className="px-4 py-3">18 educators</td>
                    <td className="px-4 py-3 text-slate-650">2 teachers</td>
                    <td className="px-4 py-3 font-mono">9.8 yrs</td>
                    <td className="px-4 py-3"><span className="text-[9px] font-black uppercase text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded leading-none">Normal</span></td>
                  </tr>
                </>
              ) : activeScope === 'Central' ? (
                <>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950">
                    <td className="px-4 py-3 font-extrabold text-slate-800 dark:text-slate-200">Shashe River Secondary School</td>
                    <td className="px-4 py-3">8 educators</td>
                    <td className="px-4 py-3 font-semibold text-rose-650">2 teachers</td>
                    <td className="px-4 py-3 font-mono">10.5 yrs</td>
                    <td className="px-4 py-3"><span className="text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">High Risk</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950">
                    <td className="px-4 py-3 font-extrabold text-slate-800 dark:text-slate-200">Palapye Secondary School</td>
                    <td className="px-4 py-3">6 educators</td>
                    <td className="px-4 py-3 font-semibold text-rose-650">1 teacher</td>
                    <td className="px-4 py-3 font-mono">11.1 yrs</td>
                    <td className="px-4 py-3"><span className="text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">High Risk</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950">
                    <td className="px-4 py-3 font-extrabold text-slate-800 dark:text-slate-200">Sefhare Junior Secondary</td>
                    <td className="px-4 py-3">4 educators</td>
                    <td className="px-4 py-3 font-semibold text-slate-600">1 teacher</td>
                    <td className="px-4 py-3 font-mono">8.4 yrs</td>
                    <td className="px-4 py-3"><span className="text-[9px] font-black uppercase text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded">Routine</span></td>
                  </tr>
                </>
              ) : (
                <>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950">
                    <td className="px-4 py-3 font-extrabold text-slate-800 dark:text-slate-200">Ledumang Senior Secondary School</td>
                    <td className="px-4 py-3">10 educators</td>
                    <td className="px-4 py-3 font-semibold text-rose-650">3 teachers</td>
                    <td className="px-4 py-3 font-mono">14.4 yrs (Tebogo Boikhutso)</td>
                    <td className="px-4 py-3"><span className="text-[9px] font-black uppercase text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">Severe</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950">
                    <td className="px-4 py-3 font-extrabold text-slate-800 dark:text-slate-200">Gaborone West Junior Secondary School</td>
                    <td className="px-4 py-3">8 educators</td>
                    <td className="px-4 py-3 font-semibold text-slate-600">1 teacher</td>
                    <td className="px-4 py-3 font-mono">9.1 yrs</td>
                    <td className="px-4 py-3"><span className="text-[9px] font-black uppercase text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded">Routine</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950">
                    <td className="px-4 py-3 font-extrabold text-slate-800 dark:text-slate-200">Naledi Senior Secondary School</td>
                    <td className="px-4 py-3">10 educators</td>
                    <td className="px-4 py-3 font-semibold text-rose-650">2 teachers</td>
                    <td className="px-4 py-3 font-mono">11.6 yrs</td>
                    <td className="px-4 py-3"><span className="text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">High Risk</span></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// Visual Wrapper to avoid duplicating Lucide AlertTriangle rendering
function AlertSquareWrapper() {
  return (
    <div className="flex items-center justify-center font-bold">
      <AlertTriangle className="w-4 h-4 text-rose-600" />
    </div>
  );
}
