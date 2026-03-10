import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.jpeg'; // Uncomment when you have the file

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', roles: ['Admin', 'Director', 'Viewer'] },
    { name: 'Upload', path: '/upload', roles: ['Admin', 'Director'] },
    { name: 'Reports', path: '/reports', roles: ['Admin', 'Director', 'Viewer'] },
    { name: 'Admin Panel', path: '/admin', roles: ['Admin'] },
  ];

  return (
    <header className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-100 shadow-sm">
      <div className="flex items-center gap-4">
        {/* LOGO SECTION */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
           <img src={logoImg} alt="Logo" className="w-8 h-8"/> 
             <span className="text-white font-black text-xl">I</span> 
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 leading-none uppercase tracking-tighter text-lg">Institute</span>
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Document Tracker</span>
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex ml-10 gap-6">
          {navLinks.map(link => (
            link.roles.includes(user?.role) && (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                  location.pathname === link.path ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            )
          ))}
        </nav>
      </div>

      {/* USER INFO */}
      <div className="flex items-center gap-4">
        <div className="text-right mr-2">
          <p className="text-[9px] font-black text-slate-400 uppercase">Authenticated As</p>
          <p className="text-xs font-black text-slate-800 uppercase">{user?.role}</p>
        </div>
        <button 
          onClick={logout}
          className="bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}