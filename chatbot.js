const chatbot = document.querySelector("[data-chatbot]");

if (chatbot) {
  const panel = chatbot.querySelector("[data-chatbot-panel]");
  const openButton = chatbot.querySelector("[data-chatbot-open]");
  const closeButton = chatbot.querySelector("[data-chatbot-close]");
  const form = chatbot.querySelector("[data-chatbot-form]");
  const input = chatbot.querySelector("[data-chatbot-input]");
  const messages = chatbot.querySelector("[data-chatbot-messages]");
  const suggestions = chatbot.querySelector("[data-chatbot-suggestions]");

  function addMessage(content, type, isHtml = false) {
    const msg = document.createElement("div");
    msg.className = `chatbot-message chatbot-message-${type}`;
    if (isHtml) {
      msg.innerHTML = content;
    } else {
      msg.textContent = content;
    }
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
  }

  async function ask(question) {
    const clean = question.trim();
    if (!clean) return;

    addMessage(clean, "user");
    input.value = "";

    const thinkingBubble = addMessage("Thinking...", "bot");

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean })
      });

      const data = await res.json();
      thinkingBubble.remove();

      if (data.reply) {
        addMessage(data.reply, "bot");
      } else {
        addMessage("Error: " + (data.error || "Unable to get response"), "bot");
      }
    } catch (err) {
      thinkingBubble.remove();
      addMessage("Cannot reach backend. Make sure 'python3 server.py' is running in your terminal!", "bot");
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

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input.value);
  });

  suggestions.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-chatbot-question]");
    if (!btn) return;
    ask(btn.dataset.chatbotQuestion);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) setOpen(false);
  });
}