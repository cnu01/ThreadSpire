import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to auth page, but save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;