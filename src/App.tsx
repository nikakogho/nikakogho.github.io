import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VaultHomeRedirect from './components/VaultHomeRedirectComponent';
import NotePage from './pages/NotePage';
import NotFoundPage from './pages/NotFoundPage';

// Function to generate vault IDs from your vault folders
const VAULT_IDS = ['Neuroscience', 'Space', 'Bioengineering', 'Robots'];

function App() {
  return (
    <Layout>
      <Routes>
        {/* Main site routes */}
        <Route path="/" element={<HomePage />} />

        {/* --- Updated Vault Root Route --- */}
        <Route path="/vaults/:vaultId" element={<VaultHomeRedirect />} />
        <Route path="/vaults/:vaultId/notes/*" element={<NotePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;