import fs from 'fs';

const filePath = './src/App.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Add import
content = content.replace(
  `import { Applicant, ApplicationStatus, WhatsAppMessage, Vacancy, Placement } from './types';`,
  `import { Applicant, ApplicationStatus, WhatsAppMessage, Vacancy, Placement, User, UserRole } from './types';\nimport AuthPage from './components/auth/AuthPage';`
);

// Add currentUser state
content = content.replace(
  `const [role, setRole] = useState<'applicant' | 'school' | 'admin'>('applicant');`,
  `const [currentUser, setCurrentUser] = useState<User | null>(() => {\n    const saved = localStorage.getItem('moesd_current_user');\n    return saved ? JSON.parse(saved) : null;\n  });\n\n  const role = currentUser?.role === UserRole.TEACHER ? 'applicant' : (currentUser?.role === UserRole.SCHOOL_LEADER ? 'school' : 'admin');\n\n  useEffect(() => {\n    if (currentUser) {\n      localStorage.setItem('moesd_current_user', JSON.stringify(currentUser));\n    } else {\n      localStorage.removeItem('moesd_current_user');\n    }\n  }, [currentUser]);`
);


const authGateStart = `  if (!currentUser) {
    return (
      <div className={darkMode ? 'dark' : ''}>
         <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
         </div>
         <AuthPage onLogin={(u) => setCurrentUser(u)} />
      </div>
    );
  }

  return (`;

content = content.replace(`  return (`, authGateStart);


// Let's modify the header so the Nav bar is replaced by "Logout" button
const headerButtons = `<div className="flex bg-slate-100 dark:bg-slate-800 dark:bg-slate-900 p-1 rounded-lg">
                 <button 
                  onClick={() => setRole('applicant')}
                  className={\`px-4 py-2 rounded-md text-sm font-semibold transition-colors \${role === 'applicant' ? 'bg-white dark:bg-slate-900 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 dark:hover:text-slate-300'}\`}
                >
                  For Teachers
                </button>
                <button 
                  onClick={() => setRole('school')}
                  className={\`px-4 py-2 rounded-md text-sm font-semibold transition-colors \${role === 'school' ? 'bg-white dark:bg-slate-900 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 dark:hover:text-slate-300'}\`}
                >
                  For Schools
                </button>
                <button 
                  onClick={() => setRole('admin')}
                  className={\`px-4 py-2 rounded-md text-sm font-semibold transition-colors \${role === 'admin' ? 'bg-white dark:bg-slate-900 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 dark:hover:text-slate-300'}\`}
                >
                  For Ministry
                </button>
            </div>`;

const userProfileButton = `<div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{currentUser.fullName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.role === UserRole.TEACHER && currentUser.teacherType ? currentUser.teacherType : currentUser.role}</p>
              </div>
              <button 
                onClick={() => setCurrentUser(null)}
                className="px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm font-semibold transition-colors border border-red-200 dark:border-red-800"
              >
                Sign Out
              </button>
            </div>`;
            
content = content.replace(headerButtons, userProfileButton);


// Optional: update the role buttons in the hero section based on current User role
const heroButtons = `<div className="flex flex-wrap justify-center gap-4 pt-4">
              <button 
                onClick={() => setRole('applicant')}
                className="px-8 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Application
              </button>
              <button 
                onClick={() => setRole('school')}
                className="px-8 py-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 text-blue-900 dark:text-blue-300 dark:text-blue-100 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                View Vacancies
              </button>
            </div>`;

const revisedHeroButtons = `<div className="flex flex-wrap justify-center gap-4 pt-4">
              {role === 'applicant' && (
                <button 
                  className="px-8 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                >
                  My Portal
                </button>
              )}
              {role === 'school' && (
                <button 
                  className="px-8 py-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-900 dark:text-blue-300 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                >
                  Manage Vacancies
                </button>
              )}
              {role === 'admin' && (
                <button 
                  className="px-8 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                >
                  Admin Dashboard
                </button>
              )}
            </div>`;
content = content.replace(heroButtons, revisedHeroButtons);

fs.writeFileSync(filePath, content, 'utf-8');
