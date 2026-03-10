import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function ReportsPage() {
  const { API_URL } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/documents`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(res.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [API_URL]);

  const filteredReports = filter === 'All' 
    ? reports 
    : reports.filter(r => r.meeting_id?.committee_id?.committee_name === filter);

  // Get unique committee names for the filter dropdown
  const committeeNames = ['All', ...new Set(reports.map(r => r.meeting_id?.committee_id?.committee_name).filter(Boolean))];

  return (
    <div className="relative min-h-screen w-full p-8 overflow-hidden bg-slate-50">
      
      {/* --- CONSISTENT BACKGROUND PARTICLES --- */}
      <div className="absolute inset-0 z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/5 blur-3xl"
            style={{
              width: 400,
              height: 400,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Archival Reports</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Compliance & Meeting History</p>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter by:</label>
            <select 
              className="bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold text-slate-600 outline-none shadow-sm"
              onChange={(e) => setFilter(e.target.value)}
            >
              {committeeNames.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
        </div>

        {/* REPORTS TABLE CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/5">
                  <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Committee</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Meeting</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Date</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Archive Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="4" className="p-20 text-center text-xs font-bold text-slate-400">Loading Archival Data...</td></tr>
                ) : filteredReports.length === 0 ? (
                  <tr><td colSpan="4" className="p-20 text-center text-xs font-bold text-slate-400">No documents found matching this criteria.</td></tr>
                ) : (
                  filteredReports.map((report) => (
                    <motion.tr 
                      key={report._id}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                      className="transition-colors"
                    >
                      <td className="p-6">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                          {report.meeting_id?.committee_id?.committee_name || "N/A"}
                        </span>
                      </td>
                      <td className="p-6 text-sm font-bold text-slate-700">
                        Meeting #{report.meeting_id?.meeting_number || "???"}
                      </td>
                      <td className="p-6 text-xs font-medium text-slate-400">
                        {report.meeting_id?.date ? new Date(report.meeting_id.date).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        }) : "N/A"}
                      </td>
                      <td className="p-6">
                        <a 
                          href={report.file_path} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-black text-[10px] uppercase tracking-widest group"
                        >
                          View PDF 
                          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}