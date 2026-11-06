import fs from 'fs';

function applyDarkModeClasses(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Common background colors
  content = content.replace(/bg-white([^/a-zA-Z0-9_-])/g, 'bg-white dark:bg-slate-900$1');
  content = content.replace(/bg-slate-50([^/a-zA-Z0-9_-])/g, 'bg-slate-50 dark:bg-slate-950$1');
  content = content.replace(/bg-slate-100([^/a-zA-Z0-9_-])/g, 'bg-slate-100 dark:bg-slate-800$1');

  // Text colors
  content = content.replace(/text-slate-900([^/a-zA-Z0-9_-])/g, 'text-slate-900 dark:text-slate-100$1');
  content = content.replace(/text-slate-800([^/a-zA-Z0-9_-])/g, 'text-slate-800 dark:text-slate-200$1');
  content = content.replace(/text-slate-700([^/a-zA-Z0-9_-])/g, 'text-slate-700 dark:text-slate-300$1');
  content = content.replace(/text-slate-600([^/a-zA-Z0-9_-])/g, 'text-slate-600 dark:text-slate-400$1');
  content = content.replace(/text-slate-500([^/a-zA-Z0-9_-])/g, 'text-slate-500 dark:text-slate-400$1');

  // Borders
  content = content.replace(/border-slate-200([^/a-zA-Z0-9_-])/g, 'border-slate-200 dark:border-slate-800$1');
  content = content.replace(/border-slate-300([^/a-zA-Z0-9_-])/g, 'border-slate-300 dark:border-slate-700$1');
  content = content.replace(/border-slate-100([^/a-zA-Z0-9_-])/g, 'border-slate-100 dark:border-slate-800$1');

  // Specific handling for chat sections, cards, specific buttons
  content = content.replace(/hover:bg-slate-100/g, 'hover:bg-slate-100 dark:hover:bg-slate-800');
  content = content.replace(/bg-blue-50(?!0)/g, 'bg-blue-50 dark:bg-blue-900/30');
  content = content.replace(/hover:bg-blue-100/g, 'hover:bg-blue-100 dark:hover:bg-blue-900/50');
  content = content.replace(/bg-green-50(?!0)/g, 'bg-green-50 dark:bg-green-900/30');
  content = content.replace(/bg-red-50(?!0)/g, 'bg-red-50 dark:bg-red-900/30');
  content = content.replace(/text-blue-900/g, 'text-blue-900 dark:text-blue-100');
  
  fs.writeFileSync(filePath, content, 'utf-8');
}

const filesToTransform = [
  './src/App.tsx',
  './src/components/AdminPortal.tsx',
  './src/components/ApplicantPortal.tsx',
  './src/components/SchoolPortal.tsx',
  './src/components/applicant/ApplicantWelcome.tsx',
  './src/components/applicant/ApplicantRegister.tsx',
  './src/components/applicant/ApplicantTrack.tsx',
  './src/components/admin/AdminAnalytics.tsx',
];

filesToTransform.forEach(filePath => {
  try {
    applyDarkModeClasses(filePath);
    console.log("Transformed", filePath);
  } catch (err) {
    console.warn("Could not transform", filePath);
  }
});
