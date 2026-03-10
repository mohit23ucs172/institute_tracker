import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="overflow-auto p-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}