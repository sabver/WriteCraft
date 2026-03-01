'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-app-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-screen scroll-smooth">
        {children}
      </main>
    </div>
  );
}
