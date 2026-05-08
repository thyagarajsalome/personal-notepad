import type { ReactNode } from 'react';

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function Layout({ sidebar, children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden transition-colors duration-200">
      {sidebar}
      <main className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 relative transition-colors duration-200">
        {children}
      </main>
    </div>
  );
}