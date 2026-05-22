/**
 * UploadCSV — Drag-and-drop CSV file upload component.
 * Posts the file to /upload-csv and passes the result to the parent.
 *
 * Design: Liquid Crystal Glass — Black & White
 */
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CloudUpload, FileWarning } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://quantara-backend-deploy.onrender.com');
const H = { fontFamily: "'Inter', system-ui, sans-serif" };
const B = { fontFamily: "'Inter', system-ui, sans-serif" };

export default function UploadCSV({ onResult, onLoading, firebaseUser }) {
    const [dragOver, setDragOver] = useState(false);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const uploadFile = async (file) => {
        if (!file || !file.name.toLowerCase().endsWith('.csv')) {
            setError('Please upload a valid CSV file.');
            return;
        }

        setError('');
        setFileName(file.name);
        onLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const headers = {};
            // Get a fresh Firebase ID token for the request
            if (firebaseUser && !firebaseUser.isAnonymous) {
                try {
                    const idToken = await firebaseUser.getIdToken();
                    headers['Authorization'] = `Bearer ${idToken}`;
                } catch (e) {
                    console.warn('Could not get Firebase token:', e);
                }
            }

            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers,
                body: formData,
            });

            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error('Server returned an invalid response.');
            }

            if (!response.ok) {
                throw new Error(data.detail || 'Upload failed. Please try again.');
            }

            onResult(data);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Cannot connect to backend. Make sure the server is running on port 8000.');
        } finally {
            onLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        uploadFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) uploadFile(file);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(16px)',
            }}
        >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

            <div className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-5" style={H}>
                    Upload Transaction Data
                </h2>

                <motion.div
                    whileHover={{ borderColor: 'rgba(255,255,255,0.2)', boxShadow: '0 0 30px rgba(255,255,255,0.03)' }}
                    className={`relative rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${dragOver ? 'border-white/30 bg-white/[0.03]' : ''}`}
                    style={{
                        border: `2px dashed ${dragOver ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        background: dragOver ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <motion.div
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        <CloudUpload size={28} className="text-white/40" />
                    </motion.div>

                    <p className="text-base font-semibold text-white/70" style={H}>
                        {fileName || 'Drop your CSV file here or click to browse'}
                    </p>
                    <p className="text-sm text-white/25 mt-2" style={B}>
                        Supports: TX_ID, SENDER_ACCOUNT_ID, RECEIVER_ACCOUNT_ID, TX_AMOUNT, TIMESTAMP
                    </p>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3.5 rounded-xl flex items-center gap-2.5"
                        style={{
                            background: 'rgba(239,68,68,0.06)',
                            border: '1px solid rgba(239,68,68,0.15)',
                        }}
                    >
                        <FileWarning size={16} className="text-red-400/60 shrink-0" />
                        <span className="text-red-300/80 text-sm" style={B}>{error}</span>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
