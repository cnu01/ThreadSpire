import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuthStore } from '../../stores/authStore';
import { useBookmarkStore } from '../../stores/bookmarkStore';

function Layout() {
  const { isAuthenticated } = useAuthStore();
  const { fetchBookmarks } = useBookmarkStore();
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);
  
  // Hide footer on create/edit page to maximize space for content creation
  useEffect(() => {
    const path = location.pathname;
    setShowFooter(!path.includes('/create') && !path.includes('/edit'));
  }, [location.pathname]);
  
  // Fetch user's bookmarks when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated, fetchBookmarks]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}

export default Layout;