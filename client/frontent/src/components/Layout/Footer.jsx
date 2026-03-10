import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* FOOTER LOGO & COPYRIGHT */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
            <span className="text-slate-500 font-bold text-sm">I</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
              National Institute of Technology
            </p>
            <p className="text-[9px] font-medium text-slate-400">
              © {currentYear} Institutional Archive System. All Rights Reserved.
            </p>
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Database Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-700 uppercase">Operational</span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-slate-100 hidden md:block"></div>

          <div className="flex flex-col items-end text-right">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Version</span>
            <span className="text-[10px] font-bold text-slate-700 uppercase">v2.1.0-Relational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}