const careerCards = document.querySelectorAll(".career-card");
const preview = document.getElementById("careerPreview");
const previewTitle = document.getElementById("previewTitle");
const previewSummary = document.getElementById("previewSummary");
const previewTools = document.getElementById("previewTools");
const previewLink = document.getElementById("previewLink");

const careerPages = {
  "Software Engineer": "programming.html",
  "Security Analyst": "security.html",
  "Business Analyst": "ba.html",
  "IT Auditor": "audit.html"
};

careerCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {

    careerCards.forEach((otherCard) => {
      otherCard.classList.remove("active");
    });

    card.classList.add("active");

    const career = card.dataset.career;
    const summary = card.dataset.summary;
    const tools = card.dataset.tools;

    previewTitle.textContent = career;
    previewSummary.textContent = summary;
    previewTools.textContent = "Common tools: " + tools;

    previewLink.href = careerPages[career] || "#";

    preview.classList.add("visible");
  });
});