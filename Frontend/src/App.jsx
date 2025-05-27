import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import CreateThreadPage from './pages/CreateThreadPage';
import ProfilePage from './pages/ProfilePage';
import CollectionsPage from './pages/CollectionsPage';
import CreateCollectionPage from './pages/CreateCollectionPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { checkAuth } = useAuthStore();
  const location = useLocation();

  // Check authentication status on app load and route changes
  useEffect(() => {
    checkAuth();
  }, [checkAuth, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="thread/:threadId" element={<ThreadDetailPage />} />
        <Route path="auth" element={<AuthPage />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="create" element={<CreateThreadPage />} />
          <Route path="edit/:threadId" element={<CreateThreadPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="collections/new" element={<CreateCollectionPage />} />
          <Route path="collections/:collectionId" element={<CollectionDetailPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;