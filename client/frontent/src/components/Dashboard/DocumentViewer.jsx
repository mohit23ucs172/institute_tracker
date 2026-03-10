import React from 'react';

export default function DocumentViewer({ activeDocument }) {
  if (!activeDocument) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col text-slate-400 bg-slate-100">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6">
           <span className="text-3xl">📄</span>
        </div>
        <p className="font-black uppercase tracking-[0.3em] text-[10px]">Select a Meeting</p>
        <p className="text-[9px] font-bold mt-2 opacity-60">To view its official minutes</p>
      </div>
    );
  }

  const meeting = activeDocument.meeting_id;
  const committeeName = meeting?.committee_id?.committee_name;

  return (
    <div className="flex-1 bg-slate-100 flex flex-col">
      <div className="bg-white border-b border-slate-200 p-5 flex justify-between items-center px-10 shadow-sm z-10">
        <div>
          <h2 className="font-black text-slate-800 uppercase text-xs tracking-tighter">
            {meeting?.meeting_number} | Official Scanned Minutes
          </h2>
          <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest mt-1">
            {committeeName} • {meeting?.date}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <a 
            href={activeDocument.file_path}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
          >
            Open Document
          </a>
        </div>
      </div>

      <div className="flex-1 p-10 overflow-hidden bg-slate-200/50">
        <iframe 
          src={`${activeDocument.file_path}#toolbar=0`} 
          className="w-full h-full rounded-2xl shadow-2xl border border-slate-300 bg-white"
          title="PDF Viewer"
        />
      </div>
      
    </div>
  );
}