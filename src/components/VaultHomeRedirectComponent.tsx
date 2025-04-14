import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { normalizeNoteName } from '../utils/markdownHelper'; // Import your normalization function

const VaultHomeRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { vaultId } = useParams<{ vaultId: string }>();

  useEffect(() => {
    if (vaultId) {
      // Normalize the target note name (assuming it's "Home")
      const homeNotePath = normalizeNoteName('Home');
      const targetPath = `/vaults/${vaultId}/notes/${homeNotePath}`;
      console.log(`Redirecting from /vaults/${vaultId} to ${targetPath}`);
      // Use replace: true to avoid adding the vault root URL to the browser history
      navigate(targetPath, { replace: true });
    } else {
      // Handle case where vaultId is somehow missing, maybe redirect home or show error
      console.error("Vault ID missing in VaultHomeRedirect");
      navigate('/', { replace: true });
    }
    // Run only once on mount
  }, [vaultId, navigate]);

  // Render nothing or a loading indicator while redirecting
  return <div>Loading Vault Home...</div>;
};

export default VaultHomeRedirect;
