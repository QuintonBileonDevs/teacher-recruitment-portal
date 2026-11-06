import React, { useState, useEffect } from 'react';
import { 
  Building, CheckCircle, Mail, MapPin, Search, Calendar, ChevronRight, Phone, MessageSquare, Sun, Moon, Zap, ArrowRight, Activity, Send, Sparkles, Clock, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Applicant, ApplicationStatus, WhatsAppMessage, Vacancy, Placement, User, UserRole, TeacherType, SchoolLeaderType, SystemAuditLog } from './types';
import AuthPage from './components/auth/AuthPage';
import { SAMPLE_APPLICANTS, SAMPLE_VACANCIES, SAMPLE_PLACEMENTS, SAMPLE_AUDIT_LOGS } from './sampleData';
import ApplicantPortal from './components/ApplicantPortal';
import AdminPortal from './components/AdminPortal';
import SchoolPortal from './components/SchoolPortal';
import LandingContent from './components/LandingContent';
import ProfileCompletionWizard from './components/auth/ProfileCompletionWizard';
import ProfileDropdown from './components/auth/ProfileDropdown';
import SuperAdminPortal from './components/SuperAdminPortal';

export default function App() {
  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    const saved = localStorage.getItem('moesd_applicants');
    return saved ? JSON.parse(saved) : SAMPLE_APPLICANTS;
  });

  const [vacancies, setVacancies] = useState<Vacancy[]>(() => {
    const saved = localStorage.getItem('moesd_vacancies');
    return saved ? JSON.parse(saved) : SAMPLE_VACANCIES;
  });

  const [placements, setPlacements] = useState<Placement[]>(() => {
    const saved = localStorage.getItem('moesd_placements');
    return saved ? JSON.parse(saved) : SAMPLE_PLACEMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() => {
    const saved = localStorage.getItem('moesd_audit_logs');
    return saved ? JSON.parse(saved) : SAMPLE_AUDIT_LOGS;
  });

  const addAuditLog = (
    action: string,
    details: string,
    severity: "info" | "warning" | "critical" = "info",
    actorUser?: User | null
  ) => {
    const activeUser = actorUser !== undefined ? actorUser : currentUser;
    const logUserEmail = activeUser ? activeUser.email : "anonymous@guest.bw";
    const logUserName = activeUser ? activeUser.fullName : "Anonymous Guest";
    const logUserRole = activeUser ? activeUser.role : "Guest";
    const logUserId = activeUser ? activeUser.id : "USR-UNKNOWN";

    const newLog: SystemAuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: logUserId,
      userName: logUserName,
      userEmail: logUserEmail,
      userRole: logUserRole,
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: "168.167." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
      browser: typeof navigator !== "undefined" ? navigator.userAgent.substring(0, 100) : "Chrome 125.0.0",
      severity
    };

    setAuditLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('moesd_audit_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAuditLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem('moesd_audit_logs');
  };

  const [activeTrackOmang, setActiveTrackOmang] = useState<string>(() => {
    const saved = localStorage.getItem('moesd_active_track_omang');
    return saved || '172481923'; 
  });

  const [chatInput, setChatInput] = useState<string>('');
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);

  const [messages, setMessages] = useState<WhatsAppMessage[]>(() => {
    const saved = localStorage.getItem('moesd_chat_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seen = new Set<string>();
          return parsed.map((m: any, idx: number) => {
            let uniqueId = m.id;
            if (!uniqueId) {
              uniqueId = `m-gen-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000000)}`;
            } else if (seen.has(uniqueId)) {
              uniqueId = `${uniqueId}-dedupe-${idx}-${Math.floor(Math.random() * 1000000)}`;
            }
            seen.add(uniqueId);
            return { ...m, id: uniqueId };
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "init-0",
        sender: "bot",
        text: "Hello! Welcome to the Ministry of Child Welfare and Basic Education help desk.\n\nWe will send updates about your application here.\n\nCommands:\n• Send 'STATUS' to check your profile\n• Send your 9-digit ID to view details",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      }
    ];
  });

  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages, isBotTyping]);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('moesd_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [showProfileWizard, setShowProfileWizard] = useState<boolean>(false);

  const handleUpdateUserProfile = (updatedFields: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedFields, profileCompleted: true };
    
    // Update in registered users list
    const savedUsersStr = localStorage.getItem('moesd_registered_users');
    if (savedUsersStr) {
      try {
        const savedUsers = JSON.parse(savedUsersStr);
        const index = savedUsers.findIndex((u: any) => u.email.toLowerCase() === currentUser.email.toLowerCase());
        if (index !== -1) {
          savedUsers[index] = { ...savedUsers[index], ...updatedFields, profileCompleted: true };
          localStorage.setItem('moesd_registered_users', JSON.stringify(savedUsers));
        }
      } catch (e) {
        console.error(e);
      }
    }

    const categoryName = currentUser.teacherType || currentUser.schoolLeaderType || currentUser.role;
    
    const completeMsg: WhatsAppMessage = {
      id: `m-profile-success-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      sender: 'bot',
      text: `Congratulations ${currentUser.fullName}!\n\nYour profile as a "${categoryName}" has been successfully completed and verified.\n\nYour Omang ID (${updatedFields.omangNumber || currentUser.omangNumber || 'registered'}) is now active in the National Teacher Database.\n\nThank you for utilizing the Ministry of Child Welfare and Basic Education Portal.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(messagesPrev => {
      if (messagesPrev.some(m => m.id === completeMsg.id)) return messagesPrev;
      return [...messagesPrev, completeMsg];
    });

    setCurrentUser(updatedUser);
    addAuditLog("PROFILE_COMPLETE", `${currentUser.fullName} completed or updated their MoESD profile registry fields (Indicated category: ${categoryName}).`, "info", updatedUser);
  };

  const role = !currentUser ? null : (currentUser.role === UserRole.TEACHER ? 'applicant' : (currentUser.role === UserRole.SCHOOL_LEADER ? 'school' : (currentUser.role === UserRole.SUPER_ADMIN ? 'superadmin' : 'admin')));

  // Dynamic Hero Stats Cards Logic
  const myApplication = currentUser ? applicants.find(a => 
    (currentUser.email && a.email.toLowerCase() === currentUser.email.toLowerCase()) || 
    (currentUser.omangNumber && a.omangNumber === currentUser.omangNumber)
  ) : null;

  const matchingVacanciesCount = currentUser?.subjectSpeciality 
    ? vacancies.filter(v => v.subject.toLowerCase() === currentUser.subjectSpeciality?.toLowerCase() && v.status === 'Open').length
    : 0;

  const generalOpenVacancies = vacancies.filter(v => v.status === 'Open').length;

  const mySchoolName = currentUser?.schoolName || '';
  const schoolVacancies = vacancies.filter(v => v.schoolName.toLowerCase() === mySchoolName.toLowerCase());
  const activeSchoolVacancies = schoolVacancies.filter(v => v.status === 'Open').length;
  
  const schoolPlacements = placements.filter(p => p.schoolName.toLowerCase() === mySchoolName.toLowerCase());
  const activeSchoolPlacements = schoolPlacements.filter(p => p.status === 'Active').length;

  // Derive final stats
  let statCard1 = {
    bgIcon: CheckCircle,
    smallIcon: CheckCircle,
    value: "1,240",
    title: "Total Placements",
    subtitle: "Teachers"
  };

  let statCard2 = {
    bgIcon: MapPin,
    smallIcon: MapPin,
    value: "42",
    title: "Available Vacancies",
    subtitle: "Across 14 Regions"
  };

  let statCard3 = {
    bgIcon: Activity,
    smallIcon: Activity,
    value: "2 Days",
    title: "Avg. Response Time",
    subtitle: "Fast & Efficient"
  };

  if (currentUser) {
    if (currentUser.role === UserRole.TEACHER) {
      statCard1 = {
        bgIcon: CheckCircle,
        smallIcon: CheckCircle,
        value: myApplication ? myApplication.status : 'Draft',
        title: "My Application Status",
        subtitle: myApplication ? `Subject: ${myApplication.vacancySubject}` : 'Register to start matching'
      };
      statCard2 = {
        bgIcon: MapPin,
        smallIcon: MapPin,
        value: matchingVacanciesCount > 0 ? String(matchingVacanciesCount) : String(generalOpenVacancies),
        title: matchingVacanciesCount > 0 ? "Matching Vacancies" : "Open Vacancies",
        subtitle: currentUser.subjectSpeciality ? `In ${currentUser.subjectSpeciality}` : 'Nationwide'
      };
      statCard3 = {
        bgIcon: Activity,
        smallIcon: Activity,
        value: currentUser.profileCompleted ? 'Verified ✔' : 'Incomplete ✎',
        title: "Ministry Registry",
        subtitle: currentUser.experienceYears ? `${currentUser.experienceYears} Yrs Classroom Exp.` : 'Complete details'
      };
    } else if (currentUser.role === UserRole.SCHOOL_LEADER) {
      statCard1 = {
        bgIcon: MapPin,
        smallIcon: MapPin,
        value: String(activeSchoolVacancies),
        title: "My School Vacancies",
        subtitle: mySchoolName ? `Active gaps listed at ${mySchoolName}` : 'Under recruitment'
      };
      statCard2 = {
        bgIcon: CheckCircle,
        smallIcon: CheckCircle,
        value: String(activeSchoolPlacements),
        title: "Assigned Teachers",
        subtitle: "Active on-station staff"
      };
      statCard3 = {
        bgIcon: Activity,
        smallIcon: Activity,
        value: currentUser.schoolLevel || "All Levels",
        title: "School Type",
        subtitle: currentUser.region ? `Region: ${currentUser.region}` : 'District Board'
      };
    } else {
      // Admin/Government Official and fallback roles
      statCard1 = {
        bgIcon: CheckCircle,
        smallIcon: CheckCircle,
        value: String(applicants.length),
        title: "National Applicants",
        subtitle: "Vetted applicant database"
      };
      statCard2 = {
        bgIcon: MapPin,
        smallIcon: MapPin,
        value: String(generalOpenVacancies),
        title: "Global Vacancies",
        subtitle: "Active regional openings"
      };
      statCard3 = {
        bgIcon: Activity,
        smallIcon: Activity,
        value: String(placements.filter(p => p.status === 'Active').length),
        title: "Active Deployments",
        subtitle: "Direct tracked placements"
      };
    }
  }

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('moesd_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('moesd_current_user');
    }
  }, [currentUser]);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('moesd_dark_mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('moesd_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('moesd_applicants', JSON.stringify(applicants));
  }, [applicants]);

  useEffect(() => {
    localStorage.setItem('moesd_vacancies', JSON.stringify(vacancies));
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem('moesd_placements', JSON.stringify(placements));
  }, [placements]);

  useEffect(() => {
    localStorage.setItem('moesd_active_track_omang', activeTrackOmang);
  }, [activeTrackOmang]);

  useEffect(() => {
    localStorage.setItem('moesd_chat_messages', JSON.stringify(messages));
  }, [messages]);

  const handleAddApplicant = (newApplicant: Applicant) => {
    setApplicants(prev => [newApplicant, ...prev]);
    addAuditLog("APPLICATION_SUBMIT", `Applicant ${newApplicant.fullName} registered a new application for ${newApplicant.vacancySubject} in ${newApplicant.preferredRegion}. Assigned Reference ID: ${newApplicant.id}`, "info");
    
    // Dispatch instant simulated WhatsApp receipt
    const submitMsg: WhatsAppMessage = {
      id: `m-sub-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      sender: 'bot',
      text: `Hello ${newApplicant.fullName}!\n\nWe have received your application for "${newApplicant.vacancySubject}" in region: ${newApplicant.preferredRegion}.\n\nYour reference ID is: ${newApplicant.id}.\n\nWe will update you here soon.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => {
      if (prev.some(m => m.id === submitMsg.id)) return prev;
      return [...prev, submitMsg];
    });
  };

  const handleUpdateApplicantStatus = (
    applicantId: string, 
    newStatus: ApplicationStatus, 
    reviewNote: string, 
    interviewDate?: string
  ) => {
    setApplicants(prev => prev.map(app => {
      if (app.id === applicantId) {
        const updatedLogs = [
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            updatedBy: "HR Officer",
            note: reviewNote
          },
          ...app.logs
        ];
        return {
          ...app,
          status: newStatus,
          notes: reviewNote,
          interviewDate: interviewDate || app.interviewDate,
          logs: updatedLogs
        };
      }
      return app;
    }));

    const applicant = applicants.find(a => a.id === applicantId);
    if (!applicant) return;

    addAuditLog("STATUS_CHANGE", `Status updated for applicant ${applicant.fullName} (Omang: ${applicant.omangNumber}) to '${newStatus}'. Reason: ${reviewNote}`, "info");

    let alertText = '';
    if (newStatus === ApplicationStatus.UNDER_REVIEW) {
      alertText = `Status Update\n\nHello ${applicant.fullName},\n\nYour application is now under review.\n\nStatus: Under Review\nNote: "${reviewNote}"`;
    } else if (newStatus === ApplicationStatus.SHORTLISTED) {
      alertText = `Good News!\n\nHello ${applicant.fullName},\n\nYou have been shortlisted.\n\nStatus: Shortlisted\nNote: "${reviewNote}"\n\nWe will notify you when an interview is scheduled.`;
    } else if (newStatus === ApplicationStatus.INTERVIEW_SCHEDULED) {
      const formattedDate = interviewDate ? new Date(interviewDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'To Be Decided';
      alertText = `Interview Scheduled!\n\nHello ${applicant.fullName},\n\nAn interview has been scheduled for you.\n\nStatus: Interview Scheduled\nTime: ${formattedDate}\nLocation: Ministry Office, Gaborone\nNote: "${reviewNote}"\n\nPlease bring original copies of your documents.`;
    } else if (newStatus === ApplicationStatus.REJECTED) {
      alertText = `Application Update\n\nHello ${applicant.fullName},\n\nWe regret to inform you that your application was not successful this time.\n\nStatus: Not Selected\nReason: "${reviewNote}"\n\nThank you for applying.`;
    }

    const updateMsg: WhatsAppMessage = {
      id: `m-upd-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      sender: 'bot',
      text: alertText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => {
      if (prev.some(m => m.id === updateMsg.id)) return prev;
      return [...prev, updateMsg];
    });
  };

  const handleSendWhatsAppMessage = (text: string) => {
    const userMsg: WhatsAppMessage = {
      id: `u-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => {
      if (prev.some(m => m.id === userMsg.id)) return prev;
      return [...prev, userMsg];
    });

    setIsBotTyping(true);

    setTimeout(() => {
      setIsBotTyping(false);
      const cleanText = text.trim().toUpperCase();
      let replyText = '';

      if (cleanText === 'HELP' || cleanText === 'SYSTEM COMMANDS' || cleanText === '❓ HELP COMMANDS') {
        replyText = `Ministry Support Commands:\n\n• STATUS — checks the current status of your active application.\n• [9-digit ID] — queries any candidate's application details.\n• HELP — displays this list of instructions.\n\nIn a live production system, this server responds automatically to SMS & WhatsApp messages to assist candidates with limited data connection.`;
      } else if (cleanText === 'HOW IT WORKS' || cleanText === '🙋 HOW IT WORKS') {
        replyText = `How it works:\n\n1. Register and complete your profile on this portal.\n2. Apply for a targeted vacancy of your selection.\n3. The Ministry runs credential verification pairings.\n4. You receive SMS notifications of status changes.\n5. Intersecting with low-bandwidth, candidates can check real-time status here or via offline SMS gateways.`;
      } else if (cleanText === 'STATUS' || cleanText === "CHECK STATUS" || cleanText === "📊 STATUS CHECK") {
        const matched = applicants.find(a => a.omangNumber === activeTrackOmang);
        if (matched) {
          replyText = `Profile Found\n\nHello ${matched.fullName}!\n\nSubject: ${matched.vacancySubject}\nStatus: ${matched.status.replace(/_/g, " ")}\n\nYou can log in to the website to see more details.`;
        } else {
          replyText = `We could not find an active session.\n\nPlease enter your 9-digit Omang number to check your status.`;
        }
      } else if (/^[1-2]\d{8}$/.test(cleanText)) {
        const matched = applicants.find(a => a.omangNumber === cleanText);
        if (matched) {
          replyText = `Record Found\n\nName: ${matched.fullName}\nPosition: ${matched.vacancySubject}\nRegion: ${matched.preferredRegion}\nStatus: ${matched.status.replace(/_/g, " ")}`;
        } else {
          replyText = `Sorry, ID "${text}" is not in our system.\n\nPlease register on the website first.`;
        }
      } else {
        replyText = `Hello! I did not understand that.\n\nPlease send:\n• 'STATUS' to check your application\n• 'HOW IT WORKS' for a systems overview\n• Your 9-digit Omang ID (e.g. 172481923) to view details`;
      }

      const botMsg: WhatsAppMessage = {
        id: `b-auto-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => {
        if (prev.some(m => m.id === botMsg.id)) return prev;
        return [...prev, botMsg];
      });
    }, 700);
  };

  if (authMode && !currentUser) {
    return (
      <div className={darkMode ? 'dark' : ''}>
         <div className="absolute top-6 left-6 z-50">
            <button
              onClick={() => setAuthMode(null)}
              className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg shadow font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              ← Back to Home
            </button>
         </div>
         <div className="absolute top-6 right-6 z-50">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
         </div>
         <AuthPage 
           defaultIsLogin={authMode === 'login'}
           onLogin={(u) => {
             setCurrentUser(u);
             setAuthMode(null);
            addAuditLog("LOGIN", `${u.fullName} (${u.role}) successfully logged in via administrative gateway.`, "info", u);
           }} 
         />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-black shadow border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
               <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/de/Coat_of_arms_of_Botswana.svg"
                  alt="Coat of arms"
                  className="h-10 w-auto sm:h-12"
                  referrerPolicy="no-referrer"
                />
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm xs:text-base sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight font-display truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none">
                Teacher Registry &amp; Deployment System
              </h1>
              <p className="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400 truncate max-w-[130px] xs:max-w-[205px] sm:max-w-none">
                Ministry of Child Welfare and Basic Education
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 justify-end">
            {currentUser ? (
              <ProfileDropdown 
                currentUser={currentUser}
                onUpdateUser={handleUpdateUserProfile}
                onLogout={() => {
                  addAuditLog("LOGOUT", `${currentUser.fullName} (${currentUser.role}) logged out and cleared session token.`, "info", currentUser);
                  setCurrentUser(null);
                }}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
              />
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button 
                  onClick={() => setAuthMode('login')}
                  className="px-2.5 py-1.5 sm:px-5 sm:py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-205 hover:bg-slate-200 hover:text-slate-950 dark:hover:bg-slate-700 dark:hover:text-white font-semibold transition-all text-xs sm:text-sm border border-slate-200/45 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-650"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setAuthMode('signup')}
                  className="px-2.5 py-1.5 sm:px-5 sm:py-2 rounded-lg bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-400 text-white font-semibold transition-colors text-xs sm:text-sm shadow animate-subtle"
                >
                  Create Account
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 sm:p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/5905607/pexels-photo-5905607.jpeg" 
            alt="Students in classroom" 
            className="w-full h-full object-cover opacity-40 brightness-75"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center flex flex-col items-center justify-center min-h-[40vh]">
          <div className="max-w-4xl text-white space-y-8 flex flex-col items-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] font-display text-balance drop-shadow-sm">
              Connect educators with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-100 to-white drop-shadow-none">opportunities.</span>
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl font-medium leading-relaxed max-w-2xl mx-auto text-slate-200 font-sans">
              The unified national ecosystem for teacher recruitment and deployment. Apply for positions, transparently manage vacancies, and accelerate placements.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {currentUser ? (
                <>
                  {role === 'applicant' && (
                    <button 
                      className="px-8 py-3 bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                      onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                    >
                      My Portal
                    </button>
                  )}
                  {role === 'school' && (
                    <button 
                      className="px-8 py-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-sky-900 dark:text-sky-300 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                      onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                    >
                      Manage Vacancies
                    </button>
                  )}
                  {role === 'admin' && (
                    <button 
                      className="px-8 py-3 bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                      onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                    >
                      Admin Dashboard
                    </button>
                  )}
                  {role === 'superadmin' && (
                    <button 
                      className="px-8 py-3 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                      onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                    >
                      Super Admin Portal
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setAuthMode('login')}
                    className="px-8 py-3 bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Start Application
                  </button>
                  <button 
                    className="px-8 py-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-sky-900 dark:text-sky-300 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    onClick={() => setAuthMode('login')}
                  >
                    Login / Sign up
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="w-full max-w-5xl mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 relative z-20">
             {(() => {
                const BgIcon1 = statCard1.bgIcon;
                const SmallIcon1 = statCard1.smallIcon;
                return (
                  <div className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col justify-center overflow-hidden shadow-2xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(14,165,233,0.15)] hover:border-sky-500/30">
                      <div className="absolute -top-6 -right-6 text-sky-500/5 group-hover:text-sky-500/10 transition-colors pointer-events-none">
                          <CheckCircle className="w-40 h-40" />
                      </div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                          <div className="p-3 bg-gradient-to-br from-sky-500/20 to-sky-500/5 rounded-2xl mb-4 border border-sky-500/20 shadow-inner">
                              <SmallIcon1 className="w-8 h-8 text-sky-400" />
                          </div>
                          <p className="text-3xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2 truncate max-w-full px-2" title={statCard1.value}>{statCard1.value}</p>
                          <h3 className="text-sky-400 font-semibold uppercase tracking-wider text-xs mb-1">{statCard1.title}</h3>
                          <span className="text-sm font-medium text-slate-100">{statCard1.subtitle}</span>
                      </div>
                  </div>
                );
             })()}

             {(() => {
                const BgIcon2 = statCard2.bgIcon;
                const SmallIcon2 = statCard2.smallIcon;
                return (
                  <div className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col justify-center overflow-hidden shadow-2xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(14,165,233,0.15)] hover:border-sky-500/30">
                      <div className="absolute -top-6 -right-6 text-sky-500/5 group-hover:text-sky-500/10 transition-colors pointer-events-none">
                          <MapPin className="w-40 h-40" />
                      </div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                          <div className="p-3 bg-gradient-to-br from-sky-500/20 to-sky-500/5 rounded-2xl mb-4 border border-sky-500/20 shadow-inner">
                              <SmallIcon2 className="w-8 h-8 text-sky-400" />
                          </div>
                          <p className="text-3xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2 truncate max-w-full px-2" title={statCard2.value}>{statCard2.value}</p>
                          <h3 className="text-sky-400 font-semibold uppercase tracking-wider text-xs mb-1">{statCard2.title}</h3>
                          <span className="text-sm font-medium text-slate-100">{statCard2.subtitle}</span>
                      </div>
                  </div>
                );
             })()}

             {(() => {
                const BgIcon3 = statCard3.bgIcon;
                const SmallIcon3 = statCard3.smallIcon;
                return (
                  <div className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col justify-center overflow-hidden shadow-2xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(14,165,233,0.15)] hover:border-sky-500/30">
                      <div className="absolute -top-6 -right-6 text-sky-500/5 group-hover:text-sky-500/10 transition-colors pointer-events-none">
                          <Activity className="w-40 h-40" />
                      </div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                          <div className="p-3 bg-gradient-to-br from-sky-500/20 to-sky-500/5 rounded-2xl mb-4 border border-sky-500/20 shadow-inner">
                              <SmallIcon3 className="w-8 h-8 text-sky-400" />
                          </div>
                          <p className="text-3xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2 truncate max-w-full px-2" title={statCard3.value}>{statCard3.value}</p>
                          <h3 className="text-sky-400 font-semibold uppercase tracking-wider text-xs mb-1">{statCard3.title}</h3>
                          <span className="text-sm font-medium text-slate-100">{statCard3.subtitle}</span>
                      </div>
                  </div>
                );
             })()}
          </div>
        </div>
      </section>

      {/* Main Content Areas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!currentUser ? (
             <LandingContent />
          ) : (
            <>
              {/* Profile Completion Warning Notification */}
              {((currentUser.role === UserRole.SCHOOL_LEADER && currentUser.schoolLeaderType === SchoolLeaderType.SCHOOLHEAD) ||
                (currentUser.role === UserRole.TEACHER && !!currentUser.teacherType)) && 
                !currentUser.profileCompleted && (
                <div id="profile-incomplete-banner" className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-2xl p-5 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
                      <Zap className="w-6 h-6 animate-pulse text-amber-550" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-amber-905 dark:text-amber-300 text-base">Action Required: Complete Your Official Profile</h3>
                      <p className="text-sm text-slate-600 dark:text-white mt-1 max-w-2xl leading-relaxed">
                        To activate your profile status in the Ministry system, verify credential pairings, and receive automatic employment circular alerts, please supply your verified details. 
                      </p>
                    </div>
                  </div>
                  <button 
                    id="btn-complete-profile"
                    onClick={() => setShowProfileWizard(true)} 
                    className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-405 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-amber-600/10 shrink-0 flex items-center gap-2 animate-pulse"
                  >
                    Complete Profile <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {showProfileWizard && (
                <ProfileCompletionWizard 
                  currentUser={currentUser}
                  onComplete={(updated) => {
                    handleUpdateUserProfile(updated);
                    setShowProfileWizard(false);
                  }}
                  onClose={() => setShowProfileWizard(false)}
                />
              )}

              {role === 'applicant' && (
                <ApplicantPortal 
                  onAddApplicant={handleAddApplicant}
                  applicants={applicants}
                  setApplicants={setApplicants}
                  activeTrackOmang={activeTrackOmang}
                  setActiveTrackOmang={setActiveTrackOmang}
                  vacancies={vacancies}
                  setVacancies={setVacancies}
                  placements={placements}
                  setPlacements={setPlacements}
                  onSendMessage={handleSendWhatsAppMessage}
                  currentUser={currentUser}
                  onUpdateUser={handleUpdateUserProfile}
                  auditLogs={auditLogs}
                />
              )}
              {role === 'school' && (
                <SchoolPortal
                  applicants={applicants}
                  setApplicants={setApplicants}
                  vacancies={vacancies}
                  setVacancies={setVacancies}
                  placements={placements}
                  setPlacements={setPlacements}
                  onSendMessage={handleSendWhatsAppMessage}
                  currentUser={currentUser}
                  onUpdateUser={handleUpdateUserProfile}
                  auditLogs={auditLogs}
                  onAddAuditLog={addAuditLog}
                />
              )}
              {role === 'admin' && (
                <AdminPortal 
                  currentUser={currentUser}
                  applicants={applicants}
                  setApplicants={setApplicants}
                  vacancies={vacancies}
                  setVacancies={setVacancies}
                  placements={placements}
                  setPlacements={setPlacements}
                  onUpdateApplicantStatus={handleUpdateApplicantStatus}
                  onSendMessage={handleSendWhatsAppMessage}
                  auditLogs={auditLogs}
                  onAddAuditLog={addAuditLog}
                  onClearAuditLogs={handleClearAuditLogs}
                />
              )}
              {role === 'superadmin' && (
                <SuperAdminPortal 
                  currentUser={currentUser}
                  onUpdateUser={(fields) => {
                    setCurrentUser(prev => {
                      if (!prev) return null;
                      const updated = { ...prev, ...fields };
                      localStorage.setItem('moesd_current_user', JSON.stringify(updated));
                      return updated;
                    });
                  }}
                  auditLogs={auditLogs}
                  onAddAuditLog={(action, details, severity) => addAuditLog(action, details, severity)}
                  onClearAuditLogs={handleClearAuditLogs}
                  vacancies={vacancies}
                  placements={placements}
                  onSendMessage={handleSendWhatsAppMessage}
                />
              )}
            </>
          )}
      </main>

      {/* Chat Section */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Column 1 & 2: Dynamic Live Chat Console */}
          <div className="lg:col-span-2 bg-white dark:bg-black rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[500px]">
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center">
                <span className="relative flex h-3 w-3 mr-3 mt-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Botswana Teacher Support Direct</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Automated Gateway &amp; Live Assistant</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-350 rounded uppercase tracking-wider">
                SMS &amp; WhatsApp Live
              </span>
            </div>
            
            {/* Messages Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20 dark:bg-black/20" id="chat-messages-container">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <div 
                    key={`${msg.id}-${idx}`}
                    className={`p-4 rounded-2xl border max-w-[85%] shadow-sm transition-all ${
                      msg.sender === 'bot' 
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200' 
                        : 'bg-sky-600 dark:bg-sky-500 border-sky-600 text-white ml-auto'
                    }`}
                  >
                    <span className={`text-[10px] font-bold tracking-wider uppercase block ${msg.sender === 'bot' ? 'text-sky-600 dark:text-sky-400' : 'text-sky-200'}`}>
                      {msg.sender === 'bot' ? '🤖 support-bot' : '👤 candidate'}
                    </span>
                    <p className="whitespace-pre-line mt-1 text-sm leading-relaxed">{msg.text}</p>
                    <span className={`block text-[9px] mt-2 text-right ${msg.sender === 'bot' ? 'text-slate-400' : 'text-sky-200/70'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isBotTyping && (
                  <div className="p-4 rounded-2xl border max-w-[150px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-400">Bot is typing</span>
                    <span className="flex gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                    </span>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Action Chips */}
            <div className="px-6 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap gap-2 items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mr-1">Quick Queries:</span>
              <button 
                onClick={() => handleSendWhatsAppMessage('STATUS')}
                type="button"
                className="text-[11px] font-bold px-2.5 py-1 bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-lg text-slate-700 dark:text-slate-300 transition-colors shadow-sm cursor-pointer"
              >
                📊 Check Status
              </button>
              <button 
                onClick={() => handleSendWhatsAppMessage('HOW IT WORKS')}
                type="button"
                className="text-[11px] font-bold px-2.5 py-1 bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-755 rounded-lg text-slate-700 dark:text-slate-300 transition-colors shadow-sm cursor-pointer"
              >
                🙋 How It Works
              </button>
              <button 
                onClick={() => handleSendWhatsAppMessage('HELP')}
                type="button"
                className="text-[11px] font-bold px-2.5 py-1 bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-755 rounded-lg text-slate-700 dark:text-slate-300 transition-colors shadow-sm cursor-pointer"
              >
                ❓ All Commands
              </button>
              {currentUser && (
                <button 
                  onClick={() => handleSendWhatsAppMessage(currentUser.omangNumber || '172481923')}
                  type="button"
                  className="text-[11px] font-bold px-2.5 py-1 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-950 border border-sky-200/30 dark:border-sky-800/40 rounded-lg text-sky-700 dark:text-sky-300 transition-colors shadow-sm cursor-pointer"
                >
                  🔍 Query My ID
                </button>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!chatInput.trim()) return;
              handleSendWhatsAppMessage(chatInput);
              setChatInput('');
            }} className="flex gap-2 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type 'STATUS' or enter a 9-digit Omang ID..."
                className="flex-1 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-slate-150 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white p-2.5 rounded-xl disabled:opacity-40 transition-all shadow cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Column 3: How it Works in a Live System */}
          <div className="bg-slate-100/50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 lg:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-xl">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider">Production Architecture</h4>
                <p className="text-xs text-slate-500">How the live support line responds</p>
              </div>
            </div>

            <div className="border-l-2 border-dashed border-slate-300 dark:border-slate-700 pl-4 ml-6 space-y-4 text-xs leading-relaxed">
              <div className="relative">
                <span className="absolute -left-[21px] top-1.5 flex h-2 w-2 rounded-full bg-sky-500 border border-white dark:border-black"></span>
                <p className="font-bold text-slate-800 dark:text-slate-200">1. User Send</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  The candidate sends an SMS, Telegram, or WhatsApp message to the official Ministry line (e.g., +267 365 5000).
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-1.5 flex h-2 w-2 rounded-full bg-sky-500 border border-white dark:border-black"></span>
                <p className="font-bold text-slate-800 dark:text-slate-200">2. Automated Gateway Trigger</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Our core communication engine receives the payload, parses keywords, and identifies the sender's mobile phone number or inputted Omang ID.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-1.5 flex h-2 w-2 rounded-full bg-sky-500 border border-white dark:border-black"></span>
                <p className="font-bold text-slate-800 dark:text-slate-200">3. Secure Database Query</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  The bot verifies the profile on the National Teacher Database, fetching real-time review states, interview dates, or deployment regions.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-1.5 flex h-2 w-2 rounded-full bg-sky-500 border border-white dark:border-black"></span>
                <p className="font-bold text-slate-800 dark:text-slate-200">4. Instant Dispatch</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  The gateway responds in &lt;1 second. When teachers are shortlisted, the system also automatically dispatches proactive SMS alerts!
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
                <strong>No Data Required:</strong> By allowing standard SMS query loops, teachers in remote rural regions gain identical equitable access to status updates as urban users.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-sm font-medium tracking-wide">&copy; {new Date().getFullYear()} Ministry of Child Welfare and Basic Education, Botswana.</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">Providing a fast and reliable recruitment service for educators nationwide.</p>
        </div>
      </footer>

    </div>
  );
}
