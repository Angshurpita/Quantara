/**
 * ProtectedRoute — Auth guard wrapper for routes.
 * Uses Firebase Auth state. Redirects to /login if not authenticated.
 * Shows a spinner while Firebase Auth initializes.
 * Optional `requiredRole` prop for admin-only pages.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show spinner while Firebase Auth is initializing
    if (loading || user === undefined) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-white/10 border-t-white/50 rounded-full animate-spin" />
            </div>
        );
    }

    // Not logged in → redirect to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Wrong role → redirect to dashboard
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
