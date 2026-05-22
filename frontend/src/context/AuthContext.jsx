/* eslint-disable react-refresh/only-export-components */
/**
 * AuthContext — Firebase Authentication state management.
 * Uses Firebase Auth's onAuthStateChanged listener for real-time auth state.
 * User profile (role, username) is loaded from Firestore.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserProfile } from '../firebase/auth';
import { logOut } from '../firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch Firestore profile for role/username
                try {
                    const profile = await getUserProfile(firebaseUser.uid);
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        username: profile?.username || firebaseUser.displayName || 'User',
                        role: profile?.role || (firebaseUser.isAnonymous ? 'guest' : 'user'),
                        isAnonymous: firebaseUser.isAnonymous,
                        firebaseUser, // raw Firebase user for getIdToken()
                    });
                } catch (err) {
                    console.error('Failed to load profile:', err);
                    // Fallback: use Firebase user info only
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        username: firebaseUser.displayName || 'User',
                        role: firebaseUser.isAnonymous ? 'guest' : 'user',
                        isAnonymous: firebaseUser.isAnonymous,
                        firebaseUser,
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await logOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
}

export default AuthContext;
