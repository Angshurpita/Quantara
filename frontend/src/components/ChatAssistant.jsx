/**
 * ChatAssistant — AI Fraud Detection Assistant chat widget.
 * Design: Liquid Crystal Glass — Black & White
 */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Minimize2, Maximize2 } from 'lucide-react';

const H = { fontFamily: "'Inter', system-ui, sans-serif" };
const B = { fontFamily: "'Inter', system-ui, sans-serif" };

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: 'Hello! I am your Fraud Detection Assistant. How can I help you analyze the transaction data today?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        setTimeout(() => {
            const botResponses = [
                "I've analyzed the recent transaction graph. There appears to be a high-density cluster in Region A.",
                "Based on the pattern, Account #8821 looks suspicious due to circular flow velocity.",
                "I can export that report for you. Would you like it in PDF or CSV format?",
                "The risk score for this transaction path needs manual review. Marking it as 'High Priority'.",
                "Scanning for mule accounts... I found 3 accounts with matching device fingerprints."
            ];
            const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: randomResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center z-50 cursor-pointer"
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 0 30px rgba(255,255,255,0.05)',
                        }}
                    >
                        <MessageSquare size={24} className="text-white/50" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            height: isMinimized ? 'auto' : '500px',
                            width: '350px'
                        }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 right-6 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
                        style={{
                            background: 'rgba(0,0,0,0.95)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(24px)',
                        }}
                    >
                        {/* Header */}
                        <div className="p-4 flex items-center justify-between cursor-pointer"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
                            onClick={() => setIsMinimized(!isMinimized)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <Bot size={18} className="text-white/40" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white/70" style={H}>Fraud Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-white/30 animate-pulse" />
                                        <span className="text-[10px] text-white/20">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                                    className="p-1 hover:bg-white/[0.05] rounded text-white/20 hover:text-white/50 transition-colors cursor-pointer"
                                >
                                    {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                    className="p-1 hover:bg-white/[0.05] rounded text-white/20 hover:text-white/40 transition-colors cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        {!isMinimized && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.type === 'user'
                                                ? 'bg-white text-black rounded-br-none'
                                                : 'rounded-bl-none'
                                                }`}
                                                style={msg.type === 'bot' ? {
                                                    background: 'rgba(255,255,255,0.04)',
                                                    border: '1px solid rgba(255,255,255,0.06)',
                                                    color: 'rgba(255,255,255,0.6)',
                                                } : {}}
                                            >
                                                {msg.text}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 pl-2">
                                            <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ask about suspicious nodes..."
                                            className="w-full rounded-xl py-3 pl-4 pr-12 text-sm text-white/70 placeholder-white/15 focus:outline-none transition-colors"
                                            style={{
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                ...B,
                                            }}
                                        />
                                        <button
                                            onClick={handleSend}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-black transition-colors cursor-pointer"
                                            style={{ background: 'rgba(255,255,255,0.8)' }}
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatAssistant;
