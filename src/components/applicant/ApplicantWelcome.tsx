import React from 'react';
import { ChevronRight, FileText, Search } from 'lucide-react';

import { User, TeacherType } from '../../types';

export default function ApplicantWelcome({ 
  setView, 
  currentUser 
}: { 
  setView: (view: any) => void;
  currentUser?: User;
}) {
  const isAide = currentUser && (
    currentUser.teacherType === TeacherType.PERMANENT_TEACHER_AIDE || 
    currentUser.teacherType === TeacherType.NEWLY_EMPLOYED_TEACHER_AIDE || 
    currentUser.teacherType === TeacherType.TEMPORARY_TEACHER_AIDE
  );

  return (
    <div className="space-y-6">
      <div className="bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-850 rounded-xl p-6 relative overflow-hidden">
        <h2 className="text-2xl font-bold text-sky-900 dark:text-sky-100 mb-2 flex items-center flex-wrap gap-2">
          Welcome, {currentUser?.fullName || 'Teacher'}
          {currentUser && !currentUser.profileCompleted && (
            <span className="text-xs font-black px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
              ⚠️ Profile Incomplete
            </span>
          )}
          {currentUser?.profileCompleted && (
            <span className="text-xs font-black px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-405 border border-emerald-500/20">
              ✓ Profile Verified
            </span>
          )}
        </h2>
        <p className="text-sky-800 dark:text-white text-sm">
          Submit your application to the Ministry to be matched with schools across the country. Make sure you have your Omang card ready.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div 
          onClick={() => setView('register')}
          className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 hover:border-sky-300 p-6 rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="bg-sky-100 w-12 h-12 rounded-lg flex items-center justify-center text-sky-600 dark:text-sky-300 mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1">New Application</h3>
          <p className="text-sm text-slate-500 dark:text-white mb-4">Register your qualifications and preferred regions.</p>
          <div className="text-sky-600 dark:text-sky-305 text-sm font-semibold flex items-center gap-1">
            Start Form <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => setView('track')}
          className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 hover:border-sky-300 p-6 rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="bg-slate-100 dark:bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 mb-4 group-hover:scale-110 transition-transform">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1">Track Application</h3>
          <p className="text-sm text-slate-500 dark:text-white mb-4">View the status of an existing application using your ID.</p>
          <div className="text-sky-600 dark:text-sky-305 text-sm font-semibold flex items-center gap-1">
            Check Status <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {currentUser?.profileCompleted && (
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">National Teacher Registry & Deployment Profile</h3>
            <p className="text-xs text-slate-400">Verified official record from Ministry of Child Welfare and Basic Education database</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Col 1: Identity & Demographics */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-sky-600 dark:text-sky-400 tracking-wider border-b border-sky-50 dark:border-sky-900/10 pb-1">Demographics & Identity</h4>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="grid grid-cols-2">
                  <span className="font-medium text-slate-400">National ID (Omang):</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">{currentUser.omangNumber || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium text-slate-400">Date of Birth:</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">
                    {currentUser.dob ? new Date(currentUser.dob).toLocaleDateString([], { dateStyle: 'medium' }) : 'Not provided'}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium text-slate-400">Gender:</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">{currentUser.gender || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium text-slate-400">Primary Contact:</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">{currentUser.phoneNumber || 'Not provided'}</span>
                </div>
                {currentUser.alternativePhone && (
                  <div className="grid grid-cols-2">
                    <span className="font-medium text-slate-400">Alternative Contact:</span>
                    <span className="font-semibold text-slate-850 dark:text-slate-200">{currentUser.alternativePhone}</span>
                  </div>
                )}
                {currentUser.contactAddress && (
                  <div className="grid grid-cols-2">
                    <span className="font-medium text-slate-400">Physical Address:</span>
                    <span className="font-semibold text-slate-850 dark:text-slate-200">{currentUser.contactAddress}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Col 2: Service & Station Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider border-b border-indigo-50 dark:border-indigo-900/10 pb-1">
                {currentUser.teacherType === TeacherType.TEMPORARY ? 'Temporary Contract Credentials' : isAide ? 'Aide Service Credentials' : 'Service & Placement Credentials'}
              </h4>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                <div className="grid grid-cols-2">
                  <span className="font-medium text-slate-400">Current Station:</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">{currentUser.schoolName || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium text-slate-400">Grade / Education Category:</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">{currentUser.schoolLevel || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium text-slate-400">Accredited Degree:</span>
                  <span className="font-semibold text-slate-855 dark:text-slate-200">{currentUser.highestQualification || 'Not provided'}</span>
                </div>

                {/* Only display for non-aides (Permanent or Temporary standard teachers) */}
                {!isAide && currentUser.subjectSpeciality && (
                  <div className="grid grid-cols-2">
                    <span className="font-medium text-slate-400">Subject Specialty:</span>
                    <span className="font-semibold text-slate-850 dark:text-slate-200">{currentUser.subjectSpeciality}</span>
                  </div>
                )}

                {/* Specific details for Aides */}
                {isAide && currentUser.aideSpecialty && (
                  <div className="grid grid-cols-2">
                    <span className="font-medium text-slate-400">Aide Focus Area:</span>
                    <span className="font-semibold text-slate-855 dark:text-sky-400">{currentUser.aideSpecialty}</span>
                  </div>
                )}

                {/* Specific details for Temporary staff */}
                {currentUser.teacherType === TeacherType.TEMPORARY && (
                  <>
                    <div className="grid grid-cols-2">
                      <span className="font-medium text-slate-400">Active Contract Status:</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">{currentUser.contractStatus || 'Awaiting Placement'}</span>
                    </div>
                    {currentUser.contractEndDate && (
                      <div className="grid grid-cols-2">
                        <span className="font-medium text-slate-400">Contract End Date:</span>
                        <span className="font-semibold text-slate-500 dark:text-white">
                          {new Date(currentUser.contractEndDate).toLocaleDateString([], { dateStyle: 'medium' })}
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-2">
                      <span className="font-medium text-slate-400">Preferred Term Length:</span>
                      <span className="font-semibold text-slate-850 dark:text-slate-200">{currentUser.preferredContractDuration || 'Not provided'}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium text-slate-400">Availability:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currentUser.availabilityStatus || 'Immediate'}</span>
                    </div>
                  </>
                )}

                {/* Permanent teacher specific dates */}
                {currentUser.teacherType !== TeacherType.TEMPORARY && !isAide && (
                  <>
                    {currentUser.currentPosition && (
                      <div className="grid grid-cols-2">
                        <span className="font-medium text-slate-400">Current Position:</span>
                        <span className="font-semibold text-sky-605 dark:text-sky-400">{currentUser.currentPosition}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2">
                      <span className="font-medium text-slate-400">First Appointment:</span>
                      <span className="font-semibold text-slate-855 dark:text-slate-200">
                        {currentUser.dateOfFirstAppointment ? new Date(currentUser.dateOfFirstAppointment).toLocaleDateString([], { dateStyle: 'medium' }) : 'Not provided'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium text-slate-400">Date into Current School:</span>
                      <span className="font-semibold text-slate-855 dark:text-slate-200">
                        {currentUser.dateIntoCurrentSchool ? new Date(currentUser.dateIntoCurrentSchool).toLocaleDateString([], { dateStyle: 'medium' }) : 'Not provided'}
                      </span>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2">
                  <span className="font-medium text-slate-400">{isAide ? 'Prior Experience:' : 'Classroom Experience:'}</span>
                  <span className="font-semibold text-slate-855 dark:text-slate-200">{currentUser.experienceYears || 0} Years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Previous Schools history */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Historical Service History (Previous Schools)</h4>
            {currentUser.previousSchools && currentUser.previousSchools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {currentUser.previousSchools.map((sch, index) => (
                  <div key={index} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-100 mb-1">{sch.schoolName}</p>
                    <div className="flex gap-4 font-semibold text-slate-500 dark:text-slate-400">
                      <span>📅 {sch.fromYear} — {sch.toYear}</span>
                      <span>👤 {sch.roleHeld}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No previous school educational services logged.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
