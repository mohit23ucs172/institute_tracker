import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPanel() {
  const { API_URL } = useAuth();
  const [committees, setCommittees] = useState([]);
  const [users, setUsers] = useState([]); // State for personnel
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch Data (Committees and Users)
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };

      const [commRes, userRes] = await Promise.all([
        axios.get(`${API_URL}/committees`, { headers }),
        axios.get(`${API_URL}/users`, { headers }) // Ensure this route exists on backend
      ]);

      setCommittees(commRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  useEffect(() => {
    if (API_URL) fetchData();
  }, [API_URL]);

  // 2. Create Committee
  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/committees`, 
        { committee_name: name, description: desc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName(''); setDesc('');
      fetchData();
      alert("Committee Successfully Initialized!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Server Error";
      alert(`Initialization Failed: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Assign Committee to User (The fix for Directors/Viewers)
  const handleAssign = async (userId, committeeId) => {
    if (!committeeId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/users/assign`, 
        { userId, committeeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Permission Granted Successfully!");
      fetchData(); // Refresh to show updated assignments
    } catch (err) {
      alert("Failed to assign committee. Check backend routes.");
    }
  };
const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Viewer' });

// Function to Register New Personnel
const handleAddUser = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const token = localStorage.getItem('token');
    // Ensure this path matches the backend route
    await axios.post(`${API_URL}/users/register`, newUser, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    alert("User Created Successfully!");
    // ... rest of logic
  } catch (err) {
    // This will help you see the REAL error in the alert
    alert(err.response?.data?.message || "Error adding user");
  }
};
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="px-2">
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Admin Console</h2>
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-2">Institutional Entity & Access Management</p>
      </header>

      {/* --- SECTION 1: CREATE COMMITTEE --- */}
      <section className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Register New Committee</h3>
        </div>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Committee Title</label>
            <input 
              className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-blue-500 focus:bg-white transition-all"
              placeholder="e.g. Building Works Committee"
              value={name} onChange={e => setName(e.target.value)} required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Mandate Description</label>
            <input 
              className="w-full p-5 bg-slate-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-blue-500 focus:bg-white transition-all"
              placeholder="Brief administrative purpose..."
              value={desc} onChange={e => setDesc(e.target.value)}
            />
          </div>
          <button 
            disabled={isLoading}
            className={`md:col-span-2 p-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg ${
              isLoading ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Processing...' : 'Initialize Committee Entity'}
          </button>
        </form>
      </section>


<section className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
  <div className="flex items-center gap-3 mb-8">
    <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
    <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Add New Personnel</h3>
  </div>

  <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <input 
      className="p-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-indigo-500"
      placeholder="Full Name"
      value={newUser.name}
      onChange={e => setNewUser({...newUser, name: e.target.value})}
      required
    />
    <input 
      type="email"
      className="p-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-indigo-500"
      placeholder="Email Address"
      value={newUser.email}
      onChange={e => setNewUser({...newUser, email: e.target.value})}
      required
    />
    <input 
      type="password"
      className="p-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-indigo-500"
      placeholder="Initial Password"
      value={newUser.password}
      onChange={e => setNewUser({...newUser, password: e.target.value})}
      required
    />
    <select 
      className="p-4 bg-slate-50 rounded-2xl text-xs font-black uppercase border border-transparent outline-none focus:border-indigo-500"
      value={newUser.role}
      onChange={e => setNewUser({...newUser, role: e.target.value})}
    >
      <option value="Viewer">Viewer</option>
      <option value="Director">Director</option>
    </select>
    
    <button 
      className="md:col-span-2 lg:col-span-4 bg-indigo-600 text-white p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all shadow-lg"
    >
      Create Personnel Account
    </button>
  </form>
</section>
      {/* --- SECTION 2: USER PERMISSIONS (FIX FOR DIRECTORS/VIEWERS) --- */}
      <section className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Access Control & Assignments</h3>
        </div>

        <div className="space-y-4">
          {users.filter(u => u.role !== 'Admin').map(user => (
            <div key={user._id} className="p-6 bg-slate-50 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-slate-100/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-blue-600 text-xs shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{user.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.role} • {user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <select 
                  onChange={(e) => handleAssign(user._id, e.target.value)}
                  className="flex-1 md:w-64 p-3 bg-white rounded-xl text-[10px] font-black uppercase tracking-tight border border-slate-200 outline-none focus:border-blue-500"
                >
                  <option value="">+ Assign Committee Access</option>
                  {committees.map(c => (
                    <option key={c._id} value={c._id}>{c.committee_name}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 3: COMMITTEE REGISTRY --- */}
      <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Institutional Registry</h3>
          <span className="text-[9px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">Total: {committees.length}</span>
        </div>
        <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {committees.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">{i + 1}</div>
                  <div>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{c.committee_name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{c.description || 'General Mandate'}</p>
                  </div>
                </div>
                <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[8px] font-black uppercase tracking-widest">Active</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}