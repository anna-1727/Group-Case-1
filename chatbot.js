const chatbot = document.querySelector("[data-chatbot]");

if (chatbot) {
  const panel = chatbot.querySelector("[data-chatbot-panel]");
  const openButton = chatbot.querySelector("[data-chatbot-open]");
  const closeButton = chatbot.querySelector("[data-chatbot-close]");
  const form = chatbot.querySelector("[data-chatbot-form]");
  const input = chatbot.querySelector("[data-chatbot-input]");
  const messages = chatbot.querySelector("[data-chatbot-messages]");
  const suggestions = chatbot.querySelector("[data-chatbot-suggestions]");

  // API Configuration
  const GEMINI_API_KEY = "AQ.Ab8RN6Ktl5Z-an-Q1rPdLYhzZaNIpeF9GFE51QrKK4BowGYx1g";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;

  const conversationHistory = [
    {
      role: "user",
      parts: [{
        text: "You are the IS Career Launchpad Assistant for BYU's Information Systems program. Help students navigate career tracks (Software Engineer, Security Analyst, Business Analyst, IT Auditor), campus resources (Handshake, AIS, Marriott Business Career Center), certifications (AWS, Security+, CISA, Azure), and interview prep. Keep responses concise, direct, helpful, and under 3 sentences where possible."
      }]
    },
    {
      role: "model",
      parts: [{
        text: "Understood! I'm ready to help students with IS career tracks, skills, certifications, and resources at BYU."
      }]
    }
  ];

  function addMessage(content, type, isHtml = false) {
    const message = document.createElement("div");
    message.className = `chatbot-message chatbot-message-${type}`;
    if (isHtml) {
      message.innerHTML = content;
    } else {
      message.textContent = content;
    }
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  async function ask(question) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    addMessage(cleanQuestion, "user");
    input.value = "";

    conversationHistory.push({
      role: "user",
      parts: [{ text: cleanQuestion }]
    });

    const thinkingBubble = addMessage("Thinking...", "bot");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: conversationHistory })
      });

      const data = await res.json();
      thinkingBubble.remove();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const reply = data.candidates[0].content.parts[0].text;
        addMessage(reply, "bot");
        conversationHistory.push({
          role: "model",
          parts: [{ text: reply }]
        });
      } else if (data.error?.message) {
        addMessage(data.error.message, "bot");
      } else {
        addMessage("I couldn't generate a response right now. Please try again.", "bot");
      }
    } catch (err) {
      thinkingBubble.remove();
      addMessage("Connection error. Please check your network and try again.", "bot");
    }
  }

  function setOpen(isOpen) {
    panel.hidden = !isOpen;
    openButton.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) input.focus();
  }

  openButton.setAttribute("aria-expanded", "false");
  openButton.addEventListener("click", () => setOpen(panel.hidden));
  closeButton.addEventListener("click", () => setOpen(false));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(input.value);
  });

  suggestions.addEventListener("click", (event) => {
    const questionButton = event.target.closest("[data-chatbot-question]");
    if (!questionButton) return;
    ask(questionButton.dataset.chatbotQuestion);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });
}