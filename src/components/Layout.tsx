import { ReactNode } from 'react';

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function Layout({ sidebar, children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar Area */}
      {sidebar}
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-white relative">
        {children}
      </main>
    </div>
  );
}