import fs from 'fs';

const filePath = './src/components/SchoolPortal.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(/bg-white\/40 dark:bg-slate-950\/30/g, 'bg-[#0a0f1c]/60 backdrop-blur-3xl');
content = content.replace(/border-slate-200\/60 dark:border-slate-800/g, 'border-white/10');
content = content.replace(/border-slate-150 dark:border-slate-800/g, 'border-white/10');
content = content.replace(/text-slate-850 dark:text-white/g, 'text-white');
content = content.replace(/text-slate-850 dark:text-slate-100/g, 'text-white');

fs.writeFileSync(filePath, content, 'utf-8');
