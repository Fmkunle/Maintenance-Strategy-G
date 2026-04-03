// Central copy and navigation config for the home-page tool selector.
const toolDefinitions = {
  maintenance: {
    title: "Maintenance Strategy Generator",
    description:
      "Generate structured maintenance strategies, tasks, and intervals with guardrails.",
    meta: [
      "RCM aligned",
      "Task library",
      "Export ready",
    ],
    action: "Create new strategy",
    secondaryAction: "Open existing",
    actionHref: null,
  },
  cba: {
    title: "Reliability Insights",
    description:
      "Surfaces cost, risk, and operational trade-offs in your maintenance strategy.",
    meta: [
      "Cost impact",
      "Risk gaps",
      "Labour allocation",
    ],
    action: "Open insights",
    secondaryAction: "Open existing",
    actionHref: "reliability-insights-overview.html",
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
    actionHref: null,
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
const themeStorageKey = "agenticai-theme";
let activeToolKey =
  document.querySelector(".tool-card--selectable.is-selected")?.dataset.tool ?? "fmea";

// Keep theme preference consistent as users move between the overview pages.
const applyTheme = (theme) => {
  if (!body) {
    return;
  }

  body.dataset.theme = theme;
};

const storedTheme = window.localStorage.getItem(themeStorageKey);
if (storedTheme === "dark" || storedTheme === "light") {
  applyTheme(storedTheme);
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  window.localStorage.setItem(themeStorageKey, nextTheme);
});

// Sync the selected tool tile with the hero card content and CTA behavior.
const applyToolSelection = (toolKey, selectedCard) => {
  const tool = toolDefinitions[toolKey];
  if (!tool) {
    return;
  }

  activeToolKey = toolKey;

  toolCards.forEach((toolCard) => {
    toolCard.classList.toggle("is-selected", toolCard === selectedCard);

    const badge = toolCard.querySelector(".badge");
    if (badge) {
      badge.textContent = toolCard === selectedCard ? "Selected" : "Ready";
      badge.classList.toggle("badge-live", toolCard === selectedCard);
    }
  });

  if (selectedToolTitle) {
    selectedToolTitle.textContent = tool.title;
  }
  if (selectedToolDescription) {
    selectedToolDescription.textContent = tool.description;
  }
  if (selectedToolMeta) {
    selectedToolMeta.innerHTML = tool.meta
      .map((item) => `<span>${item}</span>`)
      .join("");
  }
  if (primaryAction) {
    primaryAction.textContent = tool.action;
    primaryAction.dataset.href = tool.actionHref ?? "";
  }
  if (secondaryAction) {
    secondaryAction.textContent = tool.secondaryAction;
  }
};

toolCards.forEach((card) => {
  card.addEventListener("click", () => {
    applyToolSelection(card.dataset.tool, card);
  });
});

const selectedCard = document.querySelector(`.tool-card--selectable[data-tool="${activeToolKey}"]`);
if (selectedCard) {
  applyToolSelection(activeToolKey, selectedCard);
}

// Some tools stay on the landing page; others launch a dedicated workflow page.
primaryAction?.addEventListener("click", () => {
  const targetHref = toolDefinitions[activeToolKey]?.actionHref || primaryAction.dataset.href;
  if (targetHref) {
    window.location.href = targetHref;
  }
});
