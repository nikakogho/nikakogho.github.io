import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Your main site layout
import HomePage from './pages/HomePage';
import VaultLayout from './pages/VaultLayout'; // Import the vault layout
import VaultHomeRedirect from './components/VaultHomeRedirectComponent'; // Import the redirect component
import NotePage from './pages/NotePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Layout>
      <Routes>
        {/* Main site routes */}
        <Route path="/" element={<HomePage />} />

        {/* Parent route for all vaults - uses VaultLayout */}
        {/* This component will persist while navigating within a vault */}
        <Route path="/vaults/:vaultId" element={<VaultLayout />}>
          {/* Index route: Render the redirect component to show Home.md */}
          <Route index element={<VaultHomeRedirect />} />
          {/* Route for specific notes within the vault */}
          <Route path="notes/*" element={<NotePage />} />
        </Route>

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
