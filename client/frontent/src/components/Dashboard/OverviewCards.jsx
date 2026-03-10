import React from 'react';
import { motion } from 'framer-motion';

export default function OverviewCards({ documents, committees }) {
  // Logic to calculate stats
  const totalDocs = documents.length;
  const recentUploads = documents.filter(doc => {
    const docDate = new Date(doc.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return docDate > sevenDaysAgo;
  }).length;

  const stats = [
    { label: 'Total Documents', value: totalDocs, icon: '📂', color: 'text-blue-600' },
    { label: 'Committees', value: committees.length, icon: '🏛️', color: 'text-indigo-600' },
    { label: 'New This Week', value: recentUploads, icon: '✨', color: 'text-emerald-600' },
    { label: 'System Status', value: 'Online', icon: '📡', color: 'text-slate-600' },
  ];

  return (
    <div className="p-8 w-full overflow-y-auto bg-slate-50/50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4"
          >
            <div className="text-3xl p-3 bg-slate-50 rounded-2xl">{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ACTIVITY CHART REPLACEMENT (CSS BARS) */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 text-center">
          Document Distribution by Committee
        </h3>
        <div className="space-y-6">
          {committees.map((comm) => {
            const count = documents.filter(d => d.meeting_id?.committee_id?.committee_name === comm).length;
            const percentage = totalDocs > 0 ? (count / totalDocs) * 100 : 0;

            return (
              <div key={comm} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>{comm}</span>
                  <span>{count} Files</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}