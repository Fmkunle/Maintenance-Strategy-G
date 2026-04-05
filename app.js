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
      "Reliability Insights shows where maintenance cost, exposure, and execution logic are misaligned.",
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
    currentFrequency: "1 month",
    recommendedFrequency: "2 months",
    expectedRiskChange: "Low",
    hoursReleased: "162 hrs/year",
    savingsDelta: "50%",
    currentExpectedExposure: "0.18 events/year",
    proposedExpectedExposure: "0.22 events/year",
    safetyConsequenceChange: "No material change",
    masterUpdatesNeeded: "10",
    implementationEffortScore: "3 / 5",
    currentLabourHours: 324,
    recommendedLabourHours: 162,
    tradeoffModel: [
      { key: "2-weeks", label: "2 weeks", cost: 168000, exposure: 0.17, riskIndex: 1.0 },
      { key: "1-month", label: "1 month", cost: 96000, exposure: 0.18, riskIndex: 1.05 },
      { key: "2-months", label: "2 months", cost: 48000, exposure: 0.22, riskIndex: 1.12 },
      { key: "3-months", label: "3 months", cost: 36000, exposure: 0.31, riskIndex: 1.3 },
      { key: "6-months", label: "6 months", cost: 24000, exposure: 0.52, riskIndex: 1.85 },
    ],
    inspectionYield: [
      {
        key: "completed",
        label: "Inspections completed",
        count: 120,
        note: "PM02 inspections were executed at high volume, but the detected value remained low.",
      },
      {
        key: "findings",
        label: "Inspections with findings",
        count: 14,
        note: "Only a small portion of inspections surfaced any finding, suggesting low defect yield.",
      },
      {
        key: "actionable",
        label: "Actionable findings",
        count: 3,
        note: "Only three inspections led to findings that justified corrective follow-up or a maintenance decision.",
      },
      {
        key: "conversions",
        label: "Corrective conversions",
        count: 3,
        note: "Corrective conversion remained low, reinforcing the view that monthly inspection demand may be too high.",
      },
    ],
    delayHistoryHours: [0, 0.5, 0, 0, 0.3, 0, 0, 0.6, 0, 0, 0, 0.4, 0, 0, 0, 0.2, 0, 1.5],
    strategyBasis: [
      {
        key: "failure-mode-understanding",
        label: "Failure mode understanding",
        systemScore: 78,
        rationale: "Failure behavior is reasonably understood for this gearbox group from work history and engineering context.",
      },
      {
        key: "mitigation-strategy-understanding",
        label: "Mitigation strategy understanding",
        systemScore: 74,
        rationale: "The current PM02 strategy intent is understood, but its present interval logic is only partly supported.",
      },
      {
        key: "detection-evidence",
        label: "Detection evidence",
        systemScore: 38,
        rationale: "Inspection yield remains weak relative to volume, limiting evidence that the current interval materially improves control.",
      },
      {
        key: "cmms-history-coverage",
        label: "CMMS history coverage",
        systemScore: 82,
        rationale: "Work order coverage is strong enough to support a review of current demand, findings, and follow-up patterns.",
      },
      {
        key: "data-quality-traceability",
        label: "Data quality and traceability",
        systemScore: 57,
        rationale: "PM-to-outcome traceability is incomplete, reducing confidence in how findings link to avoided failures.",
      },
      {
        key: "delay-consequence-history",
        label: "Delay and consequence history",
        systemScore: 71,
        rationale: "Delay history is available and consequence has been reviewed, though major event frequency remains limited.",
      },
      {
        key: "operating-context-stability",
        label: "Operating context stability",
        systemScore: 76,
        rationale: "Operating duty and service context appear stable enough for interval review without major scenario drift.",
      },
    ],
    confidenceImprovements: [
      "Cleaner failure coding",
      "More structured PM finding capture",
      "Clearer delay-event linkage",
    ],
    assumptionsMatrix: [
      {
        key: "detectability",
        label: "Detectability",
        rating: "Moderate",
        score: 0.64,
        rationale: "Defects are sometimes detected by PM02, but the low actionable yield suggests detection strength is only moderate.",
      },
      {
        key: "pf-interval-fit",
        label: "P-F interval fit",
        rating: "Weak",
        score: 0.36,
        rationale: "The available history does not strongly support a monthly interval as necessary for this gearbox group.",
      },
      {
        key: "consequence-logic",
        label: "Consequence logic",
        rating: "Moderate",
        score: 0.62,
        rationale: "Service context and delay history suggest consequence exists, but recent major production effect has remained limited.",
      },
      {
        key: "redundancy-logic",
        label: "Redundancy logic",
        rating: "Moderate",
        score: 0.6,
        rationale: "Redundancy and recoverability appear adequate in most operating states, reducing the need for a highly conservative interval.",
      },
      {
        key: "demand-frequency",
        label: "Demand frequency",
        rating: "Weak",
        score: 0.34,
        rationale: "Corrective demand triggered by PM02 has been infrequent relative to the current work volume.",
      },
      {
        key: "cost-benefit-justification",
        label: "Cost-benefit justification",
        rating: "Weak",
        score: 0.38,
        rationale: "The maintenance cost is clear, but the supported avoided consequence is comparatively small.",
      },
    ],
    summary:
      "Current monthly PM02 inspections appear to provide limited defect detection value relative to their cost and labour demand. Available CMMS and delay history suggest the current interval may be more conservative than required for this gearbox group.",
    confidenceNote:
      "Confidence is reduced by limited direct condition evidence, possible inconsistency in historical failure coding, and incomplete mapping between PM findings and prevented failures.",
    dataReviewed:
      "PM02 work orders, PM completion history, PM findings, corrective follow-up, breakdown history, delay log, labour hours, criticality, service context",
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
      "Route redesign required",
      "10 PM master records to update",
      "Planner effort 8 hrs",
      "Engineering review effort 6 hrs",
      "Shutdown not required",
    ],
    recommendedAction:
      "Change PM02 inspection interval from 1 month to 2 months for the next review cycle and monitor findings rate, corrective conversion, delay events, and repeat defects over 6 months.",
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

const formatSignedCurrency = (value) => {
  const sign = value < 0 ? "-" : "";
  return `${sign}${formatCurrency(Math.abs(value))}`;
};

const svgNamespace = "http://www.w3.org/2000/svg";
const createSvgNode = (tagName, attributes = {}) => {
  const node = document.createElementNS(svgNamespace, tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, String(value));
  });
  return node;
};

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
    currentFrequency: "Current interval",
    recommendedFrequency: "Reduced interval",
    expectedRiskChange: opportunity.riskImpact === "Low" ? "Low" : "Moderate",
    hoursReleased: "120 hrs/year",
    savingsDelta: "30%",
    currentExpectedExposure: "0.18 events/year",
    proposedExpectedExposure: "0.24 events/year",
    safetyConsequenceChange: "No material change",
    masterUpdatesNeeded: "6",
    implementationEffortScore: "3 / 5",
    currentLabourHours: 240,
    recommendedLabourHours: 120,
    tradeoffModel: [
      { key: "current", label: "Current", cost: opportunity.currentCost * 1.4, exposure: 0.16, riskIndex: 1.0 },
      { key: "baseline", label: "Baseline", cost: opportunity.currentCost, exposure: 0.18, riskIndex: 1.08 },
      { key: "recommended", label: "Recommended", cost: opportunity.recommendedCost, exposure: 0.24, riskIndex: 1.2 },
    ],
    inspectionYield: [
      {
        key: "completed",
        label: "Planned tasks completed",
        count: 100,
        note: "Planned maintenance volume remains high across the current interval.",
      },
      {
        key: "findings",
        label: "Tasks with findings",
        count: 12,
        note: "Only a small share of planned work surfaces useful findings.",
      },
      {
        key: "actionable",
        label: "Actionable findings",
        count: 4,
        note: "Actionable findings remain limited relative to the inspection volume.",
      },
      {
        key: "conversions",
        label: "Corrective conversions",
        count: 3,
        note: "Corrective conversions remain modest versus the planned work demand.",
      },
    ],
    delayHistoryHours: [0, 0.1, 0, 0, 0.2, 0, 0.1, 0, 0.2, 0, 0, 0.1],
    strategyBasis: [
      {
        key: "failure-mode-understanding",
        label: "Failure mode understanding",
        systemScore: 72,
        rationale: "Failure behavior is partly understood from recent work history and engineering standards.",
      },
      {
        key: "mitigation-strategy-understanding",
        label: "Mitigation strategy understanding",
        systemScore: 69,
        rationale: "Current mitigation logic is understood, but interval justification remains under review.",
      },
      {
        key: "detection-evidence",
        label: "Detection evidence",
        systemScore: 42,
        rationale: "Observed detection evidence remains limited relative to planned work volume.",
      },
      {
        key: "cmms-history-coverage",
        label: "CMMS history coverage",
        systemScore: 77,
        rationale: "History coverage is directionally strong enough for review and comparison.",
      },
      {
        key: "data-quality-traceability",
        label: "Data quality and traceability",
        systemScore: 54,
        rationale: "Traceability between findings, follow-up, and avoided consequence is incomplete.",
      },
      {
        key: "delay-consequence-history",
        label: "Delay and consequence history",
        systemScore: 66,
        rationale: "Delay history provides some support but remains incomplete across all scenarios.",
      },
      {
        key: "operating-context-stability",
        label: "Operating context stability",
        systemScore: 73,
        rationale: "Operating context appears stable enough to review interval or task-scope changes.",
      },
    ],
    confidenceImprovements: [
      "Cleaner failure coding",
      "More structured PM finding capture",
      "Clearer delay-event linkage",
    ],
    assumptionsMatrix: [
      {
        key: "detectability",
        label: "Detectability",
        rating: "Moderate",
        score: 0.58,
        rationale: "Detectability is partially supported, but evidence remains mixed.",
      },
      {
        key: "pf-interval-fit",
        label: "P-F interval fit",
        rating: "Weak",
        score: 0.34,
        rationale: "Interval fit remains under review due to limited direct evidence.",
      },
      {
        key: "consequence-logic",
        label: "Consequence logic",
        rating: "Moderate",
        score: 0.6,
        rationale: "Consequence logic is partly supported by service context and delay history.",
      },
      {
        key: "redundancy-logic",
        label: "Redundancy logic",
        rating: "Moderate",
        score: 0.56,
        rationale: "Redundancy appears adequate in most operating scenarios.",
      },
      {
        key: "demand-frequency",
        label: "Demand frequency",
        rating: "Weak",
        score: 0.32,
        rationale: "Observed demand remains lower than the current task frequency suggests.",
      },
      {
        key: "cost-benefit-justification",
        label: "Cost-benefit justification",
        rating: "Weak",
        score: 0.36,
        rationale: "The cost-benefit case remains directional rather than definitive.",
      },
    ],
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
  const detailState = {
    viewMode: params.get("mode") === "engineering" ? "engineering" : "executive",
    selectedScenarioKey:
      detail.tradeoffModel?.find((scenario) => scenario.label === detail.recommendedFrequency)?.key ??
      detail.tradeoffModel?.[0]?.key ??
      null,
    hoveredScenarioKey: null,
    costView: "cost",
    selectedEvidenceStageKey: detail.inspectionYield?.[2]?.key ?? detail.inspectionYield?.[0]?.key,
    reviewedStrategyBasis:
      detail.strategyBasis?.map((item) => ({
        ...item,
        reviewedScore: item.systemScore,
        reviewStatus: "Accepted",
      })) ?? [],
    showComparison: false,
    simulatedConfidenceScore: null,
  };

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

  const getTooltip = () => {
    let tooltip = document.getElementById("analyticTooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "analyticTooltip";
      tooltip.className = "analytic-tooltip";
      tooltip.hidden = true;
      document.body.appendChild(tooltip);
    }

    return tooltip;
  };

  const showTooltip = (html, event) => {
    const tooltip = getTooltip();
    tooltip.innerHTML = html;
    tooltip.hidden = false;
    tooltip.style.left = `${event.clientX + 16}px`;
    tooltip.style.top = `${event.clientY + 16}px`;
  };

  const moveTooltip = (event) => {
    const tooltip = getTooltip();
    if (!tooltip.hidden) {
      tooltip.style.left = `${event.clientX + 16}px`;
      tooltip.style.top = `${event.clientY + 16}px`;
    }
  };

  const hideTooltip = () => {
    getTooltip().hidden = true;
  };

  const attachTooltip = (node, html) => {
    node.addEventListener("mouseenter", (event) => showTooltip(html, event));
    node.addEventListener("mousemove", moveTooltip);
    node.addEventListener("mouseleave", hideTooltip);
  };

  const classifyRiskChange = (delta) => {
    if (delta <= 0.01) {
      return "None";
    }
    if (delta <= 0.05) {
      return "Low";
    }
    if (delta <= 0.15) {
      return "Moderate";
    }
    return "High";
  };

  const clampScore = (value) => Math.max(0, Math.min(100, Number(value) || 0));

  const getEvidenceStatus = (score) => {
    if (score >= 75) {
      return "Strong";
    }
    if (score >= 55) {
      return "Moderate";
    }
    return "Weak";
  };

  const getConfidenceLevel = (score) => {
    if (score >= 75) {
      return "High confidence";
    }
    if (score >= 55) {
      return "Medium confidence";
    }
    return "Low confidence";
  };

  const getRecommendationStrength = (score, scenario) => {
    const baseline =
      detail.tradeoffModel.find((item) => item.label === detail.currentFrequency) ??
      detail.tradeoffModel[0];
    const exposureDelta = Math.max(0, scenario.exposure - baseline.exposure);
    if (score >= 75 && exposureDelta <= 0.08) {
      return "Strong";
    }
    if (score >= 55) {
      return "Moderate";
    }
    return "Cautious";
  };

  const getStrategyBasisModel = (basisRows) => {
    const effectiveScores = basisRows.map((item) =>
      clampScore(item.reviewedScore) - (item.reviewStatus === "Uncertain" ? 8 : 0)
    );
    const score = Math.round(
      effectiveScores.reduce((sum, value) => sum + value, 0) / (effectiveScores.length || 1)
    );
    const sortedRows = [...basisRows].sort(
      (left, right) => clampScore(right.reviewedScore) - clampScore(left.reviewedScore)
    );

    return {
      score,
      level: getConfidenceLevel(score),
      strongest: sortedRows.slice(0, 2),
      limitations: sortedRows.slice(-2),
    };
  };

  const systemConfidenceModel = getStrategyBasisModel(
    detail.strategyBasis.map((item) => ({
      ...item,
      reviewedScore: item.systemScore,
      reviewStatus: "Accepted",
    }))
  );
  detailState.simulatedConfidenceScore = systemConfidenceModel.score;

  const getFactorShortNote = (factor) => {
    const notes = {
      "detection-evidence": "Detection evidence is weak",
      "data-quality-traceability": "PM-to-outcome traceability is incomplete",
      "cmms-history-coverage": "CMMS history coverage",
      "failure-mode-understanding": "Failure mode understanding",
    };

    return notes[factor.key] ?? factor.label;
  };

  const getSelectedScenario = () =>
    detail.tradeoffModel.find((item) => item.key === detailState.selectedScenarioKey) ??
    detail.tradeoffModel[0];

  const getReadinessModel = () => {
    const confidence = (detail.confidence || "").toLowerCase();
    if (detail.shutdownDependency === "Yes") {
      return {
        label: "Blocked by constraints",
        primaryAction: "Request engineering review",
      };
    }
    if (confidence === "high") {
      return {
        label: "Ready for approval",
        primaryAction: "Approve recommendation",
      };
    }
    return {
      label: "Requires engineering review",
      primaryAction: "Request engineering review",
    };
  };

  const getProductionImpactStatement = (exposureDelta) => {
    if (detail.shutdownDependency === "Yes") {
      return "Requires shutdown window";
    }
    if (exposureDelta <= 0.05) {
      return "No material production impact expected";
    }
    if (exposureDelta <= 0.15) {
      return "Minor planning disruption expected";
    }
    return "Elevated production uncertainty";
  };

  const getImplementationSummary = () => {
    if (detail.shutdownDependency === "Yes") {
      return "Operationally constrained";
    }
    if (detail.routeRedesignRequired === "Yes" || Number(detail.masterUpdatesNeeded) > 0) {
      return "Moderate coordination required";
    }
    return "Easy to implement";
  };

  const extractEffortHours = (labelPrefix) => {
    const match = (detail.operationalChallenge ?? [])
      .find((item) => item.toLowerCase().includes(labelPrefix))
      ?.match(/(\d+)\s*hrs?/i);
    return match ? `${match[1]} hrs` : "Pending review";
  };

  const syncDetailUrl = () => {
    const nextParams = new URLSearchParams(window.location.search);
    nextParams.set("id", selectedOpportunity.id);
    nextParams.set("mode", detailState.viewMode);
    const nextUrl = `${window.location.pathname}?${nextParams.toString()}`;
    window.history.replaceState({}, "", nextUrl);
  };

  const getSystemJudgment = (scenario, savings, exposureDelta) => {
    const riskChange = classifyRiskChange(exposureDelta).toLowerCase();
    const confidenceScore =
      detailState.simulatedConfidenceScore ?? systemConfidenceModel.score;
    const recommendationStrength = getRecommendationStrength(confidenceScore, scenario);
    if (scenario.label === detail.currentFrequency) {
      return `The current monthly interval remains the baseline reference for cost and exposure comparison. Confidence is ${confidenceScore}/100 with ${recommendationStrength.toLowerCase()} recommendation strength.`;
    }

    if (savings >= 0) {
      return `Moving to ${scenario.label} retains a ${riskChange} risk change while shifting ${formatCurrency(
        savings
      )} of annual inspection cost out of the current program. Confidence is ${confidenceScore}/100 with ${recommendationStrength.toLowerCase()} recommendation strength.`;
    }

    return `Moving to ${scenario.label} increases annual inspection cost by ${formatCurrency(
      Math.abs(savings)
    )} with a ${riskChange} risk change. Confidence is ${confidenceScore}/100 with ${recommendationStrength.toLowerCase()} recommendation strength.`;
  };

  const renderSharedHeader = (scenario) => {
    const baseline =
      detail.tradeoffModel.find((item) => item.label === detail.currentFrequency) ??
      detail.tradeoffModel[0];
    const savings = baseline.cost - scenario.cost;
    const exposureDelta = Math.max(0, scenario.exposure - baseline.exposure);
    const readiness = getReadinessModel();
    const confidenceScore = detailState.simulatedConfidenceScore ?? systemConfidenceModel.score;
    const modeHeadline =
      detailState.viewMode === "engineering"
        ? `Recommended PM02 interval change from ${detail.currentFrequency} to ${scenario.label} based on low detection yield and stable failure exposure`
        : savings >= 0
          ? `Save ${formatCurrency(savings)}/year with ${classifyRiskChange(exposureDelta).toLowerCase()} risk impact`
          : `Current interval remains the reference case under review`;
    const modeSubheadline =
      detailState.viewMode === "engineering"
        ? "Engineering review of maintenance strategy basis, confidence, and implementation constraints"
        : "Inspection interval optimization for gearbox PM02 route";

    setText("detailContextMeta", `${detail.area} - ${detail.equipment}`);
    setText("detailModeHeadline", modeHeadline);
    setText("detailModeSubheadline", modeSubheadline);
    setText("detailOpportunityType", "Cost Reduction");
    setText("detailReadinessStatus", readiness.label);
    setText("detailConfidence", getConfidenceLevel(confidenceScore));
    const confidenceBadge = document.getElementById("detailConfidence");
    if (confidenceBadge) {
      confidenceBadge.classList.remove("is-high", "is-medium", "is-low");
      confidenceBadge.classList.add(
        confidenceScore >= 75 ? "is-high" : confidenceScore >= 55 ? "is-medium" : "is-low"
      );
    }

    ["executivePrimaryAction", "executiveDecisionPrimary"].forEach((id) => {
      setText(id, readiness.primaryAction);
    });
  };

  const renderExecutiveSummary = (scenario) => {
    const baseline =
      detail.tradeoffModel.find((item) => item.label === detail.currentFrequency) ??
      detail.tradeoffModel[0];
    const savings = baseline.cost - scenario.cost;
    const exposureDelta = Math.max(0, scenario.exposure - baseline.exposure);
    const confidenceModel = getStrategyBasisModel(detailState.reviewedStrategyBasis);
    const strongest = confidenceModel.strongest.map((factor) => getFactorShortNote(factor));
    const limitations = confidenceModel.limitations.map((factor) => getFactorShortNote(factor));

    setText("execCurrentFrequency", detail.currentFrequency);
    setText("execCurrentCost", `Annual cost: ${formatCurrency(baseline.cost)}`);
    setText("execCurrentRisk", `Current risk level: ${detail.safetyImpact}`);
    setText("execRecommendedFrequency", scenario.label);
    setText("execRecommendedCost", `Annual cost: ${formatCurrency(scenario.cost)}`);
    setText("execRecommendedRisk", `Expected risk change: ${classifyRiskChange(exposureDelta)}`);
    setText("execBusinessImpact", `${formatSignedCurrency(savings)} / year`);
    setText("execHoursReleased", `${detail.hoursReleased} released`);
    setText("execProductionImpact", getProductionImpactStatement(exposureDelta));
    setText("execRiskSummary", `${classifyRiskChange(exposureDelta)} exposure change`);
    setText("execWorstCaseConsequence", "Worst-case consequence estimate not yet available");
    setText("execExposureDelta", `Exposure change: ${(scenario.exposure - baseline.exposure).toFixed(2)} events/year`);
    setText("execConfidenceScore", `${confidenceModel.score} / 100`);
    setText("execConfidenceLabel", confidenceModel.level);
    setText(
      "execConfidenceSummary",
      `${confidenceModel.level} due to strong ${strongest.join(" and ").toLowerCase()} but ${limitations.join(" and ").toLowerCase()}.`
    );
    setText("detailImplementationSummary", getImplementationSummary());
    setText("detailImplementationTime", "Estimated implementation time pending planner logic");
    setText("execRouteRedesignRequired", detail.routeRedesignRequired);
    setText("execMasterUpdatesNeeded", detail.masterUpdatesNeeded);
    setText("execPlannerEffort", extractEffortHours("planner effort"));
    setText("execEngineeringEffort", extractEffortHours("engineering review effort"));
    setText("execShutdownRequired", detail.shutdownDependency);
    setText("execWhyRecommendation", detail.summary);
    setText(
      "execWhyPreview",
      "Low finding yield relative to inspection effort; no material evidence current frequency improves control."
    );
    setText(
      "execConfidencePreview",
      `${confidenceModel.score}/100 - strongest in ${strongest[0]?.toLowerCase() ?? "CMMS history"}, weakest in ${limitations[0]?.toLowerCase() ?? "detection evidence"}.`
    );
    setText(
      "execConfidenceDetail",
      `${confidenceModel.level}. Strongest support: ${strongest.join(", ")}. Main limitations: ${limitations.join(", ")}.`
    );
    setText(
      "execImplementationPreview",
      `${detail.routeRedesignRequired === "Yes" ? "Route redesign required" : "Route redesign not required"}; ${detail.shutdownDependency === "Yes" ? "shutdown needed" : "no shutdown needed"}.`
    );
    setText(
      "execEvidencePreview",
      `${detail.inspectionYield?.[0]?.count ?? 0} inspections, ${detail.inspectionYield?.[2]?.count ?? 0} actionable findings, 0 major delay events.`
    );
    setList("execImplementationConsiderations", detail.operationalChallenge);
    setList("execEvidenceSnapshot", detail.observedEvidence.slice(0, 4));
  };

  const applyViewMode = (mode) => {
    detailState.viewMode = mode === "engineering" ? "engineering" : "executive";
    const executiveView = document.getElementById("executiveView");
    const engineeringView = document.getElementById("engineeringView");
    if (executiveView) {
      executiveView.hidden = detailState.viewMode !== "executive";
    }
    if (engineeringView) {
      engineeringView.hidden = detailState.viewMode !== "engineering";
    }

    document.querySelectorAll("[data-mode-actions]").forEach((node) => {
      node.hidden = node.getAttribute("data-mode-actions") !== detailState.viewMode;
    });

    document.querySelectorAll("[data-view-mode]").forEach((button) => {
      const isActive = button.getAttribute("data-view-mode") === detailState.viewMode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    renderSharedHeader(getSelectedScenario());
    syncDetailUrl();
  };

  const updateDecisionSnapshot = (scenario) => {
    const baseline =
      detail.tradeoffModel.find((item) => item.label === detail.currentFrequency) ??
      detail.tradeoffModel[0];
    const savings = baseline.cost - scenario.cost;
    const exposureDelta = Math.max(0, scenario.exposure - baseline.exposure);
    const confidenceScore = detailState.simulatedConfidenceScore ?? systemConfidenceModel.score;

    setText("detailCurrentFrequency", detail.currentFrequency);
    setText("detailRecommendedFrequency", scenario.label);
    setText("detailAnnualSavingKpi", formatSignedCurrency(savings));
    setText("detailRiskChangeKpi", classifyRiskChange(exposureDelta));
    setText(
      "detailCurrentFrequencyHint",
      scenario.label === detail.currentFrequency
        ? "Current PM02 interval"
        : `Baseline for ${scenario.label} comparison`
    );
    setText("detailRecommendedFrequencyHint", "Selected interval under review");
    setText(
      "detailAnnualSavingHint",
      savings >= 0 ? "Relative to current annual cost" : "Additional cost relative to current"
    );
    setText(
      "detailRiskChangeHint",
      exposureDelta <= 0.05
        ? "Exposure increase remains limited"
        : exposureDelta <= 0.15
          ? "Exposure rises but remains manageable"
          : "Exposure rises materially"
    );
    setText("recommendationStrength", getRecommendationStrength(confidenceScore, scenario));
    ["detailSystemJudgment", "detailSystemJudgmentExecutive"].forEach((id) => {
      setText(id, getSystemJudgment(scenario, savings, exposureDelta));
    });
    setText("detailCurrentCost", formatCurrency(baseline.cost));
    setText("detailRecommendedCost", formatCurrency(scenario.cost));
    setText("detailEconomicPrimary", formatSignedCurrency(savings));
    setText("detailRiskPrimary", `${scenario.exposure.toFixed(2)} events/year`);
    setText("detailProposedExpectedExposure", `${scenario.exposure.toFixed(2)} events/year`);
    renderSharedHeader(scenario);
    renderExecutiveSummary(scenario);
  };

  const renderTradeoffChart = () => {
    const chartTargets = ["tradeoffChartSvgExecutive", "tradeoffChartSvg"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!chartTargets.length || !detail.tradeoffModel?.length) {
      return;
    }

    const width = 980;
    const height = 400;
    const padding = { top: 48, right: 88, bottom: 78, left: 92 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const maxCost = Math.max(...detail.tradeoffModel.map((item) => item.cost));
    const maxExposure = Math.max(...detail.tradeoffModel.map((item) => item.exposure));
    const xStep = plotWidth / (detail.tradeoffModel.length - 1 || 1);
    const xFor = (index) => padding.left + index * xStep;
    const yForCost = (value) => padding.top + plotHeight - (value / maxCost) * plotHeight;
    const yForExposure = (value) =>
      padding.top + plotHeight - (value / maxExposure) * plotHeight;
    const selectedScenario = getSelectedScenario();
    const hoveredScenario =
      detail.tradeoffModel.find((item) => item.key === detailState.hoveredScenarioKey) ?? null;
    const activeScenario = hoveredScenario ?? selectedScenario;
    const currentKey =
      detail.tradeoffModel.find((item) => item.label === detail.currentFrequency)?.key ??
      detail.tradeoffModel[0].key;
    const recommendedKey =
      detail.tradeoffModel.find((item) => item.label === "2 months")?.key ??
      detail.tradeoffModel[0].key;
    const recommendedStart = detail.tradeoffModel.findIndex((item) => item.label === "2 months");
    const recommendedEnd = detail.tradeoffModel.findIndex((item) => item.label === "3 months");

    const buildScenarioTooltip = (item) => `
      <strong>${item.label}</strong>
      <span>Annual cost: ${formatCurrency(item.cost)}</span>
      <span>Exposure: ${item.exposure.toFixed(2)} events/year</span>
      <span>Risk index: ${item.riskIndex.toFixed(2)}</span>
    `;

    const bindOverlayEvents = (svg, overlay) => {
      overlay.addEventListener("mousemove", (event) => {
        const rect = svg.getBoundingClientRect();
        const relativeX = ((event.clientX - rect.left) / rect.width) * width;
        const nearestScenario =
          detail.tradeoffModel.reduce((closest, item, index) => {
            const distance = Math.abs(relativeX - xFor(index));
            if (!closest || distance < closest.distance) {
              return { item, distance };
            }
            return closest;
          }, null)?.item ?? detail.tradeoffModel[0];

        if (detailState.hoveredScenarioKey !== nearestScenario.key) {
          detailState.hoveredScenarioKey = nearestScenario.key;
          renderTradeoffChart();
        }

        showTooltip(buildScenarioTooltip(nearestScenario), event);
      });

      overlay.addEventListener("mouseleave", () => {
        detailState.hoveredScenarioKey = null;
        hideTooltip();
        renderTradeoffChart();
      });

      overlay.addEventListener("click", () => {
        const activeKey = detailState.hoveredScenarioKey ?? selectedScenario.key;
        detailState.selectedScenarioKey = activeKey;
        renderTradeoffChart();
      });
    };

    chartTargets.forEach((svg) => {
      svg.innerHTML = "";

      if (recommendedStart >= 0 && recommendedEnd >= 0) {
        svg.appendChild(
          createSvgNode("rect", {
            x: xFor(recommendedStart) - xStep * 0.45,
            y: padding.top,
            width: xFor(recommendedEnd) - xFor(recommendedStart) + xStep * 0.9,
            height: plotHeight,
            class: "tradeoff-chart__zone",
          })
        );

        const zoneCaption = createSvgNode("text", {
          x: (xFor(recommendedStart) + xFor(recommendedEnd)) / 2,
          y: padding.top + 18,
          "text-anchor": "middle",
          class: "tradeoff-chart__zone-caption",
        });
        zoneCaption.textContent = "Preferred trade-off zone";
        svg.appendChild(zoneCaption);
      }

      [0, 0.33, 0.66, 1].forEach((tick) => {
        const y = padding.top + plotHeight - plotHeight * tick;
        svg.appendChild(
          createSvgNode("line", {
            x1: padding.left,
            y1: y,
            x2: width - padding.right,
            y2: y,
            class: "tradeoff-chart__grid",
          })
        );

        const leftLabel = createSvgNode("text", {
          x: padding.left - 12,
          y: y + 4,
          "text-anchor": "end",
          class: "tradeoff-chart__axis-label tradeoff-chart__axis-label--left",
        });
        leftLabel.textContent = formatCompactCurrency(maxCost * tick);
        svg.appendChild(leftLabel);

        const rightLabel = createSvgNode("text", {
          x: width - padding.right + 14,
          y: y + 4,
          class: "tradeoff-chart__axis-label tradeoff-chart__axis-label--right",
        });
        rightLabel.textContent = (maxExposure * tick).toFixed(2);
        svg.appendChild(rightLabel);
      });

      const leftAxisTitle = createSvgNode("text", {
        x: 28,
        y: padding.top + plotHeight / 2,
        transform: `rotate(-90 28 ${padding.top + plotHeight / 2})`,
        class: "tradeoff-chart__axis-title",
      });
      leftAxisTitle.textContent = "Annual cost ($)";
      svg.appendChild(leftAxisTitle);

      const rightAxisTitle = createSvgNode("text", {
        x: width - 22,
        y: padding.top + plotHeight / 2,
        transform: `rotate(90 ${width - 22} ${padding.top + plotHeight / 2})`,
        class: "tradeoff-chart__axis-title",
      });
      rightAxisTitle.textContent = "Exposure (events/yr)";
      svg.appendChild(rightAxisTitle);

      [
        { x1: padding.left, y1: padding.top, x2: padding.left, y2: padding.top + plotHeight },
        {
          x1: width - padding.right,
          y1: padding.top,
          x2: width - padding.right,
          y2: padding.top + plotHeight,
        },
        {
          x1: padding.left,
          y1: padding.top + plotHeight,
          x2: width - padding.right,
          y2: padding.top + plotHeight,
        },
      ].forEach((line) => {
        svg.appendChild(createSvgNode("line", { ...line, class: "tradeoff-chart__axis" }));
      });

      const costPath = detail.tradeoffModel
        .map((item, index) => `${index === 0 ? "M" : "L"} ${xFor(index)} ${yForCost(item.cost)}`)
        .join(" ");
      const exposurePath = detail.tradeoffModel
        .map(
          (item, index) => `${index === 0 ? "M" : "L"} ${xFor(index)} ${yForExposure(item.exposure)}`
        )
        .join(" ");

      svg.appendChild(
        createSvgNode("path", { d: costPath, class: "tradeoff-chart__line tradeoff-chart__line--cost" })
      );
      svg.appendChild(
        createSvgNode("path", {
          d: exposurePath,
          class: "tradeoff-chart__line tradeoff-chart__line--exposure",
        })
      );

      const activeIndex = detail.tradeoffModel.findIndex((item) => item.key === activeScenario.key);
      if (activeIndex >= 0) {
        svg.appendChild(
          createSvgNode("line", {
            x1: xFor(activeIndex),
            y1: padding.top,
            x2: xFor(activeIndex),
            y2: padding.top + plotHeight,
            class: "tradeoff-chart__guide-line",
          })
        );
      }

      detail.tradeoffModel.forEach((item, index) => {
        const x = xFor(index);
        const isCurrent = item.key === currentKey;
        const isRecommended = item.key === recommendedKey;
        const pointTooltip = buildScenarioTooltip(item);

        if (isRecommended) {
          svg.appendChild(
            createSvgNode("circle", {
              cx: x,
              cy: yForCost(item.cost),
              r: 12,
              class: "tradeoff-chart__halo",
            })
          );
          svg.appendChild(
            createSvgNode("circle", {
              cx: x,
              cy: yForExposure(item.exposure),
              r: 12,
              class: "tradeoff-chart__halo",
            })
          );
        }

        const costDot = createSvgNode("circle", {
          cx: x,
          cy: yForCost(item.cost),
          r: isRecommended ? 8 : isCurrent ? 6 : 4,
          class: [
            "tradeoff-chart__dot",
            "tradeoff-chart__dot--cost",
            isCurrent ? "is-current" : "",
            isRecommended ? "is-recommended" : "",
          ]
            .filter(Boolean)
            .join(" "),
        });
        const exposureDot = createSvgNode("circle", {
          cx: x,
          cy: yForExposure(item.exposure),
          r: isRecommended ? 8 : isCurrent ? 6 : 4,
          class: [
            "tradeoff-chart__dot",
            "tradeoff-chart__dot--exposure",
            isCurrent ? "is-current" : "",
            isRecommended ? "is-recommended" : "",
          ]
            .filter(Boolean)
            .join(" "),
        });

        [costDot, exposureDot].forEach((node) => {
          attachTooltip(node, pointTooltip);
          node.addEventListener("click", () => {
            detailState.selectedScenarioKey = item.key;
            renderTradeoffChart();
          });
        });

        svg.appendChild(costDot);
        svg.appendChild(exposureDot);

        if (isCurrent || isRecommended) {
          const markerLabel = createSvgNode("text", {
            x,
            y:
              Math.min(yForCost(item.cost), yForExposure(item.exposure)) - (isRecommended ? 30 : 20),
            dy: isRecommended ? 0 : -2,
            "text-anchor": "middle",
            class: "tradeoff-chart__point-label",
          });
          markerLabel.textContent = isCurrent ? "Current" : "Recommended";
          svg.appendChild(markerLabel);
        }

        const label = createSvgNode("text", {
          x,
          y: height - 16,
          "text-anchor": "middle",
          class: `tradeoff-chart__x-label ${item.key === activeScenario.key ? "is-active" : ""}`,
        });
        label.textContent = item.label;
        svg.appendChild(label);
      });

      const overlay = createSvgNode("rect", {
        x: padding.left - xStep * 0.5,
        y: padding.top,
        width: plotWidth + xStep,
        height: plotHeight,
        class: "tradeoff-chart__overlay",
      });

      bindOverlayEvents(svg, overlay);
      svg.appendChild(overlay);
    });

    updateDecisionSnapshot(selectedScenario);
  };

  const renderInspectionYieldChart = () => {
    const svg = document.getElementById("inspectionYieldChart");
    if (!svg || !detail.inspectionYield?.length) {
      return;
    }

    const width = 480;
    const stageHeight = 24;
    const baseCount = detail.inspectionYield[0].count;
    svg.innerHTML = "";

    detail.inspectionYield.forEach((stage, index) => {
      const y = 22 + index * 46;
      const stageWidth = 248 * (stage.count / baseCount);
      const x = 124;
      const percentage = (stage.count / baseCount) * 100;
      const priorCount = index === 0 ? baseCount : detail.inspectionYield[index - 1].count;
      const stageConversion = index === 0 ? 100 : (stage.count / priorCount) * 100;

      const hitArea = createSvgNode("rect", {
        x: 16,
        y: y - 6,
        width: 436,
        height: 34,
        rx: 12,
        class: "funnel-chart__hit-area",
      });
      const bar = createSvgNode("rect", {
        x,
        y,
        width: stageWidth,
        height: stageHeight,
        rx: 12,
        class: `funnel-chart__stage ${stage.key === detailState.selectedEvidenceStageKey ? "is-selected" : ""}`,
      });
      const label = createSvgNode("text", { x: 20, y: y + 15, class: "funnel-chart__label" });
      label.textContent = stage.label.replace("Inspections ", "").replace("Corrective ", "");
      const value = createSvgNode("text", {
        x: width - 16,
        y: y + 15,
        "text-anchor": "end",
        class: "funnel-chart__value",
      });
      value.textContent = `${stage.count}`;

      attachTooltip(
        hitArea,
          `<strong>${stage.label}</strong><span>${stage.count} items</span><span>${percentage.toFixed(1)}% of completed inspections</span><span>${stageConversion.toFixed(1)}% conversion from prior stage</span>`
      );
      hitArea.addEventListener("click", () => {
        detailState.selectedEvidenceStageKey = stage.key;
        showTooltip(
          `<strong>${stage.label}</strong><span>${stage.count} items</span><span>${stage.note}</span>`,
          { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }
        );
        renderInspectionYieldChart();
      });

      svg.appendChild(hitArea);
      svg.appendChild(bar);
      svg.appendChild(label);
      svg.appendChild(value);

      if (index > 0) {
        const conversionNote = createSvgNode("text", {
          x: 74,
          y: y + 33,
          "text-anchor": "start",
          class: "funnel-chart__conversion",
        });
        conversionNote.textContent = `${stageConversion.toFixed(1)}% from prior`;
        svg.appendChild(conversionNote);
      }
    });
  };

  const renderCostComparisonChart = () => {
    const svg = document.getElementById("costComparisonChart");
    const toggle = document.getElementById("costViewToggle");
    const chip = document.getElementById("costDeltaChip");
    if (!svg || !toggle) {
      return;
    }

    const views = {
      cost: {
        current: detail.currentCost,
        recommended: detail.recommendedCost,
        formatter: formatCurrency,
        label: "annual cost",
      },
      hours: {
        current: detail.currentLabourHours,
        recommended: detail.recommendedLabourHours,
        formatter: (value) => `${value} hrs`,
        label: "labour hours",
      },
    };
    const activeView = views[detailState.costView] ?? views.cost;
    const delta = activeView.current - activeView.recommended;
    const percentReduction = activeView.current === 0 ? 0 : Math.round((delta / activeView.current) * 100);
    const width = 480;
    const height = 240;
    const padding = { top: 20, right: 20, bottom: 36, left: 44 };
    const plotHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(activeView.current, activeView.recommended) * 1.15;
    const bars = [
      { label: "Current", value: activeView.current, className: "current", x: 122 },
      { label: "Recommended", value: activeView.recommended, className: "recommended", x: 274 },
    ];

    toggle.querySelectorAll("[data-cost-view]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.costView === detailState.costView);
      button.onclick = () => {
        detailState.costView = button.dataset.costView;
        renderCostComparisonChart();
      };
    });

    if (chip) {
      chip.textContent =
        detailState.costView === "hours"
          ? `-${delta} hrs / -${percentReduction}%`
          : `-${formatCurrency(delta)} / -${percentReduction}%`;
    }

    setText(
      "costCompareCurrent",
      detailState.costView === "hours"
        ? `${activeView.current} hrs`
        : formatCurrency(activeView.current)
    );
    setText(
      "costCompareRecommended",
      detailState.costView === "hours"
        ? `${activeView.recommended} hrs`
        : formatCurrency(activeView.recommended)
    );

    svg.innerHTML = "";
    [0, 0.5, 1].forEach((tick) => {
      const y = padding.top + plotHeight - plotHeight * tick;
      svg.appendChild(
        createSvgNode("line", {
          x1: padding.left,
          y1: y,
          x2: width - padding.right,
          y2: y,
          class: "bar-compare__grid",
        })
      );
    });

    [0, 0.5, 1].forEach((tick) => {
      const label = createSvgNode("text", {
        x: padding.left - 8,
        y: padding.top + plotHeight - plotHeight * tick + 4,
        "text-anchor": "end",
        class: "bar-compare__axis-label",
      });
      label.textContent = activeView.formatter(Math.round(maxValue * tick));
      svg.appendChild(label);
    });

    bars.forEach((barData) => {
      const barHeight = (barData.value / maxValue) * plotHeight;
      const y = padding.top + plotHeight - barHeight;
      const bar = createSvgNode("rect", {
        x: barData.x,
        y,
        width: 74,
        height: barHeight,
        rx: 12,
        class: `bar-compare__bar bar-compare__bar--${barData.className}`,
      });
      attachTooltip(
        bar,
        `<strong>${barData.label} ${activeView.label}</strong><span>${activeView.formatter(barData.value)}</span>`
      );
      svg.appendChild(bar);

      const value = createSvgNode("text", {
        x: barData.x + 37,
        y: y - 10,
        "text-anchor": "middle",
        class: "bar-compare__value",
      });
      value.textContent = activeView.formatter(barData.value);
      svg.appendChild(value);

      const label = createSvgNode("text", {
        x: barData.x + 37,
        y: height - 12,
        "text-anchor": "middle",
        class: "bar-compare__label",
      });
      label.textContent = barData.label;
      svg.appendChild(label);
    });
  };

  const renderDelayHistoryChart = () => {
    const svg = document.getElementById("delayHistoryChart");
    if (!svg || !detail.delayHistoryHours?.length) {
      return;
    }

    const width = 480;
    const height = 240;
    const padding = { top: 18, right: 18, bottom: 34, left: 28 };
    const plotHeight = height - padding.top - padding.bottom;
    const plotWidth = width - padding.left - padding.right;
    const maxValue = Math.max(...detail.delayHistoryHours);
    const step = plotWidth / detail.delayHistoryHours.length;
    const barWidth = Math.max(8, step - 5);
    svg.innerHTML = "";

    [0, 0.5, 1].forEach((tick) => {
      const y = padding.top + plotHeight - plotHeight * tick;
      svg.appendChild(
        createSvgNode("line", {
          x1: padding.left,
          y1: y,
          x2: width - padding.right,
          y2: y,
          class: "delay-chart__grid",
        })
      );
    });

    [0, 0.5, 1].forEach((tick) => {
      const label = createSvgNode("text", {
        x: padding.left - 6,
        y: padding.top + plotHeight - plotHeight * tick + 4,
        "text-anchor": "end",
        class: "delay-chart__axis-label",
      });
      label.textContent = (maxValue * tick).toFixed(1);
      svg.appendChild(label);
    });

    detail.delayHistoryHours.forEach((value, index) => {
      const x = padding.left + index * step + (step - barWidth) / 2;
      const barHeight = maxValue === 0 ? 0 : (value / maxValue) * plotHeight;
      const y = padding.top + plotHeight - barHeight;
      const bar = createSvgNode("rect", {
        x,
        y,
        width: barWidth,
        height: Math.max(2, barHeight),
        rx: 6,
        class: "delay-chart__bar",
      });
      attachTooltip(bar, `<strong>Month ${index + 1}</strong><span>${value.toFixed(1)} delay hours</span>`);
      svg.appendChild(bar);
    });

    [1, 6, 12, 18].forEach((month) => {
      const x = padding.left + (month - 0.5) * step;
      const label = createSvgNode("text", {
        x,
        y: height - 10,
        "text-anchor": "middle",
        class: "delay-chart__label",
      });
      label.textContent = `${month}`;
      svg.appendChild(label);
    });
  };

  const renderConfidenceModel = () => {
    const confidenceDrivers = document.getElementById("confidenceDrivers");
    const confidenceStrengths = document.getElementById("confidenceStrengths");
    const confidenceLimitations = document.getElementById("confidenceLimitations");
    const confidenceImprovements = document.getElementById("confidenceImprovements");
    const model = getStrategyBasisModel(detailState.reviewedStrategyBasis);

    setText("detailConfidence", model.level);
    setText("detailConfidenceSide", model.level);
    setText("detailConfidenceScore", String(model.score));

    if (confidenceDrivers) {
      confidenceDrivers.innerHTML = detailState.reviewedStrategyBasis
        .map((factor) => {
          const score = clampScore(factor.reviewedScore);
          return `
            <div class="economic-confidence-driver">
              <span>${factor.label}</span>
              <div class="economic-confidence-driver__track">
                <span class="is-${getEvidenceStatus(score).toLowerCase()}" style="width: ${score}%;"></span>
              </div>
              <strong>${score}</strong>
            </div>
          `;
        })
        .join("");
    }

    if (confidenceStrengths) {
      confidenceStrengths.innerHTML = model.strongest
        .map((factor) => `<li>${getFactorShortNote(factor)}</li>`)
        .join("");
    }

    if (confidenceLimitations) {
      confidenceLimitations.innerHTML = model.limitations
        .map((factor) => `<li>${getFactorShortNote(factor)}</li>`)
        .join("");
    }

    if (confidenceImprovements) {
      confidenceImprovements.innerHTML = (detail.confidenceImprovements ?? [])
        .map((item) => `<li>${item}</li>`)
        .join("");
    }

    setText(
      "recommendationStrength",
      getRecommendationStrength(
        detailState.simulatedConfidenceScore ?? systemConfidenceModel.score,
        detail.tradeoffModel.find((item) => item.key === detailState.selectedScenarioKey) ??
          detail.tradeoffModel[0]
      )
    );

    renderSharedHeader(getSelectedScenario());
    renderExecutiveSummary(getSelectedScenario());
  };

  const renderStrategyBasisTable = () => {
    const tableBody = document.getElementById("strategyBasisRows");
    const comparePanel = document.getElementById("strategyComparePanel");

    if (!tableBody || !detailState.reviewedStrategyBasis.length) {
      return;
    }

    tableBody.innerHTML = detailState.reviewedStrategyBasis
      .map(
        (item) => {
          const reviewedScore = clampScore(item.reviewedScore);
          const evidenceStatus = getEvidenceStatus(reviewedScore);
          return `
          <tr data-factor-key="${item.key}">
            <td>
              <div class="economic-review-factor">
                <strong>${item.label}</strong>
              </div>
            </td>
            <td>
              <div class="economic-score-cell">
                <strong>${item.systemScore}</strong>
                <div class="economic-score-bar">
                  <span class="is-${getEvidenceStatus(item.systemScore).toLowerCase()}" style="width: ${item.systemScore}%;"></span>
                </div>
              </div>
            </td>
            <td>
              <div class="economic-score-input">
                <input type="number" min="0" max="100" value="${reviewedScore}" data-review-score="${item.key}" aria-label="Reviewed score for ${item.label}">
                <div class="economic-score-bar economic-score-bar--reviewed">
                  <span class="is-${evidenceStatus.toLowerCase()}" style="width: ${reviewedScore}%;"></span>
                </div>
              </div>
            </td>
            <td>
              <span class="economic-evidence-pill economic-evidence-pill--${evidenceStatus.toLowerCase()}">${evidenceStatus}</span>
            </td>
            <td>
              <select data-review-status="${item.key}" aria-label="Review status for ${item.label}">
                ${["Accepted", "Adjusted", "Uncertain"]
                  .map(
                    (status) =>
                      `<option value="${status}" ${item.reviewStatus === status ? "selected" : ""}>${status}</option>`
                  )
                  .join("")}
              </select>
            </td>
            <td>
              <span class="economic-review-note">${item.rationale}</span>
            </td>
          </tr>
        `
        }
      )
      .join("");

    tableBody.querySelectorAll("[data-review-score]").forEach((input) => {
      input.addEventListener("input", () => {
        const factor = detailState.reviewedStrategyBasis.find(
          (item) => item.key === input.dataset.reviewScore
        );
        if (!factor) {
          return;
        }

        factor.reviewedScore = clampScore(input.value);
        if (factor.reviewStatus !== "Uncertain") {
          factor.reviewStatus =
            factor.reviewedScore === factor.systemScore ? "Accepted" : "Adjusted";
        }
        renderStrategyBasisTable();
        renderConfidenceModel();
      });
    });

    tableBody.querySelectorAll("[data-review-status]").forEach((select) => {
      select.addEventListener("change", () => {
        const factor = detailState.reviewedStrategyBasis.find(
          (item) => item.key === select.dataset.reviewStatus
        );
        if (!factor) {
          return;
        }

        factor.reviewStatus = select.value;
        renderStrategyBasisTable();
        renderConfidenceModel();
      });
    });

    tableBody.querySelectorAll("tr[data-factor-key]").forEach((row) => {
      const factor = detailState.reviewedStrategyBasis.find(
        (item) => item.key === row.dataset.factorKey
      );
      if (!factor) {
        return;
      }

      attachTooltip(
        row,
        `<strong>${factor.label}</strong><span>System score: ${factor.systemScore}</span><span>${factor.rationale}</span>`
      );
    });

    const reviewedModel = getStrategyBasisModel(detailState.reviewedStrategyBasis);
    const simulatedScenario =
      detail.tradeoffModel.find((item) => item.key === detailState.selectedScenarioKey) ??
      detail.tradeoffModel[0];
    const reviewedStrength = getRecommendationStrength(reviewedModel.score, simulatedScenario);
    const confidenceDelta = reviewedModel.score - systemConfidenceModel.score;

    if (comparePanel) {
      comparePanel.hidden = !detailState.showComparison;
    }
    setText("compareConfidenceBefore", `${systemConfidenceModel.score} / 100`);
    setText("compareConfidenceAfter", `${reviewedModel.score} / 100`);
    setText("compareConfidenceDelta", confidenceDelta === 0 ? "0" : `${confidenceDelta > 0 ? "+" : ""}${confidenceDelta}`);
    setText(
      "compareStrengthBefore",
      `${getRecommendationStrength(systemConfidenceModel.score, simulatedScenario)} recommendation strength`
    );
    setText("compareStrengthAfter", `${reviewedStrength} recommendation strength`);
    setText(
      "compareDeltaInterpretation",
      confidenceDelta === 0
        ? "No confidence change after review"
        : confidenceDelta > 0
          ? "Reviewed strategy basis increases confidence in the recommendation"
          : "Reviewed strategy basis reduces confidence in the recommendation"
    );
  };

  const rerenderRecommendationModel = () => {
    const currentScenario =
      detail.tradeoffModel.find((item) => item.key === detailState.selectedScenarioKey) ??
      detail.tradeoffModel[0];
    updateDecisionSnapshot(currentScenario);
    renderConfidenceModel();
    renderStrategyBasisTable();
  };

  document.getElementById("resimulateRecommendation")?.addEventListener("click", () => {
    const reviewedModel = getStrategyBasisModel(detailState.reviewedStrategyBasis);
    const currentScenario =
      detail.tradeoffModel.find((item) => item.key === detailState.selectedScenarioKey) ??
      detail.tradeoffModel[0];

    detailState.simulatedConfidenceScore = reviewedModel.score;
    detailState.showComparison = true;
    rerenderRecommendationModel();
  });

  document.getElementById("resetStrategyBasis")?.addEventListener("click", () => {
    detailState.reviewedStrategyBasis = detail.strategyBasis.map((item) => ({
      ...item,
      reviewedScore: item.systemScore,
      reviewStatus: "Accepted",
    }));
    detailState.simulatedConfidenceScore = systemConfidenceModel.score;
    rerenderRecommendationModel();
  });

  document.getElementById("toggleBasisCompare")?.addEventListener("click", () => {
    detailState.showComparison = !detailState.showComparison;
    renderStrategyBasisTable();
  });

  document.querySelectorAll("[data-view-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      applyViewMode(button.getAttribute("data-view-mode"));
    });
  });

  ["executiveReviewEngineering", "executiveReviewEngineeringSecondary", "executivePrimaryAction", "executiveDecisionPrimary"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => {
      applyViewMode("engineering");
    });
  });

  document.getElementById("executiveRunSimulation")?.addEventListener("click", () => {
    applyViewMode("engineering");
  });

  setText("detailAssetGroup", detail.assetGroup);
  setText("detailConfidence", `${detail.confidence} confidence`);
  setText("detailConfidenceSide", `${detail.confidence} confidence`);
  setText("detailCurrentFrequency", detail.currentFrequency);
  setText("detailRecommendedFrequency", detail.recommendedFrequency);
  setText("detailAnnualSavingKpi", formatCurrency(detail.potentialSaving));
  setText("detailRiskChangeKpi", detail.expectedRiskChange);
  setText("detailRecommendedFrequencyHint", "Selected interval under review");
  setText("detailAnnualSavingHint", "Relative to current annual cost");
  setText("detailRiskChangeHint", "Exposure increase remains limited");
  setText("detailCurrentCost", formatCurrency(detail.currentCost));
  setText("detailRecommendedCost", formatCurrency(detail.recommendedCost));
  setText("detailEconomicPrimary", formatCurrency(detail.potentialSaving));
  setText("detailPotentialSaving", formatCurrency(detail.potentialSaving));
  setText("detailCostReduction", formatCurrency(detail.potentialSaving));
  setText("detailHoursReleased", detail.hoursReleased);
  setText("detailSavingsDelta", detail.savingsDelta);
  setText("detailCurrentExpectedExposure", detail.currentExpectedExposure);
  setText("detailProposedExpectedExposure", detail.proposedExpectedExposure);
  setText("detailRiskPrimary", detail.proposedExpectedExposure);
  setText("detailSafetyConsequenceChange", detail.safetyConsequenceChange);
  setText("detailSafetyImpact", detail.safetyImpact);
  setText("detailProductionImpact", detail.productionImpact);
  setText("detailExposureEvidence", detail.uncontrolledExposure);
  setText("detailLabourDemandReduced", detail.labourDemandReduced);
  setText("detailRouteRedesignRequired", detail.routeRedesignRequired);
  setText("detailRouteRedesignFlag", detail.routeRedesignRequired);
  setText("detailMasterUpdatesNeeded", detail.masterUpdatesNeeded);
  setText("detailImplementationEffortScore", detail.implementationEffortScore);
  setText("detailOperationalPrimary", detail.implementationEffortScore);
  setText("detailShutdownDependency", detail.shutdownDependency);
  setText("detailDataReviewed", detail.dataReviewed);
  setList("detailObservedEvidence", detail.observedEvidence);
  setList("detailOperationalChallenge", detail.operationalChallenge);
  setText("detailRecommendedAction", detail.recommendedAction);
  renderTradeoffChart();
  renderInspectionYieldChart();
  renderCostComparisonChart();
  renderDelayHistoryChart();
  renderConfidenceModel();
  renderStrategyBasisTable();
  applyViewMode(detailState.viewMode);
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
