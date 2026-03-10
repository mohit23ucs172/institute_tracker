import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Components
import CommitteeList from '../components/Dashboard/CommitteeList';
import MeetingTable from '../components/Dashboard/MeetingTable';
import DocumentViewer from '../components/Dashboard/DocumentViewer';
import SummaryDashboard from '../components/Dashboard/SummaryDashboard';

// ... (imports remain the same)

export default function Dashboard() {
  const { user, API_URL } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [allCommittees, setAllCommittees] = useState([]); 
  const [userCommittees, setUserCommittees] = useState([]); 
  const [activeCommittee, setActiveCommittee] = useState('Overview'); 
  const [activeDocument, setActiveDocument] = useState(null);

  useEffect(() => {
    const syncAndFetch = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // STEP 1: Fetch Institutional Data
        const committeeRes = await axios.get(`${API_URL}/committees`, { headers });
        setAllCommittees(committeeRes.data);

        // STEP 2: Fetch Personal Permissions (The Sync)
        const userRes = await axios.get(`${API_URL}/auth/me`, { headers });
        // CRITICAL: Ensure we use the freshly fetched list from the DB
        setUserCommittees(userRes.data.assignedCommittees || []);

        // STEP 3: Fetch Documents
        const docRes = await axios.get(`${API_URL}/documents`, { headers });
        setDocuments(docRes.data);

      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (API_URL) syncAndFetch();
  }, [API_URL, user?.role]);

  // DERIVED LOGIC
  const sidebarNames = user?.role === 'Admin' 
    ? allCommittees.map(c => c.committee_name) 
    : userCommittees.map(c => c.committee_name); // Uses the synced state

  const statsCommittees = user?.role === 'Admin' ? allCommittees : userCommittees;

  const filteredDocuments = documents.filter(doc => 
    doc.meeting_id?.committee_id?.committee_name === activeCommittee
  );

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center font-black text-slate-300 animate-pulse uppercase tracking-[0.5em] text-[10px]">
      Syncing Institutional Registry...
    </div>
  );

  return (
    <div className="relative h-full">
      <div className="flex flex-col lg:flex-row h-full min-h-[75vh] gap-8">
        <CommitteeList 
          committees={sidebarNames} 
          activeCommittee={activeCommittee} 
          allDocuments={documents} 
          isMobileOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onSelect={(name) => {
            setActiveCommittee(name);
            setActiveDocument(null);
          }} 
        />
        
        <div className="flex-1 overflow-hidden">
          {activeCommittee === 'Overview' ? (
            <SummaryDashboard documents={documents} userCommittees={statsCommittees} />
          ) : (
            <div className="flex flex-col xl:flex-row gap-6 h-full">
              <div className="flex-1 min-w-0">
                <MeetingTable documents={filteredDocuments} onSelect={setActiveDocument} />
              </div>
              <div className="w-full xl:w-1/3">
                <DocumentViewer activeDocument={activeDocument} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}