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
        <Route path="/" element={<HomePage />} />

        <Route path="/vaults/:vaultId" element={<VaultHomeRedirect />} />
        <Route path="/vaults/:vaultId/notes/*" element={<NotePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;