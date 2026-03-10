import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommitteeList({ 
  committees = [], 
  activeCommittee, 
  onSelect, 
  isMobileOpen, 
  onClose,
  allDocuments = [] // Ensure this is passed from Dashboard
}) {
  const [expandedFolder, setExpandedFolder] = useState(null);

  // LOGIC: Get real meetings from documents for this specific committee
  const getMeetingsForCommittee = (committeeName) => {
    return allDocuments
      .filter(doc => doc.meeting_id?.committee_id?.committee_name === committeeName)
      .map(doc => ({
        id: doc._id,
        label: `Meeting ${doc.meeting_id?.meeting_number} (${new Date(doc.meeting_id?.date).getFullYear()})`,
        rawDate: new Date(doc.meeting_id?.date)
      }))
      // Sort by Year (Newest First)
      .sort((a, b) => b.rawDate - a.rawDate);
  };

  const toggleFolder = (name) => {
    setExpandedFolder(expandedFolder === name ? null : name);
    onSelect(name);
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-400 p-6 overflow-y-auto custom-scrollbar">
      
      <div className="mb-10">
        <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 mb-6 uppercase px-4">Navigation</p>
        <button
          onClick={() => { onSelect('Overview'); if(onClose) onClose(); }}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
            activeCommittee === 'Overview' 
              ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
              : 'hover:bg-slate-800/50'
          }`}
        >
          <span>📊</span> SYSTEM OVERVIEW
        </button>
      </div>

      {/* DYNAMIC COMMITTEE TREE */}
      <div className="flex-1">
        <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 mb-6 uppercase px-4">Your Committees</p>
        <div className="space-y-2">
          {committees.map((name) => {
            const realMeetings = getMeetingsForCommittee(name);
            const isExpanded = expandedFolder === name;

            return (
              <div key={name} className="space-y-1">
                <button
                  onClick={() => toggleFolder(name)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCommittee === name ? 'text-white bg-slate-800/40' : 'hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="opacity-50">{realMeetings.length > 0 ? '📂' : '📁'}</span>
                    {name}
                  </div>
                  <span className={`text-[8px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-10 border-l border-slate-800 overflow-hidden"
                    >
                      {realMeetings.length > 0 ? realMeetings.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => { if(onClose) onClose(); } }
                          className="w-full text-left px-6 py-3 text-[9px] font-bold text-slate-500 hover:text-blue-400 transition-colors relative"
                        >
                          <span className="absolute left-0 top-1/2 w-3 h-1px bg-slate-800"></span>
                          {m.label}
                        </button>
                      )) : (
                        <p className="px-6 py-3 text-[8px] italic text-slate-600">No archives yet</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-72 shrink-0 h-full rounded-3xl overflow-hidden shadow-2xl">{SidebarContent}</aside>
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm z-50 lg:hidden shadow-2xl">{SidebarContent}</motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}