/**
 * AdminPage — Admin dashboard page wrapper.
 * Uses AuthContext and React Router for navigation.
 */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminPanel from '../components/AdminPanel';

export default function AdminPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    return (
        <AdminPanel
            user={user}
            onLogout={handleLogout}
            onBackToDashboard={() => navigate('/dashboard')}
        />
    );
}
