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

    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });

    const data = await res.json();

    const botMsg = { sender: "Bot", text: data.reply };
    setMessages((prev) => [...prev, botMsg]);

    setInput("");
  };

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex">
      <div className="w-full h-full flex flex-col px-8 py-6">
        {/* Chat container */}
        <div className="flex-1 bg-white rounded-xl shadow-md p-4 overflow-y-auto space-y-3">
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
        <div className="mt-4 flex">
          <input
            className="flex-1 border shadow-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-3 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
