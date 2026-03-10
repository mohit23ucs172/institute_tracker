import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// We default props to empty arrays to prevent "Cannot read property filter of undefined"
export default function SummaryDashboard({ documents = [], userCommittees = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // 1. FILTER LOGIC: Robust searching
  const filteredDocs = documents.filter(doc => {
    const searchStr = searchQuery.toLowerCase();
    
    // Safety check: ensure the nested properties exist before calling toLowerCase()
    const committeeName = doc.meeting_id?.committee_id?.committee_name?.toLowerCase() || "";
    const meetingNum = doc.meeting_id?.meeting_number?.toString() || "";
    const meetingDate = doc.meeting_id?.date || "";

    return (
      meetingNum.includes(searchStr) ||
      committeeName.includes(searchStr) ||
      meetingDate.includes(searchStr)
    );
  });

  const stats = [
    { label: 'Total Archives', value: documents.length, icon: '📂', color: 'text-blue-600' },
    { label: 'Matches Found', value: filteredDocs.length, icon: '🔍', color: 'text-indigo-600' },
    { label: 'My Committees', value: userCommittees.length, icon: '🏛️', color: 'text-emerald-600' },
  ];

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none">System Summary</h1>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-3">Cross-Committee Intelligence</p>
        </div>

        <div className="relative w-full max-w-md group">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">🔍</span>
          <input 
            type="text" 
            placeholder="Search by meeting # or committee..."
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-2rem shadow-sm border border-slate-100 flex items-center space-x-6"
          >
            <div className="text-3xl p-5 bg-slate-50 rounded-2xl">{stat.icon}</div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SEARCH RESULTS LIST */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Database Entry Log</h3>
          <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase">Real-time Sync</span>
        </div>
        
        <div className="divide-y divide-slate-50 max-h-500px overflow-y-auto custom-scrollbar">
          <AnimatePresence mode='popLayout'>
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <motion.div 
                  key={doc._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 flex items-center justify-between hover:bg-blue-50/30 transition-all group cursor-default"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 font-black text-sm group-hover:scale-110 transition-transform">
                      #{doc.meeting_id?.meeting_number || 'N/A'}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                        {doc.meeting_id?.committee_id?.committee_name || 'General Committee'}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        Archived • {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                  </div>
                  <a 
                    href={doc.file_path} 
                    target="_blank" 
                    rel="noreferrer"
                    className="opacity-0 group-hover:opacity-100 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200"
                  >
                    View Document
                  </a>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-32 text-center"
              >
                <div className="text-4xl mb-4 opacity-20">📂</div>
                <p className="text-xs font-black text-slate-300 uppercase tracking-[0.4em]">No matching archives located</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}