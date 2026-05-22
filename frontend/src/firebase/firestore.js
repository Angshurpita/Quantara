/**
 * Firestore Helpers — Quantara
 * CRUD operations for users and usage history.
 */
import {
    collection, doc, getDoc, getDocs, setDoc, deleteDoc, addDoc,
    query, where, orderBy, limit, serverTimestamp, updateDoc,
} from 'firebase/firestore';
import { db } from './config';

// ══════════════════════════════════════════════════════════════════════════
//  USER PROFILES (collection: "users")
// ══════════════════════════════════════════════════════════════════════════

/** Get all users (admin). */
export async function getAllUsers() {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

/** Get a single user profile. */
export async function getUser(uid) {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? { uid: snap.id, ...snap.data() } : null;
}

/** Update user profile fields. */
export async function updateUser(uid, fields) {
    await updateDoc(doc(db, 'users', uid), fields);
}

/** Delete user profile (Firestore doc only; Auth deletion done separately). */
export async function deleteUserProfile(uid) {
    await deleteDoc(doc(db, 'users', uid));
}

// ══════════════════════════════════════════════════════════════════════════
//  USAGE HISTORY (collection: "usage_history")
// ══════════════════════════════════════════════════════════════════════════

/** Save an analysis to history. */
export async function saveHistory(uid, { action, fileName, details, summary, result }) {
    return addDoc(collection(db, 'usage_history'), {
        uid,
        action: action || 'upload_csv',
        fileName: fileName || null,
        details: details || null,
        summary: summary || null,
        suspiciousCount: result?.suspicious_accounts?.length || 0,
        ringsCount: result?.fraud_rings?.length || 0,
        // Store the full result for reload (Firestore limit: 1MB per doc)
        fullResult: result || null,
        timestamp: serverTimestamp(),
    });
}

/** Get history for a specific user (ordered by newest first). */
export async function getUserHistory(uid, maxItems = 20) {
    const q = query(
        collection(db, 'usage_history'),
        where('uid', '==', uid),
        orderBy('timestamp', 'desc'),
        limit(maxItems),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Get all history (admin). */
export async function getAllHistory(maxItems = 50) {
    const q = query(
        collection(db, 'usage_history'),
        orderBy('timestamp', 'desc'),
        limit(maxItems),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Delete a single history entry. */
export async function deleteHistoryEntry(docId) {
    await deleteDoc(doc(db, 'usage_history', docId));
}

/** Clear all history for a user. */
export async function clearUserHistory(uid) {
    const entries = await getUserHistory(uid, 100);
    const deletes = entries.map(e => deleteDoc(doc(db, 'usage_history', e.id)));
    await Promise.all(deletes);
}
