"use client";

import { useState } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! I'm SportLight AI 🌿 Ask me about sports." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are SportLight AI, an assistant focused on sports. Answer briefly.\nUser: ${userMessage}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();

      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";

      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-green-700"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed inset-0 md:inset-auto md:bottom-20 md:right-5 md:w-96 md:h-[520px] bg-green-50 text-black z-50 shadow-2xl rounded-none md:rounded-xl flex flex-col">

          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-green-600 text-white rounded-t-md">
            <span className="font-semibold">SportLight AI</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] ${
                  m.role === "user"
                    ? "bg-green-300 ml-auto"
                    : "bg-green-100 mr-auto"
                }`}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="bg-green-100 mr-auto p-3 rounded-lg max-w-[80%]">
                Typing...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2 bg-green-50">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded px-3 py-2 text-sm text-black placeholder-green-600 focus:outline-none"
              placeholder="Ask about sports..."
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
