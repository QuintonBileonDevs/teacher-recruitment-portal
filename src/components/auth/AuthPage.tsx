import React, { useState, useEffect } from 'react';
import { User, UserRole, TeacherType, SchoolLeaderType } from '../../types';
import { REGIONS, ALL_SUB_REGIONS } from '../../sampleData';
import { 
  Mail, Lock, User as UserIcon, Building, MapPin, Briefcase, 
  KeyRound, HelpCircle, CheckCircle, AlertCircle, Info, Unlock, ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthPageProps {
  onLogin: (user: User) => void;
  defaultIsLogin?: boolean;
}

// Preset Security Questions for dummy users and signup flow
const SECURITY_QUESTIONS = [
  "What was your first school?",
  "What is your mother's maiden name?",
  "What is the name of your favorite book?",
  "What was your childhood nickname?",
  "What was the name of your first pet?"
];

// Base Dummy Credentials with standard password and recovery information
const INITIAL_DUMMY_USERS = [
  {
    id: 'USR-TEACHER',
    email: 'teacher@gov.bw',
    password: 'pass123',
    fullName: 'Thabo Kabelo Balopi',
    role: UserRole.TEACHER,
    teacherType: TeacherType.PERMANENT,
    salaryScale: 'C3',
    currentPosition: 'Senior Teacher (without portfolio)',
    securityQuestion: 'What was your first school?',
    securityAnswer: 'Kanye Primary',
    notes: 'Accesses Applicant portal with tracking and registration forms.'
  },
  {
    id: 'USR-TEMP-TEACHER',
    email: 'tempteacher@gov.bw',
    password: 'pass123',
    fullName: 'Lesedi Tshireletso',
    role: UserRole.TEACHER,
    teacherType: TeacherType.TEMPORARY,
    salaryScale: 'C4',
    securityQuestion: 'What was your first school?',
    securityAnswer: 'Kanye Primary',
    notes: 'Accesses Applicant portal under a Temporary Teacher profile.'
  },
  {
    id: 'USR-TEMP-AIDE',
    email: 'tempaide@gov.bw',
    password: 'pass123',
    fullName: 'Lorato Segokgo',
    role: UserRole.TEACHER,
    teacherType: TeacherType.TEMPORARY_TEACHER_AIDE,
    salaryScale: 'B3',
    securityQuestion: 'What was your first school?',
    securityAnswer: 'Molepolole Primary',
    notes: 'Accesses Applicant portal under a Temporary Teacher Aide profile.'
  },
  {
    id: 'USR-SCHOOLHEAD',
    email: 'schoolhead@gov.bw',
    password: 'pass123',
    fullName: 'Principal Masego Moeng',
    role: UserRole.SCHOOL_LEADER,
    schoolLeaderType: SchoolLeaderType.SCHOOLHEAD,
    schoolName: 'Ledumang Senior Secondary School',
    salaryScale: 'D1',
    securityQuestion: 'What was your first school?',
    securityAnswer: 'Ledumang Secondary',
    notes: 'Accesses School portal to manage vacancies and placements.'
  },
  {
    id: 'USR-SUBREGIONAL',
    email: 'subregional@gov.bw',
    password: 'pass123',
    fullName: 'Kelebonye Ntuane',
    role: UserRole.OFFICIAL_SUB_REGIONAL,
    region: 'Gaborone',
    salaryScale: 'D2',
    securityQuestion: 'What was your first school?',
    securityAnswer: 'Sebele Primary',
    notes: 'Accesses Admin/HR portals with Gaborone regional scope filtering.'
  },
  {
    id: 'USR-REGIONAL',
    email: 'regional@gov.bw',
    password: 'pass123',
    fullName: 'Masego Kgosi',
    role: UserRole.OFFICIAL_REGIONAL,
    region: 'Central District',
    salaryScale: 'D3',
    securityQuestion: 'What was your first school?',
    securityAnswer: 'Swaneng Hill',
    notes: 'Accesses administrative dashboards with Central District filtering.'
  },
  {
    id: 'USR-MINISTRY',
    email: 'ministry@gov.bw',
    password: 'pass123',
    fullName: 'Director Tshepo Phiri',
    role: UserRole.OFFICIAL_MINISTRY,
    salaryScale: 'E1',
    securityQuestion: 'What was your first school?',
    securityAnswer: 'Gaborone West',
    notes: 'Accesses full Ministry control dashboards and nationwide analytics.'
  },
  {
    id: 'USR-SUPER-ADMIN',
    email: 'superadmin@gov.bw',
    password: 'pass123',
    fullName: 'Chief Coordinator Neo Molosi',
    role: UserRole.SUPER_ADMIN,
    salaryScale: 'F0',
    securityQuestion: 'What was your first school?',
    securityAnswer: 'Botswana National DC',
    notes: 'Accesses System Overseer Super Admin Panel (Database config, Users CRUD, System state/simulation).'
  }
];

export default function AuthPage({ onLogin, defaultIsLogin = true }: AuthPageProps) {
  // Navigation / View modes: 'login' | 'signup' | 'forgot' | 'security_challenge' | 'reset_password_now'
  const [view, setView] = useState<'login' | 'signup' | 'forgot' | 'security_challenge' | 'reset_password_now'>(
    defaultIsLogin ? 'login' : 'signup'
  );

  // Users registry state
  const [users, setUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('moesd_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure new presets (e.g., temporary teacher/aide) exist seamlessly in local storage cache
        const missing = INITIAL_DUMMY_USERS.filter(
          initial => !parsed.some((u: any) => u.email.toLowerCase() === initial.email.toLowerCase())
        );
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem('moesd_registered_users', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch (e) {
        // Fallback to initial
      }
    }
    return INITIAL_DUMMY_USERS;
  });

  // Persist updated list of users (e.g. including new signups and password resets)
  useEffect(() => {
    localStorage.setItem('moesd_registered_users', JSON.stringify(users));
  }, [users]);

  // Form Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.TEACHER);
  const [teacherType, setTeacherType] = useState<TeacherType>(TeacherType.PERMANENT);
  const [currentPosition, setCurrentPosition] = useState('Teacher');
  const [specifiedPosition, setSpecifiedPosition] = useState('');
  const [schoolLeaderType, setSchoolLeaderType] = useState<SchoolLeaderType>(SchoolLeaderType.SCHOOLHEAD);
  const [region, setRegion] = useState('Gaborone');
  const [salaryScale, setSalaryScale] = useState('C3');

  // Password Recovery Signup Inputs
  const [selectedQuestion, setSelectedQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [backupEmail, setBackupEmail] = useState('');

  // Password recovery flow states
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryUser, setRecoveryUser] = useState<any | null>(null);
  const [challengerAnswer, setChallengerAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI feedback States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reset notifications on view changes
  useEffect(() => {
    setErrorMsg(null);
    setInfoMsg(null);
    setSuccessMsg(null);
  }, [view]);

  // Handle Demo Credential Injection & Immediate/Fill Login
  const handleQuickFill = (demoUser: any, instantMode: boolean = false) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setView('login');
    setErrorMsg(null);
    
    if (instantMode) {
      const isTargetForCompletion = (demoUser.role === UserRole.SCHOOL_LEADER && demoUser.schoolLeaderType === SchoolLeaderType.SCHOOLHEAD) ||
        (demoUser.role === UserRole.TEACHER && !!demoUser.teacherType);

      // Try finding the registered user in local storage to load saved profile progress
      const registeredList = localStorage.getItem('moesd_registered_users');
      let savedUser = null;
      if (registeredList) {
        try {
          const parsedList = JSON.parse(registeredList);
          savedUser = parsedList.find((u: any) => u.email.toLowerCase() === demoUser.email.toLowerCase());
        } catch (e) {}
      }

      const matchUser = savedUser || demoUser;

      const userToLogin: User = {
        id: matchUser.id,
        email: matchUser.email,
        fullName: matchUser.fullName,
        role: matchUser.role,
        teacherType: matchUser.teacherType,
        schoolLeaderType: matchUser.schoolLeaderType,
        region: matchUser.region,
        schoolName: matchUser.schoolName,
        profileCompleted: matchUser.profileCompleted !== undefined ? matchUser.profileCompleted : (isTargetForCompletion ? false : true),
        phoneNumber: matchUser.phoneNumber,
        highestQualification: matchUser.highestQualification,
        experienceYears: matchUser.experienceYears,
        subjectSpeciality: matchUser.subjectSpeciality,
        schoolLevel: matchUser.schoolLevel,
        omangNumber: matchUser.omangNumber,
        salaryScale: matchUser.salaryScale || 'C3',
        currentPosition: matchUser.currentPosition
      };
      onLogin(userToLogin);
    } else {
      setInfoMsg(`Filled with: ${demoUser.email} (Password: ${demoUser.password})`);
    }
  };

  // Submit Logic for Login and Sign-up Flows
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (view === 'login') {
      const match = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!match) {
        setErrorMsg("This account is not registered. Please sign up or click a quick-login account below!");
        return;
      }
      if (match.password !== password) {
        setErrorMsg("Incorrect password. High-usability Tip: all demo accounts use 'pass123'.");
        return;
      }

      // Successful login
      const isTargetForCompletion = (match.role === UserRole.SCHOOL_LEADER && match.schoolLeaderType === SchoolLeaderType.SCHOOLHEAD) ||
        (match.role === UserRole.TEACHER && !!match.teacherType);

      const userSession: User = {
        id: match.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        email: match.email,
        fullName: match.fullName,
        role: match.role,
        teacherType: match.teacherType,
        schoolLeaderType: match.schoolLeaderType,
        region: match.region,
        schoolName: match.schoolName,
        profileCompleted: match.profileCompleted !== undefined ? match.profileCompleted : (isTargetForCompletion ? false : true),
        phoneNumber: match.phoneNumber,
        highestQualification: match.highestQualification,
        experienceYears: match.experienceYears,
        subjectSpeciality: match.subjectSpeciality,
        schoolLevel: match.schoolLevel,
        omangNumber: match.omangNumber,
        salaryScale: match.salaryScale || 'C3',
        currentPosition: match.currentPosition
      };
      onLogin(userSession);
    } else if (view === 'signup') {
      // Validate inputs
      if (!fullName.trim()) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (!securityAnswer.trim()) {
        setErrorMsg("Please provide an answer to your chosen security question for future recovery.");
        return;
      }
      if (role === UserRole.TEACHER && teacherType === TeacherType.PERMANENT &&
          (currentPosition === 'Senior Teacher (with portfolio)' || currentPosition === 'Head of Department') &&
          !specifiedPosition.trim()) {
        setErrorMsg("Please specify your portfolio or department name.");
        return;
      }

      // Check duplicate email
      const exists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (exists) {
        setErrorMsg("An account with this email already exists. Try signing in!");
        return;
      }

      const generatedId = `USR-${Math.floor(10000 + Math.random() * 90000)}`;
      const isTargetForCompletion = (role === UserRole.SCHOOL_LEADER && schoolLeaderType === SchoolLeaderType.SCHOOLHEAD) ||
        (role === UserRole.TEACHER && !!teacherType);

      const newUser = {
        id: generatedId,
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        role,
        teacherType: role === UserRole.TEACHER ? teacherType : undefined,
        schoolLeaderType: role === UserRole.SCHOOL_LEADER ? schoolLeaderType : undefined,
        region: (role === UserRole.OFFICIAL_REGIONAL || role === UserRole.OFFICIAL_SUB_REGIONAL) ? region : undefined,
        schoolName: role === UserRole.SCHOOL_LEADER ? 'Botswana Government School' : undefined,
        salaryScale: salaryScale,
        currentPosition: (role === UserRole.TEACHER && teacherType === TeacherType.PERMANENT)
          ? (currentPosition === 'Senior Teacher (with portfolio)' || currentPosition === 'Head of Department')
            ? `${currentPosition} - ${specifiedPosition.trim()}`
            : currentPosition
          : undefined,
        securityQuestion: selectedQuestion,
        securityAnswer: securityAnswer.trim(),
        backupEmail: backupEmail.trim() || undefined,
        profileCompleted: isTargetForCompletion ? false : true
      };

      // Add to state registry & auto login
      setUsers(prev => [newUser, ...prev]);
      
      const userSession: User = {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        teacherType: newUser.teacherType,
        schoolLeaderType: newUser.schoolLeaderType,
        region: newUser.region,
        schoolName: newUser.schoolName,
        profileCompleted: newUser.profileCompleted,
        salaryScale: newUser.salaryScale,
        currentPosition: newUser.currentPosition
      };

      onLogin(userSession);
    }
  };

  // Submit logic for requesting email to recover password
  const handleRequestRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const matchByEmail = users.find(u => u.email.toLowerCase() === forgotEmail.trim().toLowerCase());
    if (!matchByEmail) {
      setErrorMsg("We couldn't find any account registered with that email address.");
      return;
    }

    setRecoveryUser(matchByEmail);
    // Move to question challenge view!
    setView('security_challenge');
    setChallengerAnswer('');
  };

  // Check security question answer
  const handleVerifyAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!recoveryUser) return;

    const savedAnswer = (recoveryUser.securityAnswer || '').trim().toLowerCase();
    const enteredAnswer = challengerAnswer.trim().toLowerCase();

    if (savedAnswer !== enteredAnswer) {
      setErrorMsg("Incorrect security answer. Please try again! (For demo accounts, find correct answers below)");
      return;
    }

    // Move to secure reset view
    setNewPassword('');
    setConfirmNewPassword('');
    setView('reset_password_now');
  };

  // Submit dynamic password change
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 4) {
      setErrorMsg("Password must be at least 4 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    // Update the record in state registry
    setUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === recoveryUser.email.toLowerCase()) {
        return {
          ...u,
          password: newPassword
        };
      }
      return u;
    }));

    setSuccessMsg(`Success! Password for ${recoveryUser.fullName} has been updated. Log in with your new credentials.`);
    setView('login');
    // Pre-fill the reset credentials
    setEmail(recoveryUser.email);
    setPassword(newPassword);
    setRecoveryUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Visual */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/5905607/pexels-photo-5905607.jpeg" 
          alt="Classroom" 
          className="w-full h-full object-cover opacity-20 filter brightness-[0.7] saturate-150 mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-sky-500/10 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg mt-8 mb-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_0_50px_rgba(14,165,233,0.15)] overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/de/Coat_of_arms_of_Botswana.svg"
                alt="Coat of arms"
                className="h-14 w-auto mx-auto mb-3"
                referrerPolicy="no-referrer"
              />
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-display">
                {view === 'login' && 'Welcome Back'}
                {view === 'signup' && 'Create an Account'}
                {view === 'forgot' && 'Reset Password'}
                {view === 'security_challenge' && 'Security Recovery'}
                {view === 'reset_password_now' && 'Enter New Password'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold uppercase tracking-wider">
                Teacher Registry & Deployment System, Botswana
              </p>
            </div>

            {/* Error alerts */}
            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success alerts */}
            {successMsg && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Temporary helpful feedback notices */}
            {infoMsg && !errorMsg && !successMsg && (
              <div className="p-3 mb-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{infoMsg}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* Login View */}
              {view === 'login' && (
                <motion.form 
                  key="login-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleFormSubmit} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium transition-all"
                        placeholder="e.g. teacher@gov.bw"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => setView('forgot')}
                        className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline hover:text-sky-700"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-400 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 active:scale-[0.99]"
                    >
                      Sign In
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Signup View */}
              {view === 'signup' && (
                <motion.form 
                  key="signup-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleFormSubmit} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Role</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="pl-10 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none appearance-none font-medium"
                      >
                        {Object.values(UserRole).map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {role === UserRole.TEACHER && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teacher Category</label>
                      <select
                        value={teacherType}
                        onChange={(e) => setTeacherType(e.target.value as TeacherType)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                      >
                        {Object.values(TeacherType).map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  {role === UserRole.TEACHER && teacherType === TeacherType.PERMANENT && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Position</label>
                        <select
                          value={currentPosition}
                          onChange={(e) => {
                            setCurrentPosition(e.target.value);
                            setSpecifiedPosition(''); // Reset on change
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                        >
                          <option value="Teacher">Teacher</option>
                          <option value="Senior Teacher (without portfolio)">Senior Teacher (without portfolio)</option>
                          <option value="Senior Teacher (with portfolio)">Senior Teacher (with portfolio)</option>
                          <option value="Head of Department">Head of Department</option>
                        </select>
                      </div>

                      {(currentPosition === 'Senior Teacher (with portfolio)' || currentPosition === 'Head of Department') && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          className="space-y-1"
                        >
                          <label className="block text-xs font-bold text-sky-600 dark:text-sky-450 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                            Specify Portfolio / Department Name
                          </label>
                          <input
                            type="text"
                            placeholder={currentPosition === 'Head of Department' ? "e.g., Mathematics, Science, Humanities" : "e.g., Languages, Guidance & Counselling"}
                            value={specifiedPosition}
                            onChange={(e) => setSpecifiedPosition(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-850 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {role === UserRole.SCHOOL_LEADER && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Position</label>
                      <select
                        value={schoolLeaderType}
                        onChange={(e) => setSchoolLeaderType(e.target.value as SchoolLeaderType)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                      >
                        {Object.values(SchoolLeaderType).map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  {(role === UserRole.OFFICIAL_REGIONAL || role === UserRole.OFFICIAL_SUB_REGIONAL) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {role === UserRole.OFFICIAL_REGIONAL ? "Assigned Education Region" : "Assigned Sub-Region"}
                      </label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                      >
                        {role === UserRole.OFFICIAL_REGIONAL ? (
                          REGIONS.map(r => <option key={r} value={r}>{r}</option>)
                        ) : (
                          ALL_SUB_REGIONS.map(sr => <option key={sr} value={sr}>{sr}</option>)
                        )}
                      </select>
                    </motion.div>
                  )}

                  {/* Salary Scale Selector */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-sky-500" /> Salary Scale (A1 to F)
                    </label>
                    <div className="relative">
                      <select
                        value={salaryScale}
                        onChange={(e) => setSalaryScale(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium appearance-none"
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
                  </motion.div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Password Recovery Method for Sign up */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-450 flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5" /> Password Recovery Setup
                    </h3>
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-405 mb-1">Security Question</label>
                      <select
                        value={selectedQuestion}
                        onChange={(e) => setSelectedQuestion(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                      >
                        {SECURITY_QUESTIONS.map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-405 mb-1">Your Answer (Required for recovery)</label>
                      <input
                        type="text"
                        required
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                        placeholder="Answer is case-insensitive"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-405 mb-1">Backup Recovery Email (Optional)</label>
                      <input
                        type="email"
                        value={backupEmail}
                        onChange={(e) => setBackupEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                        placeholder="backup@example.com"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-400 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-sky-500/10"
                    >
                      Register & Log In
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Forgot Password Request Email View */}
              {view === 'forgot' && (
                <motion.form 
                  key="forgot-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleRequestRecovery} 
                  className="space-y-4"
                >
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                    Enter the email associated with your account. We will challenge your security question to let you immediately overwrite and reset your password.
                  </p>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Registered Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="pl-10 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                        placeholder="e.g. teacher@gov.bw"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setView('login')}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      Back to Login
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-400 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md"
                    >
                      Next Step <ArrowRight className="w-4 h-4 inline-block ml-1" />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Security Challenge Request View */}
              {view === 'security_challenge' && (
                <motion.form 
                  key="challenge-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleVerifyAnswer} 
                  className="space-y-4"
                >
                  <div className="p-3.5 bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/50 rounded-xl mb-2 flex gap-3">
                    <HelpCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-505 font-bold uppercase tracking-wide">Security Check</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                        {recoveryUser?.securityQuestion || "What was your first school?"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Security Answer</label>
                    <input
                      type="text"
                      required
                      value={challengerAnswer}
                      onChange={(e) => setChallengerAnswer(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                      placeholder="Type correct answer..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      Change Email
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-400 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md"
                    >
                      Verify <Unlock className="w-4 h-4 inline-block ml-1" />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Reset Password Form Setup */}
              {view === 'reset_password_now' && (
                <motion.form 
                  key="reset-pw-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleResetPassword} 
                  className="space-y-4"
                >
                  <p className="text-sm text-slate-650 dark:text-slate-400 mb-2 leading-relaxed">
                    Identity verified for <strong className="text-slate-800 dark:text-slate-200">{recoveryUser?.fullName}</strong>. Please set a new security password.
                  </p>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                        placeholder="At least 4 characters"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="pl-10 w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                        placeholder="Must match exactly"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md"
                    >
                      Save Password & Sign In
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800 pt-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {view === 'login' && (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setView('signup')}
                      className="text-sky-600 dark:text-sky-300 font-bold hover:underline"
                    >
                      Sign Up
                    </button>
                  </>
                )}
                {view === 'signup' && (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setView('login')}
                      className="text-sky-600 dark:text-sky-300 font-bold hover:underline"
                    >
                      Log In
                    </button>
                  </>
                )}
                {(view === 'forgot' || view === 'security_challenge' || view === 'reset_password_now') && (
                  <button
                    onClick={() => setView('login')}
                    className="text-sky-600 dark:text-sky-400 font-bold hover:underline"
                  >
                    Back to Login View
                  </button>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Predefined Sample Logins with high usability tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-2xl rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1 px-1.5 bg-sky-500/10 text-sky-400 rounded-lg text-xs font-bold border border-sky-500/20">
              Demo Mode
            </div>
            <h3 className="font-extrabold text-slate-100 text-sm flex-grow">Interactive Sandbox Logins</h3>
            <span className="text-[10px] text-slate-400 font-mono">Password: <strong className="text-sky-300">pass123</strong></span>
          </div>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Standard test accounts representing all core users of the Botswana teacher recruitment system. Click any user to **auto-fill and instantly log in** directly!
          </p>

          <div className="space-y-2.5">
            {INITIAL_DUMMY_USERS.map((demoAcc) => {
              const rBadge = demoAcc.role === UserRole.TEACHER 
                ? (demoAcc.teacherType || 'Teacher')
                : demoAcc.role === UserRole.SCHOOL_LEADER 
                ? 'School Head' 
                : demoAcc.role === UserRole.SUPER_ADMIN
                ? 'Super Admin ⚙️'
                : demoAcc.role === UserRole.OFFICIAL_MINISTRY
                ? 'Ministry HQ'
                : demoAcc.role === UserRole.OFFICIAL_REGIONAL
                ? 'Regional'
                : 'Sub-Regional';

              const roleColor = demoAcc.role === UserRole.TEACHER 
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' 
                : demoAcc.role === UserRole.SCHOOL_LEADER
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : demoAcc.role === UserRole.SUPER_ADMIN
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30';

              return (
                <div 
                  key={demoAcc.email}
                  className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all transition-colors duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleColor}`}>
                        {rBadge}
                      </span>
                      <span className="text-xs font-bold text-slate-200 truncate">{demoAcc.fullName}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono truncate">{demoAcc.email}</p>
                    <p className="text-[10px] text-slate-550 mt-1 leading-snug line-clamp-1 italic italic">
                      Q: "{demoAcc.securityQuestion}" → A: "{demoAcc.securityAnswer}"
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <button
                      onClick={() => handleQuickFill(demoAcc, false)}
                      className="flex-1 sm:flex-initial text-[10px] font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700/80 transition-colors"
                      title="Prefill fields"
                    >
                      Pre-fill
                    </button>
                    <button
                      onClick={() => handleQuickFill(demoAcc, true)}
                      className="flex-1 sm:flex-initial text-[10px] font-bold text-white bg-sky-600 hover:bg-sky-500 px-3 py-1.5 rounded-lg border border-sky-500/40 transition-all flex items-center justify-center gap-1"
                      title="Log in directly matching state"
                    >
                      Instant Sign In ➔
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
