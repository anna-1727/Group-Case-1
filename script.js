const careerCards = document.querySelectorAll(".career-card");
const preview = document.getElementById("careerPreview");
const previewTitle = document.getElementById("previewTitle");
const previewSummary = document.getElementById("previewSummary");
const previewTools = document.getElementById("previewTools");
const previewLink = document.getElementById("previewLink");

careerCards.forEach((card) => {
  card.addEventListener("click", () => {
    // Remove active styling from all career cards
    careerCards.forEach((otherCard) => {
      otherCard.classList.remove("active");
    });

    // Highlight the selected career
    card.classList.add("active");

    // Get career information from the HTML
    const career = card.dataset.career;
    const summary = card.dataset.summary;
    const tools = card.dataset.tools;

    // Update the career preview
    previewTitle.textContent = career;
    previewSummary.textContent = summary;
    previewTools.textContent = "Common tools: " + tools;

    // Create the link for the career's page
    const slug = career.toLowerCase().replaceAll(" ", "-");
    previewLink.href = "careers/" + slug + ".html";

    // Show the preview
    preview.classList.add("visible");

    // Gently move the preview into view
    preview.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });
});