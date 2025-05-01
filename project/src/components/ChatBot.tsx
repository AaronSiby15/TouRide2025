import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize, Minimize, MessageCircle } from 'lucide-react';
import { marked } from 'marked';

export interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
}

export default function ChatBot() {
    const [history, setHistory] = useState<Message[]>([
        { id: 'bot-0', sender: 'bot', text: 'Hello, how can I help you?' },
    ]);
    const [input, setInput] = useState('');
    const [fullScreen, setFullScreen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const send = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = {
            id: `u-${Date.now()}`,
            sender: 'user',
            text: input.trim(),
        };
        const newHist = [...history, userMsg];
        setHistory(newHist);
        setInput('');

        const convo = newHist.slice(1);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/chat`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        history: convo.map((m) => ({
                            sender: m.sender,
                            text: m.text,
                        })),
                        message: userMsg.text,
                    }),
                }
            );

            const data = await res.json();
            const botText =
                typeof data.reply === 'string' ? data.reply : String(data.reply);

            setHistory((h) => [
                ...h,
                { id: `b-${Date.now()}`, sender: 'bot', text: botText },
            ]);
        } catch (err) {
            console.error(err);
            setHistory((h) => [
                ...h,
                {
                    id: `b-${Date.now()}`,
                    sender: 'bot',
                    text: 'Sorry, something went wrong.',
                },
            ]);
        }
    };

    // Auto-scroll
    useEffect(() => {
        const el = containerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [history]);

    if (minimized) {
        return (
            <button
                className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg z-50"
                onClick={() => setMinimized(false)}
                title="Open Chat"
            >
                <MessageCircle size={24} />
            </button>
        );
    }

    return (
        <div className={`chat-wrapper ${fullScreen ? 'fullscreen' : ''}`}>
            <div className="chat-header">
                <span>TouRide ChatBot</span>
                <div className="chat-controls">
                    <button onClick={() => setFullScreen(f => !f)} title="Toggle Fullscreen">
                        {fullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    </button>
                </div>
            </div>

            <div className="chat-body" ref={containerRef}>
                {history.map((m) => (
                    <div key={m.id} className={`chat-message ${m.sender}`}>
                        <div
                            dangerouslySetInnerHTML={{ __html: marked.parse(m.text) }}
                        />
                    </div>
                ))}
            </div>

            <form className="chat-input" onSubmit={send}>
                <input
                    type="text"
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">➤</button>
            </form>
            <button onClick={() => setMinimized(true)} className="chat-close" title="Minimize">
                <X size={20} />
            </button>
        </div>
    );
}
