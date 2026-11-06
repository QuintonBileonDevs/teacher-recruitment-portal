import React, { useState } from 'react';
import { 
  Users, Search, Filter, AlertTriangle, Check, X, Calendar, 
  ArrowLeftRight, ArrowUpCircle, RefreshCw, Eye, Smartphone, 
  Mail, CalendarClock, Award, Landmark, UserCheck
} from 'lucide-react';
import { User, TeacherType, SchoolLeaderType } from '../../types';

interface StaffMember {
  id: string;
  fullName: string;
  gender: 'Male' | 'Female';
  category: 'Permanent Teacher' | 'Temporary Teacher' | 'Temporary Teacher Aide' | 'Permanent Teacher Aide';
  subject: string;
  omangNumber: string;
  dateFirstAppointment: string;
  dateCurrentSchool: string; // Dynamic calculation anchor
  qualification: string;
  scale: string;
  experienceYears: number;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Transfer Pending';
  previousSchools?: { schoolName: string; years: string; role: string }[];
}

interface StaffRequest {
  id: string;
  staffName: string;
  staffCategory: string;
  requestType: 'Leave' | 'Swap' | 'Redirection' | 'Upgrade';
  details: string;
  motivation: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface SchoolStaffRosterProps {
  currentUser: User;
  onAddAuditLog?: (action: string, details: string, severity: 'info' | 'warning' | 'critical') => void;
}

// Fixed dynamic date helper to compute years relative to mid-2026 local environment
const calculateYearsAtSchool = (dateStr: string) => {
  const arrivalDate = new Date(dateStr);
  const currentDate = new Date('2026-06-10');
  const diffTime = Math.abs(currentDate.getTime() - arrivalDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Number((diffDays / 365).toFixed(1));
};

export default function SchoolStaffRoster({ currentUser, onAddAuditLog }: SchoolStaffRosterProps) {
  // 10 Detailed staff members of the Schoolhead's school
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 'STF-001',
      fullName: 'Thabo Kabelo Balopi',
      gender: 'Male',
      category: 'Permanent Teacher',
      subject: 'Setswana Language & Culture',
      omangNumber: '172481923',
      dateFirstAppointment: '2016-02-12',
      dateCurrentSchool: '2017-01-15', // 9.4 years (OVERSTAY)
      qualification: 'B.Ed in Setswana Literature',
      scale: 'C3',
      experienceYears: 10,
      email: 'teacher@gov.bw',
      phone: '+267 71829304',
      status: 'Active',
      previousSchools: [
        { schoolName: 'Kanye Primary School', years: '2016 - 2017', role: 'Junior Teacher' }
      ]
    },
    {
      id: 'STF-002',
      fullName: 'Lesedi Tshireletso',
      gender: 'Female',
      category: 'Temporary Teacher',
      subject: 'English Language & Literature',
      omangNumber: '283719485',
      dateFirstAppointment: '2023-01-05',
      dateCurrentSchool: '2024-05-12', // 2.1 years
      qualification: 'Diploma in Secondary Education (General)',
      scale: 'C4',
      experienceYears: 3,
      email: 'tempteacher@gov.bw',
      phone: '+267 72918374',
      status: 'Active',
      previousSchools: []
    },
    {
      id: 'STF-003',
      fullName: 'Lorato Segokgo',
      gender: 'Female',
      category: 'Temporary Teacher Aide',
      subject: 'Special Needs & Learner Support',
      omangNumber: '482910482',
      dateFirstAppointment: '2025-02-18',
      dateCurrentSchool: '2025-02-18', // 1.3 years
      qualification: 'Certificate in Special Needs Support',
      scale: 'B3',
      experienceYears: 1,
      email: 'tempaide@gov.bw',
      phone: '+267 75839201',
      status: 'Active',
      previousSchools: []
    },
    {
      id: 'STF-004',
      fullName: 'Kabelo Moeti',
      gender: 'Male',
      category: 'Permanent Teacher',
      subject: 'Mathematics',
      omangNumber: '582918492',
      dateFirstAppointment: '2012-05-15',
      dateCurrentSchool: '2014-04-10', // 12.2 years (OVERSTAY)
      qualification: 'B.Ed (Hons) in Mathematics Ed',
      scale: 'C2',
      experienceYears: 14,
      email: 'kmoeti@gov.bw',
      phone: '+267 71556677',
      status: 'Active',
      previousSchools: [
        { schoolName: 'Sebele Senior Sec', years: '2012 - 2014', role: 'Math Teacher' }
      ]
    },
    {
      id: 'STF-005',
      fullName: 'Oneitsile Phiri',
      gender: 'Female',
      category: 'Permanent Teacher',
      subject: 'Physics',
      omangNumber: '384729184',
      dateFirstAppointment: '2020-03-01',
      dateCurrentSchool: '2020-03-01', // 6.3 years
      qualification: 'M.Ed in Science Education',
      scale: 'C1',
      experienceYears: 6,
      email: 'ophiri@gov.bw',
      phone: '+267 76332211',
      status: 'Active',
      previousSchools: []
    },
    {
      id: 'STF-006',
      fullName: 'Tebogo Boikhutso',
      gender: 'Female',
      category: 'Permanent Teacher',
      subject: 'History & Social Studies',
      omangNumber: '204859183',
      dateFirstAppointment: '2010-09-01',
      dateCurrentSchool: '2012-01-15', // 14.4 years (OVERSTAY)
      qualification: 'Bachelor of Humanities (History major)',
      scale: 'C1',
      experienceYears: 16,
      email: 'tboikhutso@gov.bw',
      phone: '+267 72445566',
      status: 'Active',
      previousSchools: [
        { schoolName: 'Swaneng Hill School', years: '2010 - 2012', role: 'History Intern' }
      ]
    },
    {
      id: 'STF-007',
      fullName: 'Neo Segobye',
      gender: 'Male',
      category: 'Temporary Teacher',
      subject: 'Chemistry',
      omangNumber: '729482716',
      dateFirstAppointment: '2024-08-01',
      dateCurrentSchool: '2024-08-01', // 1.8 years
      qualification: 'B.Sc in Chemistry with PGDE',
      scale: 'C4',
      experienceYears: 2,
      email: 'nsegobye@gov.bw',
      phone: '+267 73229988',
      status: 'Active',
      previousSchools: []
    },
    {
      id: 'STF-008',
      fullName: 'Onkemetse Moreri',
      gender: 'Female',
      category: 'Permanent Teacher',
      subject: 'Geography & Environmental Systems',
      omangNumber: '938172635',
      dateFirstAppointment: '2021-06-01',
      dateCurrentSchool: '2022-01-10', // 4.4 years
      qualification: 'B.Ed in Geography',
      scale: 'C3',
      experienceYears: 5,
      email: 'omoreri@gov.bw',
      phone: '+267 74558833',
      status: 'Active',
      previousSchools: []
    },
    {
      id: 'STF-009',
      fullName: 'Goabaone Kealotswe',
      gender: 'Male',
      category: 'Permanent Teacher Aide',
      subject: 'Guidance & Counseling Support',
      omangNumber: '102938475',
      dateFirstAppointment: '2019-10-10',
      dateCurrentSchool: '2019-10-10', // 6.7 years
      qualification: 'B.A. in Social Work & Counseling',
      scale: 'B2',
      experienceYears: 7,
      email: 'gkeal@gov.bw',
      phone: '+267 75112233',
      status: 'Active',
      previousSchools: []
    },
    {
      id: 'STF-010',
      fullName: 'Mothusi Kebalepile',
      gender: 'Male',
      category: 'Temporary Teacher Aide',
      subject: 'Agriculture & Technical Studies',
      omangNumber: '837261940',
      dateFirstAppointment: '2025-05-01',
      dateCurrentSchool: '2025-05-01', // 1.1 years
      qualification: 'Certificate in General Agriculture',
      scale: 'B3',
      experienceYears: 1,
      email: 'mkebal@gov.bw',
      phone: '+267 76998877',
      status: 'Active',
      previousSchools: []
    }
  ]);

  // Combined staff service motions matching teacher dashboards
  const [requests, setRequests] = useState<StaffRequest[]>([
    {
      id: 'REQ-01',
      staffName: 'Lesedi Tshireletso',
      staffCategory: 'Temporary Teacher',
      requestType: 'Leave',
      details: 'Maternity Leave (84 Working Days)',
      motivation: 'Requesting statutory maternal break with doctor recommendation certificates uploaded in regional files.',
      submittedAt: '2026-06-05T09:30:00Z',
      status: 'Pending'
    },
    {
      id: 'REQ-02',
      staffName: 'Thabo Kabelo Balopi',
      staffCategory: 'Permanent Teacher',
      requestType: 'Upgrade',
      details: 'Profile scale advancement from C3 to D3 seniority status.',
      motivation: 'Completed 8+ years under the current station with national student Setswana pass rates consistently above 94%.',
      submittedAt: '2026-06-08T11:45:00Z',
      status: 'Pending'
    },
    {
      id: 'REQ-03',
      staffName: 'Lorato Segokgo',
      staffCategory: 'Temporary Teacher Aide',
      requestType: 'Redirection',
      details: 'Redirection from Ledumang School to Francistown Primary School',
      motivation: 'My family resides in Francistown, seeking family reunification placement.',
      submittedAt: '2026-06-10T07:15:00Z',
      status: 'Pending'
    },
    {
      id: 'REQ-04',
      staffName: 'Kabelo Moeti',
      staffCategory: 'Permanent Teacher',
      requestType: 'Swap',
      details: 'Mutual placement swap with Mr. James Phakedi at Naledi Senior School (Gaborone).',
      motivation: 'Both teach Secondary Mathematics. Solves mutual housing commute issues.',
      submittedAt: '2026-06-09T14:20:00Z',
      status: 'Pending'
    }
  ]);

  // Operational state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'Male' | 'Female'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Permanent Teacher' | 'Temporary Teacher' | 'Temporary Teacher Aide' | 'Permanent Teacher Aide'>('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedOverstay, setSelectedOverstay] = useState<'all' | 'Overstay' | 'Standard'>('all');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Dynamic Metrics Derivation
  const totalStaffCount = staff.length;
  
  const maleCount = staff.filter(s => s.gender === 'Male').length;
  const femaleCount = staff.filter(s => s.gender === 'Female').length;
  const malePercentage = Math.round((maleCount / totalStaffCount) * 100);
  const femalePercentage = Math.round((femaleCount / totalStaffCount) * 100);

  const overstayCount = staff.filter(s => calculateYearsAtSchool(s.dateCurrentSchool) >= 8.0).length;

  const typeCounts = {
    'Permanent Teacher': staff.filter(s => s.category === 'Permanent Teacher').length,
    'Temporary Teacher': staff.filter(s => s.category === 'Temporary Teacher').length,
    'Temporary Teacher Aide': staff.filter(s => s.category === 'Temporary Teacher Aide').length,
    'Permanent Teacher Aide': staff.filter(s => s.category === 'Permanent Teacher Aide').length,
  };

  // Unique subjects for filter
  const subjects = ['all', ...new Set(staff.map(s => s.subject.split(' ')[0]))];

  // Filtering Logic
  const filteredStaff = staff.filter(s => {
    const years = calculateYearsAtSchool(s.dateCurrentSchool);
    const isOverstay = years >= 8.0;

    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.omangNumber.includes(searchTerm) ||
      s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = selectedGender === 'all' || s.gender === selectedGender;
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSubject = selectedSubject === 'all' || s.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesOverstay = 
      selectedOverstay === 'all' || 
      (selectedOverstay === 'Overstay' && isOverstay) || 
      (selectedOverstay === 'Standard' && !isOverstay);

    return matchesSearch && matchesGender && matchesCategory && matchesSubject && matchesOverstay;
  });

  const handleRequestAction = (id: string, action: 'Approved' | 'Rejected') => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
    const targetReq = requests.find(r => r.id === id);
    if (targetReq) {
      if (onAddAuditLog) {
        onAddAuditLog(
          `STAFF_${targetReq.requestType.toUpperCase()}_${action.toUpperCase()}`,
          `Schoolhead ${currentUser.fullName} ${action.toLowerCase()} ${targetReq.requestType} motion for ${targetReq.staffName} (${targetReq.staffCategory}): "${targetReq.details}"`,
          action === 'Approved' ? 'info' : 'warning'
        );
      }
      
      // If redirection/swap approved, optionally flag staff status dynamically
      if (action === 'Approved') {
        setStaff(prev => prev.map(s => {
          if (s.fullName === targetReq.staffName) {
            return {
              ...s,
              status: targetReq.requestType === 'Leave' ? 'On Leave' : s.status
            };
          }
          return s;
        }));
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="schoolhead-staff-roster">
      {/* Dynamic Demographic Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Staff Metric */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">School Staffing</span>
            <div className="p-2.5 bg-sky-50 dark:bg-sky-950/35 text-sky-600 dark:text-sky-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">{totalStaffCount}</h3>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              Active duty staff at {currentUser.schoolName || 'Ledumang School'}
            </p>
          </div>
          
          {/* Staff Type Distribution Bars */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
              <span>Permanent Teachers</span>
              <span>{typeCounts['Permanent Teacher']} / {totalStaffCount}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-840 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full" 
                style={{ width: `${(typeCounts['Permanent Teacher'] / totalStaffCount) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
              <span>Temporary Teachers</span>
              <span>{typeCounts['Temporary Teacher']} / {totalStaffCount}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-840 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-sky-550 h-full rounded-full" 
                style={{ width: `${(typeCounts['Temporary Teacher'] / totalStaffCount) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Gender Demographic Metrics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gender Demographics</span>
          <div className="flex items-center gap-5 mt-4">
            {/* Visual Ring Donut representation */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500"
                  strokeDasharray={`${malePercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-[10px] font-black text-slate-700 dark:text-slate-350">{malePercentage}% M</div>
            </div>
            
            <div className="space-y-2 text-xs flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500 font-bold">
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full inline-block"></span> Male Staff
                </span>
                <span className="font-black text-slate-850 dark:text-slate-205">{maleCount} ({malePercentage}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500 font-bold">
                  <span className="w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 rounded-full inline-block"></span> Female Staff
                </span>
                <span className="font-black text-slate-850 dark:text-slate-205">{femaleCount} ({femalePercentage}%)</span>
              </div>
            </div>
          </div>
          
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
              <span>Teacher Aides (Assigned)</span>
              <span>{typeCounts['Temporary Teacher Aide'] + (typeCounts['Permanent Teacher Aide'] || 0)}</span>
            </div>
            <p className="text-[10px] text-slate-400 italic">Support ratio: 1 aide per 4 senior educators</p>
          </div>
        </div>

        {/* Overstays (8+ Years) Card */}
        <div className={`border p-5 rounded-2xl shadow-sm transition-all ${
          overstayCount > 0 
            ? 'bg-amber-500/5 border-amber-500/20 text-amber-900 dark:text-amber-300' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">Overstay Alerts</span>
            <div className={`p-2.5 rounded-xl ${overstayCount > 0 ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-600' : 'bg-slate-50 dark:bg-slate-800'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-amber-700 dark:text-amber-400">{overstayCount}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold leading-relaxed">
              Teachers with 8 years+ in current duty station. Eligible for mandatory cycle redistribution.
            </p>
          </div>
          <div className="mt-3 text-[10px] text-amber-605 font-bold flex items-center gap-1.5 bg-amber-500/10 p-1.5 rounded-lg border border-amber-300/10">
            <span>Cycle guidelines: Rotate to support rural district schools.</span>
          </div>
        </div>

        {/* Interactive Stats Block - Active Placements */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Request Queue</span>
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <CalendarClock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-indigo-755 dark:text-indigo-400">
              {requests.filter(r => r.status === 'Pending').length}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold">
              Pending staff deployment leaves, swaps, redirections, &amp; upgrades awaiting endorsement.
            </p>
          </div>
          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
            <span className="text-[10px] font-black text-slate-400 uppercase">National Standard</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/10 px-2 py-0.5 rounded text-[10px]">98% SLA SLA compliant</span>
          </div>
        </div>

      </div>

      {/* Staff Service Requests Actions Block (Using their dashboards to build school head dash) */}
      <div className="bg-slate-50/50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div>
            <h4 className="font-black text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              Staff Deployment &amp; Service Decisions
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Endorse, redirect, or upgrade requests initiated on standard teacher profiles:
            </p>
          </div>
          <span className="text-[10px] font-black uppercase text-indigo-605 bg-indigo-550/10 px-2 py-1 rounded">
            Integrated Service Flow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map(req => (
            <div 
              key={req.id} 
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                req.status === 'Approved' ? 'bg-emerald-500/5 border-emerald-500/20 shadow-inner' :
                req.status === 'Rejected' ? 'bg-rose-500/5 border-rose-500/10' :
                'bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">{req.staffName}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{req.staffCategory}</span>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    req.requestType === 'Leave' ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300' :
                    req.requestType === 'Swap' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' :
                    req.requestType === 'Redirection' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                    'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {req.requestType === 'Leave' && <Calendar className="w-3 h-3" />}
                    {req.requestType === 'Swap' && <ArrowLeftRight className="w-3 h-3" />}
                    {req.requestType === 'Redirection' && <RefreshCw className="w-3 h-3" />}
                    {req.requestType === 'Upgrade' && <ArrowUpCircle className="w-3 h-3" />}
                    {req.requestType}
                  </span>
                </div>

                <div className="mt-2 space-y-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{req.details}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 italic line-clamp-2" title={req.motivation}>
                    "{req.motivation}"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-850">
                <span className="text-[9px] font-mono text-slate-400">
                  Submitted: {new Date(req.submittedAt).toLocaleDateString()}
                </span>
                
                {req.status === 'Pending' ? (
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleRequestAction(req.id, 'Approved')}
                      className="px-2.5 py-1 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black transition-colors flex items-center gap-0.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Endorse
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRequestAction(req.id, 'Rejected')}
                      className="px-2 py-1 bg-slate-100 hover:bg-rose-50 dark:bg-slate-805 dark:hover:bg-rose-950/20 text-slate-600 dark:text-slate-400 hover:text-rose-600 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Decline
                    </button>
                  </div>
                ) : (
                  <span className={`text-[10px] font-black uppercase tracking-wider ${
                    req.status === 'Approved' ? 'text-emerald-600' : 'text-rose-500'
                  }`}>
                    {req.status === 'Approved' ? '✓ Endorsed' : '✗ Declined'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Roster Interactive Table Module */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-550" />
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">Comprehensive Staff Directory</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Search, filter, and track local station staff tenures:</p>
            </div>
          </div>

          {/* Quick Clear Button */}
          {(searchTerm !== '' || selectedGender !== 'all' || selectedCategory !== 'all' || selectedSubject !== 'all' || selectedOverstay !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGender('all');
                setSelectedCategory('all');
                setSelectedSubject('all');
                setSelectedOverstay('all');
              }}
              className="text-xs font-bold text-sky-620 dark:text-sky-400 hover:underline cursor-pointer text-left shrink-0 self-end"
            >
              Reset Active Filters
            </button>
          )}
        </div>

        {/* Detailed Filters panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-100 dark:border-slate-850">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-8 pr-3 py-1.5 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-750 dark:text-slate-350"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1.5 rounded-lg text-xs font-bold text-slate-650 dark:text-slate-350 cursor-pointer focus:outline-none"
            >
              <option value="all">All Category Types</option>
              <option value="Permanent Teacher">Permanent Teachers</option>
              <option value="Temporary Teacher">Temporary Teachers</option>
              <option value="Temporary Teacher Aide">Temporary Teacher Aides</option>
              <option value="Permanent Teacher Aide">Permanent Teacher Aides</option>
            </select>
          </div>

          <div>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as any)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1.5 rounded-lg text-xs font-bold text-slate-650 dark:text-slate-350 cursor-pointer focus:outline-none"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1.5 rounded-lg text-xs font-bold text-slate-650 dark:text-slate-350 cursor-pointer focus:outline-none"
            >
              <option value="all">All Specialties</option>
              {subjects.filter(s => s !== 'all').map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedOverstay}
              onChange={(e) => setSelectedOverstay(e.target.value as any)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1.5 rounded-lg text-xs font-bold text-slate-650 dark:text-slate-350 cursor-pointer focus:outline-none"
            >
              <option value="all">All Tenures</option>
              <option value="Overstay">Overstay alerts (8+ yrs)</option>
              <option value="Standard">Standard cycle (&lt;8 yrs)</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-inner text-xs bg-slate-50/10">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 font-bold text-[10px] tracking-wider uppercase">Staff ID / Name</th>
                <th className="px-4 py-3 font-bold text-[10px] tracking-wider uppercase">Category</th>
                <th className="px-4 py-3 font-bold text-[10px] tracking-wider uppercase">Specialty Subject</th>
                <th className="px-4 py-3 font-bold text-[10px] tracking-wider uppercase">Omang ID</th>
                <th className="px-4 py-3 font-bold text-[10px] tracking-wider uppercase">Current Station Arrival</th>
                <th className="px-4 py-3 font-bold text-[10px] tracking-wider uppercase text-right">Years at Station</th>
                <th className="px-4 py-3 font-bold text-[10px] tracking-wider uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map(member => {
                const years = calculateYearsAtSchool(member.dateCurrentSchool);
                const isOverstay = years >= 8.0;
                return (
                  <tr 
                    key={member.id}
                    className={`border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-indigo-50/5 transition-colors ${
                      isOverstay ? 'bg-amber-500/[0.02]' : ''
                    }`}
                  >
                    <td className="px-4 py-3 pb-3.5">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          {member.fullName}
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            member.gender === 'Male' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20' : 'bg-pink-50 text-pink-700 dark:bg-pink-950/20'
                          }`}>
                            {member.gender[0]}
                          </span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 mt-0.5">{member.id}</span>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        member.category === 'Permanent Teacher' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30' :
                        member.category === 'Temporary Teacher' ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/30' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800'
                      }`}>
                        {member.category}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-650 dark:text-slate-350">{member.subject}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{member.omangNumber}</td>
                    <td className="px-4 py-3 text-slate-500">{member.dateCurrentSchool}</td>
                    
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className={`font-mono font-extrabold text-[12px] ${isOverstay ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {years} yrs
                        </span>
                        {isOverstay && (
                          <span className="text-[8px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1 py-0.2 rounded uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                            <AlertTriangle className="w-2.5 h-2.5" /> Overstay
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedStaff(member)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-550 hover:text-indigo-605 rounded-xl transition-colors inline-block cursor-pointer"
                        title="View Full Profile Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No matching staff member profiles found under the active filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Detailed Profile Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn">
            
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black uppercase text-indigo-505 dark:text-indigo-400 block tracking-wider">MoESD Teacher Dossier</span>
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">{selectedStaff.fullName}</h4>
              </div>
              <button 
                onClick={() => setSelectedStaff(null)}
                className="p-1 px-1.5 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-500 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Profile Content Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Staff Type and Status */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-1 rounded bg-indigo-550/15 text-indigo-650 dark:text-indigo-400 font-extrabold text-[10px]">
                  {selectedStaff.category}
                </span>
                <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold ${
                  selectedStaff.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/10' : 'bg-amber-500/10 text-amber-600'
                }`}>
                  Status: {selectedStaff.status}
                </span>
                {calculateYearsAtSchool(selectedStaff.dateCurrentSchool) >= 8.0 && (
                  <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 font-black flex items-center gap-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> High Transfer Priority
                  </span>
                )}
              </div>

              {/* Core Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide flex items-center gap-1"><Smartphone className="w-3 h-3 text-slate-400" /> Phone Contact</span>
                  <span className="font-extrabold text-[#111827] dark:text-slate-200 select-all">{selectedStaff.phone}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> Email Address</span>
                  <span className="font-extrabold text-[#111827] dark:text-slate-200 truncate select-all block" title={selectedStaff.email}>{selectedStaff.email}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide flex items-center gap-1"><Award className="w-3 h-3 text-slate-400" /> Qualifications</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 block leading-tight">{selectedStaff.qualification}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide flex items-center gap-1"><Landmark className="w-3 h-3 text-slate-400" /> Grade Scale</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-305 flex items-center gap-1">
                    Scale {selectedStaff.scale} <span className="text-[10px] text-slate-400 font-bold">({selectedStaff.experienceYears} Years Experience)</span>
                  </span>
                </div>
              </div>

              {/* Critical Dates Section */}
              <div className="border border-slate-100 dark:border-slate-850 p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-black uppercase text-indigo-505 dark:text-indigo-400 tracking-wider block">Service Milestones</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">Date of First Appointment:</span>
                    <span className="font-extrabold text-slate-750 dark:text-slate-300">{selectedStaff.dateFirstAppointment}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">Arrival at Current Duty Station:</span>
                    <span className="font-extrabold text-slate-750 dark:text-slate-300">{selectedStaff.dateCurrentSchool}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">
                  Teaching credentials verified by MoESD Central Registry on appointment. Subject Specialty: <strong className="text-slate-705 dark:text-slate-350">{selectedStaff.subject}</strong>.
                </p>
              </div>

              {/* Previous Schools tracking */}
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-505 dark:text-indigo-400 tracking-wider block mb-2">Previous Station Service History</span>
                {selectedStaff.previousSchools && selectedStaff.previousSchools.length > 0 ? (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-150 dark:divide-slate-800 overflow-hidden">
                    {selectedStaff.previousSchools.map((school, idx) => (
                      <div key={idx} className="p-3 bg-slate-50/40 dark:bg-slate-950/20 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{school.schoolName}</span>
                          <span className="text-[10px] text-slate-404 block mt-0.5">{school.role}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{school.years}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic">No previous station records registry on this profile. First station deployment.</p>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-1">
              <button 
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close File Roster
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
