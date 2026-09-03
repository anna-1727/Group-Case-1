const chatbot = document.querySelector("[data-chatbot]");

if (chatbot) {
  const panel = chatbot.querySelector("[data-chatbot-panel]");
  const openButton = chatbot.querySelector("[data-chatbot-open]");
  const closeButton = chatbot.querySelector("[data-chatbot-close]");
  const form = chatbot.querySelector("[data-chatbot-form]");
  const input = chatbot.querySelector("[data-chatbot-input]");
  const messages = chatbot.querySelector("[data-chatbot-messages]");
  const suggestions = chatbot.querySelector("[data-chatbot-suggestions]");

  const answers = [
    {
      terms: ["byu is", "official is", "information systems website", "infosys website", "major"],
      response: "The official BYU Information Systems site has program details, curriculum information, student opportunities, and ways to get involved. <a href=\"https://marriott.byu.edu/infosys/\" target=\"_blank\" rel=\"noopener noreferrer\">Visit BYU Information Systems</a>."
    },
    {
      terms: ["career", "job", "role", "path", "what can i do"],
      response: "This site covers four IS paths: Software Engineer, Security Analyst, Business Analyst, and IT Auditor. Start with <a href=\"index.html#careers\">Explore Careers</a> to compare them."
    },
    {
      terms: ["resume", "cv", "bullet", "application"],
      response: "Use the <a href=\"https://marriott.byu.edu/stories/student-experiences/resume-builder\" target=\"_blank\" rel=\"noopener noreferrer\">BYU Marriott Resume Builder</a> for resume guidance, then check the BYU <a href=\"https://careers.byu.edu/resumes\" target=\"_blank\" rel=\"noopener noreferrer\">resume resources</a>."
    },
    {
      terms: ["recruit", "career fair", "fair", "event", "network"],
      response: "BYU's <a href=\"https://careers.byu.edu/students/fairs-and-events\" target=\"_blank\" rel=\"noopener noreferrer\">Fairs &amp; Events page</a> lists upcoming recruiting opportunities. Prepare with a polished resume, a short introduction, and a few questions for employers."
    },
    {
      terms: ["interview", "behavioral", "technical question", "practice"],
      response: "Practice on the site's <a href=\"interview.html\">Interview Prep page</a>. Prepare examples that show how you solved a problem, worked with others, and used technology to create a result."
    },
    {
      terms: ["ais", "association for information systems", "student organization", "club"],
      response: "AIS is a BYU Marriott Information Systems student organization for professional development, networking, and hands-on opportunities. <a href=\"https://marriott.byu.edu/infosys/get-involved/student-organizations/ais/\" target=\"_blank\" rel=\"noopener noreferrer\">Explore AIS</a>."
    },
    {
      terms: ["certification", "certifications", "credential", "security+", "security plus", "aws", "azure", "cisa"],
      response: "The certifications section links to official AWS, CompTIA Security+, ISACA CISA, and Microsoft Azure Fundamentals pages. Choose based on your target career, then review prerequisites and exam preparation on the provider's site."
    },
    {
      terms: ["business analyst", "analyst"],
      response: "Business Analysts connect organizational needs with technology solutions. Explore the site's <a href=\"ba.html\">Business Analyst career page</a> for responsibilities, skills, and interview topics."
    },
    {
      terms: ["software engineer", "programming", "developer", "coding"],
      response: "Software Engineers design, develop, test, and maintain applications. See the site's <a href=\"programming.html\">Software Engineer career page</a> for common tools and role details."
    },
    {
      terms: ["security analyst", "cybersecurity", "cyber security", "security"],
      response: "Security Analysts monitor threats, identify vulnerabilities, and reduce cybersecurity risk. See the site's <a href=\"security.html\">Security Analyst career page</a> for role details."
    },
    {
      terms: ["auditor", "audit", "risk", "controls"],
      response: "IT Auditors evaluate controls, systems, and technology risk. See the site's <a href=\"audit.html\">IT Auditor career page</a> for more context."
    }
  ];

  const fallback = "I can help with IS career paths, BYU resources, recruiting, resumes, interviews, AIS, or certifications. Try asking, \"Which career path fits me?\" or \"Where can I find BYU IS?\"";

  function findAnswer(question) {
    const normalizedQuestion = question.toLowerCase();
    const match = answers.find((answer) => answer.terms.some((term) => normalizedQuestion.includes(term)));
    return match ? match.response : fallback;
  }

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
  }

  function ask(question) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    addMessage(cleanQuestion, "user");
    addMessage(findAnswer(cleanQuestion), "bot", true);
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
    input.value = "";
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
