import fs from 'fs';

const filePath = './src/components/AdminPortal.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace standard tab buttons 
content = content.replace(
  /activeTab === 'teachers'\s*\?\s*'bg-white text-black shadow-sm'\s*:\s*'text-slate-500 hover:bg-white\/10 hover:text-slate-200'/g,
  "activeTab === 'teachers' ? 'bg-[#00AEEF] text-black shadow-[0_0_15px_rgba(0,174,239,0.5)] font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'"
);
content = content.replace(
  /activeTab === 'analytics'\s*\?\s*'bg-white text-black shadow-sm'\s*:\s*'text-slate-500 hover:bg-white\/10 hover:text-slate-200'/g,
  "activeTab === 'analytics' ? 'bg-[#00AEEF] text-black shadow-[0_0_15px_rgba(0,174,239,0.5)] font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'"
);
content = content.replace(
  /activeTab === 'matching'\s*\?\s*'bg-emerald-500 text-black shadow-sm'\s*:\s*'text-emerald-500 hover:bg-emerald-500\/10 hover:text-emerald-400'/g,
  "activeTab === 'matching' ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] font-black' : 'text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300'"
);

fs.writeFileSync(filePath, content, 'utf-8');
