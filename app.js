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
    actionHref: "reliability-insights-fiori.html",
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

// Shared drill-down data for the Economic flow. The overview total should always
// roll up from these opportunity records.
const economicOpportunities = [
  {
    id: "gbx-mfa-321",
    assetGroup: "Gearboxes MFA-321-GB01 to MFA-321-GB10",
    area: "Crushing and conveying",
    equipment: "MFA-321 gearbox group",
    title: "PM02 inspection frequency may be higher than current risk justifies",
    currentCost: 96000,
    recommendedCost: 48000,
    potentialSaving: 48000,
    riskImpact: "Low",
    confidence: "Medium",
    operationalConstraint: "Route redesign required",
    status: "Open",
    safetyImpact: "Low",
    productionImpact: "Low to moderate",
    uncontrolledExposure: "Limited",
    labourDemandReduced: "Yes",
    routeRedesignRequired: "Yes",
    shutdownDependency: "No",
    summary:
      "Current monthly PM02 inspections appear to provide limited defect detection value relative to their cost and labour demand. Available CMMS and delay history suggest the current interval may be more conservative than required for this gearbox group.",
    confidenceNote:
      "Confidence is reduced by limited direct condition evidence, possible inconsistency in historical failure coding, and incomplete mapping between PM findings and prevented failures.",
    dataReviewed:
      "PM02 work order history, inspection completion records, PM findings and corrective follow-up, breakdown history, failure coding, production delay log, downtime duration, task labour hours, asset criticality and service context",
    observedEvidence: [
      "120 PM02 inspections completed in 12 months",
      "3 actionable defects identified",
      "0 major production delay events in 18 months linked to this gearbox group",
      "Corrective work triggered from PM findings in 2.5% of inspections",
      "No clear evidence that monthly frequency is materially improving current risk control",
    ],
    assumptions: [
      "Failure mode is progressive and detectable - Partly supported",
      "P-F interval supports monthly inspection - Weak evidence",
      "PM02 task has strong probability of detection - Weak evidence",
      "Consequence justifies conservative interval - Partly supported",
      "Redundancy is low enough to justify current cost - Not clearly supported",
    ],
    operationalChallenge: [
      "PM route redesign required",
      "PM master data update required",
      "Engineering approval needed before frequency change",
      "Current task packaging may not reflect service variation across GB01 to GB10",
    ],
    recommendedAction:
      "Review changing PM02 inspection frequency from 1 month to 2 months for MFA-321-GB01 to GB10, then monitor defect yield, corrective conversion, and delay consequences over the next review cycle.",
  },
  {
    id: "cv-440-network",
    assetGroup: "Conveyor drives CV-440 to CV-468",
    area: "Processing plant",
    equipment: "Conveyor drive network",
    title: "Inspection and lubrication route density exceeds current defect yield",
    currentCost: 1320000,
    recommendedCost: 760000,
    potentialSaving: 560000,
    riskImpact: "Low to moderate",
    confidence: "High",
    operationalConstraint: "Route redesign required",
    status: "Open",
  },
  {
    id: "wm-210-fleet",
    assetGroup: "Wheel motors WM-210 fleet",
    area: "Mobile fleet",
    equipment: "Wheel motor routes",
    title: "Planned inspection routes duplicate labour across similar duty trucks",
    currentCost: 980000,
    recommendedCost: 620000,
    potentialSaving: 360000,
    riskImpact: "Low",
    confidence: "High",
    operationalConstraint: "Labour rebalance required",
    status: "Open",
  },
  {
    id: "rf-11-feeders",
    assetGroup: "Reclaim feeders RF-11 to RF-16",
    area: "Processing plant",
    equipment: "Reclaim feeder drives",
    title: "Vibration collection frequency appears conservative for current duty",
    currentCost: 620000,
    recommendedCost: 380000,
    potentialSaving: 240000,
    riskImpact: "Low to moderate",
    confidence: "Medium",
    operationalConstraint: "Condition route update required",
    status: "Open",
  },
  {
    id: "dp-401-pumps",
    assetGroup: "Dewatering pumps DP-401 to DP-412",
    area: "Water services",
    equipment: "Pump train packages",
    title: "Task packaging duplicates shutdown preparation effort",
    currentCost: 710000,
    recommendedCost: 470000,
    potentialSaving: 240000,
    riskImpact: "Low",
    confidence: "Medium",
    operationalConstraint: "Task packaging redesign",
    status: "Open",
  },
  {
    id: "sr-220-reclaimers",
    assetGroup: "Stacker reclaimer motors SR-220 series",
    area: "Port utilities",
    equipment: "Motor inspection program",
    title: "Motor inspection frequency is higher than consequence profile suggests",
    currentCost: 540000,
    recommendedCost: 360000,
    potentialSaving: 180000,
    riskImpact: "Low",
    confidence: "Medium",
    operationalConstraint: "Planner update required",
    status: "Open",
  },
  {
    id: "sw-110-switchrooms",
    assetGroup: "Switchrooms SW-110 to SW-118",
    area: "Port utilities",
    equipment: "Thermal scan program",
    title: "Thermal scan frequency is conservative for current failure history",
    currentCost: 290000,
    recommendedCost: 170000,
    potentialSaving: 120000,
    riskImpact: "Low",
    confidence: "High",
    operationalConstraint: "Approval to revise standard",
    status: "Open",
  },
  {
    id: "tbp-700-boosters",
    assetGroup: "Tailings booster pumps TBP-700 series",
    area: "Tailings pumping",
    equipment: "Booster pump maintenance strategy",
    title: "Routine PM package appears oversized for current service context",
    currentCost: 840000,
    recommendedCost: 500000,
    potentialSaving: 340000,
    riskImpact: "Low to moderate",
    confidence: "Medium",
    operationalConstraint: "Engineering review required",
    status: "Open",
  },
  {
    id: "wrb-500-blowers",
    assetGroup: "Water recovery blowers WRB-500 series",
    area: "Water recovery",
    equipment: "Blower inspection and cleaning plan",
    title: "Current inspection and cleaning interval may be more conservative than required",
    currentCost: 630000,
    recommendedCost: 318000,
    potentialSaving: 312000,
    riskImpact: "Low",
    confidence: "Medium",
    operationalConstraint: "Task sequence redesign",
    status: "Open",
  },
];

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

const formatCompactCurrency = (value) => {
  if (!Number.isFinite(value)) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: value >= 1000000 ? 1 : 0,
  }).format(value);
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const totalEconomicSavings = economicOpportunities.reduce(
  (sum, item) => sum + item.potentialSaving,
  0
);

const totalLowValueCost = economicOpportunities.reduce(
  (sum, item) => sum + (item.currentCost - item.recommendedCost),
  0
);

const economicOpportunityCount = economicOpportunities.length;

const renderEconomicOverviewRollup = () => {
  const economicTotal = document.getElementById("economicTotalSavings");
  const economicOpportunityCountNode = document.getElementById("economicOpportunityCount");
  const economicLowValueCost = document.getElementById("economicLowValueCost");

  if (economicTotal) {
    economicTotal.textContent = formatCompactCurrency(totalEconomicSavings);
  }
  if (economicOpportunityCountNode) {
    economicOpportunityCountNode.textContent = `${economicOpportunityCount} opportunities`;
  }
  if (economicLowValueCost) {
    economicLowValueCost.textContent = `${formatCompactCurrency(totalLowValueCost)} current low-value cost`;
  }
};

// Build the Economic list page from the same source data used by the overview rollup.
const renderEconomicOpportunityList = () => {
  const tableBody = document.getElementById("economicOpportunityRows");
  if (!tableBody) {
    return;
  }

  const totalPotentialSavingsNode = document.getElementById("economicListTotalSavings");
  const opportunityCountNode = document.getElementById("economicListOpportunityCount");

  if (totalPotentialSavingsNode) {
    totalPotentialSavingsNode.textContent = formatCompactCurrency(totalEconomicSavings);
  }
  if (opportunityCountNode) {
    opportunityCountNode.textContent = `${economicOpportunityCount} opportunities`;
  }

  tableBody.innerHTML = economicOpportunities
    .map(
      (opportunity) => `
        <tr data-href="economic-opportunity-detail.html?id=${opportunity.id}" tabindex="0">
          <td>${opportunity.assetGroup}</td>
          <td>${opportunity.title}</td>
          <td>${formatCurrency(opportunity.currentCost)}</td>
          <td>${formatCurrency(opportunity.recommendedCost)}</td>
          <td>${formatCurrency(opportunity.potentialSaving)}</td>
          <td>${opportunity.riskImpact}</td>
          <td>${opportunity.confidence}</td>
          <td>${opportunity.operationalConstraint}</td>
          <td>${opportunity.status}</td>
        </tr>
      `
    )
    .join("");

  tableBody.querySelectorAll("tr[data-href]").forEach((row) => {
    row.addEventListener("click", () => {
      window.location.href = row.dataset.href;
    });
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.href = row.dataset.href;
      }
    });
  });
};

const getOpportunityDetail = (opportunity) => {
  if (opportunity.id === "gbx-mfa-321") {
    return opportunity;
  }

  return {
    ...opportunity,
    summary: `Current planned maintenance activity on ${opportunity.assetGroup} appears more conservative than the present duty, defect yield, and consequence profile justify. Review data suggests there may be room to lower annual maintenance cost while maintaining current risk control.`,
    confidenceNote:
      "Confidence is moderated by mixed failure coding quality, limited direct condition evidence, and incomplete linkage between planned work and avoided consequence.",
    dataReviewed:
      "Planned maintenance history, completion records, corrective follow-up, failure coding, downtime log, production delay history, labour hours, and asset criticality context",
    observedEvidence: [
      "Planned work volume is high relative to detected actionable findings",
      "Recent history shows limited major consequence events for this asset group",
      "Corrective conversion from planned tasks is lower than expected for the current interval",
      "No clear evidence that the present task rate is materially improving risk control",
    ],
    assumptions: [
      "Failure mode remains progressive and detectable - Partly supported",
      "Current task interval is more conservative than required - Partly supported",
      "Probability of detection is strong enough at a longer interval - Under review",
      "Current service context still justifies legacy frequency - Not clearly supported",
    ],
    operationalChallenge: [
      "Maintenance route or task package update required",
      "Master data and PM plan update required",
      "Review and approval needed before interval change",
    ],
    recommendedAction: `Review reducing the current maintenance frequency or task scope for ${opportunity.assetGroup}, then monitor defect yield, corrective conversion, and consequence outcomes over the next review cycle.`,
    safetyImpact: opportunity.riskImpact === "Low" ? "Low" : "Low to moderate",
    productionImpact: opportunity.riskImpact,
    uncontrolledExposure:
      opportunity.riskImpact === "Low" ? "Limited" : "Limited to moderate",
    labourDemandReduced: "Yes",
    routeRedesignRequired: opportunity.operationalConstraint.toLowerCase().includes("route")
      ? "Yes"
      : "Partly",
    shutdownDependency:
      opportunity.operationalConstraint.toLowerCase().includes("shutdown") ? "Yes" : "No",
  };
};

// Render the third-level drill-down object page for the selected opportunity.
const renderEconomicOpportunityDetail = () => {
  const detailRoot = document.getElementById("economicOpportunityDetail");
  if (!detailRoot) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const selectedId = params.get("id") || economicOpportunities[0].id;
  const selectedOpportunity =
    economicOpportunities.find((item) => item.id === selectedId) || economicOpportunities[0];
  const detail = getOpportunityDetail(selectedOpportunity);

  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  };

  const setList = (id, items) => {
    const node = document.getElementById(id);
    if (node) {
      node.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
    }
  };

  setText("detailAssetGroup", detail.assetGroup);
  setText("detailInsightTitle", detail.title);
  setText("detailConfidence", `${detail.confidence} confidence`);
  setText("detailConfidenceSide", `${detail.confidence} confidence`);
  setText("detailSummary", detail.summary);
  setText("detailCurrentCost", formatCurrency(detail.currentCost));
  setText("detailRecommendedCost", formatCurrency(detail.recommendedCost));
  setText("detailPotentialSaving", formatCurrency(detail.potentialSaving));
  setText("detailSafetyImpact", detail.safetyImpact);
  setText("detailProductionImpact", detail.productionImpact);
  setText("detailExposureEvidence", detail.uncontrolledExposure);
  setText("detailLabourDemandReduced", detail.labourDemandReduced);
  setText("detailRouteRedesignRequired", detail.routeRedesignRequired);
  setText("detailShutdownDependency", detail.shutdownDependency);
  setText("detailConfidenceNote", detail.confidenceNote);
  setText("detailDataReviewed", detail.dataReviewed);
  setList("detailObservedEvidence", detail.observedEvidence);
  setList("detailAssumptions", detail.assumptions);
  setList("detailOperationalChallenge", detail.operationalChallenge);
  setText("detailRecommendedAction", detail.recommendedAction);
};

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

renderEconomicOverviewRollup();
renderEconomicOpportunityList();
renderEconomicOpportunityDetail();
