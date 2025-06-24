import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeNoteName } from '../utils/markdownHelper'; // Import your normalization function

const VaultHomeRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Normalize the target note name (assuming it's "Home")
    const homeNotePath = normalizeNoteName('🌌 Nexus');
    const targetPath = `/nexus/notes/${homeNotePath}`;
    console.log(`Redirecting from /nexus to ${targetPath}`);
    // Use replace: true to avoid adding the vault root URL to the browser history
    navigate(targetPath, { replace: true });
    // Run only once on mount
  }, [navigate]);

  // Render nothing or a loading indicator while redirecting
  return <div>Loading Vault Home...</div>;
};

export default VaultHomeRedirect;
