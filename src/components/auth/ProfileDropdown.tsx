import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, Settings, LogOut, ChevronDown, User, ShieldAlert, Check, 
  Sparkles, Mail, Lock, Volume2, Moon, Sun, Eye, Image, Trash 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType, UserNotification } from '../../types';

interface ProfileDropdownProps {
  currentUser: UserType;
  onUpdateUser: (fields: Partial<UserType>) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
];

const INITIAL_NOTIFICATIONS: UserNotification[] = [
  {
    id: "notif-1",
    title: "Welcome to Botswana Teacher Registry",
    message: "Your account is active. Complete your profile details to finish integration.",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    isRead: false,
    type: "info"
  },
  {
    id: "notif-2",
    title: "Directory Security Verified",
    message: "Security questions registered successfully.",
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    isRead: false,
    type: "success"
  }
];

export default function ProfileDropdown({ currentUser, onUpdateUser, onLogout, darkMode, onToggleDarkMode }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'menu' | 'notif' | 'settings' | 'avatar'>('menu');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load / Store Notifications in localStorage
  const [notifications, setNotifications] = useState<UserNotification[]>(() => {
    const saved = localStorage.getItem(`moesd_notif_${currentUser.id}`);
    if (saved) return JSON.parse(saved);
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem(`moesd_notif_${currentUser.id}`, JSON.stringify(notifications));
  }, [notifications, currentUser.id]);

  // Click outside to close helper
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDismissNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const selectAvatar = (url: string) => {
    onUpdateUser({ avatarUrl: url });
    setActiveSubTab('menu');
    
    // Push feedback notification
    const newNotif: UserNotification = {
      id: "notif-" + Math.floor(1000 + Math.random() * 9000),
      title: "Avatar Updated",
      message: "Your official dashboard profile image has been successfully modified.",
      timestamp: new Date().toISOString(),
      isRead: false,
      type: "success"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Helper for Initials Avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Capsule Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setActiveSubTab('menu');
        }}
        className="flex items-center gap-2 bg-slate-50 hover:bg-white dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 rounded-full pl-2 pr-4 py-1.5 transition-all text-left shadow-sm outline-none cursor-pointer group"
      >
        <div className="relative">
          {currentUser.avatarUrl ? (
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.fullName}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-800 group-hover:border-slate-300"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-sky-400 text-white font-extrabold text-xs flex items-center justify-center border border-sky-455 group-hover:scale-105 transition-transform">
              {getInitials(currentUser.fullName)}
            </div>
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-black text-[9px] font-black text-white flex items-center justify-center animate-subtle">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="hidden md:block">
          <p className="text-xs font-bold text-slate-800 group-hover:text-slate-950 dark:text-slate-200 dark:group-hover:text-white leading-none truncate max-w-[120px] transition-colors">
            {currentUser.fullName}
          </p>
          <span className="text-[10px] text-slate-405 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-305 font-semibold capitalize mt-1 block transition-colors">
            {currentUser.salaryScale ? `${currentUser.salaryScale} Scale` : 'Standard User'}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-all ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Panel Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-[calc(100vw-32px)] sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[100] text-sm text-slate-700 dark:text-slate-300"
          >
            
            {/* Context Navigation bar */}
            <div className="flex bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 p-1">
              <button
                onClick={() => setActiveSubTab('menu')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeSubTab === 'menu' || activeSubTab === 'avatar'
                    ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-xs border border-sky-700/20 dark:border-sky-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveSubTab('notif')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all relative ${
                  activeSubTab === 'notif' 
                    ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-xs border border-sky-700/20 dark:border-sky-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                Inbox 
                {unreadCount > 0 && (
                  <span className={`ml-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase transition-all ${
                    activeSubTab === 'notif' ? 'bg-white text-sky-600' : 'bg-red-500 text-white'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveSubTab('settings')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeSubTab === 'settings' 
                    ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-xs border border-sky-700/20 dark:border-sky-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                Preferences
              </button>
            </div>

            {/* TAB: Main dropdown settings menu */}
            {activeSubTab === 'menu' && (
              <div className="p-4 space-y-4">
                {/* Profile Overview */}
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <div className="relative group cursor-pointer" onClick={() => setActiveSubTab('avatar')}>
                    {currentUser.avatarUrl ? (
                      <img 
                        src={currentUser.avatarUrl} 
                        alt={currentUser.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-800 group-hover:brightness-75 transition-all"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-sky-400 text-white font-extrabold text-sm flex items-center justify-center border border-sky-400 group-hover:brightness-90 transition-all">
                        {getInitials(currentUser.fullName)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-bold transition-opacity">
                      <span>Edit</span>
                    </div>
                  </div>
                  
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-900 dark:text-slate-105 truncate leading-tight">{currentUser.fullName}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                    <span className="inline-block mt-1 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-450 text-[10px] px-2 py-0.5 rounded font-black uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                {/* Switch list */}
                <div className="space-y-1">
                  <button
                    onClick={onToggleDarkMode}
                    type="button"
                    className="w-full flex items-center justify-between px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-semibold cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-violet-500" />}
                      <span>{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase">
                      {darkMode ? 'Active' : 'Inactive'}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('avatar')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-semibold"
                  >
                    <Image className="w-4 h-4 text-slate-400" />
                    <span>Change Profile Image</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('notif')}
                    className="w-full flex-row flex items-center justify-between px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-semibold"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-slate-400" />
                      <span>Notifications Inbox</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 rounded px-1.5 py-0.5 text-[9px] text-white font-black">
                        {unreadCount} NEW
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveSubTab('settings')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-semibold"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>
                </div>

                {/* Quick signout */}
                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-red-650 hover:text-red-700 hover:bg-red-500/5 rounded-xl transition-all font-bold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout Account</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Select Avatar presets */}
            {activeSubTab === 'avatar' && (
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <h4 className="font-bold text-xs text-slate-500 uppercase">Choose Profile Avatar</h4>
                  <button onClick={() => setActiveSubTab('menu')} className="text-[10px] font-bold text-sky-600 hover:underline">Back</button>
                </div>

                <div className="grid grid-cols-4 gap-2.5 py-2">
                  {DEFAULT_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => selectAvatar(url)}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all hover:scale-105 ${
                        currentUser.avatarUrl === url ? 'border-sky-500 shadow-md scale-95' : 'border-transparent hover:border-slate-205'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {currentUser.avatarUrl === url && (
                        <div className="absolute inset-0 bg-sky-500/20 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white bg-sky-600 rounded-full p-0.5" />
                        </div>
                      )}
                    </button>
                  ))}
                  
                  {/* Remove Avatar Button */}
                  {currentUser.avatarUrl && (
                    <button
                      onClick={() => selectAvatar('')}
                      className="rounded-xl border border-dashed border-red-200 dark:border-red-800 aspect-square flex flex-col items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/10 text-red-500 transition-all text-[9.5px] font-bold"
                      title="Remove profile image"
                    >
                      <Trash className="w-4 h-4" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 italic leading-snug">
                  Choose an optimized official preset avatar to complete directory image alignment.
                </p>
              </div>
            )}

            {/* TAB: Notifications list inside dropdown */}
            {activeSubTab === 'notif' && (
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-500 uppercase">Notifications Hub</h4>
                    {unreadCount > 0 && (
                      <span className="bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 text-[9px] px-1.5 py-0.5 font-bold rounded">
                        {unreadCount} NEW
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead} 
                      className="text-[10px] font-black text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-xs">No notifications yet.</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-2.5 border rounded-xl relative transition-all ${
                          notif.isRead 
                            ? 'bg-slate-50/20 dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-70' 
                            : 'bg-sky-500/5 dark:bg-sky-950/15 border-sky-500/10 dark:border-sky-800/40 ring-1 ring-sky-500/5'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <h5 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[170px]">
                            {notif.title}
                          </h5>
                          <button 
                            onClick={() => handleDismissNotif(notif.id)} 
                            className="text-[11px] text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-0.5 rounded cursor-pointer shrink-0"
                            title="Dismiss notification"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mt-1">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-slate-400 block mt-1.5 text-right font-medium">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Settings preferences */}
            {activeSubTab === 'settings' && (
              <div className="p-4 space-y-4">
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <h4 className="font-bold text-xs text-slate-500 uppercase">Preferences & Security</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-500 uppercase tracking-widest text-[9px]">Backup Email Address</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={currentUser.backupEmail || ''}
                        onChange={(e) => onUpdateUser({ backupEmail: e.target.value })}
                        placeholder="e.g., mail@backup.com"
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/65 pt-2.5">
                    <label className="block font-bold text-slate-500 uppercase tracking-widest text-[9px]">System Options</label>
                    
                    <button
                      onClick={onToggleDarkMode}
                      type="button"
                      className="w-full flex items-center justify-between py-1.5 text-left font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-2 rounded-lg transition-colors outline-none cursor-pointer"
                    >
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Theme Mode</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{darkMode ? 'Dark' : 'Light'}</span>
                        {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                      </div>
                    </button>

                    <div className="flex items-center justify-between py-1.5 px-2">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Notifications Audio</span>
                      <Volume2 className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="flex items-center justify-between py-1.5 px-2">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Secure Recovery Login</span>
                      <ShieldAlert className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 italic text-center pt-2 leading-tight">
                    Settings synchronized with Botswana National Active Teacher Network directories.
                  </p>
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
