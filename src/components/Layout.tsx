import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname, hash } = useLocation();
  const isImmersive = pathname === '/' || pathname === '/world';

  useEffect(() => {
    // Section links manage their own target. Every ordinary route change should
    // start at the top instead of inheriting a long post's scroll position.
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return (
    <div className={`app-container${isImmersive ? ' app-container--immersive' : ''}`}>
      {!isImmersive && <Header />}
      <main className={`content-container${isImmersive ? ' content-container--immersive' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
