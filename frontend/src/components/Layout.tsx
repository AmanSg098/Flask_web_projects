// src/components/Layout.js
import Header from './Headrer';
import Footer from './footer';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Container for consistent padding across the entire app */}
      <Header />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;