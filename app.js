const toolDefinitions = {
  maintenance: {
    title: "Basic Maintenance Strategy Generator",
    description:
      "Build adaptive maintenance strategies from asset context, risk signals, and decision guardrails.",
    action: "Create maintenance strategy",
  },
  fmea: {
    title: "AI-Assisted FMEA Builder",
    description:
      "Generate structured failure modes, effects, and actions with guardrails.",
    action: "Create new FMEA",
  },
};

const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const selectedToolTitle = document.getElementById("selectedToolTitle");
const selectedToolDescription = document.getElementById("selectedToolDescription");
const primaryAction = document.getElementById("primaryAction");
const toolCards = document.querySelectorAll(".tool-card--selectable");

themeToggle?.addEventListener("click", () => {
  body.dataset.theme = body.dataset.theme === "dark" ? "light" : "dark";
});

toolCards.forEach((card) => {
  card.addEventListener("click", () => {
    toolCards.forEach((toolCard) => toolCard.classList.remove("is-selected"));
    card.classList.add("is-selected");

    const toolKey = card.dataset.tool;
    const tool = toolDefinitions[toolKey];
    if (!tool) {
      return;
    }

    selectedToolTitle.textContent = tool.title;
    selectedToolDescription.textContent = tool.description;
    primaryAction.textContent = tool.action;
  });
});
