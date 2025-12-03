"use client";
import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("https://chatbotsystem-m9rb.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      const botMsg = { sender: "Bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "Bot", text: "Server not reachable." },
      ]);
    }

    setInput("");
  };

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
      <div className="w-full max-w-2xl h-[80vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Chat header */}
        <div className="bg-blue-600 text-white py-4 px-6 font-semibold text-lg">
          Chatbot
        </div>

        {/* Chat container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm 
                ${
                  msg.sender === "You"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        {/* Input box */}
        <div className="flex p-4 bg-white border-t border-gray-200">
          <input
            type="text"
            className="flex-1 border rounded-xl p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-3 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
