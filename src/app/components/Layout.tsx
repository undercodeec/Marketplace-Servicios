import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Outlet } from 'react-router';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white selection:bg-[#FFCA0C] selection:text-[#404145]">
      <Header />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}