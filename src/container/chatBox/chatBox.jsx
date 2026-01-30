import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

function Chatbox() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const newMsg = { sender: "user", text: input };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");

        try {
          const res = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
          });
          const data = await res.json();
          setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
        } catch (err) {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "⚠️ Error connecting to server." },
          ]);
        }
        // try {
        //     const res = await fetch("http://localhost:5000/chat", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({ message: input }),
        //     });

        //     if (!res.body) throw new Error("No response body");

        //     const reader = res.body.getReader();
        //     const decoder = new TextDecoder("utf-8");

        //     // Add empty AI message once
        //     let aiMessage = { sender: "ai", text: "" };
        //     setMessages((prev) => [...prev, aiMessage]);

        //     let buffer = "";

        //     while (true) {
        //         const { done, value } = await reader.read();
        //         if (done) break;

        //         buffer += decoder.decode(value, { stream: true });

        //         // Update last AI message incrementally
        //         setMessages((prev) => {
        //             const updated = [...prev];
        //             const lastIndex = updated.length - 1;
        //             updated[lastIndex] = {
        //                 ...updated[lastIndex],
        //                 text: buffer, // full text so far
        //             };
        //             return updated;
        //         });
        //     }
        // } catch (err) {
        //     console.error("Streaming error:", err);
        //     setMessages((prev) => [
        //         ...prev,
        //         { sender: "ai", text: "⚠️ Error connecting to server." },
        //     ]);
        // }

    };

    return (
        <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="w-full max-w-3xl h-[700px] flex flex-col rounded-2xl shadow-xl overflow-hidden bg-white border border-gray-200">

                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-semibold text-lg shadow flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <span className="text-2xl">🤖</span>
                        <span>Chitti Assistant</span>
                    </span>
                    <span className="text-sm text-gray-300">AI Chat</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {msg.sender === "ai" && (
                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-700 text-white shadow-md">
                                    🤖
                                </div>
                            )}
                            <div
                                className={`px-4 py-3 rounded-2xl max-w-[70%] text-sm leading-relaxed shadow-sm ${msg.sender === "user"
                                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none"
                                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                                    }`}
                            >
                                {msg.text}
                            </div>
                            {msg.sender === "user" && (
                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                                    🧑
                                </div>
                            )}
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div className="p-4 border-t bg-white flex items-center gap-3 shadow-inner">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
                    />
                    <button
                        onClick={sendMessage}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow hover:opacity-90 transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chatbox;
