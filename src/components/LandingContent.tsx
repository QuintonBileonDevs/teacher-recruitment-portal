import React from 'react';
import { Shield, Target, Users, Zap, BookOpen, FileText, Search, CheckCircle, Award, Briefcase, Building, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import GovernmentCirculars from './GovernmentCirculars';

export default function LandingContent() {
  return (
    <div className="space-y-24 py-8">
      {/* Now Hiring Regions Government Circulars */}
      <GovernmentCirculars />

      {/* Platform Features */}
      <section>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 font-display mb-4">
            How the System Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A unified digital ecosystem designed to streamline the recruitment, posting, and placement of educational staff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FileText className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
              bgIcon: <FileText className="w-48 h-48 text-sky-50 dark:text-sky-500/10" />,
              title: "Unified Registration",
              desc: "Register securely. Whether you are a permanent teacher, temporary staff, or teacher aide, your complete profile is digitized and ready.",
              accentClass: "hover:border-sky-500/30 hover:shadow-sky-500/10",
              iconBg: "bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-500/20"
            },
            {
              icon: <Search className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
              bgIcon: <Search className="w-48 h-48 text-sky-50 dark:text-sky-500/10" />,
              title: "Transparent Vacancies",
              desc: "Schools can publish current open positions immediately. Teachers have full visibility into regional demand and specific subjects needed.",
              accentClass: "hover:border-sky-500/30 hover:shadow-sky-500/10",
              iconBg: "bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-500/20"
            },
            {
              icon: <Zap className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
              bgIcon: <Zap className="w-48 h-48 text-sky-50 dark:text-sky-500/10" />,
              title: "Automated Placements",
              desc: "Ministry officials track analytics in real-time, making data-driven decisions that cut down placement delays to just days.",
              accentClass: "hover:border-sky-500/30 hover:shadow-sky-500/10",
              iconBg: "bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-500/20"
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group relative bg-white dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 ${feature.accentClass}`}
            >
              <div className="absolute -top-12 -right-12 opacity-50 group-hover:opacity-100 group-hover:-rotate-12 transition-all transform group-hover:scale-110 duration-500 pointer-events-none">
                {feature.bgIcon}
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border shadow-sm transition-colors duration-300 ${feature.iconBg}`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 font-display group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg flex-grow">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust & Security */}
      <section className="bg-slate-900 text-slate-50 border border-slate-800 rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop')] opacity-25 bg-cover bg-center mix-blend-overlay filter grayscale brightness-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-450 font-semibold text-sm mb-6 border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
              <Shield className="w-4 h-4" />
              Secure & Authorized
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-6 leading-tight text-white drop-shadow-sm">
              A Transparent, Trustworthy Educational Infrastructure.
            </h2>
            <p className="text-slate-300 leading-relaxed max-w-lg mb-8 text-lg font-medium">
              The Teacher Registry & Deployment System is directly integrated with Ministry of Child Welfare and Basic Education standards. It eliminates physical paperwork loss, prevents placement duplication, and ensures equitable geographic distribution of teaching talent.
            </p>
            <ul className="space-y-5">
              {[
                "Strict Data Privacy & Encryption",
                "Verified Identity & Credentials",
                "Live Activity Audit Logs for Sub-Regional Officials",
                "Zero Tolerance for Duplicate Placements"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-sky-400" />
                  </div>
                  <span className="text-slate-200 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-4 lg:gap-6 relative">
             {/* Decorative glow behind cards */}
             <div className="absolute inset-0 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none"></div>
             
             <motion.div whileHover={{ y: -5 }} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center shadow-2xl ring-1 ring-white/10 relative z-10 transition-colors hover:bg-slate-800/60 hover:border-sky-500/30">
               <div className="p-3 md:p-4 bg-gradient-to-br from-sky-500/20 to-sky-500/5 rounded-2xl mb-4 border border-sky-500/20 shadow-inner">
                 <Award className="w-8 h-8 md:w-10 md:h-10 text-sky-400" />
               </div>
               <h4 className="text-3xl md:text-4xl font-black text-white tracking-tight">100%</h4>
               <p className="text-sm text-slate-400 mt-1.5 font-medium">Verified Educators</p>
             </motion.div>
             <motion.div whileHover={{ y: -5 }} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center shadow-2xl ring-1 ring-white/10 relative z-10 lg:translate-y-8 transition-colors hover:bg-slate-800/60 hover:border-sky-500/30">
               <div className="p-3 md:p-4 bg-gradient-to-br from-sky-500/20 to-sky-500/5 rounded-2xl mb-4 border border-sky-500/20 shadow-inner">
                 <Target className="w-8 h-8 md:w-10 md:h-10 text-sky-400" />
               </div>
               <h4 className="text-3xl md:text-4xl font-black text-white tracking-tight">Data</h4>
               <p className="text-sm text-slate-400 mt-1.5 font-medium">Placement Engine</p>
             </motion.div>
             <motion.div whileHover={{ y: -5 }} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center shadow-2xl ring-1 ring-white/10 relative z-10 transition-colors hover:bg-slate-800/60 hover:border-sky-500/30">
               <div className="p-3 md:p-4 bg-gradient-to-br from-sky-500/20 to-sky-500/5 rounded-2xl mb-4 border border-sky-500/20 shadow-inner">
                 <Users className="w-8 h-8 md:w-10 md:h-10 text-sky-400" />
               </div>
               <h4 className="text-3xl md:text-4xl font-black text-white tracking-tight">5+</h4>
               <p className="text-sm text-slate-400 mt-1.5 font-medium">Supported Roles</p>
             </motion.div>
             <motion.div whileHover={{ y: -5 }} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center shadow-2xl ring-1 ring-white/10 relative z-10 lg:translate-y-8 transition-colors hover:bg-slate-800/60 hover:border-sky-500/30">
               <div className="p-3 md:p-4 bg-gradient-to-br from-sky-500/20 to-sky-500/5 rounded-2xl mb-4 border border-sky-500/20 shadow-inner">
                 <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-sky-400" />
               </div>
               <h4 className="text-3xl md:text-4xl font-black text-white tracking-tight">National</h4>
               <p className="text-sm text-slate-400 mt-1.5 font-medium">School Coverage</p>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Info Sections for Roles */}
      <section className="pb-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 font-display mb-4">
            Built For Every Educator
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Our platform provides tailored dashboards depending on your organizational role.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <motion.div whileHover={{ y: -5 }} className="group relative bg-white dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                <Briefcase className="w-48 h-48 -mr-12 -mt-12 text-sky-600" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-sky-50 dark:bg-sky-500/10 rounded-2xl flex items-center justify-center mb-8 border border-sky-100 dark:border-sky-500/20 shadow-sm text-sky-600 dark:text-sky-400">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 font-display group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">For Teachers & Applicants</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-lg flex-grow">
                  Whether you are a newly graduated temporary teacher or looking for a permanent transfer, the portal allows you to build your profile, apply directly to schools, and track your application statuses in real-time.
                </p>
                <div className="flex items-center text-sky-600 dark:text-sky-400 font-semibold group-hover:gap-3 gap-2 transition-all mt-auto">
                  <span>Explore Teacher Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
           </motion.div>
           <motion.div whileHover={{ y: -5 }} className="group relative bg-white dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                <Building className="w-48 h-48 -mr-12 -mt-12 text-emerald-600" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-100 dark:border-emerald-500/20 shadow-sm text-emerald-600 dark:text-emerald-400">
                  <Building className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 font-display group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">For Schools & Officials</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-lg flex-grow">
                  Schoolheads and officials can approve vacancies and manage shortlisting efficiently. Regional officials have an eagle-eye view of staffing needs to balance the educational ecosystem nationwide.
                </p>
                <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold group-hover:gap-3 gap-2 transition-all mt-auto">
                  <span>Explore School Tools</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
           </motion.div>
        </div>
      </section>
    </div>
  );
}
