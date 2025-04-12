import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getVaultNotePathsForSidebar } from '../utils/markdownHelper';

// Import modules to get the list of files
const markdownModules = import.meta.glob('/vaults/**/*.md');

interface VaultIndexPageProps {
  vaultId: string; // Passed from App.tsx route
}

const VaultIndexPage: React.FC<VaultIndexPageProps> = ({ vaultId }) => {
  // useMemo avoids recalculating the list on every render
  const notes = useMemo(() => getVaultNotePathsForSidebar(vaultId, markdownModules), [vaultId]);

  return (
    <div>
      <h1>Vault: {vaultId.charAt(0).toUpperCase() + vaultId.slice(1)}</h1>
      {notes.length > 0 ? (
        <ul>
          {notes.map(note => (
            <li key={note.path}>
              {/* Link uses the normalized path, display uses the derived name */}
              <Link to={`/vaults/${vaultId}/notes/${note.path}`}>
                {note.displayName}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>This vault is empty or contains no Markdown files.</p>
      )}
    </div>
  );
};

export default VaultIndexPage;