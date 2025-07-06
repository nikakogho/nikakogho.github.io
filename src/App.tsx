import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VaultLayout from './pages/VaultLayout';
import VaultHomeRedirect from './components/VaultHomeRedirectComponent';
import NotePage from './pages/NotePage';
import NotFoundPage from './pages/NotFoundPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import { ThemeProvider } from './context/ThemeContext';
import SecretPage from './pages/SecretPage';
import GraphViewPage from './pages/GraphViewPage';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/secrets/*" element={<SecretPage />} />

          {/* Vault Routes */}
          <Route path="/nexus" element={<VaultLayout />}>
            <Route index element={<VaultHomeRedirect />} />
            <Route path="notes/*" element={<NotePage />} />
            <Route path="graph" element={<GraphViewPage />} />
          </Route>

          {/* Blog Routes*/}
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />

          {/* Catch-all Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;