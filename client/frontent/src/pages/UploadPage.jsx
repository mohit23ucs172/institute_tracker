import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function UploadPage() {
  const { user, API_URL } = useAuth();
  
  // State for dynamic committee list (Reflects real-time database changes)
  const [availableCommittees, setAvailableCommittees] = useState([]);
  
  // State for the primary file and meeting details
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [formData, setFormData] = useState({
    committee: '',
    meetingNo: '',
    date: '',
    agenda: ''
  });

  // 1. FRESH FETCH LOGIC: Runs every time the user enters the page
  useEffect(() => {
    const syncPermissions = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };

      try {
        if (user?.role === 'Admin') {
          // Admins see everything in the institutional registry
          const res = await axios.get(`${API_URL}/committees`, { headers });
          setAvailableCommittees(res.data);
        } else {
          // Directors fetch fresh assignments from the /me endpoint
          const res = await axios.get(`${API_URL}/auth/me`, { headers });
          setAvailableCommittees(res.data.assignedCommittees || []);
        }
      } catch (err) {
        console.error("Failed to sync institutional permissions:", err);
      }
    };

    if (user) syncPermissions();
  }, [user, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setStatus({ type: 'error', msg: 'Please select the primary minutes PDF.' });
      return;
    }
    if (!formData.committee || !formData.meetingNo) {
      setStatus({ type: 'error', msg: 'Committee and Meeting Number are required.' });
      return;
    }

    const token = localStorage.getItem('token');
    setStatus({ type: 'loading', msg: 'Archiving documents to relational database...' });

    const data = new FormData();
    data.append('file', file);
    data.append('committee', formData.committee);
    data.append('meetingNo', formData.meetingNo);
    data.append('date', formData.date);
    data.append('agenda', formData.agenda);

    try {
      await axios.post(`${API_URL}/documents`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });

      setStatus({ type: 'success', msg: 'Meeting Archived & Relational Links Created!' });
      
      // Reset Form
      setFile(null);
      setFormData({ committee: '', meetingNo: '', date: '', agenda: '' });
      document.getElementById('file-upload').value = ''; 
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Upload failed';
      setStatus({ type: 'error', msg: `Error: ${errorMsg}` });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-12 rounded-3xl shadow-2xl border border-slate-100">
        
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
            Upload Meeting Minutes
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
            Institutional Archival Interface
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Committee Selection - NOW USING availableCommittees */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">
              Target Entity / Committee
            </label>
            <select 
              value={formData.committee}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
              onChange={(e) => setFormData({...formData, committee: e.target.value})}
              required
            >
              <option value="">-- Choose Target Entity --</option>
              {availableCommittees.map(c => (
                <option key={c._id} value={c.committee_name}>
                  {c.committee_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Meeting No.</label>
              <input 
                type="text" 
                placeholder="e.g. 23" 
                value={formData.meetingNo}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setFormData({...formData, meetingNo: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Date of Meeting</label>
              <input 
                type="date" 
                value={formData.date}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Agenda Summary</label>
            <textarea 
              placeholder="Enter key agenda items here..."
              value={formData.agenda}
              rows="4"
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all resize-none"
              onChange={(e) => setFormData({...formData, agenda: e.target.value})}
            />
          </div>

          <div className="relative group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Primary PDF Minutes</label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all">
              <input 
                type="file" accept=".pdf" className="hidden" id="file-upload"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-3xl block mb-2">📥</span>
                <p className="text-[10px] font-black text-slate-600 uppercase">
                  {file ? file.name : "Select Primary Minutes Document"}
                </p>
              </label>
            </div>
          </div>

          <button 
            type="submit"
            disabled={status.type === 'loading'}
            className="w-full bg-[#0f172a] text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-blue-600 transition-all shadow-2xl shadow-blue-900/20 disabled:opacity-50"
          >
            {status.type === 'loading' ? 'Processing Relational Data...' : 'Submit to Institutional Archive'}
          </button>
        </form>

        {status.msg && (
          <div className={`mt-8 p-5 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest ${
            status.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
          }`}>
            {status.msg}
          </div>
        )}
      </div>
    </div>
  );
}