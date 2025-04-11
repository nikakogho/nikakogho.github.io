import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VaultIndexPage from './pages/VaultIndexPage';
import NotePage from './pages/NotePage';
import NotFoundPage from './pages/NotFoundPage';

// Function to generate vault IDs from your vault folders
const VAULT_IDS = ['Neuroscience', 'Space', 'Bioengineering', 'Robots'];

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Routes for vault index pages */}
        {VAULT_IDS.map(id => (
          <Route key={id} path={`/vaults/${id}`} element={<VaultIndexPage vaultId={id} />} />
        ))}
        {/* Route for individual notes within vaults */}
        <Route path="/vaults/:vaultId/notes/*" element={<NotePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;