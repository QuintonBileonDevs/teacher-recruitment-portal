import fs from 'fs';

const appContent = `import React, { useState, useEffect } from 'react';
import { 
  Building, CheckCircle, Mail, MapPin, Search, Calendar, ChevronRight, Phone, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Applicant, ApplicationStatus, WhatsAppMessage, Vacancy, Placement } from './types';
import { SAMPLE_APPLICANTS, SAMPLE_VACANCIES, SAMPLE_PLACEMENTS } from './sampleData';
import ApplicantPortal from './components/ApplicantPortal';
import AdminPortal from './components/AdminPortal';
import SchoolPortal from './components/SchoolPortal';

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

  const [activeTrackOmang, setActiveTrackOmang] = useState<string>(() => {
    const saved = localStorage.getItem('moesd_active_track_omang');
    return saved || '172481923'; 
  });

  const [messages, setMessages] = useState<WhatsAppMessage[]>(() => {
    const saved = localStorage.getItem('moesd_chat_messages');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "init-0",
        sender: "bot",
        text: "Hello! Welcome to the Ministry of Education help desk.\\n\\nWe will send updates about your application here.\\n\\nCommands:\\n• Send 'STATUS' to check your profile\\n• Send your 9-digit ID to view details",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      }
    ];
  });

  const [role, setRole] = useState<'applicant' | 'school' | 'admin'>('applicant');

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
    
    // Dispatch instant simulated WhatsApp receipt
    const submitMsg: WhatsAppMessage = {
      id: \`m-sub-\${Date.now()}\`,
      sender: 'bot',
      text: \`Hello \${newApplicant.fullName}!\\n\\nWe have received your application for "\${newApplicant.vacancySubject}" in region: \${newApplicant.preferredRegion}.\\n\\nYour reference ID is: \${newApplicant.id}.\\n\\nWe will update you here soon.\`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, submitMsg]);
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

    let alertText = '';
    if (newStatus === ApplicationStatus.UNDER_REVIEW) {
      alertText = \`Status Update\\n\\nHello \${applicant.fullName},\\n\\nYour application is now under review.\\n\\nStatus: Under Review\\nNote: "\${reviewNote}"\`;
    } else if (newStatus === ApplicationStatus.SHORTLISTED) {
      alertText = \`Good News!\\n\\nHello \${applicant.fullName},\\n\\nYou have been shortlisted.\\n\\nStatus: Shortlisted\\nNote: "\${reviewNote}"\\n\\nWe will notify you when an interview is scheduled.\`;
    } else if (newStatus === ApplicationStatus.INTERVIEW_SCHEDULED) {
      const formattedDate = interviewDate ? new Date(interviewDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'To Be Decided';
      alertText = \`Interview Scheduled!\\n\\nHello \${applicant.fullName},\\n\\nAn interview has been scheduled for you.\\n\\nStatus: Interview Scheduled\\nTime: \${formattedDate}\\nLocation: Ministry Office, Gaborone\\nNote: "\${reviewNote}"\\n\\nPlease bring original copies of your documents.\`;
    } else if (newStatus === ApplicationStatus.REJECTED) {
      alertText = \`Application Update\\n\\nHello \${applicant.fullName},\\n\\nWe regret to inform you that your application was not successful this time.\\n\\nStatus: Not Selected\\nReason: "\${reviewNote}"\\n\\nThank you for applying.\`;
    }

    const updateMsg: WhatsAppMessage = {
      id: \`m-upd-\${Date.now()}\`,
      sender: 'bot',
      text: alertText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, updateMsg]);
  };

  const handleSendWhatsAppMessage = (text: string) => {
    const userMsg: WhatsAppMessage = {
      id: \`u-\${Date.now()}\`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const cleanText = text.trim().toUpperCase();
      let replyText = '';

      if (cleanText === 'STATUS' || cleanText === 'CHECK STATUS') {
        const matched = applicants.find(a => a.omangNumber === activeTrackOmang);
        if (matched) {
          replyText = \`Profile Found\\n\\nHello \${matched.fullName}!\\n\\nSubject: \${matched.vacancySubject}\\nStatus: \${matched.status.replace(/_/g, " ")}\\n\\nYou can log in to the website to see more details.\`;
        } else {
          replyText = \`We could not find an active session.\\n\\nPlease enter your 9-digit ID number to check your status.\`;
        }
      } else if (/^[1-2]\\d{8}$/.test(cleanText)) {
        const matched = applicants.find(a => a.omangNumber === cleanText);
        if (matched) {
          replyText = \`Record Found\\n\\nName: \${matched.fullName}\\nPosition: \${matched.vacancySubject}\\nRegion: \${matched.preferredRegion}\\nStatus: \${matched.status.replace(/_/g, " ")}\`;
        } else {
          replyText = \`Sorry, ID "\${text}" is not in our system.\\n\\nPlease register on the website first.\`;
        }
      } else {
        replyText = \`Hello! I did not understand that.\\n\\nPlease send:\\n• 'STATUS' to check your application\\n• Your 9-digit ID to view details\`;
      }

      const botMsg: WhatsAppMessage = {
        id: \`b-auto-\${Date.now()}\`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    }, 650);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white shadow border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
               <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/de/Coat_of_arms_of_Botswana.svg"
                  alt="Coat of arms"
                  className="h-12 w-auto"
                  referrerPolicy="no-referrer"
                />
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight font-display">
                Teacher Registry System
              </h1>
              <p className="text-sm text-slate-500">Ministry of Education, Botswana</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
               <button 
                onClick={() => setRole('applicant')}
                className={\`px-4 py-2 rounded-md text-sm font-semibold transition-colors \${role === 'applicant' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}\`}
              >
                For Teachers
              </button>
              <button 
                onClick={() => setRole('school')}
                className={\`px-4 py-2 rounded-md text-sm font-semibold transition-colors \${role === 'school' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}\`}
              >
                For Schools
              </button>
              <button 
                onClick={() => setRole('admin')}
                className={\`px-4 py-2 rounded-md text-sm font-semibold transition-colors \${role === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}\`}
              >
                For Ministry
              </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2670&auto=format&fit=crop" 
            alt="Students in classroom" 
            className="w-full h-full object-cover opacity-40 brightness-75"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center flex flex-col items-center justify-center min-h-[40vh]">
          <div className="max-w-3xl text-white space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-display">
              Connect teachers with <span className="text-blue-300">schools seamlessly.</span>
            </h2>
            <p className="text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto opacity-90 font-sans">
              A straightforward platform to apply for positions, list school vacancies, and manage placements across regions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button 
                onClick={() => setRole('applicant')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Application
              </button>
              <button 
                onClick={() => setRole('school')}
                className="px-8 py-3 bg-white hover:bg-slate-100 text-blue-900 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                View Vacancies
              </button>
            </div>
          </div>
          
          <div className="w-full max-w-4xl mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
             <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                 <h3 className="text-slate-500 font-semibold uppercase tracking-wide text-xs">Total Placements</h3>
                 <p className="text-4xl font-black text-blue-700 my-2 font-display">1,240</p>
                 <span className="text-sm font-medium text-slate-500">Teachers</span>
             </div>
             <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                 <h3 className="text-slate-500 font-semibold uppercase tracking-wide text-xs">Available Vacancies</h3>
                 <p className="text-4xl font-black text-blue-700 my-2 font-display">42</p>
                 <span className="text-sm font-medium text-slate-500">Across 14 Regions</span>
             </div>
             <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                 <h3 className="text-slate-500 font-semibold uppercase tracking-wide text-xs">Avg. Response Time</h3>
                 <p className="text-4xl font-black text-blue-700 my-2 font-display">2 Days</p>
                 <span className="text-sm font-medium text-slate-500">Fast & Efficient</span>
             </div>
          </div>
        </div>
      </section>

      {/* Main Content Areas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            />
          )}
          {role === 'admin' && (
            <AdminPortal 
              applicants={applicants}
              setApplicants={setApplicants}
              vacancies={vacancies}
              setVacancies={setVacancies}
              placements={placements}
              setPlacements={setPlacements}
              onUpdateApplicantStatus={handleUpdateApplicantStatus}
              onSendMessage={handleSendWhatsAppMessage}
            />
          )}
      </main>

      {/* Chat Section */}
      <div className="max-w-3xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 flex items-center border-b border-slate-200">
            <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
            <h3 className="text-sm font-bold text-slate-800">Direct Support Line</h3>
          </div>
          
          <div className="p-6 max-h-[300px] overflow-y-auto space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={\`p-4 rounded-xl border max-w-[85%] shadow-sm \${
                    msg.sender === 'bot' 
                      ? 'bg-white border-slate-200 text-slate-800' 
                      : 'bg-blue-600 border-blue-600 text-white ml-auto'
                  }\`}
                >
                  <span className={\`text-xs font-semibold \${msg.sender === 'bot' ? 'text-slate-500' : 'text-blue-100'}\`}>
                    {msg.sender === 'bot' ? 'Support System' : 'You'}
                  </span>
                  <p className="whitespace-pre-line mt-1 text-sm">{msg.text}</p>
                  <span className={\`block text-[10px] mt-2 \${msg.sender === 'bot' ? 'text-slate-400' : 'text-blue-200'}\`}>
                    {msg.timestamp}
                  </span>
                </div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-sm font-medium tracking-wide">&copy; {new Date().getFullYear()} Ministry of Education and Skills Development, Botswana.</p>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">Providing a fast and reliable recruitment service for educators nationwide.</p>
        </div>
      </footer>

    </div>
  );
}
`;
fs.writeFileSync('./src/App.tsx', appContent);
