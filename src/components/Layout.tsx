import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname, hash } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    // Section links manage their own target. Every ordinary route change should
    // start at the top instead of inheriting a long post's scroll position.
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return (
    <div className={`app-container${isHome ? ' app-container--home' : ''}`}>
      <Header />
      <main className={`content-container${isHome ? ' content-container--home' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
