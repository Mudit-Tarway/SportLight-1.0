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

  // Predefined Q&A mapping
  const qaMap: { [key: string]: string } = {
    // Cricket
    "who is virat kohli": "He is a famous Indian cricketer and former captain of the Indian cricket team.",
    "who is sachin tendulkar": "He is a legendary Indian cricketer, known as the 'God of Cricket'.",
    "who won icc cricket world cup 2019": "England won the ICC Cricket World Cup in 2019.",
    "who is ms dhoni": "MS Dhoni is a former Indian cricket team captain and wicketkeeper-batsman.",
    "what is odi in cricket": "ODI stands for One Day International, a format of cricket with 50 overs per side.",
    "what is t20 in cricket": "T20 is a cricket format where each team plays 20 overs.",

    // Football
    "what is football": "Football, also known as soccer, is a team sport played with a spherical ball between two teams of 11 players.",
    "who won fifa world cup 2022": "Argentina won the FIFA World Cup 2022.",
    "who is lionel messi": "Lionel Messi is a world-famous Argentinian football player, considered one of the greatest of all time.",
    "who is cristiano ronaldo": "Cristiano Ronaldo is a Portuguese football superstar, known for his goal-scoring ability.",
    "how many players in football": "Each football team has 11 players on the field.",

    // Basketball
    "who is michael jordan": "Michael Jordan is a legendary basketball player, widely regarded as the greatest of all time.",
    "who is lebron james": "LeBron James is an American professional basketball player, known for his incredible skills and leadership.",
    "how many players in basketball": "Each basketball team has 5 players on the court.",
    "what is nba": "NBA stands for National Basketball Association, the premier professional basketball league in the USA.",

    // Tennis
    "who is roger federer": "Roger Federer is a Swiss tennis player, considered one of the greatest in tennis history.",
    "who is rafael nadal": "Rafael Nadal is a Spanish tennis player, famous for his dominance on clay courts.",
    "who is serena williams": "Serena Williams is an American tennis legend, winner of 23 Grand Slam singles titles.",
    "how many sets in tennis": "A typical tennis match is played in best of 3 or best of 5 sets.",

    // Olympics & General Sports
    "what is olympics": "The Olympics is an international multi-sport event held every four years.",
    "when were the first olympic games": "The first modern Olympic Games were held in Athens, Greece, in 1896.",
    "who is usain bolt": "Usain Bolt is a Jamaican sprinter, widely regarded as the fastest man in the world.",
    "what is marathon": "A marathon is a long-distance running race of 42.195 kilometers (26.2 miles).",
    "what is hockey": "Hockey is a team sport played with sticks and a ball or puck, popular in field and ice formats.",

    // More generic
    "what is sports": "Sports are physical or mental activities involving skill, competition, or recreation.",
    "who won icc t20 world cup 2022": "England won the ICC T20 World Cup in 2022.",
    "who is sachin": "Sachin Tendulkar is a legendary Indian cricketer, also called the 'God of Cricket'.",
    "who is virat": "Virat Kohli is a famous Indian cricketer and former captain of the Indian team.",
    "what is cricket": "Cricket is a bat-and-ball sport played between two teams of 11 players.",
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    // Small delay to simulate typing
    setTimeout(() => {
      const key = userText.toLowerCase();
      const botReply =
        qaMap[key] ?? "I’m here to help with sports questions 🙂 Try asking again.";

      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-green-600 text-white text-2xl shadow-lg hover:bg-green-700"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed inset-0 md:inset-auto md:bottom-20 md:right-5 md:w-96 md:h-[520px] bg-green-50 z-50 shadow-2xl rounded-none md:rounded-xl flex flex-col text-black">

          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-green-600 text-white">
            <span className="font-semibold">SportLight AI</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 text-sm text-black">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] text-black ${
                  m.role === "user"
                    ? "bg-green-300 ml-auto"
                    : "bg-green-100 mr-auto"
                }`}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="bg-green-100 mr-auto p-3 rounded-lg max-w-[80%] text-black">
                Typing…
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2 bg-green-50">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about sports..."
              className="flex-1 border rounded px-3 py-2 text-sm text-black placeholder-gray-500 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-green-600 text-white px-4 rounded hover:bg-green-700 disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
