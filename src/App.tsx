import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import { ThemeProvider } from './context/ThemeContext';

const SecretPage = lazy(() => import('./pages/SecretPage'));
const VaultLayout = lazy(() => import('./pages/VaultLayout'));
const VaultHomeRedirect = lazy(() => import('./components/VaultHomeRedirectComponent'));
const NotePage = lazy(() => import('./pages/NotePage'));
const GraphViewPage = lazy(() => import('./pages/GraphViewPage'));
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const ResearchListPage = lazy(() => import('./pages/ResearchListPage'));
const ResearchPostPage = lazy(() => import('./pages/ResearchPostPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const RouteLoading = () => (
  <div className="route-loading" role="status" aria-live="polite">
    <span aria-hidden="true" />
    Opening the next page…
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Suspense fallback={<RouteLoading />}>
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

            {/* Research Routes - Added */}
            <Route path="/research" element={<ResearchListPage />} />
            <Route path="/research/:slug" element={<ResearchPostPage />} />

            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
