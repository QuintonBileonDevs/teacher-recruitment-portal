import fs from 'fs';

const filePath = './src/App.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const heroSearchString = `        {/* Immersive Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 relative w-full flex flex-col items-center justify-center min-h-[45vh]">`;

const heroReplacement = `        {/* Immersive Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 relative w-full flex flex-col items-center justify-center min-h-[50vh] overflow-hidden shadow-[0_30px_60px_rgba(0,174,239,0.1)]">
          {/* Stunning Background Visual */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop" 
              alt="Space and Earth" 
              className="w-full h-full object-cover filter brightness-[0.7] dark:brightness-[0.4] saturate-150"
              referrerPolicy="no-referrer"
            />
            {/* Blend overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/50 to-slate-50 dark:via-[#030712]/70 dark:to-slate-950"></div>
            <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">`;

content = content.replace(heroSearchString, heroReplacement);

// We need to fix the text color in light mode to look premium with the background
content = content.replace(
  `text-slate-900 dark:text-white drop-shadow-2xl">
                Orchestrating Educational <br />`,
  `text-white drop-shadow-[0_0_20px_rgba(0,174,239,0.5)]">
                Orchestrating Educational <br />`
);

content = content.replace(
  `className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light"`,
  `className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md"`
);

// We should also replace the main header to not conflict with the dark background
// \`sticky top-4 z-40 mx-4 sm:mx-8 xl:mx-auto max-w-7xl rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]\` -> make it ultra-dark sci-fi
content = content.replace(
  `sticky top-4 z-40 mx-4 sm:mx-8 xl:mx-auto max-w-7xl rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40`,
  `sticky top-4 z-40 mx-4 sm:mx-8 xl:mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-black/50 dark:bg-black/60`
);

// Also remove `text-slate-900 to-slate-500` inside header title
content = content.replace(
  `bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 font-display`,
  `bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-white font-display`
);

fs.writeFileSync(filePath, content, 'utf-8');
