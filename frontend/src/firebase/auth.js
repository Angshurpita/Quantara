/**
 * Firebase Auth Helpers — Quantara
 * Wraps Firebase Authentication methods for the app.
 */
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInAnonymously,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

/**
 * Sign up a new user with email & password.
 * Creates a Firestore profile document in /users/{uid}.
 */
export async function signUp(email, password, username, role = 'user') {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: username });

    // Create Firestore user profile
    await setDoc(doc(db, 'users', cred.user.uid), {
        username,
        email,
        role,
        isActive: true,
        createdAt: serverTimestamp(),
    });

    return cred.user;
}

/**
 * Sign in with email & password.
 */
export async function signIn(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
}

/**
 * Sign in as anonymous guest.
 * Creates a minimal Firestore profile.
 */
export async function signInAsGuest() {
    const cred = await signInAnonymously(auth);
    const uid = cred.user.uid;

    // Only create profile if it doesn't exist
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', uid), {
            username: 'Guest',
            email: null,
            role: 'guest',
            isActive: true,
            createdAt: serverTimestamp(),
        });
    }

    return cred.user;
}

/**
 * Sign in with Google (popup).
 * Creates a Firestore profile on first login.
 */
export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const uid = cred.user.uid;

    // Only create profile if it doesn't exist yet
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', uid), {
            username: cred.user.displayName || 'Google User',
            email: cred.user.email,
            role: 'user',
            isActive: true,
            createdAt: serverTimestamp(),
        });
    }

    return cred.user;
}

/**
 * Sign out the current user.
 */
export async function logOut() {
    return signOut(auth);
}

/**
 * Get the Firestore profile for a user.
 */
export async function getUserProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
        return { uid, ...snap.data() };
    }
    return null;
}
