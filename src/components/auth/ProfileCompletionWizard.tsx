import React, { useState, useEffect } from 'react';
import { User, UserRole, TeacherType, SchoolLeaderType, PreviousSchool } from '../../types';
import { REGIONS, ALL_SUB_REGIONS } from '../../sampleData';
import { 
  User as UserIcon, ShieldCheck, Mail, Phone, MapPin, 
  BookOpen, Calendar, Briefcase, Award, X, Check, CheckCircle, AlertCircle, Trash2, Plus, Clock, Info
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileCompletionWizardProps {
  currentUser: User;
  onComplete: (updated: Partial<User>) => void;
  onClose: () => void;
}

export default function ProfileCompletionWizard({ 
  currentUser, 
  onComplete, 
  onClose 
}: ProfileCompletionWizardProps) {
  // Common states
  const [omangNumber, setOmangNumber] = useState(currentUser.omangNumber || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '');
  const [salaryScale, setSalaryScale] = useState(currentUser.salaryScale || 'C3');

  const initialPositionData = (() => {
    const fullPos = currentUser.currentPosition || 'Teacher';
    if (fullPos.startsWith('Senior Teacher (with portfolio) - ')) {
      return {
        base: 'Senior Teacher (with portfolio)',
        detail: fullPos.replace('Senior Teacher (with portfolio) - ', '')
      };
    }
    if (fullPos.startsWith('Head of Department - ')) {
      return {
        base: 'Head of Department',
        detail: fullPos.replace('Head of Department - ', '')
      };
    }
    if (fullPos === 'Senior Teacher (with portfolio)' || fullPos === 'Head of Department' || fullPos === 'Senior Teacher (without portfolio)' || fullPos === 'Teacher') {
      return { base: fullPos, detail: '' };
    }
    if (fullPos.includes('Senior Teacher (with portfolio)')) {
      return { base: 'Senior Teacher (with portfolio)', detail: fullPos.replace(/Senior Teacher \(with portfolio\)\s*[-:]?\s*/, '') };
    }
    if (fullPos.includes('Head of Department')) {
      return { base: 'Head of Department', detail: fullPos.replace(/Head of Department\s*[-:]?\s*/, '') };
    }
    return { base: 'Teacher', detail: '' };
  })();

  const [currentPosition, setCurrentPosition] = useState(initialPositionData.base);
  const [specifiedPosition, setSpecifiedPosition] = useState(initialPositionData.detail);
  
  // Teacher-specific states
  const [highestQualification, setHighestQualification] = useState(currentUser.highestQualification || 'Diploma in Education');
  const [experienceYears, setExperienceYears] = useState<number>(currentUser.experienceYears || 0);
  const [subjectSpeciality, setSubjectSpeciality] = useState(currentUser.subjectSpeciality || 'Primary General');
  const [preferredRegion, setPreferredRegion] = useState(currentUser.region || 'Gaborone');

  // Schoolhead-specific states
  const [schoolName, setSchoolName] = useState(currentUser.schoolName || 'Botswana Government School');
  const [schoolLevel, setSchoolLevel] = useState(currentUser.schoolLevel || 'Primary');
  const [schoolHeadCode, setSchoolHeadCode] = useState('');

  // Extended Teacher states
  const [dob, setDob] = useState(currentUser.dob || '');
  const [gender, setGender] = useState(currentUser.gender || 'Male');
  const [contactAddress, setContactAddress] = useState(currentUser.contactAddress || '');
  const [alternativePhone, setAlternativePhone] = useState(currentUser.alternativePhone || '');
  const [dateOfFirstAppointment, setDateOfFirstAppointment] = useState(currentUser.dateOfFirstAppointment || '');
  const [currentSchool, setCurrentSchool] = useState(currentUser.schoolName || '');
  const [dateIntoCurrentSchool, setDateIntoCurrentSchool] = useState(currentUser.dateIntoCurrentSchool || '');
  const [previousSchools, setPreviousSchools] = useState<PreviousSchool[]>(currentUser.previousSchools || []);

  // Temporary & Aide-specific states
  const [contractStatus, setContractStatus] = useState(currentUser.contractStatus || 'Awaiting Placement');
  const [contractEndDate, setContractEndDate] = useState(currentUser.contractEndDate || '');
  const [aideSpecialty, setAideSpecialty] = useState(currentUser.aideSpecialty || 'Early Childhood Support');
  const [availabilityStatus, setAvailabilityStatus] = useState(currentUser.availabilityStatus || 'Immediate');
  const [preferredContractDuration, setPreferredContractDuration] = useState(currentUser.preferredContractDuration || '3-6 months');

  // Previous school form state
  const [prevSchName, setPrevSchName] = useState('');
  const [prevSchFrom, setPrevSchFrom] = useState('');
  const [prevSchTo, setPrevSchTo] = useState('');
  const [prevSchRole, setPrevSchRole] = useState('');
  const [prevSchoolError, setPrevSchoolError] = useState('');

  // UI state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [success, setSuccess] = useState(false);

  const isTeacher = currentUser.role === UserRole.TEACHER;
  const isTemporary = currentUser.teacherType === TeacherType.TEMPORARY;
  const isAide = currentUser.teacherType === TeacherType.PERMANENT_TEACHER_AIDE || 
                 currentUser.teacherType === TeacherType.NEWLY_EMPLOYED_TEACHER_AIDE || 
                 currentUser.teacherType === TeacherType.TEMPORARY_TEACHER_AIDE;
  const isPermanent = isTeacher && !isTemporary && !isAide;

  // Dynamic specialty management based on teaching level
  useEffect(() => {
    if (isTeacher) {
      if (schoolLevel === 'Primary') {
        setSubjectSpeciality('Primary General (All Subjects)');
      } else if (subjectSpeciality === 'Primary General (All Subjects)') {
        setSubjectSpeciality('');
      }
    }
  }, [schoolLevel, isTeacher]);

  // Real-time completeness & percent calculate
  const getCompletenessStats = () => {
    let totalFields = 4;
    let filledCount = 0;
    const items: { label: string; filled: boolean }[] = [];

    // Fields tracking
    const omangValid = /^[1-2]\d{8}$/.test(omangNumber.trim());
    const phoneValid = /^\+?267?\s?[37]\d{6,7}$|^[37]\d{6,7}$/.test(phoneNumber.trim());

    items.push({ label: 'Omang ID (9 digits, starts with 1 or 2)', filled: omangValid });
    items.push({ label: 'Botswana Phone Number (7 or 8 digits)', filled: phoneValid });

    if (omangValid) filledCount++;
    if (phoneValid) filledCount++;

    if (isTeacher) {
      if (isPermanent) {
        totalFields = 9;
        const levelFilled = !!schoolLevel;
        const qualFilled = !!highestQualification;
        const experienceFilled = experienceYears >= 0;
        
        const isPrimary = schoolLevel === 'Primary';
        const specialityFilled = isPrimary ? true : (!!subjectSpeciality.trim() && subjectSpeciality !== 'Primary General (All Subjects)');

        const dobValid = !!dob;
        const apptDatesValid = !!dateOfFirstAppointment && !!dateIntoCurrentSchool;
        const currentSchValid = !!currentSchool.trim();

        items.push({ label: 'Teaching Level specified', filled: levelFilled });
        items.push({ label: 'Verified Qualification credentials', filled: qualFilled });
        items.push({ label: 'Date of Birth (D.O.B)', filled: dobValid });
        items.push({ label: 'First Appt & Current School Dates', filled: apptDatesValid });
        items.push({ label: 'Current School defined', filled: currentSchValid });
        items.push({ label: 'Years of classroom service declared', filled: experienceFilled });

        if (levelFilled) filledCount++;
        if (qualFilled) filledCount++;
        if (dobValid) filledCount++;
        if (apptDatesValid) filledCount++;
        if (currentSchValid) filledCount++;
        if (experienceFilled) filledCount++;

        if (isPrimary) {
          items.push({ label: 'Primary Curriculum Alignment', filled: true });
          filledCount++;
        } else {
          items.push({ label: 'Subject speciality chosen', filled: specialityFilled });
          if (specialityFilled) filledCount++;
        }
      } else if (isTemporary) {
        totalFields = 9;
        const levelFilled = !!schoolLevel;
        const qualFilled = !!highestQualification;
        const dobValid = !!dob;
        const availabilityValid = !!availabilityStatus;
        const preferredDurationValid = !!preferredContractDuration;
        const currentSchValid = !!currentSchool.trim();
        const experienceFilled = experienceYears >= 0;

        const isPrimary = schoolLevel === 'Primary';
        const specialityFilled = isPrimary ? true : (!!subjectSpeciality.trim() && subjectSpeciality !== 'Primary General (All Subjects)');

        items.push({ label: 'Teaching Level specified', filled: levelFilled });
        items.push({ label: 'Verified Qualification credentials', filled: qualFilled });
        items.push({ label: 'Date of Birth (D.O.B)', filled: dobValid });
        items.push({ label: 'Active Availability Status Set', filled: availabilityValid });
        items.push({ label: 'Preferred Contract Term Specified', filled: preferredDurationValid });
        items.push({ label: 'Current Station / Placement Target', filled: currentSchValid });
        items.push({ label: 'Years of classroom service declared', filled: experienceFilled });

        if (levelFilled) filledCount++;
        if (qualFilled) filledCount++;
        if (dobValid) filledCount++;
        if (availabilityValid) filledCount++;
        if (preferredDurationValid) filledCount++;
        if (currentSchValid) filledCount++;
        if (experienceFilled) filledCount++;

        if (isPrimary) {
          items.push({ label: 'Primary Curriculum Alignment', filled: true });
          filledCount++;
        } else {
          items.push({ label: 'Subject speciality chosen', filled: specialityFilled });
          if (specialityFilled) filledCount++;
        }
      } else if (isAide) {
        totalFields = 8;
        const levelFilled = !!schoolLevel;
        const qualFilled = !!highestQualification;
        const dobValid = !!dob;
        const currentSchValid = !!currentSchool.trim();
        const aideSpecialtyValid = !!aideSpecialty;
        const experienceFilled = experienceYears >= 0;

        items.push({ label: 'School Level specified', filled: levelFilled });
        items.push({ label: 'Verified Aide Credentials', filled: qualFilled });
        items.push({ label: 'Date of Birth (D.O.B)', filled: dobValid });
        items.push({ label: 'Assigned / Target School Station', filled: currentSchValid });
        items.push({ label: 'Aide support specialty defined', filled: aideSpecialtyValid });
        items.push({ label: 'Experience (Years)', filled: experienceFilled });

        if (levelFilled) filledCount++;
        if (qualFilled) filledCount++;
        if (dobValid) filledCount++;
        if (currentSchValid) filledCount++;
        if (aideSpecialtyValid) filledCount++;
        if (experienceFilled) filledCount++;
      }
    } else {
      totalFields = 5;
      const schoolNameFilled = schoolName.trim().length > 4;
      const schoolLevelFilled = !!schoolLevel;
      const headCodeFilled = schoolHeadCode.trim().length >= 4;

      items.push({ label: 'School Name (Min 5 chars)', filled: schoolNameFilled });
      items.push({ label: 'School Level specified', filled: schoolLevelFilled });
      items.push({ label: 'School Head Official Authorization Code', filled: headCodeFilled });

      if (schoolNameFilled) filledCount++;
      if (schoolLevelFilled) filledCount++;
      if (headCodeFilled) filledCount++;
    }

    const percentage = Math.round((filledCount / totalFields) * 100);
    return { percentage, items, allValid: filledCount === totalFields };
  };

  const { percentage, items, allValid } = getCompletenessStats();

  // Helper to add previous school safely
  const handleAddPreviousSchool = () => {
    setPrevSchoolError('');
    if (!prevSchName.trim()) {
      setPrevSchoolError('Please enter the school name.');
      return;
    }
    if (!prevSchFrom.trim() || isNaN(parseInt(prevSchFrom)) || prevSchFrom.length !== 4) {
      setPrevSchoolError('Please enter a valid start year (4 digits, e.g. 2015).');
      return;
    }
    if (!prevSchTo.trim() || isNaN(parseInt(prevSchTo)) || prevSchTo.length !== 4) {
      setPrevSchoolError('Please enter a valid end year (4 digits, e.g. 2018).');
      return;
    }
    if (parseInt(prevSchFrom) > parseInt(prevSchTo)) {
      setPrevSchoolError('"From" year cannot succeed "To" year.');
      return;
    }
    if (!prevSchRole.trim()) {
      setPrevSchoolError('Please specify the designation/role held.');
      return;
    }

    const newSch: PreviousSchool = {
      schoolName: prevSchName.trim(),
      fromYear: prevSchFrom.trim(),
      toYear: prevSchTo.trim(),
      roleHeld: prevSchRole.trim()
    };

    setPreviousSchools(prev => [...prev, newSch]);
    // reset form fields
    setPrevSchName('');
    setPrevSchFrom('');
    setPrevSchTo('');
    setPrevSchRole('');
  };

  // Helper to remove school
  const handleRemovePreviousSchool = (index: number) => {
    setPreviousSchools(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};

    // ID validation (Omang) - 9 digits, starting with 1 or 2
    if (!/^[1-2]\d{8}$/.test(omangNumber.trim())) {
      tempErrors.omang = "Botswana Omang must be exactly 9 digits, starting with 1 or 2.";
    }

    // Phone validation
    if (!/^\+?267?\s?[37]\d{6,7}$|^[37]\d{6,7}$/.test(phoneNumber.trim())) {
      tempErrors.phone = "Provide a valid Botswana landline/mobile number (e.g. 71234567 or 3951234).";
    }

    if (isTeacher) {
      if (experienceYears < 0) {
        tempErrors.experience = "Experience can't be negative.";
      }
      if (!dob) {
        tempErrors.dob = "Date of Birth is required.";
      }
      if (!gender) {
        tempErrors.gender = "Gender is required.";
      }
      if (!currentSchool.trim()) {
        tempErrors.currentSchool = isAide ? "Assigned / target school station is required." : "Current assigned government school is required.";
      }

      if (isPermanent) {
        if (schoolLevel !== 'Primary' && !subjectSpeciality.trim()) {
          tempErrors.speciality = "Subject Speciality is required.";
        }
        if (!dateOfFirstAppointment) {
          tempErrors.firstAppointment = "Date of first appointment into public service is required.";
        }
        if (!dateIntoCurrentSchool) {
          tempErrors.dateIntoCurrentSchool = "Date of reporting to the current school is required.";
        }
        if ((currentPosition === 'Senior Teacher (with portfolio)' || currentPosition === 'Head of Department') && !specifiedPosition.trim()) {
          tempErrors.specifiedPosition = "Please specify your portfolio or department name.";
        }
      } else if (isTemporary) {
        if (schoolLevel !== 'Primary' && !subjectSpeciality.trim()) {
          tempErrors.speciality = "Subject Speciality is required.";
        }
        if (!availabilityStatus) {
          tempErrors.availabilityStatus = "Availability status is required.";
        }
        if (!preferredContractDuration) {
          tempErrors.preferredContractDuration = "Preferred contract duration is required.";
        }
      } else if (isAide) {
        if (!aideSpecialty) {
          tempErrors.aideSpecialty = "Aide support specialty is required.";
        }
      }
    } else {
      if (schoolName.trim().length < 5) {
        tempErrors.schoolName = "Official School Name is required (Min 5 letters).";
      }
      if (schoolHeadCode.trim().length < 4) {
        tempErrors.headCode = "Ministry Authorization Headmaster code is required (e.g. SH-7512).";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedOnce(true);

    if (validateForm()) {
      setSuccess(true);
      // Construct payload
      const payload: Partial<User> = {
        omangNumber: omangNumber.trim(),
        phoneNumber: phoneNumber.trim(),
        profileCompleted: true,
        salaryScale: salaryScale
      };

      if (isTeacher) {
        payload.highestQualification = highestQualification;
        payload.experienceYears = experienceYears;
        payload.region = preferredRegion;
        payload.schoolLevel = schoolLevel;
        payload.dob = dob;
        payload.gender = gender;
        payload.contactAddress = contactAddress.trim();
        payload.alternativePhone = alternativePhone.trim();
        payload.schoolName = currentSchool.trim();
        payload.previousSchools = previousSchools;

        if (isPermanent) {
          payload.subjectSpeciality = subjectSpeciality.trim();
          payload.dateOfFirstAppointment = dateOfFirstAppointment;
          payload.dateIntoCurrentSchool = dateIntoCurrentSchool;
          payload.currentPosition = (currentPosition === 'Senior Teacher (with portfolio)' || currentPosition === 'Head of Department')
            ? `${currentPosition} - ${specifiedPosition.trim()}`
            : currentPosition;
        } else if (isTemporary) {
          payload.subjectSpeciality = subjectSpeciality.trim();
          payload.contractStatus = contractStatus;
          payload.contractEndDate = contractEndDate;
          payload.availabilityStatus = availabilityStatus;
          payload.preferredContractDuration = preferredContractDuration;
        } else if (isAide) {
          payload.aideSpecialty = aideSpecialty;
          payload.contractStatus = contractStatus;
        }
      } else {
        payload.schoolName = schoolName.trim();
        payload.schoolLevel = schoolLevel;
      }

      setTimeout(() => {
        onComplete(payload);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-black w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 p-6 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20">
              <ShieldCheck className="w-6 h-6 text-sky-100" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Complete Registry Profile</h2>
              <span className="text-xs text-sky-100">
                Official Ministry Registry Verification Flow
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-black/10 hover:bg-black/25 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {success ? (
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }}
              className="py-12 text-center flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-150 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-505 dark:text-emerald-400 border border-emerald-500/20 shadow-inner mb-2">
                <CheckCircle className="w-12 h-12 text-emerald-550 animate-bounce" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">Verification Successful!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Your profile details have been synchronized with the Ministry of Child Welfare and Basic Education cloud database.
              </p>
              <span className="text-[11px] font-mono text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-500/10 inline-block">
                PROFILE STATUS: CERTIFIED & ACTIVE
              </span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Progress Bar Alert */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-850">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Profile Completeness Profile Matrix</span>
                  <span className={`text-xs font-black ${percentage === 100 ? 'text-emerald-500' : 'text-sky-500'}`}>
                    {percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-slate-200 dark:border-slate-850 pt-3">
                  {items.map((item, id) => (
                    <div key={id} className="flex items-center gap-2 text-xs">
                      {item.filled ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-355 dark:border-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-400 shrink-0">?</span>
                      )}
                      <span className={item.filled ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-400 dark:text-slate-500'}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informative Help Alert */}
              <div className="bg-sky-50 dark:bg-sky-950/20 border border-sky-100 rounded-xl p-3 flex gap-2.5">
                <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <p className="text-xs text-sky-850 dark:text-sky-305 leading-relaxed">
                  As a registered <strong>{currentUser.teacherType || currentUser.schoolLeaderType || currentUser.role}</strong>, completing your profile makes your service records discoverable to system dispatchers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Omang Number */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-401">National ID (Omang Number)</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. 172481923"
                      value={omangNumber}
                      onChange={(e) => setOmangNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      className={`pl-9 w-full bg-slate-50 dark:bg-slate-950 border text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 ${
                        submittedOnce && errors.omang ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                  </div>
                  {submittedOnce && errors.omang && (
                    <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.omang}
                    </p>
                  )}
                </div>

                {/* Botswana Contact Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Mobile Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. 71234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d+]/g, '').slice(0, 12))}
                      className={`pl-9 w-full bg-slate-50 dark:bg-slate-950 border text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 ${
                        submittedOnce && errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                  </div>
                  {submittedOnce && errors.phone && (
                    <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Salary Scale Selector (A1 to F) */}
              <div className="space-y-1 mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-401 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-sky-500" /> Government Salary Scale (A1 to F)
                </label>
                <div className="relative">
                  <select
                    value={salaryScale}
                    onChange={(e) => setSalaryScale(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 appearance-none focus:ring-2 focus:ring-sky-500"
                  >
                    <optgroup label="Scale F">
                      <option value="F0">F0</option>
                      <option value="F1">F1</option>
                      <option value="F2">F2</option>
                    </optgroup>
                    <optgroup label="Scale E">
                      <option value="E1">E1</option>
                      <option value="E2">E2</option>
                    </optgroup>
                    <optgroup label="Scale D">
                      <option value="D1">D1</option>
                      <option value="D2">D2</option>
                      <option value="D3">D3</option>
                      <option value="D4">D4</option>
                    </optgroup>
                    <optgroup label="Scale C">
                      <option value="C1">C1</option>
                      <option value="C2">C2</option>
                      <option value="C3">C3</option>
                      <option value="C4">C4</option>
                    </optgroup>
                    <optgroup label="Scale B">
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="B3">B3</option>
                      <option value="B4">B4</option>
                      <option value="B5">B5</option>
                    </optgroup>
                    <optgroup label="Scale A">
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="A3">A3</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Adaptive / Role-specific parts */}
              {isTeacher ? (
                <>
                  {/* Section A: Demographics & Contact Details */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-2 space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-sky-500" /> Demographics & Identity
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* D.O.B */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Date of Birth (D.O.B)</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                          <input 
                            type="date" 
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className={`pl-9 w-full bg-slate-50 dark:bg-slate-950 border text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 ${
                              submittedOnce && errors.dob ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                            }`}
                          />
                        </div>
                        {submittedOnce && errors.dob && (
                          <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.dob}
                          </p>
                        )}
                      </div>

                      {/* Gender */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Gender</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer Not to Say">Prefer Not to Say</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Alternative Phone */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Alternative Phone (Optional)</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="e.g. 71223344"
                            value={alternativePhone}
                            onChange={(e) => setAlternativePhone(e.target.value.replace(/[^\d+]/g, '').slice(0, 12))}
                            className="pl-9 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Physical Address */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-white dark:text-white flex items-center gap-1">
                          Physical Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="e.g. Plot 10424, Broadhurst, Gaborone"
                            value={contactAddress}
                            onChange={(e) => setContactAddress(e.target.value)}
                            className="pl-9 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section B: Academics & Experience */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-500" /> 
                      {isAide ? 'Aide Education & Focus Credentials' : 'Academic & Experience Credentials'}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Teaching / Assistance Level Selection */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">
                          {isAide ? 'Assistance Education Level' : 'Teaching Education Level'}
                        </label>
                        <select
                          value={schoolLevel}
                          onChange={(e) => setSchoolLevel(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-850 dark:text-slate-250"
                        >
                          {isAide ? (
                            <>
                              <option value="Early Childhood">Early Childhood (Pre-Primary)</option>
                              <option value="Primary">Primary School (Standard 1 - 7)</option>
                              <option value="Secondary">Secondary School (Forms 1 - 5)</option>
                              <option value="Special Education">Special Education Center</option>
                            </>
                          ) : (
                            <>
                              <option value="Primary">Primary (Standard 1 - 7)</option>
                              <option value="Junior Secondary">Junior Secondary (Form 1 - 3)</option>
                              <option value="Senior Secondary">Senior Secondary (Form 4 - 5)</option>
                            </>
                          )}
                        </select>
                      </div>

                      {/* Highest Qualification */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Highest Accredited Qualification</label>
                        <select
                          value={highestQualification}
                          onChange={(e) => setHighestQualification(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-850 dark:text-slate-250"
                        >
                          {isAide ? (
                            <>
                              <option value="Certificate in Early Childhood Development">Certificate in Early Childhood Development</option>
                              <option value="Certificate for Teacher Aide post">Certificate for Teacher Aide post</option>
                              <option value="Special Education Aide Certificate">Special Education Aide Certificate</option>
                              <option value="Diploma in Early Childhood Education">Diploma in Early Childhood Education</option>
                              <option value="Diploma in Special Needs Support">Diploma in Special Needs Support</option>
                              <option value="BGCSE or Equivalency Cert">BGCSE or Equivalency Cert</option>
                            </>
                          ) : (
                            <>
                              <option value="Certificate in Early Childhood Education">Certificate in Early Childhood Education</option>
                              <option value="Diploma in Primary Education">Diploma in Primary Education</option>
                              <option value="Diploma in Secondary Education">Diploma in Secondary Education</option>
                              <option value="Bachelor of Education (B.Ed)">Bachelor of Education (B.Ed)</option>
                              <option value="Accredited degree + PGDE">Accredited degree + PGDE</option>
                              <option value="Master of Education (M.Ed)">Master of Education (M.Ed)</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Years of Teaching Experience */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">
                          {isAide ? 'Assistance/Aide Experience (Years)' : 'Classroom Service (Years)'}
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                          <input 
                            type="number" 
                            min="0"
                            max="50"
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                            className="pl-9 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-850 dark:text-slate-250"
                          />
                        </div>
                      </div>

                      {/* Preferred Region */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Preferred Deployment Region</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                          <select
                            value={preferredRegion}
                            onChange={(e) => setPreferredRegion(e.target.value)}
                            className="pl-9 pr-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium appearance-none text-slate-850 dark:text-slate-250"
                          >
                            {REGIONS.map(reg => (
                              <option key={reg} value={reg}>{reg}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Specialty Section - Dynamic and Elegant */}
                    {isAide ? (
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">
                          Aide Support Speciality Focus
                        </label>
                        <select
                          value={aideSpecialty}
                          onChange={(e) => setAideSpecialty(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-855 dark:text-slate-250"
                        >
                          <option value="Early Childhood Support">Early Childhood / Pre-School Specialist</option>
                          <option value="Special Needs Assistant">Special Education / Disability Care</option>
                          <option value="General Classroom Assistant">General Classroom Help & Prep</option>
                          <option value="Reading & Remedial Assistant">Reading Support & Setswana/English Literacy</option>
                          <option value="Physical Ed & Welfare Assistant">Physical Education, Sports & Kid Health</option>
                        </select>
                      </div>
                    ) : schoolLevel === 'Primary' ? (
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-305 border border-emerald-250 dark:border-emerald-850 rounded-2xl flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-905 dark:text-emerald-300">Primary Education Curriculum Model</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">
                            Primary teachers function as Generalists. Because you teach all subjects across standard 1 to 7 classes, <strong>no subject speciality is required</strong> in your profile.
                          </p>
                          <span className="inline-block mt-2 font-mono text-[10px] bg-white dark:bg-slate-900 border border-emerald-500/20 text-emerald-650 py-0.5 px-2 rounded-md font-bold">
                            Subject Specialty: Primary General (All Classes)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">
                          Academic Subject Speciality
                        </label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder={schoolLevel === 'Senior Secondary' ? 'e.g. Physics, Chemistry, Biology' : 'e.g. Setswana, Social Studies'}
                            value={subjectSpeciality}
                            onChange={(e) => setSubjectSpeciality(e.target.value)}
                            className={`pl-9 w-full bg-slate-50 dark:bg-slate-950 border text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 ${
                              submittedOnce && errors.speciality ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                            }`}
                          />
                        </div>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500">
                          {schoolLevel === 'Senior Secondary' 
                            ? "Specify your senior subjects of specialization matching BGCSE syllabus." 
                            : "Specify your junior secondary curriculum subjects matching JCE standard."}
                        </p>
                        {submittedOnce && errors.speciality && (
                          <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.speciality}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Section C: Placements & Current School / Contract Information */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                    {isPermanent ? (
                      <>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-emerald-500" /> Current Station & Placement Dates
                        </h4>

                        {/* Current Position Option */}
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Current Position</label>
                            <select
                              value={currentPosition}
                              onChange={(e) => {
                                setCurrentPosition(e.target.value);
                                setSpecifiedPosition(''); // Reset when changed
                              }}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-850 dark:text-slate-250 mb-3"
                            >
                              <option value="Teacher">Teacher</option>
                              <option value="Senior Teacher (without portfolio)">Senior Teacher (without portfolio)</option>
                              <option value="Senior Teacher (with portfolio)">Senior Teacher (with portfolio)</option>
                              <option value="Head of Department">Head of Department</option>
                            </select>
                          </div>

                          {(currentPosition === 'Senior Teacher (with portfolio)' || currentPosition === 'Head of Department') && (
                            <div className="space-y-1">
                              <label className="block text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                                Specify Portfolio / Department
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder={currentPosition === 'Head of Department' ? "e.g., Mathematics, Science, Humanities" : "e.g., Languages, Guidance & Counselling"}
                                  value={specifiedPosition}
                                  onChange={(e) => setSpecifiedPosition(e.target.value)}
                                  className={`w-full bg-slate-50 dark:bg-slate-950 border text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 ${
                                    submittedOnce && errors.specifiedPosition ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                                  }`}
                                />
                              </div>
                              {submittedOnce && errors.specifiedPosition && (
                                <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> {errors.specifiedPosition}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Current School Name */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Current Station (Current/Last School)</label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                            <input 
                              type="text" 
                              placeholder="e.g. Westwood International School or Lobatse Secondary School"
                              value={currentSchool}
                              onChange={(e) => setCurrentSchool(e.target.value)}
                              className={`pl-9 w-full bg-slate-50 dark:bg-slate-950 border text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 ${
                                submittedOnce && errors.currentSchool ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                              }`}
                            />
                          </div>
                          {submittedOnce && errors.currentSchool && (
                            <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {errors.currentSchool}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Date of First Appointment */}
                          <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Date of First Appointment</label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                              <input 
                                type="date" 
                                value={dateOfFirstAppointment}
                                onChange={(e) => setDateOfFirstAppointment(e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                className={`pl-9 w-full bg-slate-50 dark:bg-slate-950 border text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 ${
                                  submittedOnce && errors.firstAppointment ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                                }`}
                              />
                            </div>
                            {submittedOnce && errors.firstAppointment && (
                              <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.firstAppointment}
                              </p>
                            )}
                          </div>

                          {/* Date into Current School */}
                          <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Date into Current School</label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                              <input 
                                type="date" 
                                value={dateIntoCurrentSchool}
                                onChange={(e) => setDateIntoCurrentSchool(e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                className={`pl-9 w-full bg-slate-50 dark:bg-slate-950 border text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 ${
                                  submittedOnce && errors.dateIntoCurrentSchool ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                                }`}
                              />
                            </div>
                            {submittedOnce && errors.dateIntoCurrentSchool && (
                              <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.dateIntoCurrentSchool}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    ) : isTemporary ? (
                      <>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-sky-500" /> Temporary Contract & Posting Status
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Current Assignment Status */}
                          <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Current Assignment Status</label>
                            <select
                              value={contractStatus}
                              onChange={(e) => setContractStatus(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-850 dark:text-slate-250 animate-fade-in"
                            >
                              <option value="Awaiting Placement">Awaiting Active Deployment Match</option>
                              <option value="Active Contract">Currently on Active Temporary Contract</option>
                              <option value="Completed Service">Completed prior contract; seeking redeployment</option>
                            </select>
                          </div>

                          {/* Availability status */}
                          <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Immediate Availability Status</label>
                            <select
                              value={availabilityStatus}
                              onChange={(e) => setAvailabilityStatus(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-850 dark:text-slate-250"
                            >
                              <option value="Immediate">Immediately Available (Within 24 Hours)</option>
                              <option value="1 Week Notice">Requires 1-Week Notice</option>
                              <option value="2 Weeks Notice">Requires 2-Weeks Notice</option>
                              <option value="Date Specific">Available from specific Contract Expiry</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Preferred temporary term length */}
                          <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Preferred Contract Assignment Term</label>
                            <select
                              value={preferredContractDuration}
                              onChange={(e) => setPreferredContractDuration(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-850 dark:text-slate-250"
                            >
                              <option value="1-3 months">Short-Term coverage (1-3 Months)</option>
                              <option value="3-6 months">Standard Term replacement (3-6 Months)</option>
                              <option value="6-12 months">Academic Year assignment (6-12 Months)</option>
                              <option value="Any term">Any contract term</option>
                            </select>
                          </div>

                          {/* Date of Expiry if Active Contract */}
                          {contractStatus === 'Active Contract' && (
                            <div className="space-y-1 animate-fade-in">
                              <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Contract Target End Date</label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                                <input 
                                  type="date" 
                                  value={contractEndDate}
                                  onChange={(e) => setContractEndDate(e.target.value)}
                                  className="pl-9 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-850 dark:text-slate-250 animate-fade-in"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Current / Last School Name */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">
                            {contractStatus === 'Active Contract' ? 'Current Assigned Station / Government School' : 'Last Station Served (if any)'}
                          </label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                            <input 
                              type="text" 
                              placeholder="e.g. Ledumang Senior, Kanye Primary School, etc."
                              value={currentSchool}
                              onChange={(e) => setCurrentSchool(e.target.value)}
                              className={`pl-9 w-full bg-slate-50 dark:bg-slate-950 border text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 ${
                                submittedOnce && errors.currentSchool ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                              }`}
                            />
                          </div>
                          {submittedOnce && errors.currentSchool && (
                            <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {errors.currentSchool}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      // isAide
                      <>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-emerald-500" /> Aide Allocation & Current Station
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Current Assignment Status */}
                          <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Aide Placement Status</label>
                            <select
                              value={contractStatus}
                              onChange={(e) => setContractStatus(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-850 dark:text-slate-250"
                            >
                              <option value="Awaiting Placement">Awaiting School Allocation</option>
                              <option value="Active Contract">Assigned & Active in School</option>
                              <option value="Completed Service">Completed prior session</option>
                            </select>
                          </div>

                          {/* Target school name */}
                          <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">
                              {contractStatus === 'Active Contract' ? 'Assigned Primary/Secondary School' : 'Last School / Target School preference'}
                            </label>
                            <div className="relative">
                              <Briefcase className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                              <input 
                                type="text" 
                                placeholder="e.g. Palapye Central Primary"
                                value={currentSchool}
                                onChange={(e) => setCurrentSchool(e.target.value)}
                                className={`pl-9 w-full bg-slate-50 dark:bg-slate-950 border text-sm rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-slate-200 ${
                                  submittedOnce && errors.currentSchool ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                                }`}
                              />
                            </div>
                            {submittedOnce && errors.currentSchool && (
                              <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.currentSchool}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Section D: Previous Schools Service History */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                       <Clock className="w-4 h-4 text-indigo-500" /> 
                       {isPermanent ? 'Service History (Previous Government Schools)' : 'Prior Contact / Contract Service Records (Optional)'}
                    </h4>
                    <span className="text-xs text-slate-550 dark:text-slate-400 block -mt-1">
                      {isPermanent 
                        ? 'Add any previous educational institutions where you have served in the permanent public service.'
                        : 'Add any previous temporary placements, internships, or aide roles to strengthen your deployment profile.'}
                    </span>

                    {/* Pre-existing previous schools list */}
                    {previousSchools.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {previousSchools.map((sch, index) => (
                          <div 
                            key={index} 
                            className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-850 flex items-center justify-between text-xs transition-shadow hover:shadow-xs"
                          >
                            <div className="space-y-1">
                              <p className="font-bold text-slate-805 dark:text-slate-100">{sch.schoolName}</p>
                              <div className="flex gap-4 items-center text-slate-500 dark:text-slate-450 font-medium">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> {sch.fromYear} — {sch.toYear}
                                </span>
                                <span className="flex items-center gap-1">
                                  <UserIcon className="w-3 h-3" /> {sch.roleHeld}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePreviousSchool(index)}
                              className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/30 text-red-650 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-700 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs py-5">
                        No previous school history declared yet. Fill inputs below to log your records.
                      </div>
                    )}

                    {/* Inline Form Builder */}
                    <div className="bg-slate-50 dark:bg-slate-955/65 p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest text-[10px]">Log Secondary / Primary Station</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Previous School Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Francistown Senior"
                            value={prevSchName}
                            onChange={(e) => setPrevSchName(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg px-2.5 py-2 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Designation / Role Held</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Teacher, Senior Teacher II"
                            value={prevSchRole}
                            onChange={(e) => setPrevSchRole(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg px-2.5 py-2 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">From Year (e.g. 2014)</label>
                          <input 
                            type="text" 
                            placeholder="YYYY"
                            maxLength={4}
                            value={prevSchFrom}
                            onChange={(e) => setPrevSchFrom(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg px-2.5 py-2 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">To Year (e.g. 2018)</label>
                          <input 
                            type="text" 
                            placeholder="YYYY"
                            maxLength={4}
                            value={prevSchTo}
                            onChange={(e) => setPrevSchTo(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg px-2.5 py-2 outline-none"
                          />
                        </div>
                      </div>

                      {prevSchoolError && (
                        <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {prevSchoolError}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={handleAddPreviousSchool}
                        className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 border border-indigo-200/50 dark:border-indigo-900/30 text-indigo-750 dark:text-indigo-400 text-xs py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add This Station to Service History
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-350 flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-sky-500" /> Government School Authorization
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name of school */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Official School Name</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="e.g. Serowe Primary School"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            className={`pl-9 w-full bg-slate-50 dark:bg-slate-950 border text-sm rounded-xl px-3 py-2.5 outline-none font-medium ${
                              submittedOnce && errors.schoolName ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                            }`}
                          />
                        </div>
                        {submittedOnce && errors.schoolName && (
                          <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.schoolName}
                          </p>
                        )}
                      </div>

                      {/* Level of school */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">School Education Category</label>
                        <select
                          value={schoolLevel}
                          onChange={(e) => setSchoolLevel(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none font-medium"
                        >
                          <option value="Primary">Primary (Standard 1 - 7)</option>
                          <option value="Junior Secondary">Junior Secondary (Form 1 - 3)</option>
                          <option value="Senior Secondary">Senior Secondary (Form 4 - 5)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Authorization Headmaster Commission code */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-401">Headmaster Official Code (Commission Code)</label>
                        <div className="relative">
                          <Award className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="e.g. SH-4261"
                            value={schoolHeadCode}
                            onChange={(e) => setSchoolHeadCode(e.target.value.toUpperCase())}
                            className={`pl-9 w-full bg-slate-50 dark:bg-slate-950 border text-sm rounded-xl px-3 py-2.5 outline-none font-medium ${
                              submittedOnce && errors.headCode ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                            }`}
                          />
                        </div>
                        {submittedOnce && errors.headCode && (
                          <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.headCode}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Authorization Scope</span>
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/10 rounded-xl flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-555 shrink-0" /> Full School Administration, Vacancies & Deployment
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-slate-205 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5 ${
                    allValid 
                      ? 'bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 shadow-sky-500/10' 
                      : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  Save & Synchronize Profile
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
