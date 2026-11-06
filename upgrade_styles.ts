import fs from 'fs';

const files = [
  './src/components/AdminPortal.tsx',
  './src/components/SchoolPortal.tsx'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace background blocks
  content = content.replace(/bg-slate-50\/50 dark:bg-slate-950\/45/g, 'bg-[#0a0f1c]/60 backdrop-blur-3xl');
  content = content.replace(/bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/g, 'bg-[#0a0f1c]/80 backdrop-blur-3xl border border-white/10');
  content = content.replace(/bg-white dark:bg-slate-950/g, 'bg-[#030712]/50 backdrop-blur-2xl');
  content = content.replace(/bg-slate-50 dark:bg-slate-950/g, 'bg-[#0a0f1c]/50 backdrop-blur-xl');
  content = content.replace(/bg-slate-100 dark:bg-slate-900/g, 'bg-white/5 border border-white/5');
  content = content.replace(/bg-slate-100 dark:bg-slate-800/g, 'bg-white/10');
  content = content.replace(/bg-slate-800 dark:bg-slate-100/g, 'bg-white text-black');
  
  // Replace borders
  content = content.replace(/border border-slate-200\/60 dark:border-slate-800\/85/g, 'border border-white/10');
  content = content.replace(/border-slate-200 dark:border-slate-800/g, 'border-white/10');
  content = content.replace(/border-slate-100 dark:border-slate-800/g, 'border-white/5');

  // Replace colors
  content = content.replace(/text-slate-900 dark:text-white/g, 'text-white drop-shadow-md');
  content = content.replace(/text-slate-800 dark:text-slate-100/g, 'text-white');
  content = content.replace(/text-slate-700 dark:text-slate-300/g, 'text-slate-200');
  content = content.replace(/text-slate-600 dark:text-slate-400/g, 'text-slate-300');
  content = content.replace(/text-slate-500 dark:text-slate-400/g, 'text-slate-400');
  content = content.replace(/text-slate-400 dark:text-slate-500/g, 'text-slate-500');

  // Replace buttons
  content = content.replace(/bg-blue-700 hover:bg-blue-800 text-white/g, 'bg-gradient-to-r from-[#00AEEF] to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white transition-all duration-300 shadow-[0_0_20px_rgba(0,174,239,0.4)]');
  content = content.replace(/bg-[#00AEEF] hover:bg-sky-500 text-white/g, 'bg-gradient-to-r from-[#00AEEF] to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white transition-all duration-300 shadow-[0_0_20px_rgba(0,174,239,0.4)]');
  content = content.replace(/bg-emerald-600 hover:bg-emerald-700 text-white/g, 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-extrabold transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]');
  
  // Tab buttons
  content = content.replace(/rounded-lg/g, 'rounded-xl');
  content = content.replace(/rounded-2xl/g, 'rounded-[2rem]');
  content = content.replace(/rounded-full bg-slate-200 dark:bg-slate-700/g, 'rounded-full bg-white/10');

  // Input styling
  content = content.replace(/bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/g, 'bg-[#030712]/50 border border-white/10 text-white backdrop-blur-xl focus:border-[#00AEEF]');

  // Drop shadows
  content = content.replace(/shadow-sm/g, 'shadow-[0_0_30px_rgba(0,174,239,0.05)]');

  fs.writeFileSync(filePath, content, 'utf-8');
});
console.log('Successfully upgraded styling for Portals');
