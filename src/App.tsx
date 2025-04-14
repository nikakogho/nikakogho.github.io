import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VaultHomeRedirect from './components/VaultHomeRedirectComponent';
import NotePage from './pages/NotePage';
import NotFoundPage from './pages/NotFoundPage';

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