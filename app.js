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

// Rich detail seed for the gearbox recommendation used by the final drill-down page.
const gearboxOpportunityDetailSeed = {
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

const seededOpportunityRecordsExactA = [
  { id: "OPP-001", opportunity_type: "Frequency mismatch", primary_axis: "Economic", secondary_axis: "Risk", recommended_action_type: "Reduce frequency", area: "Processing plant", asset_group_equipment: "Gearboxes MFA-321-GB01 to MFA-321-GB10", asset_class: "Gearboxes", criticality: "High / Critical", opportunity_title: "PM02 inspection frequency may be higher than current risk justifies", current_state: "Monthly PM02 inspection", recommended_change: "Move to 2-month interval", current_cost_or_exposure: "$96,000 annual cost", recommended_cost_or_exposure: "$48,000 annual cost", potential_value_or_exposure: "$48,000 savings", risk_impact: "Low", confidence: "Medium", key_constraint: "Route redesign required", status: "Open" },
  { id: "OPP-002", opportunity_type: "Low-value PM", primary_axis: "Economic", secondary_axis: "Operational", recommended_action_type: "Reduce frequency", area: "Crushing and conveying", asset_group_equipment: "Conveyor drives CV-440 to CV-468", asset_class: "Conveyor drives", criticality: "High / Critical", opportunity_title: "Inspection and lubrication route density exceeds current defect yield", current_state: "Weekly inspection and lubrication route", recommended_change: "Consolidate to condition-led 2-week route", current_cost_or_exposure: "$1,320,000 annual cost", recommended_cost_or_exposure: "$760,000 annual cost", potential_value_or_exposure: "$560,000 savings", risk_impact: "Low to moderate", confidence: "High", key_constraint: "Route redesign required", status: "Open" },
  { id: "OPP-003", opportunity_type: "Duplicate / overlapping PM", primary_axis: "Economic", secondary_axis: "Operational", recommended_action_type: "Repackage route", area: "Mobile fleet", asset_group_equipment: "Wheel motors WM-210 fleet", asset_class: "Mobile fleet", criticality: "High / Critical", opportunity_title: "Planned inspection routes duplicate labour across similar duty trucks", current_state: "Separate overlapping inspection routes", recommended_change: "Merge overlapping PM route packages", current_cost_or_exposure: "$980,000 annual cost", recommended_cost_or_exposure: "$620,000 annual cost", potential_value_or_exposure: "$360,000 savings", risk_impact: "Low", confidence: "High", key_constraint: "Labour rebalance required", status: "Open" },
  { id: "OPP-004", opportunity_type: "Frequency mismatch", primary_axis: "Economic", secondary_axis: "Risk", recommended_action_type: "Reduce frequency", area: "Water services", asset_group_equipment: "Reclaim feeders RF-11 to RF-16", asset_class: "Motors", criticality: "Medium", opportunity_title: "Vibration collection frequency appears conservative for current duty", current_state: "Monthly vibration route", recommended_change: "Move to 2-month vibration route", current_cost_or_exposure: "$620,000 annual cost", recommended_cost_or_exposure: "$380,000 annual cost", potential_value_or_exposure: "$240,000 savings", risk_impact: "Low to moderate", confidence: "Medium", key_constraint: "Condition route update required", status: "Open" },
  { id: "OPP-005", opportunity_type: "Duplicate / overlapping PM", primary_axis: "Economic", secondary_axis: "Operational", recommended_action_type: "Repackage route", area: "Water recovery", asset_group_equipment: "Dewatering pumps DP-401 to DP-412", asset_class: "Pumps", criticality: "Medium", opportunity_title: "Task packaging duplicates shutdown preparation effort", current_state: "Separate PM and shutdown prep packages", recommended_change: "Combine task bundles into one route", current_cost_or_exposure: "$710,000 annual cost", recommended_cost_or_exposure: "$470,000 annual cost", potential_value_or_exposure: "$240,000 savings", risk_impact: "Low", confidence: "Medium", key_constraint: "Task packaging redesign", status: "Open" },
  { id: "OPP-006", opportunity_type: "Criticality-effort mismatch", primary_axis: "Economic", secondary_axis: "Operational", recommended_action_type: "Split strategy by duty", area: "Port utilities", asset_group_equipment: "Stacker reclaimer motors SR-220 series", asset_class: "Motors", criticality: "Medium", opportunity_title: "Motor inspection frequency is higher than consequence profile suggests", current_state: "Monthly inspection on all units", recommended_change: "Apply duty-based interval split", current_cost_or_exposure: "$540,000 annual cost", recommended_cost_or_exposure: "$360,000 annual cost", potential_value_or_exposure: "$180,000 savings", risk_impact: "Low", confidence: "Medium", key_constraint: "Planner update required", status: "Reviewed" },
  { id: "OPP-007", opportunity_type: "Low-value PM", primary_axis: "Economic", secondary_axis: "Operational", recommended_action_type: "Reduce frequency", area: "Switchrooms", asset_group_equipment: "Switchrooms SW-110 to SW-118", asset_class: "Switchrooms", criticality: "Medium", opportunity_title: "Thermal scan frequency is conservative for current failure history", current_state: "Monthly thermal scans", recommended_change: "Move to quarterly scans", current_cost_or_exposure: "$290,000 annual cost", recommended_cost_or_exposure: "$170,000 annual cost", potential_value_or_exposure: "$120,000 savings", risk_impact: "Low", confidence: "High", key_constraint: "Approval to revise standard", status: "Open" },
  { id: "OPP-008", opportunity_type: "Criticality-effort mismatch", primary_axis: "Economic", secondary_axis: "Operational", recommended_action_type: "Reduce frequency", area: "Tailings pumping", asset_group_equipment: "Tailings booster pumps TBP-700 series", asset_class: "Pumps", criticality: "Medium", opportunity_title: "Routine PM package appears oversized for current service context", current_state: "Dense monthly PM package", recommended_change: "Reduce package depth and frequency", current_cost_or_exposure: "$840,000 annual cost", recommended_cost_or_exposure: "$500,000 annual cost", potential_value_or_exposure: "$340,000 savings", risk_impact: "Low to moderate", confidence: "Medium", key_constraint: "Engineering review required", status: "Open" },
];

const seededOpportunityRecordsExactB = [
  { id: "OPP-009", opportunity_type: "Low-value PM", primary_axis: "Economic", secondary_axis: "Operational", recommended_action_type: "Reduce frequency", area: "Water recovery", asset_group_equipment: "Water recovery blowers WRB-500 series", asset_class: "Fans and blowers", criticality: "Medium", opportunity_title: "Current inspection and cleaning interval may be more conservative than required", current_state: "Monthly inspection and clean", recommended_change: "Move to 2-month interval", current_cost_or_exposure: "$630,000 annual cost", recommended_cost_or_exposure: "$318,000 annual cost", potential_value_or_exposure: "$312,000 savings", risk_impact: "Low", confidence: "Medium", key_constraint: "Task sequence redesign", status: "Open" },
  { id: "OPP-010", opportunity_type: "Failure mode coverage gap", primary_axis: "Risk", secondary_axis: "Operational", recommended_action_type: "Add task", area: "Paste plant", asset_group_equipment: "Safety bund monitoring loops BND-210 to BND-224", asset_class: "Instrumentation", criticality: "High / Critical", opportunity_title: "Bund monitoring tasks are missing from active maintenance strategy", current_state: "No active preventive task coverage", recommended_change: "Add functional monitoring task and review test interval", current_cost_or_exposure: "High exposure", recommended_cost_or_exposure: "Controlled with task coverage", potential_value_or_exposure: "Coverage gap removed", risk_impact: "High", confidence: "Medium", key_constraint: "Data quality issue", status: "Open" },
  { id: "OPP-011", opportunity_type: "Weak detectability", primary_axis: "Risk", secondary_axis: "Economic", recommended_action_type: "Redesign task", area: "Tailings pumping", asset_group_equipment: "Pump seal trains TS-610 to TS-622", asset_class: "Pumps", criticality: "High / Critical", opportunity_title: "Existing inspection task shows weak detection of pump seal failure path", current_state: "General visual PM only", recommended_change: "Add targeted detectability checks and revise task content", current_cost_or_exposure: "Moderate exposure", recommended_cost_or_exposure: "Improved detectability", potential_value_or_exposure: "Reduced downtime exposure", risk_impact: "Severe", confidence: "Medium", key_constraint: "Shutdown access", status: "Open" },
  { id: "OPP-012", opportunity_type: "Failure mode coverage gap", primary_axis: "Risk", secondary_axis: "Operational", recommended_action_type: "Add task", area: "Load and haul", asset_group_equipment: "Brake cooling fans BCF-100 fleet", asset_class: "Mobile fleet", criticality: "High / Critical", opportunity_title: "Recurring cooling-fan failure mode is not explicitly covered in current PM strategy", current_state: "No mode-specific PM coverage", recommended_change: "Add targeted task for recurring failure path", current_cost_or_exposure: "High exposure", recommended_cost_or_exposure: "Reduced recurrence risk", potential_value_or_exposure: "Coverage gap removed", risk_impact: "High", confidence: "High", key_constraint: "Engineering review required", status: "Open" },
  { id: "OPP-013", opportunity_type: "Compliance / safety obligation", primary_axis: "Risk", secondary_axis: "Operational", recommended_action_type: "Keep and monitor", area: "Processing plant", asset_group_equipment: "Emergency shutdown pull-wire systems ESD-300 series", asset_class: "Instrumentation", criticality: "High / Critical", opportunity_title: "Safety standard task has low defect yield but remains requirement-driven", current_state: "Monthly proof-test task", recommended_change: "Keep task and separate from economic optimization logic", current_cost_or_exposure: "Requirement-driven task cost", recommended_cost_or_exposure: "Maintain current compliance position", potential_value_or_exposure: "Safety obligation preserved", risk_impact: "High", confidence: "High", key_constraint: "Standard requirement", status: "Monitoring" },
  { id: "OPP-014", opportunity_type: "Wrong mitigation type", primary_axis: "Risk", secondary_axis: "Economic", recommended_action_type: "Replace mitigation type", area: "Crushing and conveying", asset_group_equipment: "Head pulley bearing sets HPB-410 to HPB-419", asset_class: "Conveyor drives", criticality: "High / Critical", opportunity_title: "Routine visual checks are a weak control for progressive bearing degradation", current_state: "Visual route inspection only", recommended_change: "Replace with vibration-based monitoring strategy", current_cost_or_exposure: "Moderate exposure", recommended_cost_or_exposure: "Better targeted detection", potential_value_or_exposure: "Reduced undetected failure risk", risk_impact: "High", confidence: "Medium", key_constraint: "Condition monitoring setup required", status: "Reviewed" },
  { id: "OPP-015", opportunity_type: "Operating-model constraint", primary_axis: "Operational", secondary_axis: "Economic", recommended_action_type: "Repackage route", area: "Load and haul", asset_group_equipment: "Shutdown intervention bundles SHD-900 fleet", asset_class: "Mobile fleet", criticality: "High / Critical", opportunity_title: "High-value maintenance changes are delayed by fitter and shutdown capacity", current_state: "Actions deferred into limited shutdown windows", recommended_change: "Repackage work and rebalance labour windows", current_cost_or_exposure: "320 labour hrs/year trapped", recommended_cost_or_exposure: "Improved execution flow", potential_value_or_exposure: "180 hrs/year released", risk_impact: "Moderate", confidence: "Medium", key_constraint: "Labour rebalance required", status: "Open" },
  { id: "OPP-016", opportunity_type: "Evidence insufficient", primary_axis: "Risk", secondary_axis: "Economic", recommended_action_type: "Improve data quality", area: "Water services", asset_group_equipment: "Chlorination dosing skids CDS-120 series", asset_class: "Instrumentation", criticality: "High / Critical", opportunity_title: "Current inspection position cannot be confidently changed due to weak failure traceability", current_state: "Existing monthly PM retained", recommended_change: "Improve coding and monitor before interval change", current_cost_or_exposure: "Uncertain exposure", recommended_cost_or_exposure: "Better evidence before change", potential_value_or_exposure: "Confidence improvement", risk_impact: "Moderate", confidence: "Low", key_constraint: "Data quality issue", status: "Monitoring" },
];

const parseCurrencyValue = (value) => {
  const match = String(value ?? "").replaceAll(",", "").match(/\$([0-9]+(?:\.[0-9]+)?)/);
  return match ? Number(match[1]) : null;
};

const parseHoursValue = (value) => {
  const match = String(value ?? "").replaceAll(",", "").match(/([0-9]+(?:\.[0-9]+)?)\s*labour hrs\/year|([0-9]+(?:\.[0-9]+)?)\s*hrs\/year/i);
  return match ? Number(match[1] || match[2]) : null;
};

const normalizeSeededOpportunityRecord = (record) => {
  const currentCost = parseCurrencyValue(record.current_cost_or_exposure);
  const recommendedCost = parseCurrencyValue(record.recommended_cost_or_exposure);
  return {
    ...record,
    opportunityType: record.opportunity_type,
    primaryAxis: record.primary_axis,
    secondaryAxis: record.secondary_axis,
    recommendedActionType: record.recommended_action_type,
    assetGroup: record.asset_group_equipment,
    equipment: record.asset_class,
    assetClass: record.asset_class,
    title: record.opportunity_title,
    currentState: record.current_state,
    recommendedChange: record.recommended_change,
    currentCostOrExposure: record.current_cost_or_exposure,
    recommendedCostOrExposure: record.recommended_cost_or_exposure,
    potentialValueExposureLabel: record.potential_value_or_exposure,
    riskImpact: record.risk_impact,
    confidenceLabel: record.confidence,
    keyConstraint: record.key_constraint,
    currentCost: currentCost ?? 0,
    recommendedCost: recommendedCost ?? currentCost ?? 0,
    potentialSaving: parseCurrencyValue(record.potential_value_or_exposure) ?? 0,
    currentHours: parseHoursValue(record.current_cost_or_exposure) ?? 0,
    recommendedHours: parseHoursValue(record.recommended_cost_or_exposure) ?? 0,
    releasedHours: parseHoursValue(record.potential_value_or_exposure) ?? 0,
  };
};

const seededReliabilityOpportunities = [...seededOpportunityRecordsExactA, ...seededOpportunityRecordsExactB].map(
  normalizeSeededOpportunityRecord
);
const seededEconomicOpportunities = seededReliabilityOpportunities.filter(
  (item) => item.primaryAxis === "Economic"
);
const isHighCriticality = (item) => item.criticality === "High / Critical";
const isHighRiskImpact = (item) => ["High", "Severe"].includes(item.riskImpact);
const isOperationallyConstrained = (item) =>
  ["labour", "shutdown", "route", "engineering review", "planner update", "task packaging", "data quality"].some(
    (term) => item.keyConstraint.toLowerCase().includes(term)
  );

const opportunityAxisViews = {
  all: { label: "All", pageTitle: "All Opportunities", primaryAxis: "" },
  economic: { label: "Economic-led", pageTitle: "Economic-led Opportunities", primaryAxis: "Economic" },
  risk: { label: "Risk-led", pageTitle: "Risk-led Opportunities", primaryAxis: "Risk" },
  operational: {
    label: "Operational-led",
    pageTitle: "Operational-led Opportunities",
    primaryAxis: "Operational",
  },
};

const getAxisSummary = (axis) => {
  const items = seededReliabilityOpportunities.filter((item) => item.primaryAxis === axis);
  if (axis === "Economic") {
    return {
      headline: formatCompactCurrency(items.reduce((sum, item) => sum + item.potentialSaving, 0)),
      count: `${items.length} opportunities`,
      supportA: `${formatCompactCurrency(items.reduce((sum, item) => sum + item.currentCost, 0))} current low-value cost`,
      supportB: `${items.filter((item) => item.opportunityType === "Frequency mismatch").length} frequency mismatches`,
      cta: "View economic-led opportunities",
    };
  }

  if (axis === "Risk") {
    const safetyCritical = items.filter(isHighCriticality).length;
    const highExposure = items.filter(isHighRiskImpact).length;
    return {
      headline: `${items.length}`,
      count: `${items.length} opportunities`,
      supportA: `${safetyCritical} high-criticality assets`,
      supportB: `${highExposure} high / severe exposures`,
      cta: "View risk-led opportunities",
    };
  }

  const releasedHours = items.reduce((sum, item) => sum + item.releasedHours, 0);
  const shutdownDependent = items.filter((item) =>
    item.keyConstraint.toLowerCase().includes("shutdown")
  ).length;
  const labourConstrained = items.filter((item) =>
    item.keyConstraint.toLowerCase().includes("labour")
  ).length;
  return {
    headline: releasedHours ? `${releasedHours} hrs/year` : `${items.length}`,
    count: `${items.length} opportunities`,
    supportA: `${shutdownDependent} shutdown-dependent`,
    supportB: `${labourConstrained} labour-constrained`,
    cta: "View operational-led opportunities",
  };
};

const renderReliabilityOverview = () => {
  const overviewRoot = document.getElementById("reliabilityInsightsOverview");
  if (!overviewRoot) {
    return;
  }

  const areaValues = [...seededReliabilityOpportunities].reduce((map, item) => {
    map.set(item.area, (map.get(item.area) || 0) + item.potentialSaving);
    return map;
  }, new Map());
  const topAreas = [...areaValues.entries()].sort((left, right) => right[1] - left[1]).slice(0, 4);
  const priorityRows = [...seededReliabilityOpportunities]
    .sort((left, right) => {
      const leftWeight = left.primaryAxis === "Risk" ? 2 : left.primaryAxis === "Operational" ? 1 : 0;
      const rightWeight = right.primaryAxis === "Risk" ? 2 : right.primaryAxis === "Operational" ? 1 : 0;
      if (rightWeight !== leftWeight) {
        return rightWeight - leftWeight;
      }
      return right.potentialSaving - left.potentialSaving;
    })
    .slice(0, 4);

  const recommendationsReady = seededReliabilityOpportunities.filter(
    (item) => item.confidenceLabel !== "Low" && item.status !== "Closed"
  ).length;

  const overviewMetrics = {
    assessed: String(seededReliabilityOpportunities.length),
    areas: new Set(seededReliabilityOpportunities.map((item) => item.area)).size,
    critical: seededReliabilityOpportunities.filter(isHighCriticality).length,
    ready: recommendationsReady,
  };

  const economicSummary = getAxisSummary("Economic");
  const riskSummary = getAxisSummary("Risk");
  const operationalSummary = getAxisSummary("Operational");

  const setIfPresent = (id, value) => {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  };

  setIfPresent("overviewItemsAssessed", overviewMetrics.assessed);
  setIfPresent("overviewAreasInScope", String(overviewMetrics.areas));
  setIfPresent("overviewHighCriticalityAssets", String(overviewMetrics.critical));
  setIfPresent("overviewRecommendationsReady", String(overviewMetrics.ready));

  [
    ["economicTotalSavings", economicSummary.headline],
    ["economicOpportunityCount", economicSummary.count],
    ["economicLowValueCost", economicSummary.supportA],
    ["economicSupportStat", economicSummary.supportB],
    ["riskHeadlineValue", riskSummary.headline],
    ["riskOpportunityCount", riskSummary.count],
    ["riskSupportStatA", riskSummary.supportA],
    ["riskSupportStatB", riskSummary.supportB],
    ["operationalHeadlineValue", operationalSummary.headline],
    ["operationalOpportunityCount", operationalSummary.count],
    ["operationalSupportStatA", operationalSummary.supportA],
    ["operationalSupportStatB", operationalSummary.supportB],
  ].forEach(([id, value]) => setIfPresent(id, value));

  const actionSummaryList = document.getElementById("overviewActionSummary");
  if (actionSummaryList) {
    const blockers = seededReliabilityOpportunities.reduce((map, item) => {
      map.set(item.keyConstraint, (map.get(item.keyConstraint) || 0) + 1);
      return map;
    }, new Map());
    const topBlockers = [...blockers.entries()].sort((left, right) => right[1] - left[1]).slice(0, 3);
    actionSummaryList.innerHTML = `
      <div class="fiori-summary-list__item">
        <span class="fiori-summary-list__label">Primary blocker</span>
        <strong>${topBlockers[0]?.[0] ?? "Engineering review required"}</strong>
      </div>
      <div class="fiori-summary-list__item">
        <span class="fiori-summary-list__label">Best first area</span>
        <strong>${topAreas[0]?.[0] ?? "Processing plant"}</strong>
      </div>
      <div class="fiori-summary-list__item">
        <span class="fiori-summary-list__label">Action mix</span>
        <strong>${seededReliabilityOpportunities.filter((item) => item.recommendedActionType === "Reduce frequency").length} reduce frequency, ${seededReliabilityOpportunities.filter((item) => item.recommendedActionType === "Repackage route").length} repackage route</strong>
      </div>
    `;
  }

  const areaChart = document.getElementById("overviewSavingsByArea");
  if (areaChart) {
    const maxValue = Math.max(...topAreas.map(([, value]) => value), 1);
    areaChart.innerHTML = topAreas
      .map(
        ([area, value]) => `
          <div class="fiori-bar-row">
            <div class="fiori-bar-row__meta">
              <span>${area}</span>
              <strong>${formatCompactCurrency(value)}</strong>
            </div>
            <div class="fiori-bar-row__track"><span style="width: ${(value / maxValue) * 100}%;"></span></div>
          </div>
        `
      )
      .join("");
  }

  const previewBody = document.getElementById("overviewPriorityRows");
  if (previewBody) {
    previewBody.innerHTML = priorityRows
      .map(
        (item) => `
          <tr>
            <td>${item.area}</td>
            <td><a class="fiori-table__row-link" href="economic-opportunity-detail.html?id=${item.id}">${item.title}</a></td>
            <td><span class="fiori-axis-tag fiori-axis-tag--${item.primaryAxis.toLowerCase()}">${item.primaryAxis}</span></td>
            <td>${item.opportunityType}</td>
            <td>${item.potentialValueExposureLabel}</td>
            <td>${item.keyConstraint}</td>
          </tr>
        `
      )
      .join("");
  }
};

const renderOpportunitiesWorkspace = () => {
  const workspace = document.getElementById("opportunitiesWorkspace");
  if (!workspace) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const state = {
    view: params.get("view") || "all",
    filters: {
      opportunityType: params.get("opportunityType") || "",
      primaryAxis: params.get("primaryAxis") || "",
      secondaryAxis: params.get("secondaryAxis") || "",
      assetClass: params.get("assetClass") || "",
      criticality: params.get("criticality") || "",
      confidence: params.get("confidence") || "",
      area: params.get("area") || "",
      status: params.get("status") || "",
    },
    groupBy: params.get("groupBy") || "opportunityType",
  };

  const axisFromView = opportunityAxisViews[state.view]?.primaryAxis || "";
  if (!state.filters.primaryAxis && axisFromView) {
    state.filters.primaryAxis = axisFromView;
  }

  const syncUrl = () => {
    const next = new URLSearchParams();
    if (state.view !== "all") {
      next.set("view", state.view);
    }
    Object.entries(state.filters).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      }
    });
    if (state.groupBy !== "opportunityType") {
      next.set("groupBy", state.groupBy);
    }
    const suffix = next.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${suffix ? `?${suffix}` : ""}`);
  };

  const getFilteredOpportunities = () =>
    seededReliabilityOpportunities.filter((item) =>
      (!state.filters.opportunityType || item.opportunityType === state.filters.opportunityType) &&
      (!state.filters.primaryAxis || item.primaryAxis === state.filters.primaryAxis) &&
      (!state.filters.secondaryAxis || item.secondaryAxis === state.filters.secondaryAxis) &&
      (!state.filters.assetClass || item.assetClass === state.filters.assetClass) &&
      (!state.filters.criticality || item.criticality === state.filters.criticality) &&
      (!state.filters.confidence || item.confidenceLabel === state.filters.confidence) &&
      (!state.filters.area || item.area === state.filters.area) &&
      (!state.filters.status || item.status === state.filters.status)
    );

  const uniqueValues = (key) =>
    [...new Set(seededReliabilityOpportunities.map((item) => item[key]).filter(Boolean))].sort();

  const populateSelect = (id, values, selectedValue, placeholder) => {
    const select = document.getElementById(id);
    if (!select) {
      return;
    }
    select.innerHTML = [`<option value="">${placeholder}</option>`]
      .concat(values.map((value) => `<option value="${value}">${value}</option>`))
      .join("");
    select.value = selectedValue;
  };

  const renderPage = () => {
    const filtered = getFilteredOpportunities();
    const pageTitle = document.getElementById("opportunitiesPageTitle");
    const pageVariant = document.getElementById("opportunitiesPageVariant");
    const pageSubtitle = document.getElementById("opportunitiesPageSubtitle");
    const summaryNodes = {
      total: document.getElementById("opportunitiesTotalCount"),
      savings: document.getElementById("opportunitiesTotalSavings"),
      risk: document.getElementById("opportunitiesHighRiskCount"),
      constrained: document.getElementById("opportunitiesConstrainedCount"),
    };
    const groupLabel = {
      opportunityType: "Opportunity Type",
      primaryAxis: "Primary Axis",
      area: "Area",
      assetClass: "Asset Class",
    }[state.groupBy];

    if (pageTitle) {
      pageTitle.textContent = opportunityAxisViews[state.view]?.pageTitle || "Opportunities";
    }
    if (pageVariant) {
      pageVariant.textContent = state.view === "all" ? "Working View" : opportunityAxisViews[state.view].label;
    }
    if (pageSubtitle) {
      pageSubtitle.textContent =
        "Surfaced maintenance strategy opportunities across cost, risk, and execution.";
    }

    if (summaryNodes.total) {
      summaryNodes.total.textContent = String(filtered.length);
    }
    if (summaryNodes.savings) {
      summaryNodes.savings.textContent = formatCompactCurrency(
        filtered.reduce((sum, item) => sum + item.potentialSaving, 0)
      );
    }
    if (summaryNodes.risk) {
      summaryNodes.risk.textContent = String(
        filtered.filter(isHighRiskImpact).length
      );
    }
    if (summaryNodes.constrained) {
      summaryNodes.constrained.textContent = String(
        filtered.filter(isOperationallyConstrained).length
      );
    }

    document.querySelectorAll("[data-opportunity-view]").forEach((button) => {
      const isActive = button.getAttribute("data-opportunity-view") === state.view;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    const groupLabelNode = document.getElementById("opportunitiesGroupLabel");
    if (groupLabelNode) {
      groupLabelNode.textContent = groupLabel;
    }

    const tableBody = document.getElementById("opportunitiesTableRows");
    if (!tableBody) {
      return;
    }

    const grouped = filtered.reduce((map, item) => {
      const key = item[state.groupBy] || "Ungrouped";
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(item);
      return map;
    }, new Map());

    const searchSuffix = window.location.search ? `&from=${encodeURIComponent(window.location.search)}` : "";
    tableBody.innerHTML = filtered.length
      ? [...grouped.entries()]
          .map(
            ([group, items]) => `
              <tr class="fiori-table__group-row">
                <td colspan="19">
                  <strong>${group}</strong>
                  <span>${items.length} opportunities</span>
                </td>
              </tr>
              ${items
                .map(
                  (item) => `
                    <tr data-href="economic-opportunity-detail.html?id=${item.id}${searchSuffix}" tabindex="0">
                      <td>${item.id}</td>
                      <td>${item.opportunityType}</td>
                      <td><span class="fiori-axis-tag fiori-axis-tag--${item.primaryAxis.toLowerCase()}">${item.primaryAxis}</span></td>
                      <td>${item.secondaryAxis ? `<span class="fiori-axis-tag fiori-axis-tag--${item.secondaryAxis.toLowerCase()}">${item.secondaryAxis}</span>` : "<span class=\"fiori-table__muted\">-</span>"}</td>
                      <td>${item.recommendedActionType}</td>
                      <td>${item.area}</td>
                      <td>${item.assetGroup}</td>
                      <td>${item.assetClass}</td>
                      <td>${item.criticality}</td>
                      <td>${item.title}</td>
                      <td>${item.currentState}</td>
                      <td>${item.recommendedChange}</td>
                      <td>${item.currentCostOrExposure}</td>
                      <td>${item.recommendedCostOrExposure}</td>
                      <td>${item.potentialValueExposureLabel}</td>
                      <td>${item.riskImpact}</td>
                      <td>${item.confidenceLabel}</td>
                      <td>${item.keyConstraint}</td>
                      <td>${item.status}</td>
                    </tr>
                  `
                )
                .join("")}
            `
          )
          .join("")
      : `
          <tr>
            <td colspan="19" class="fiori-table__empty">No opportunities match the current filters.</td>
          </tr>
        `;

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

    syncUrl();
  };

  populateSelect("opportunityTypeFilter", uniqueValues("opportunityType"), state.filters.opportunityType, "All opportunity types");
  populateSelect("primaryAxisFilter", uniqueValues("primaryAxis"), state.filters.primaryAxis, "All primary axes");
  populateSelect("secondaryAxisFilter", uniqueValues("secondaryAxis"), state.filters.secondaryAxis, "All secondary axes");
  populateSelect("assetClassFilter", uniqueValues("assetClass"), state.filters.assetClass, "All asset classes");
  populateSelect("criticalityFilter", uniqueValues("criticality"), state.filters.criticality, "All criticalities");
  populateSelect("confidenceFilter", uniqueValues("confidenceLabel"), state.filters.confidence, "All confidence levels");
  populateSelect("areaFilter", uniqueValues("area"), state.filters.area, "All areas");
  populateSelect("statusFilter", uniqueValues("status"), state.filters.status, "All statuses");
  const groupByFilter = document.getElementById("groupByFilter");
  if (groupByFilter) {
    groupByFilter.value = state.groupBy;
  }

  [
    ["opportunityTypeFilter", "opportunityType"],
    ["primaryAxisFilter", "primaryAxis"],
    ["secondaryAxisFilter", "secondaryAxis"],
    ["assetClassFilter", "assetClass"],
    ["criticalityFilter", "criticality"],
    ["confidenceFilter", "confidence"],
    ["areaFilter", "area"],
    ["statusFilter", "status"],
  ].forEach(([id, key]) => {
    document.getElementById(id)?.addEventListener("change", (event) => {
      state.filters[key] = event.target.value;
      if (key === "primaryAxis") {
        state.view =
          Object.entries(opportunityAxisViews).find(
            ([viewKey, config]) => viewKey !== "all" && config.primaryAxis === state.filters.primaryAxis
          )?.[0] ?? "all";
      }
      renderPage();
    });
  });

  document.getElementById("groupByFilter")?.addEventListener("change", (event) => {
    state.groupBy = event.target.value || "opportunityType";
    renderPage();
  });

  document.querySelectorAll("[data-opportunity-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.getAttribute("data-opportunity-view") || "all";
      state.filters.primaryAxis = opportunityAxisViews[state.view]?.primaryAxis || "";
      const primarySelect = document.getElementById("primaryAxisFilter");
      if (primarySelect) {
        primarySelect.value = state.filters.primaryAxis;
      }
      renderPage();
    });
  });

  renderPage();
};

const getOpportunityDetail = (opportunity) => {
  if (opportunity.id === "OPP-001") {
    return {
      ...opportunity,
      ...gearboxOpportunityDetailSeed,
      id: opportunity.id,
      opportunityType: opportunity.opportunityType,
      primaryAxis: opportunity.primaryAxis,
      secondaryAxis: opportunity.secondaryAxis,
      recommendedActionType: opportunity.recommendedActionType,
      area: opportunity.area,
      assetGroup: opportunity.assetGroup,
      equipment: gearboxOpportunityDetailSeed?.equipment || opportunity.assetClass,
      assetClass: opportunity.assetClass,
      title: opportunity.title,
      currentState: opportunity.currentState,
      recommendedChange: opportunity.recommendedChange,
      currentCostOrExposure: opportunity.currentCostOrExposure,
      recommendedCostOrExposure: opportunity.recommendedCostOrExposure,
      potentialValueExposureLabel: opportunity.potentialValueExposureLabel,
      riskImpact: opportunity.riskImpact,
      confidence: opportunity.confidenceLabel,
      confidenceLabel: opportunity.confidenceLabel,
      keyConstraint: opportunity.keyConstraint,
      status: opportunity.status,
      currentCost: opportunity.currentCost,
      recommendedCost: opportunity.recommendedCost,
      potentialSaving: opportunity.potentialSaving,
    };
  }

  const constraint = opportunity.keyConstraint || opportunity.operationalConstraint || "";
  const currentCost = opportunity.currentCost || 120000;
  const recommendedCost = opportunity.recommendedCost || Math.round(currentCost * 0.7);

  return {
    ...opportunity,
    confidence: opportunity.confidenceLabel || opportunity.confidence || "Medium",
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
      { key: "current", label: "Current", cost: Math.round(currentCost * 1.4), exposure: 0.16, riskIndex: 1.0 },
      { key: "baseline", label: "Baseline", cost: currentCost, exposure: 0.18, riskIndex: 1.08 },
      { key: "recommended", label: "Recommended", cost: recommendedCost, exposure: 0.24, riskIndex: 1.2 },
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
    routeRedesignRequired: constraint.toLowerCase().includes("route")
      ? "Yes"
      : "Partly",
    shutdownDependency: constraint.toLowerCase().includes("shutdown") ? "Yes" : "No",
  };
};

// Render the third-level drill-down object page for the selected opportunity.
const renderEconomicOpportunityDetail = () => {
  const detailRoot = document.getElementById("economicOpportunityDetail");
  if (!detailRoot) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const selectedId = params.get("id") || seededReliabilityOpportunities[0].id;
  const returnToListQuery = params.get("from") || "";
  const selectedOpportunity =
    seededReliabilityOpportunities.find((item) => item.id === selectedId) || seededReliabilityOpportunities[0];
  const detail = getOpportunityDetail(selectedOpportunity);
  const evidenceInputItems =
    detail.evidenceInputs ??
    String(detail.dataReviewed ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  const recommendedActionStep =
    detail.currentFrequency && detail.recommendedFrequency && detail.currentFrequency !== "Current interval"
      ? `Change PM02 inspection interval from ${detail.currentFrequency} to ${detail.recommendedFrequency}`
      : detail.recommendedChange || "Review recommended maintenance strategy change";
  const recommendedReviewPeriod = detail.reviewPeriod || "Review after 6 months";
  const recommendedMonitorItems =
    detail.recommendedMonitor ?? ["findings rate", "corrective conversion", "delay events", "repeat defects"];
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
        engineerNote: "",
        isExpanded: false,
        excludeDirtyData: false,
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

  const detailBackToOpportunities = document.getElementById("detailBackToOpportunities");
  if (detailBackToOpportunities && returnToListQuery) {
    detailBackToOpportunities.href = `economic-opportunities.html${returnToListQuery}`;
  }

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
    if (score >= 80) {
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
    const score = Math.round(
      basisRows.reduce((sum, item) => sum + clampScore(item.reviewedScore), 0) /
        (basisRows.length || 1)
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

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const reviewStatusOptions = [
    "Accepted",
    "Adjusted",
    "Incorrect mapping",
    "Insufficient evidence",
    "Dirty data",
  ];

  const getEvidenceQualityClass = (quality) => {
    const normalized = (quality || "").toLowerCase();
    if (normalized.includes("strong")) {
      return "strong";
    }
    if (normalized.includes("moderate")) {
      return "moderate";
    }
    if (normalized.includes("partial")) {
      return "partial";
    }
    if (normalized.includes("dirty")) {
      return "dirty";
    }
    return "weak";
  };

  const getStrategyBasisReviewContent = (factor) => {
    const shared = {
      "failure-mode-understanding": {
        basisSummary:
          "System mapped PM02 to gearbox degradation detection for bearing / lubrication-related failure modes.",
        evidenceQuality: "Strong",
        interpretation: [
          "Failure mode identified: gearbox bearing degradation / lubrication-related deterioration",
          "PM mapped: PM02 monthly inspection",
          "Interpreted PM purpose: detect progressive degradation before loss of function",
          "Mapping judgment: mostly aligned",
        ],
        dataReviewed: [
          "FMEA text",
          "PM task description",
          "CMMS work order history",
          "failure codes",
          "corrective follow-up",
          "delay history",
        ],
        qualityNote:
          "Failure mode mapping is supported by strategy text and work history, but task-to-mode alignment is not perfectly explicit in all records.",
        reviewPrompt:
          "Does the system correctly understand the failure mode and the PM it is intended to mitigate?",
      },
      "mitigation-strategy-understanding": {
        basisSummary:
          "System interprets PM02 as a routine degradation-detection task rather than a compliance-only inspection.",
        evidenceQuality: "Moderate",
        interpretation: [
          "PM02 interpreted as a degradation-detection task",
          "Current monthly interval interpreted as conservative surveillance",
          "Strategy intent is partly explicit in PM task and planning structure",
        ],
        dataReviewed: [
          "PM task text",
          "job plans",
          "inspection route design",
          "planner notes",
          "work order outcomes",
        ],
        qualityNote:
          "The task purpose is mostly visible, but interval justification is not strongly evidenced in current records.",
        reviewPrompt:
          "Does the system correctly understand what the PM is intended to detect, prevent, or control?",
      },
      "detection-evidence": {
        basisSummary:
          "System found low actionable defect yield from PM02 inspections relative to inspection volume.",
        evidenceQuality: "Weak",
        interpretation: [
          "120 inspections completed",
          "14 inspections with findings",
          "3 actionable findings",
          "3 corrective conversions",
          "low evidence that monthly frequency materially improves control",
        ],
        dataReviewed: [
          "PM completion history",
          "PM findings",
          "corrective follow-up",
          "repeat defect history",
        ],
        qualityNote:
          "Detection evidence is weak because meaningful findings are rare relative to inspection effort.",
        reviewPrompt:
          "Does the observed inspection yield provide enough evidence that the current frequency is effective?",
      },
      "cmms-history-coverage": {
        basisSummary:
          "System found enough post-installation work order history to assess findings and follow-up patterns.",
        evidenceQuality: "Strong",
        interpretation: [
          "post-installation history is sufficient for trend review",
          "enough inspections and follow-up records exist to support comparison",
        ],
        dataReviewed: [
          "asset history",
          "PM work orders",
          "corrective work orders",
          "installation timeline",
          "equipment master records",
        ],
        qualityNote: "Record volume is sufficient for review and trend interpretation.",
        reviewPrompt:
          "Is the available CMMS history broad and complete enough for this recommendation?",
      },
      "data-quality-traceability": {
        basisSummary:
          "System found usable but incomplete linkage between PM findings, corrective work, and avoided failure outcomes.",
        evidenceQuality: "Moderate",
        interpretation: [
          "source data is usable",
          "PM findings are not always cleanly linked to avoided failure outcomes",
          "some coding inconsistency exists",
        ],
        dataReviewed: [
          "failure codes",
          "PM finding text",
          "corrective close-out",
          "equipment references",
          "planner records",
        ],
        qualityNote:
          "Data is usable but not fully structured for clean traceability from PM activity to prevented consequence.",
        reviewPrompt:
          "Is the source data reliable enough, or is poor data quality limiting the system score?",
      },
      "delay-consequence-history": {
        basisSummary:
          "System found low realized consequence history with enough delay data to assess recent production impact.",
        evidenceQuality: "Moderate",
        interpretation: [
          "low recent production consequence",
          "0 major delay events",
          "2 minor delay events",
          "3.5 total hours lost",
        ],
        dataReviewed: [
          "delay log",
          "downtime records",
          "event classification",
          "production impact notes",
        ],
        qualityNote:
          "Consequence history is available and useful, but low event frequency limits statistical strength.",
        reviewPrompt:
          "Does the delay history accurately reflect the real consequence of this failure mode?",
      },
      "operating-context-stability": {
        basisSummary:
          "System found no major evidence of duty or service-context shift that would invalidate recent history.",
        evidenceQuality: "Strong",
        interpretation: [
          "recent service context appears stable",
          "no major duty shift detected",
          "historical evidence remains relevant for interval review",
        ],
        dataReviewed: [
          "service context",
          "asset group operating pattern",
          "planner notes",
          "duty / load context",
          "operational history",
        ],
        qualityNote:
          "The system found no major change in operating context that would invalidate the recent evidence set.",
        reviewPrompt:
          "Is recent operating context stable enough that historical PM and delay evidence is still relevant?",
      },
    };

    return shared[factor.key] ?? {
      basisSummary: factor.rationale,
      interpretation: [factor.rationale],
      dataReviewed: ["Maintenance strategy text", "CMMS work order history", "PM findings"],
      evidenceQuality: getEvidenceStatus(factor.systemScore),
      qualityNote: factor.rationale,
      reviewPrompt: "Review the system interpretation and confirm whether the current score is justified.",
    };
  };

  const getSelectedScenario = () =>
    detail.tradeoffModel.find((item) => item.key === detailState.selectedScenarioKey) ??
    detail.tradeoffModel[0];

  const getReadinessModel = () => {
    const confidence = (detail.confidence || "").toLowerCase();
    if (detail.shutdownDependency === "Yes") {
      return {
        label: "Blocked by constraints",
        primaryAction: "Send for engineering review",
      };
    }
    if (confidence === "high") {
      return {
        label: "Ready for approval",
        primaryAction: "Approve change",
      };
    }
    return {
      label: "Requires engineering review",
      primaryAction: "Send for engineering review",
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

  const getImplementationBrief = () => {
    if (detail.shutdownDependency === "Yes") {
      return "Operational constraint (shutdown required)";
    }
    if (detail.routeRedesignRequired === "Yes" || Number(detail.masterUpdatesNeeded) > 0) {
      return "Moderate effort (route redesign + PM updates)";
    }
    return "Low effort (minor planning updates)";
  };

  const getExecutiveConfidenceLabel = (score) => {
    if (score >= 80) {
      return "High";
    }
    if (score >= 55) {
      return "Moderate";
    }
    return "Low";
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
    if (returnToListQuery) {
      nextParams.set("from", returnToListQuery);
    }
    const nextUrl = `${window.location.pathname}?${nextParams.toString()}`;
    window.history.replaceState({}, "", nextUrl);
  };

  const getSystemJudgment = (scenario, savings, exposureDelta) => {
    if (scenario.label === detail.currentFrequency) {
      return "Monthly inspections remain the current reference case while the system tests whether the interval is more conservative than the evidence supports.";
    }

    if (savings >= 0) {
      return `Monthly inspections show low detection value and no evidence of improving risk control. Moving to ${scenario.label} maintains risk coverage while removing ${formatCurrency(
        savings
      )} of low-value maintenance.`;
    }

    return `The current evidence does not support reducing the interval further because the cost increase is not matched by a clear risk-control benefit.`;
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
          ? `Save ${formatCurrency(savings)}/year with no material increase in failure risk`
          : `Current interval remains the reference case under review`;
    const modeSubheadline =
      detailState.viewMode === "engineering"
        ? "Engineering review of maintenance strategy basis, confidence, and implementation constraints"
        : "Inspection interval optimization for gearbox PM02 route";

    setText("detailContextMeta", `${detail.area} - ${detail.equipment}`);
    setText("detailModeHeadline", modeHeadline);
    setText("detailModeSubheadline", modeSubheadline);
    setText("detailOpportunityType", detail.opportunityType || "Opportunity");
    setText("detailReadinessStatus", readiness.label);
    setText("detailConfidence", getConfidenceLevel(confidenceScore));
    const confidenceBadge = document.getElementById("detailConfidence");
    if (confidenceBadge) {
      confidenceBadge.classList.remove("is-high", "is-medium", "is-low");
      confidenceBadge.classList.add(
        confidenceScore >= 80 ? "is-high" : confidenceScore >= 55 ? "is-medium" : "is-low"
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
    const executiveConfidenceLabel = getExecutiveConfidenceLabel(confidenceModel.score);
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
    setText("execRiskSummary", "No material increase in failure risk");
    setText("execWorstCaseConsequence", "Worst-case consequence estimate not yet available");
    setText("execExposureDelta", `Exposure change: ${(scenario.exposure - baseline.exposure).toFixed(2)} events/year`);
    setText("execConfidenceScore", `${confidenceModel.score} / 100`);
    setText("execConfidenceLabel", executiveConfidenceLabel);
    setText(
      "execConfidenceSummary",
      `${executiveConfidenceLabel} confidence due to strong ${strongest.join(" and ").toLowerCase()} but ${limitations.join(" and ").toLowerCase()}.`
    );
    setText("execDecisionAction", `Increase PM02 interval from ${detail.currentFrequency} to ${scenario.label}`);
    setText("execDecisionOutcomeSavings", `Save ${formatCurrency(savings)}/year`);
    setText("execDecisionOutcomeRisk", "No material increase in failure risk");
    setText("execDecisionOutcomeProduction", "No impact to production targets");
    setText(
      "execDecisionImplementationSummary",
      getImplementationBrief()
    );
    setText(
      "execDecisionImplementationShutdown",
      detail.shutdownDependency === "Yes" ? "Shutdown required" : "No shutdown required"
    );
    setText(
      "execDecisionConfidence",
      `${executiveConfidenceLabel} (${confidenceModel.score}/100) - strong history, weak detection evidence`
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
    const sharedHeaderActions = document.getElementById("sharedHeaderActions");
    if (executiveView) {
      executiveView.hidden = detailState.viewMode !== "executive";
    }
    if (engineeringView) {
      engineeringView.hidden = detailState.viewMode !== "engineering";
    }
    if (sharedHeaderActions) {
      const showExecutiveActions = detailState.viewMode === "executive";
      sharedHeaderActions.hidden = !showExecutiveActions;
      sharedHeaderActions.setAttribute("aria-hidden", showExecutiveActions ? "false" : "true");
      sharedHeaderActions.style.display = showExecutiveActions ? "" : "none";
    }

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
    const compareChangedFactors = document.getElementById("compareChangedFactors");

    if (!tableBody || !detailState.reviewedStrategyBasis.length) {
      return;
    }

    tableBody.innerHTML = detailState.reviewedStrategyBasis
      .map(
        (item) => {
          const reviewedScore = clampScore(item.reviewedScore);
          const reviewContent = getStrategyBasisReviewContent(item);
          const evidenceQualityClass = getEvidenceQualityClass(reviewContent.evidenceQuality);
          const reviewedEvidenceStatus = getEvidenceStatus(reviewedScore).toLowerCase();
          return `
          <tr class="economic-review-row" data-factor-key="${item.key}">
            <td>
              <span class="economic-review-factor">
                <strong>${item.label}</strong>
                <span class="economic-review-factor__subline">Review interpretation, source mapping, and evidence quality</span>
              </span>
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
              <span class="economic-review-note">${escapeHtml(reviewContent.basisSummary)}</span>
            </td>
            <td>
              <span class="economic-evidence-pill economic-evidence-pill--${evidenceQualityClass}">${reviewContent.evidenceQuality}</span>
            </td>
            <td>
              <span class="economic-review-status economic-review-status--${item.reviewStatus.toLowerCase().replace(/[^a-z]+/g, "-")}">${item.reviewStatus}</span>
            </td>
            <td>
              <div class="economic-score-cell economic-score-cell--compact">
                <strong>${reviewedScore}</strong>
                <div class="economic-score-bar economic-score-bar--reviewed">
                  <span class="is-${reviewedEvidenceStatus}" style="width: ${reviewedScore}%;"></span>
                </div>
                <span class="economic-review-summary-hint">Edit in expanded review</span>
              </div>
            </td>
            <td>
              <span class="economic-review-note">${escapeHtml(item.rationale)}</span>
            </td>
            <td class="economic-review-expand-cell">
              <button type="button" class="economic-review-expand ${item.isExpanded ? "is-expanded" : ""}" data-review-expand="${item.key}" aria-expanded="${item.isExpanded ? "true" : "false"}" aria-label="${item.isExpanded ? "Collapse" : "Expand"} ${item.label}">
                <span class="economic-review-expand__chevron" aria-hidden="true">&#9662;</span>
              </button>
            </td>
          </tr>
          <tr class="economic-review-detail-row ${item.isExpanded ? "is-expanded" : ""}" ${item.isExpanded ? "" : "hidden"}>
            <td colspan="8">
              <div class="economic-review-detail-card">
                <div class="economic-review-prompt">
                  <span class="economic-review-detail-section__label">Engineer review prompt</span>
                  <p>${escapeHtml(reviewContent.reviewPrompt)}</p>
                </div>
                <div class="economic-review-detail-grid">
                  <section class="economic-review-detail-section">
                    <span class="economic-review-detail-section__label">System interpretation</span>
                    <ul class="economic-review-interpretation-list">
                      ${reviewContent.interpretation
                        .map(
                          (value) => `
                            <li>${escapeHtml(value)}</li>
                          `
                        )
                        .join("")}
                    </ul>
                  </section>
                  <section class="economic-review-detail-section">
                    <span class="economic-review-detail-section__label">Data reviewed</span>
                    <div class="economic-review-chip-list">
                      ${reviewContent.dataReviewed
                        .map((source) => `<span class="economic-review-chip">${escapeHtml(source)}</span>`)
                        .join("")}
                    </div>
                  </section>
                  <section class="economic-review-detail-section">
                    <span class="economic-review-detail-section__label">Evidence quality explanation</span>
                    <div class="economic-review-quality">
                      <span class="economic-evidence-pill economic-evidence-pill--${evidenceQualityClass}">${reviewContent.evidenceQuality}</span>
                      <p>${escapeHtml(reviewContent.qualityNote)}</p>
                    </div>
                  </section>
                </div>
                <div class="economic-review-controls">
                  <div class="economic-review-control">
                    <label for="review-status-${item.key}">Review outcome</label>
                    <select id="review-status-${item.key}" data-panel-review-status="${item.key}" aria-label="Engineer review action for ${item.label}">
                      ${reviewStatusOptions
                        .map(
                          (status) =>
                            `<option value="${status}" ${item.reviewStatus === status ? "selected" : ""}>${status}</option>`
                        )
                        .join("")}
                    </select>
                  </div>
                  <div class="economic-review-control">
                    <label for="review-score-${item.key}">Reviewed score</label>
                    <div class="economic-score-input">
                      <input id="review-score-${item.key}" type="number" min="0" max="100" value="${reviewedScore}" data-panel-review-score="${item.key}" aria-label="Reviewed score for ${item.label}">
                      <div class="economic-score-bar economic-score-bar--reviewed">
                        <span class="is-${reviewedEvidenceStatus}" style="width: ${reviewedScore}%;"></span>
                      </div>
                    </div>
                  </div>
                  <div class="economic-review-control economic-review-control--checkbox">
                    <label class="economic-review-checkbox">
                      <input type="checkbox" data-panel-review-dirty="${item.key}" ${item.excludeDirtyData ? "checked" : ""}>
                      <span>Exclude dirty data from this factor where possible</span>
                    </label>
                  </div>
                  <div class="economic-review-control economic-review-control--note">
                    <label for="review-note-${item.key}">Engineer note</label>
                    <textarea id="review-note-${item.key}" rows="3" data-panel-review-note="${item.key}" placeholder="Explain whether the mapping, evidence, or score needs adjustment.">${escapeHtml(item.engineerNote || "")}</textarea>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        `
        }
      )
      .join("");

    tableBody.querySelectorAll("[data-review-expand]").forEach((button) => {
      button.addEventListener("click", () => {
        const factor = detailState.reviewedStrategyBasis.find(
          (entry) => entry.key === button.dataset.reviewExpand
        );
        if (!factor) {
          return;
        }

        factor.isExpanded = !factor.isExpanded;
        renderStrategyBasisTable();
      });
    });

    tableBody.querySelectorAll("[data-panel-review-score]").forEach((input) => {
      input.addEventListener("input", () => {
        const factor = detailState.reviewedStrategyBasis.find(
          (item) => item.key === input.dataset.panelReviewScore
        );
        if (!factor) {
          return;
        }

        factor.reviewedScore = clampScore(input.value);
        if (factor.reviewStatus === "Accepted" && factor.reviewedScore !== factor.systemScore) {
          factor.reviewStatus = "Adjusted";
        } else if (
          factor.reviewStatus === "Adjusted" &&
          factor.reviewedScore === factor.systemScore
        ) {
          factor.reviewStatus = "Accepted";
        }
        renderStrategyBasisTable();
        renderConfidenceModel();
      });
    });

    tableBody.querySelectorAll("[data-panel-review-status]").forEach((select) => {
      select.addEventListener("change", () => {
        const factor = detailState.reviewedStrategyBasis.find(
          (item) => item.key === select.dataset.panelReviewStatus
        );
        if (!factor) {
          return;
        }

        factor.reviewStatus = select.value;
        renderStrategyBasisTable();
        renderConfidenceModel();
      });
    });

    tableBody.querySelectorAll("[data-panel-review-dirty]").forEach((input) => {
      input.addEventListener("change", () => {
        const factor = detailState.reviewedStrategyBasis.find(
          (item) => item.key === input.dataset.panelReviewDirty
        );
        if (!factor) {
          return;
        }

        factor.excludeDirtyData = input.checked;
        if (input.checked && factor.reviewStatus === "Accepted") {
          factor.reviewStatus = "Dirty data";
        } else if (!input.checked && factor.reviewStatus === "Dirty data") {
          factor.reviewStatus =
            clampScore(factor.reviewedScore) === factor.systemScore ? "Accepted" : "Adjusted";
        }
        renderStrategyBasisTable();
        renderConfidenceModel();
      });
    });

    tableBody.querySelectorAll("[data-panel-review-note]").forEach((textarea) => {
      textarea.addEventListener("input", () => {
        const factor = detailState.reviewedStrategyBasis.find(
          (item) => item.key === textarea.dataset.panelReviewNote
        );
        if (!factor) {
          return;
        }

        factor.engineerNote = textarea.value;
      });
    });

    tableBody.querySelectorAll("tr[data-factor-key]").forEach((row) => {
      const factor = detailState.reviewedStrategyBasis.find(
        (item) => item.key === row.dataset.factorKey
      );
      if (!factor) {
        return;
      }

      const reviewContent = getStrategyBasisReviewContent(factor);
      attachTooltip(
        row,
        `<strong>${factor.label}</strong><span>System score: ${factor.systemScore}</span><span>${reviewContent.evidenceQuality} evidence quality</span><span>${reviewContent.basisSummary}</span>`
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
    if (compareChangedFactors) {
      const changedFactors = detailState.reviewedStrategyBasis.filter(
        (item) => clampScore(item.reviewedScore) !== item.systemScore
      );
      compareChangedFactors.innerHTML = changedFactors.length
        ? changedFactors
            .map(
              (item) =>
                `<li>${escapeHtml(item.label)}: ${item.systemScore} to ${clampScore(item.reviewedScore)}</li>`
            )
            .join("")
        : "<li>No reviewed score changes yet.</li>";
    }
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
      engineerNote: "",
      isExpanded: false,
      excludeDirtyData: false,
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
  const evidenceInputsNode = document.getElementById("detailEvidenceInputs");
  if (evidenceInputsNode) {
    evidenceInputsNode.innerHTML = evidenceInputItems
      .map((item) => `<span class="economic-review-chip">${escapeHtml(item)}</span>`)
      .join("");
  }
  setList("detailObservedEvidence", detail.observedEvidence);
  setList("detailOperationalChallenge", detail.operationalChallenge);
  setText("detailRecommendedActionStep", recommendedActionStep);
  setText("detailRecommendedReviewPeriod", recommendedReviewPeriod);
  setList("detailRecommendedMonitor", recommendedMonitorItems);
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

renderReliabilityOverview();
renderOpportunitiesWorkspace();
renderEconomicOpportunityDetail();
