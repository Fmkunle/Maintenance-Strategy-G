const toolDefinitions = {
  maintenance: {
    title: "Maintenacne Strategy Generator",
    description:
      "Define failure characteristics, create mitigation charcteristics and simulate CBA.",
    meta: [
      "ISO 550009 compatible",
      "Dashboard insight",
      "Export ready",
    ],
    action: "Create new strategy",
    secondaryAction: "Open existing",
  },
  fmea: {
    title: "AI-Assisted FMEA Builder",
    description:
      "Generate structured failure modes, effects, and actions with guardrails.",
    meta: [
      "SAE J1739 compatible",
      "RPN heatmap",
      "Export ready",
    ],
    action: "Create new FMEA",
    secondaryAction: "Open existing",
  },
};

const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const selectedToolTitle = document.getElementById("selectedToolTitle");
const selectedToolDescription = document.getElementById("selectedToolDescription");
const selectedToolMeta = document.getElementById("selectedToolMeta");
const primaryAction = document.getElementById("primaryAction");
const secondaryAction = document.getElementById("secondaryAction");
const toolCards = document.querySelectorAll(".tool-card--selectable");

themeToggle?.addEventListener("click", () => {
  body.dataset.theme = body.dataset.theme === "dark" ? "light" : "dark";
});

toolCards.forEach((card) => {
  card.addEventListener("click", () => {
    toolCards.forEach((toolCard) => {
      toolCard.classList.remove("is-selected");

      const badge = toolCard.querySelector(".badge");
      if (badge) {
        badge.textContent = "Ready";
        badge.classList.remove("badge-live");
      }
    });

    card.classList.add("is-selected");

    const toolKey = card.dataset.tool;
    const tool = toolDefinitions[toolKey];
    if (!tool) {
      return;
    }

    const badge = card.querySelector(".badge");
    if (badge) {
      badge.textContent = "Selected";
      badge.classList.add("badge-live");
    }

    selectedToolTitle.textContent = tool.title;
    selectedToolDescription.textContent = tool.description;
    selectedToolMeta.innerHTML = tool.meta
      .map((item) => `<span>${item}</span>`)
      .join("");
    primaryAction.textContent = tool.action;
    secondaryAction.textContent = tool.secondaryAction;
  });
});
