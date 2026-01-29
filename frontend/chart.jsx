const sendMessage = async (msg) => {
  const res = await fetch("/api/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: msg,
      sessionId: "user-123"
    })
  });

  const data = await res.json();
  setChat((prev) => [...prev, { role: "bot", text: data.reply }]);
};
