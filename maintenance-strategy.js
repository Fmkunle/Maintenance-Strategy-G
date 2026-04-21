const body = document.body;
const appShell = document.querySelector(".app-shell");
const sidebarToggle = document.getElementById("sidebarToggle");
const themeToggle = document.getElementById("themeToggle");

const maintenanceWorkspace = document.getElementById("maintenanceWorkspace");
const assetWorkspace = document.getElementById("assetWorkspace");
const assetWorkspacePaneResizeHandle = document.getElementById("assetWorkspacePaneResizeHandle");
const assetWorkspaceCollapseToggle = document.getElementById("assetWorkspaceCollapseToggle");
const assetHierarchyTree = document.getElementById("assetHierarchyTree");
const assetHierarchyFilter = document.getElementById("assetHierarchyFilter");
const assetHierarchyTreeViewButton = document.getElementById("assetHierarchyTreeViewButton");
const assetHierarchyListViewButton = document.getElementById("assetHierarchyListViewButton");
const assetRegisterColumnResizeHandle = document.getElementById("assetRegisterColumnResizeHandle");
const selectedNodeTypeLabel = document.getElementById("selectedNodeTypeLabel");
const selectedNodeActions = document.getElementById("selectedNodeActions");
const childCreatorPanel = document.getElementById("childCreatorPanel");
const strategyList = document.getElementById("strategyList");
const maintenanceMenuBar = document.querySelector(".maintenance-menu-bar");

const assetContextOverlay = document.getElementById("assetContextOverlay");
const workflowNotice = document.getElementById("workflowNotice");
const assetContextForm = document.getElementById("assetContextForm");
const plantUnitCodeInput = document.getElementById("plantUnitCodeInput");
const plantUnitNameInput = document.getElementById("plantUnitNameInput");
const sectionSystemCodeField = document.getElementById("sectionSystemCodeField");
const sectionSystemCodePrefix = document.getElementById("sectionSystemCodePrefix");
const sectionSystemCodeInput = document.getElementById("sectionSystemCodeInput");
const sectionSystemNameInput = document.getElementById("sectionSystemNameInput");
const subsystemList = document.getElementById("subsystemList");
const addSubsystemButton = document.getElementById("addSubsystemButton");
const equipmentUnitCodeField = document.getElementById("equipmentUnitCodeField");
const equipmentUnitCodePrefix = document.getElementById("equipmentUnitCodePrefix");
const equipmentUnitCodeInput = document.getElementById("equipmentUnitCodeInput");
const equipmentUnitNameInput = document.getElementById("equipmentUnitNameInput");
const equipmentUnitMoreInfoButton = document.getElementById("equipmentUnitMoreInfoButton");
const equipmentEntryInfoPopup = document.getElementById("equipmentEntryInfoPopup");
const addSubunitButton = document.getElementById("addSubunitButton");
const subunitContainer = document.getElementById("subunitContainer");
const assetPathPreview = document.getElementById("assetPathPreview");
const saveDraftButton = document.getElementById("saveDraftButton");
const continueButton = document.getElementById("continueButton");

if (maintenanceWorkspace) {
  maintenanceWorkspace.hidden = true;
}

const backgroundDetailHeading = document.getElementById("backgroundDetailHeading");
const backgroundDetailSummary = document.getElementById("backgroundDetailSummary");

const themeStorageKey = "agenticai-theme";
const sidebarStorageKey = "agenticai-sidebar-collapsed";
const draftStorageKey = "maintenance-strategy-step1-draft";
const workspaceApiUrl = "/api/maintenance-workspace";
const workspaceSaveDebounceMs = 250;
const assetViewModes = {
  tree: "tree",
  list: "list",
};
const layoutDefaults = {
  leftPaneWidth: 720,
  locationColumnWidth: 430,
  descriptionColumnWidth: 258,
  assetViewMode: assetViewModes.tree,
  isHierarchyCollapsed: false,
  lastExpandedPaneWidth: 720,
};
const layoutLimits = {
  collapsedPaneWidth: 48,
  paneMin: 480,
  rightPaneMin: 420,
  handleWidth: 12,
  checkboxWidth: 32,
  locationMin: 220,
  descriptionMin: 160,
};
const resizableLayoutMediaQuery = "(max-width: 1180px)";

const nodeTypeMeta = {
  plant: {
    label: "Plant / Unit",
    placeholder: "New plant / unit",
    childActions: [{ type: "section", label: "Add section / system" }],
  },
  section: {
    label: "Section / System",
    placeholder: "New section / system",
    childActions: [
      { type: "subsystem", label: "Add sub-system" },
      { type: "equipment", label: "Add equipment unit" },
    ],
  },
  subsystem: {
    label: "Sub-system",
    placeholder: "New sub-system",
    childActions: [
      { type: "subsystem", label: "Add sub-system" },
      { type: "equipment", label: "Add equipment unit" },
    ],
  },
  equipment: {
    label: "Equipment Unit",
    placeholder: "New equipment unit",
    childActions: [{ type: "function", label: "Add function" }],
  },
  function: {
    label: "Function",
    placeholder: "New function",
    childActions: [{ type: "functionalFailure", label: "Add functional failure" }],
  },
  functionalFailure: {
    label: "Functional Failure",
    placeholder: "New functional failure",
    childActions: [{ type: "cause", label: "Add failure mode" }],
  },
  cause: {
    label: "Failure Mode",
    placeholder: "New failure mode",
    childActions: [
      { type: "effect", label: "Add effect" },
      { type: "cm", label: "Add CM" },
      { type: "pm", label: "Add PM" },
      { type: "ins", label: "Add INS" },
    ],
  },
  effect: {
    label: "Effect",
    placeholder: "New effect",
    childActions: [],
  },
  cm: {
    label: "CM",
    placeholder: "New CM",
    childActions: [],
  },
  ins: {
    label: "INS",
    placeholder: "New INS",
    childActions: [],
  },
  pm: {
    label: "PM",
    placeholder: "New PM",
    childActions: [],
  },
  subunit: {
    label: "Subunit",
    placeholder: "New subunit",
    childActions: [],
  },
};

const effectPerHourDownOptions = [
  "5K AUD/hr down",
  "10K AUD/hr down",
  "15K AUD/hr down",
  "20K AUD/hr down",
  "25K AUD/hr down",
  "30K AUD/hr down",
  "35K AUD/hr down",
  "40K AUD/hr down",
  "45K AUD/hr down",
  "50K AUD/hr down",
];
const effectCatalog = [
  { code: "C1", description: "Damage cost of between 10K to 50K AUD" },
  { code: "C2", description: "Damage cost of between 50K to 250K AUD" },
  { code: "C3", description: "Damage cost greater than 250K AUD" },
  { code: "S1", description: "Safety consequence cost of between 10K to 50K AUD" },
  { code: "S2", description: "Safety consequence cost of between 50K to 250K AUD" },
  { code: "S3", description: "Safety consequence cost greater than 250K AUD" },
  { code: "E1", description: "Environmental consequence cost of between 10K to 50K AUD" },
  { code: "E2", description: "Environmental consequence cost of between 50K to 250K AUD" },
  { code: "E3", description: "Environmental consequence cost greater than 250K AUD" },
  { code: "F1", description: "Financial loss of between 10K to 50K AUD" },
  { code: "F2", description: "Financial loss of between 50K to 250K AUD" },
  { code: "F3", description: "Financial loss greater than 250K AUD" },
];
const demandFrequencyOptions = ["Continuous", "Frequent", "Intermittent", "Occasional", "Rare", "Standby"];
const redundancyOptions = ["None", "50%", "25%", "Custom"];
const maeCategoryOptions = ["No", "Yes"];
const criticalityOptions = ["Extreme", "High", "Medium", "Low"];
const strategyHierarchyNodeTypes = new Set(["function", "functionalFailure", "cause", "effect", "cm", "ins", "pm"]);
const autoGeneratedChildTypes = new Set(["function", "functionalFailure", "cause", "cm", "ins", "pm"]);
const maintenanceTaskChildTypes = new Set(["cm", "pm"]);
const shortCodeHierarchyTypes = new Set(["effect", "cm", "pm", "ins"]);
const typedStrategyItemPrefixes = {
  effect: "EFF",
};

const createId = (prefix) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const defaultEquipmentContext = () => ({
  equipmentFunction: "",
  equipmentType: "",
  effectPerHourDown: "",
  demandFrequency: "",
  redundancyMode: "None",
  redundancyPercent: "",
  maeCategory: "No",
  operatingContext: "",
  criticality: "",
});

const defaultCauseFailureConfig = () => ({
  componentName: "",
  distribution: "Age related",
  weibullSet: "",
  mttf: "",
  standardDeviation: "",
  demandFrequency: "",
  standbyFailurePercent: "",
  standbyAgeingPercent: "",
  isDormant: false,
  eta1: "",
  beta1: "",
  gamma1: "",
  eta2: "",
  beta2: "",
  gamma2: "",
  eta3: "",
  beta3: "",
  gamma3: "",
  alarmIsEnabled: false,
  alarmDescription: "",
  alarmPfInterval: "",
  alarmDetectionProbability: "",
  dbJson: null,
});

const defaultCmConfig = () => ({
  intervalHours: "",
  durationHours: "",
  intervalShortDescription: "",
  offset: "0",
  rampTimeHours: "",
  operationNumber: "",
  isEnabled: true,
  doNotDeliver: false,
  isFixed: false,
  isSecondaryAction: false,
  externalOperationCost: "",
  maintenanceType: "",
  type: "",
  pfInterval: "",
  detectionProbability: "",
  labourDurationHours: "",
  resources: [],
  sparePartsRequired: [],
  toolsRequired: [],
});

const defaultPmConfig = () => ({
  intervalHours: "",
  durationHours: "",
  intervalShortDescription: "",
  offset: "0",
  rampTimeHours: "",
  operationNumber: "",
  isEnabled: true,
  doNotDeliver: false,
  isFixed: true,
  isSecondaryAction: true,
  externalOperationCost: "",
  maintenanceType: "",
  type: "",
  pfInterval: "",
  detectionProbability: "",
  labourDurationHours: "",
  resources: [],
  sparePartsRequired: [],
  toolsRequired: [],
});

const defaultInsConfig = () => ({
  inspectionType: "Routine",
  scheduledTaskType: "",
  isEnabled: true,
  doNotDeliver: false,
  interval: "",
  intervalShortDescription: "",
  pfInterval: "",
  detectionProbability: "",
  duration: "",
  laborLabor: "",
  resources: [],
  toolsRequired: [],
});

const cmResourceTypeOptions = [
  "ELECT TECH",
  "ELECT ENG",
  "MECH TECH",
  "MECH ENG",
  "AUTOMA.",
  "BOILER",
  "MAKER",
  "FITTER",
];

const cmSparePartOptions = ["Motor", "Bearing", "Seal kit", "Coupling", "Drive belt"];
const cmToolOptions = ["Spanner set", "Torque wrench", "Puller kit", "Multimeter", "Grease gun"];

const createCmResourceAssignment = (resourceType = "", durationHours = "") => ({
  id: createId("cm-resource"),
  resourceType,
  durationHours,
});

const createCmSparePartAssignment = (part = "") => ({
  id: createId("cm-spare-part"),
  part,
});

const createCmToolAssignment = (tool = "") => ({
  id: createId("cm-tool"),
  tool,
});

const createInsResourceAssignment = (resourceType = "", durationHours = "") => ({
  id: createId("ins-resource"),
  resourceType,
  durationHours,
});

const createInsToolAssignment = (tool = "") => ({
  id: createId("ins-tool"),
  tool,
});

const defaultEntryEquipmentUnit = () => ({
  code: "",
  name: "",
  equipmentContext: defaultEquipmentContext(),
});

const createNode = (
  type,
  code = "",
  name = "",
  description = "",
  equipmentContext = null,
  failureConfig = null,
  cmConfig = null,
  pmConfig = null,
  insConfig = null
) => ({
  id: createId(type),
  type,
  code,
  name,
  description,
  equipmentContext: type === "equipment" ? { ...defaultEquipmentContext(), ...(equipmentContext || {}) } : null,
  failureConfig: type === "cause" ? { ...defaultCauseFailureConfig(), ...(failureConfig || {}) } : null,
  cmConfig:
    type === "cm"
      ? {
          ...defaultCmConfig(),
          ...(cmConfig || {}),
          resources: Array.isArray(cmConfig?.resources)
            ? cmConfig.resources.map((resource) => ({
                id: typeof resource?.id === "string" && resource.id ? resource.id : createId("cm-resource"),
                resourceType: typeof resource?.resourceType === "string" ? resource.resourceType : "",
                durationHours: typeof resource?.durationHours === "string" ? resource.durationHours : "",
              }))
            : [],
          sparePartsRequired: Array.isArray(cmConfig?.sparePartsRequired)
            ? cmConfig.sparePartsRequired.map((part) => ({
                id: typeof part?.id === "string" && part.id ? part.id : createId("cm-spare-part"),
                part: typeof part?.part === "string" ? part.part : "",
              }))
            : [],
          toolsRequired: Array.isArray(cmConfig?.toolsRequired)
            ? cmConfig.toolsRequired.map((tool) => ({
                id: typeof tool?.id === "string" && tool.id ? tool.id : createId("cm-tool"),
                tool: typeof tool?.tool === "string" ? tool.tool : "",
              }))
            : [],
        }
      : null,
  pmConfig:
    type === "pm"
      ? {
          ...defaultPmConfig(),
          ...(pmConfig || {}),
          resources: Array.isArray(pmConfig?.resources)
            ? pmConfig.resources.map((resource) => ({
                id: typeof resource?.id === "string" && resource.id ? resource.id : createId("pm-resource"),
                resourceType: typeof resource?.resourceType === "string" ? resource.resourceType : "",
                durationHours: typeof resource?.durationHours === "string" ? resource.durationHours : "",
              }))
            : [],
          sparePartsRequired: Array.isArray(pmConfig?.sparePartsRequired)
            ? pmConfig.sparePartsRequired.map((part) => ({
                id: typeof part?.id === "string" && part.id ? part.id : createId("pm-spare-part"),
                part: typeof part?.part === "string" ? part.part : "",
              }))
            : [],
          toolsRequired: Array.isArray(pmConfig?.toolsRequired)
            ? pmConfig.toolsRequired.map((tool) => ({
                id: typeof tool?.id === "string" && tool.id ? tool.id : createId("pm-tool"),
                tool: typeof tool?.tool === "string" ? tool.tool : "",
              }))
            : [],
        }
      : null,
  insConfig:
    type === "ins"
      ? {
          ...defaultInsConfig(),
          ...(insConfig || {}),
          isEnabled: insConfig?.isEnabled !== undefined ? Boolean(insConfig.isEnabled) : true,
          doNotDeliver: Boolean(insConfig?.doNotDeliver),
          resources: Array.isArray(insConfig?.resources)
            ? insConfig.resources.map((resource) => ({
                id: typeof resource?.id === "string" && resource.id ? resource.id : createId("ins-resource"),
                resourceType: typeof resource?.resourceType === "string" ? resource.resourceType : "",
                durationHours: typeof resource?.durationHours === "string" ? resource.durationHours : "",
              }))
            : [],
          toolsRequired: Array.isArray(insConfig?.toolsRequired)
            ? insConfig.toolsRequired.map((tool) => ({
                id: typeof tool?.id === "string" && tool.id ? tool.id : createId("ins-tool"),
                tool: typeof tool?.tool === "string" ? tool.tool : "",
              }))
            : [],
        }
      : null,
  children: [],
});

const defaultChildDraftState = () => ({
  isOpen: false,
  parentId: "",
  editNodeId: "",
  childType: "",
  codeSegment: "",
  description: "",
  equipmentFunction: "",
  equipmentType: "",
  effectPerHourDown: "",
  demandFrequency: "",
  redundancyMode: "None",
  redundancyPercent: "",
  maeCategory: "No",
  operatingContext: "",
  criticality: "",
  distribution: "Age related",
  weibullSet: "",
  mttf: "",
  componentName: "",
  standardDeviation: "",
  causeDemandFrequency: "",
  standbyFailurePercent: "",
  standbyAgeingPercent: "",
  isDormant: false,
  eta1: "",
  beta1: "",
  gamma1: "",
  eta2: "",
  beta2: "",
  gamma2: "",
  eta3: "",
  beta3: "",
  gamma3: "",
  causeAdvancedOpen: false,
  causeAlarmOpen: false,
  alarmIsEnabled: false,
  alarmDescription: "",
  alarmPfInterval: "",
  alarmDetectionProbability: "",
  cmStep: "core",
  cmName: "",
  cmIntervalHours: "",
  cmDurationHours: "",
  cmIntervalShortDescription: "",
  cmOffset: "0",
  cmRampTimeHours: "",
  cmOperationNumber: "",
  cmIsEnabled: true,
  cmDoNotDeliver: false,
  cmIsFixed: true,
  cmIsSecondaryAction: true,
  cmExternalOperationCost: "",
  cmMaintenanceType: "",
  cmTaskType: "",
  cmPfInterval: "",
  cmDetectionProbability: "",
  cmLabourDurationHours: "",
  cmResources: [],
  cmSparePartsRequired: [],
  cmToolsRequired: [],
  copyToPmOnSave: false,
  insName: "",
  insInspectionType: "Routine",
  insScheduledTaskType: "",
  insIsEnabled: true,
  insDoNotDeliver: false,
  insInterval: "",
  insIntervalShortDescription: "",
  insPfInterval: "",
  insDetectionProbability: "",
  insDuration: "",
  insLaborLabor: "",
  insResources: [],
  insToolsRequired: [],
});

const defaultEquipmentInfoState = () => ({
  mode: "closed",
  nodeId: "",
  menuOpen: false,
  draft: null,
});

const defaultCauseConfigState = () => ({
  nodeId: "",
  draft: null,
  advancedOpen: false,
  alarmOpen: false,
});

const defaultPmConfigState = () => ({
  nodeId: "",
  draft: null,
  step: "core",
});

const defaultInsConfigState = () => ({
  nodeId: "",
  draft: null,
});

const defaultEntryState = () => ({
  plantUnit: { code: "", name: "" },
  sectionSystem: { code: "", name: "" },
  subsystems: [],
  equipmentUnit: defaultEntryEquipmentUnit(),
  hasSubunit: false,
  subunit: { code: "", name: "" },
});

const defaultEntryEquipmentInfoState = () => ({
  isOpen: false,
  draft: defaultEquipmentContext(),
});

const defaultState = () => ({
  entry: defaultEntryState(),
  hierarchy: [],
  maintainableItems: [],
  selectedNodeId: "",
  collapsedNodeIds: [],
  hierarchyFilter: "",
  strategyTable: defaultStrategyTableState(),
  layout: { ...layoutDefaults },
  modalVisible: true,
  savedAt: "",
});

const deletableNodeTypes = new Set([
  "equipment",
  "subsystem",
  "subunit",
  "function",
  "functionalFailure",
  "cause",
  "effect",
  "cm",
  "ins",
  "pm",
]);

let workspaceSaveTimer = null;
let workspaceSaveSequence = Promise.resolve();
let entryEquipmentInfoState = defaultEntryEquipmentInfoState();
let causeConfigState = defaultCauseConfigState();
let pmConfigState = defaultPmConfigState();
let insConfigState = defaultInsConfigState();

const getLaunchMode = () => {
  const mode = new URLSearchParams(window.location.search).get("mode");
  return mode === "existing" ? "existing" : "new";
};

const normalizeEntryNode = (value) => ({
  code: typeof value?.code === "string" ? value.code : "",
  name: typeof value?.name === "string" ? value.name : "",
});

const normalizeEquipmentEntryNode = (value) => ({
  ...normalizeEntryNode(value),
  equipmentContext: {
    ...defaultEquipmentContext(),
    ...(value?.equipmentContext && typeof value.equipmentContext === "object" ? value.equipmentContext : {}),
  },
});

const normalizeCauseFailureConfig = (value) => ({
  ...defaultCauseFailureConfig(),
  ...(value && typeof value === "object" ? value : {}),
  isDormant: Boolean(value?.isDormant),
  alarmIsEnabled: Boolean(value?.alarmIsEnabled),
  dbJson: value?.dbJson && typeof value.dbJson === "object" ? value.dbJson : null,
});

const normalizeCmConfig = (value) => ({
  ...defaultCmConfig(),
  ...(value && typeof value === "object" ? value : {}),
  isEnabled: value?.isEnabled !== undefined ? Boolean(value.isEnabled) : true,
  doNotDeliver: Boolean(value?.doNotDeliver),
  isFixed: value?.isFixed !== undefined ? Boolean(value.isFixed) : true,
  isSecondaryAction: value?.isSecondaryAction !== undefined ? Boolean(value.isSecondaryAction) : true,
  resources: Array.isArray(value?.resources)
    ? value.resources.map((resource, index) => ({
        id: typeof resource?.id === "string" && resource.id ? resource.id : createId(`cm-resource-${index}`),
        resourceType: typeof resource?.resourceType === "string" ? resource.resourceType : "",
        durationHours: typeof resource?.durationHours === "string" ? resource.durationHours : "",
      }))
    : [],
  sparePartsRequired: Array.isArray(value?.sparePartsRequired)
    ? value.sparePartsRequired.map((part, index) => ({
        id: typeof part?.id === "string" && part.id ? part.id : createId(`cm-spare-part-${index}`),
        part: typeof part?.part === "string" ? part.part : "",
      }))
    : [],
  toolsRequired: Array.isArray(value?.toolsRequired)
    ? value.toolsRequired.map((tool, index) => ({
        id: typeof tool?.id === "string" && tool.id ? tool.id : createId(`cm-tool-${index}`),
        tool: typeof tool?.tool === "string" ? tool.tool : "",
      }))
    : [],
});

const normalizePmConfig = (value) => ({
  ...defaultPmConfig(),
  ...(value && typeof value === "object" ? value : {}),
  isEnabled: value?.isEnabled !== undefined ? Boolean(value.isEnabled) : true,
  doNotDeliver: Boolean(value?.doNotDeliver),
  isFixed: value?.isFixed !== undefined ? Boolean(value.isFixed) : true,
  isSecondaryAction: value?.isSecondaryAction !== undefined ? Boolean(value.isSecondaryAction) : true,
  resources: Array.isArray(value?.resources)
    ? value.resources.map((resource, index) => ({
        id: typeof resource?.id === "string" && resource.id ? resource.id : createId(`pm-resource-${index}`),
        resourceType: typeof resource?.resourceType === "string" ? resource.resourceType : "",
        durationHours: typeof resource?.durationHours === "string" ? resource.durationHours : "",
      }))
    : [],
  sparePartsRequired: Array.isArray(value?.sparePartsRequired)
    ? value.sparePartsRequired.map((part, index) => ({
        id: typeof part?.id === "string" && part.id ? part.id : createId(`pm-spare-part-${index}`),
        part: typeof part?.part === "string" ? part.part : "",
      }))
    : [],
  toolsRequired: Array.isArray(value?.toolsRequired)
    ? value.toolsRequired.map((tool, index) => ({
        id: typeof tool?.id === "string" && tool.id ? tool.id : createId(`pm-tool-${index}`),
        tool: typeof tool?.tool === "string" ? tool.tool : "",
      }))
    : [],
});

const normalizeInsConfig = (value) => ({
  ...defaultInsConfig(),
  ...(value && typeof value === "object" ? value : {}),
  inspectionType: String(value?.inspectionType || "Routine") || "Routine",
  isEnabled: value?.isEnabled !== undefined ? Boolean(value.isEnabled) : true,
  doNotDeliver: Boolean(value?.doNotDeliver),
  resources: Array.isArray(value?.resources)
    ? value.resources.map((resource, index) => ({
        id: typeof resource?.id === "string" && resource.id ? resource.id : createId(`ins-resource-${index}`),
        resourceType: typeof resource?.resourceType === "string" ? resource.resourceType : "",
        durationHours: typeof resource?.durationHours === "string" ? resource.durationHours : "",
      }))
    : [],
  toolsRequired: Array.isArray(value?.toolsRequired)
    ? value.toolsRequired.map((tool, index) => ({
        id: typeof tool?.id === "string" && tool.id ? tool.id : createId(`ins-tool-${index}`),
        tool: typeof tool?.tool === "string" ? tool.tool : "",
      }))
    : [],
});

const normalizeEntryState = (entry) => ({
  plantUnit: normalizeEntryNode(entry?.plantUnit),
  sectionSystem: normalizeEntryNode(entry?.sectionSystem),
  subsystems: Array.isArray(entry?.subsystems)
    ? entry.subsystems.map((item, index) => ({
        id: typeof item?.id === "string" && item.id ? item.id : createId(`entry-subsystem-${index}`),
        code: typeof item?.code === "string" ? item.code : "",
        name: typeof item?.name === "string" ? item.name : "",
      }))
    : [],
  equipmentUnit: normalizeEquipmentEntryNode(entry?.equipmentUnit),
  hasSubunit: Boolean(entry?.hasSubunit),
  subunit: normalizeEntryNode(entry?.subunit),
});

const isResizableLayoutDisabled = () => window.matchMedia(resizableLayoutMediaQuery).matches;
const getAssetWorkspaceWidth = () => assetWorkspace?.getBoundingClientRect().width || 0;
const getPaneResizeMaxWidth = (workspaceWidth) =>
  Math.max(layoutLimits.paneMin, workspaceWidth - layoutLimits.rightPaneMin - layoutLimits.handleWidth);

const normalizeLayoutState = (layout, workspaceWidth = getAssetWorkspaceWidth()) => {
  const baseLayout = {
    ...layoutDefaults,
    ...(layout && typeof layout === "object" ? layout : {}),
  };
  const assetViewMode =
    baseLayout.assetViewMode === assetViewModes.list ? assetViewModes.list : assetViewModes.tree;
  const isHierarchyCollapsed = Boolean(baseLayout.isHierarchyCollapsed);

  if (!workspaceWidth || isResizableLayoutDisabled()) {
    return {
      leftPaneWidth: baseLayout.leftPaneWidth,
      locationColumnWidth: baseLayout.locationColumnWidth,
      descriptionColumnWidth: baseLayout.descriptionColumnWidth,
      assetViewMode,
      isHierarchyCollapsed,
      lastExpandedPaneWidth: baseLayout.lastExpandedPaneWidth,
    };
  }

  const maxPaneWidth = getPaneResizeMaxWidth(workspaceWidth);
  const leftPaneWidth = Math.min(Math.max(baseLayout.leftPaneWidth, layoutLimits.paneMin), maxPaneWidth);
  const lastExpandedPaneWidth = Math.min(
    Math.max(baseLayout.lastExpandedPaneWidth || leftPaneWidth, layoutLimits.paneMin),
    maxPaneWidth
  );
  const availableColumnWidth = Math.max(
    layoutLimits.locationMin + layoutLimits.descriptionMin,
    leftPaneWidth - layoutLimits.checkboxWidth
  );
  const maxLocationWidth = Math.max(layoutLimits.locationMin, availableColumnWidth - layoutLimits.descriptionMin);
  const locationColumnWidth = Math.min(
    Math.max(baseLayout.locationColumnWidth, layoutLimits.locationMin),
    maxLocationWidth
  );
  const descriptionColumnWidth = Math.max(
    layoutLimits.descriptionMin,
    availableColumnWidth - locationColumnWidth
  );

  return {
    leftPaneWidth,
    locationColumnWidth,
    descriptionColumnWidth,
    assetViewMode,
    isHierarchyCollapsed,
    lastExpandedPaneWidth,
  };
};

const hasHierarchyDraftData = (draft) =>
  Boolean(draft && typeof draft === "object" && Array.isArray(draft.hierarchy) && draft.hierarchy.length > 0);

const entryDraftHasRecoverableData = (entry) => {
  if (!entry || typeof entry !== "object") {
    return false;
  }

  const hasTextValue = (value) => Boolean(typeof value === "string" && value.trim());
  const hasNodeData = (node) => Boolean(node && typeof node === "object" && (hasTextValue(node.code) || hasTextValue(node.name)));
  const hasEquipmentContextData = (context) =>
    Boolean(
      context &&
        typeof context === "object" &&
        Object.entries(defaultEquipmentContext()).some(([key, defaultValue]) => {
          const nextValue = context[key];
          if (typeof defaultValue === "string") {
            return hasTextValue(nextValue);
          }
          return nextValue !== defaultValue;
        })
    );

  return Boolean(
    hasNodeData(entry.plantUnit) ||
      hasNodeData(entry.sectionSystem) ||
      (Array.isArray(entry.subsystems) && entry.subsystems.some((item) => hasNodeData(item))) ||
      hasNodeData(entry.equipmentUnit) ||
      hasEquipmentContextData(entry.equipmentUnit?.equipmentContext) ||
      Boolean(entry.hasSubunit) ||
      hasNodeData(entry.subunit)
  );
};

const isSavedModalDraftCandidate = (draft) =>
  Boolean(draft && typeof draft === "object" && !hasHierarchyDraftData(draft) && entryDraftHasRecoverableData(draft.entry));

const isExistingWorkspaceCandidate = (draft) => hasHierarchyDraftData(draft);

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const findNodeInfo = (nodes, nodeId, parent = null, path = []) => {
  for (const node of nodes) {
    const nextPath = [...path, node];
    if (node.id === nodeId) {
      return {
        node,
        parent,
        path: nextPath,
      };
    }

    const childMatch = findNodeInfo(node.children, nodeId, node, nextPath);
    if (childMatch) {
      return childMatch;
    }
  }

  return null;
};

const getFirstNode = (nodes) => {
  if (!nodes.length) {
    return null;
  }

  let current = nodes[0];
  while (current.children.length) {
    current = current.children[0];
  }
  return current;
};

const removeNodeFromHierarchy = (nodes, nodeId) =>
  nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => ({
      ...node,
      children: removeNodeFromHierarchy(node.children, nodeId),
    }));

const isCodeLikeHierarchyValue = (value) => /^[A-Z0-9]+(?:[._-][A-Z0-9]+)*$/.test(String(value || "").trim());
const getHierarchySeparatorForType = (nodeType) => (strategyHierarchyNodeTypes.has(nodeType) ? "." : "-");

const joinInheritedCode = (parentFullCode, childSegment, childType = "") => {
  const parentValue = String(parentFullCode || "").trim();
  const childValue = String(childSegment || "").trim();
  if (!parentValue) {
    return childValue;
  }
  if (!childValue) {
    return parentValue;
  }
  return `${parentValue}${getHierarchySeparatorForType(childType)}${childValue}`;
};

const extractLocalCodeSegment = (value, parentFullCode = "", childType = "") => {
  const rawValue = String(value || "").trim();
  const parentValue = String(parentFullCode || "").trim();
  if (!rawValue) {
    return "";
  }

  if (!parentValue) {
    return rawValue;
  }

  const parentUpper = parentValue.toUpperCase();
  const rawUpper = rawValue.toUpperCase();
  if (rawUpper === parentUpper) {
    return "";
  }

  const expectedPrefix = `${parentUpper}${getHierarchySeparatorForType(childType)}`;
  if (rawUpper.startsWith(expectedPrefix)) {
    return rawValue.slice(parentValue.length + 1).trim();
  }

  return rawValue;
};

const normalizeHierarchyNode = (node, fallbackType = "subsystem", parentFullCode = "") => {
  const type = nodeTypeMeta[node?.type] ? node.type : fallbackType;
  const normalizedCode = typeof node?.code === "string" ? node.code.trim() : "";
  const normalizedName = typeof node?.name === "string" ? node.name.trim() : "";
  const normalizedDescription = typeof node?.description === "string" ? node.description.trim() : "";
  let readableDescription = normalizedDescription;
  if (!readableDescription && normalizedCode && normalizedName && normalizedCode !== normalizedName) {
    readableDescription = normalizedName;
  }
  const shouldSwapReversedFields =
    readableDescription &&
    normalizedName &&
    readableDescription.toUpperCase() === normalizedCode.toUpperCase() &&
    !isCodeLikeHierarchyValue(normalizedName);
  if (shouldSwapReversedFields) {
    readableDescription = normalizedName;
  }

  const segmentFromCode = extractLocalCodeSegment(normalizedCode, parentFullCode, type);
  const segmentFromName =
    !segmentFromCode && isCodeLikeHierarchyValue(normalizedName)
      ? extractLocalCodeSegment(normalizedName, parentFullCode, type)
      : "";
  const segmentFromDescription =
    !segmentFromCode && !segmentFromName && isCodeLikeHierarchyValue(normalizedDescription)
      ? extractLocalCodeSegment(normalizedDescription, parentFullCode, type)
      : "";
  const localCodeSegment = segmentFromCode || segmentFromName || segmentFromDescription;
  const fullInheritedCode =
    joinInheritedCode(parentFullCode, localCodeSegment, type) ||
    (isCodeLikeHierarchyValue(normalizedName) ? normalizedName : "") ||
    normalizedCode ||
    normalizedName;
  const displayName = shortCodeHierarchyTypes.has(type) ? localCodeSegment || normalizedName || normalizedCode : fullInheritedCode;

  return {
    id: typeof node?.id === "string" && node.id ? node.id : createId(type),
    type,
    code: localCodeSegment,
    name: displayName,
    description: readableDescription,
    equipmentContext:
      type === "equipment"
        ? {
            ...defaultEquipmentContext(),
            ...(node?.equipmentContext && typeof node.equipmentContext === "object" ? node.equipmentContext : {}),
          }
        : null,
    failureConfig: type === "cause" ? normalizeCauseFailureConfig(node?.failureConfig) : null,
    cmConfig: type === "cm" ? normalizeCmConfig(node?.cmConfig) : null,
    pmConfig: type === "pm" ? normalizePmConfig(node?.pmConfig) : null,
    insConfig: type === "ins" ? normalizeInsConfig(node?.insConfig) : null,
    children: Array.isArray(node?.children)
      ? node.children.map((child) => normalizeHierarchyNode(child, "subsystem", fullInheritedCode))
      : [],
  };
};

const collectHierarchyNodeIds = (nodes, nodeIds = new Set()) => {
  nodes.forEach((node) => {
    nodeIds.add(node.id);
    if (node.children.length) {
      collectHierarchyNodeIds(node.children, nodeIds);
    }
  });
  return nodeIds;
};

const normalizeMaintainableItems = (items, hierarchy) => {
  const validNodeIds = collectHierarchyNodeIds(hierarchy);

  return Array.isArray(items)
    ? items
        .map((item, index) => ({
          id: typeof item?.id === "string" && item.id ? item.id : createId(`maintainable-item-${index}`),
          nodeId: typeof item?.nodeId === "string" ? item.nodeId : "",
          name: typeof item?.name === "string" ? item.name : "",
        }))
        .filter((item) => validNodeIds.has(item.nodeId))
    : [];
};

const cloneHierarchyNode = (node) => ({
  ...node,
  equipmentContext: node?.equipmentContext ? JSON.parse(JSON.stringify(node.equipmentContext)) : null,
  failureConfig: node?.failureConfig ? JSON.parse(JSON.stringify(node.failureConfig)) : null,
  cmConfig: node?.cmConfig ? JSON.parse(JSON.stringify(node.cmConfig)) : null,
  pmConfig: node?.pmConfig ? JSON.parse(JSON.stringify(node.pmConfig)) : null,
  insConfig: node?.insConfig ? JSON.parse(JSON.stringify(node.insConfig)) : null,
  children: Array.isArray(node?.children) ? node.children.map((child) => cloneHierarchyNode(child)) : [],
});

const findChildByTypeAndCode = (parentNode, type, code) =>
  (parentNode?.children || []).find(
    (child) => child.type === type && String(child.code || "").trim().toUpperCase() === String(code || "").trim().toUpperCase()
  ) || null;

const mergeSeedBranch = (targetParent, seedNode) => {
  const existingNode = findChildByTypeAndCode(targetParent, seedNode.type, seedNode.code);
  if (!existingNode) {
    targetParent.children.push(cloneHierarchyNode(seedNode));
    return;
  }

  seedNode.children.forEach((seedChild) => {
    mergeSeedBranch(existingNode, seedChild);
  });
};

const backfillMfaCrushHierarchy = (hierarchy) => {
  if (!Array.isArray(hierarchy) || !hierarchy.length) {
    return createMfaCrushSeedWorkspace().hierarchy;
  }

  const seedHierarchy = createMfaCrushSeedWorkspace().hierarchy;
  const seedRoot = seedHierarchy[0];
  if (!seedRoot) {
    return hierarchy;
  }

  const existingRoot = hierarchy.find(
    (node) => node.type === "plant" && String(node.code || "").trim().toUpperCase() === String(seedRoot.code || "").trim().toUpperCase()
  );

  if (!existingRoot) {
    return [...hierarchy, cloneHierarchyNode(seedRoot)];
  }

  seedRoot.children.forEach((seedChild) => {
    mergeSeedBranch(existingRoot, seedChild);
  });

  return hierarchy;
};

const normalizeWorkspaceHierarchyState = (draft) => {
  if (!hasHierarchyDraftData(draft)) {
    return null;
  }

  try {
    const hierarchy = backfillMfaCrushHierarchy(draft.hierarchy.map((node) => normalizeHierarchyNode(node, "plant")));
    if (!hierarchy.length) {
      return null;
    }
    refreshFailureModeDbJsonForHierarchy(hierarchy);

    const firstNode = getFirstNode(hierarchy);
    const selectedNodeId =
      typeof draft?.selectedNodeId === "string" && findNodeInfo(hierarchy, draft.selectedNodeId)
        ? draft.selectedNodeId
        : firstNode?.id || "";
    const validNodeIds = collectHierarchyNodeIds(hierarchy);

    return {
      ...defaultState(),
      entry: normalizeEntryState(draft?.entry),
      hierarchy,
      maintainableItems: normalizeMaintainableItems(draft?.maintainableItems, hierarchy),
      selectedNodeId,
      collapsedNodeIds: Array.isArray(draft?.collapsedNodeIds)
        ? draft.collapsedNodeIds.filter((nodeId) => validNodeIds.has(nodeId))
        : [],
      hierarchyFilter: typeof draft?.hierarchyFilter === "string" ? draft.hierarchyFilter : "",
      strategyTable: normalizeStrategyTableStateSafely(draft?.strategyTable),
      layout: normalizeLayoutState(draft?.layout),
      modalVisible: false,
      savedAt: typeof draft?.savedAt === "string" ? draft.savedAt : "",
    };
  } catch {
    return null;
  }
};

const normalizeWorkspaceModalDraftState = (draft) => {
  if (!isSavedModalDraftCandidate(draft)) {
    return null;
  }

  try {
    return {
      ...defaultState(),
      entry: normalizeEntryState(draft?.entry),
      hierarchy: [],
      maintainableItems: [],
      selectedNodeId: "",
      collapsedNodeIds: [],
      hierarchyFilter: "",
      strategyTable: normalizeStrategyTableStateSafely(draft?.strategyTable),
      layout: normalizeLayoutState(draft?.layout),
      modalVisible: true,
      savedAt: typeof draft?.savedAt === "string" ? draft.savedAt : "",
    };
  } catch {
    return null;
  }
};

const normalizeWorkspaceState = (draft) =>
  normalizeWorkspaceHierarchyState(draft) || normalizeWorkspaceModalDraftState(draft);

const loadExistingWorkspaceFromLocalStorage = () => {
  try {
    const rawDraft = window.localStorage.getItem(draftStorageKey);
    if (!rawDraft) {
      return null;
    }

    return JSON.parse(rawDraft);
  } catch {
    return null;
  }
};

const loadWorkspaceFromApi = async () => {
  try {
    const response = await fetch(workspaceApiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Unable to load workspace: ${response.status}`);
    }

    return await response.json();
  } catch {
    return null;
  }
};

const createPersistableWorkspace = (draft) => ({
  entry: draft.entry,
  hierarchy: draft.hierarchy,
  maintainableItems: draft.maintainableItems,
  selectedNodeId: draft.selectedNodeId,
  collapsedNodeIds: draft.collapsedNodeIds,
  hierarchyFilter: draft.hierarchyFilter,
  strategyTable: createPersistableStrategyTableState(draft.strategyTable),
  layout: draft.layout,
  modalVisible: draft.modalVisible,
  savedAt: draft.savedAt,
});

const saveWorkspaceToLocalStorage = (draft) => {
  window.localStorage.setItem(draftStorageKey, JSON.stringify(draft));
};

const saveWorkspaceToApi = async (draft) => {
  if (!isExistingWorkspaceCandidate(draft)) {
    return false;
  }

  const response = await fetch(workspaceApiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(createPersistableWorkspace(draft)),
  });

  if (!response.ok) {
    throw new Error(`Unable to save workspace: ${response.status}`);
  }

  return true;
};

const queueWorkspaceSave = (draft) => {
  if (!isExistingWorkspaceCandidate(draft)) {
    return;
  }

  const snapshot = JSON.parse(JSON.stringify(createPersistableWorkspace(draft)));
  if (workspaceSaveTimer) {
    window.clearTimeout(workspaceSaveTimer);
  }

  workspaceSaveTimer = window.setTimeout(() => {
    workspaceSaveTimer = null;
    workspaceSaveSequence = workspaceSaveSequence
      .then(() => saveWorkspaceToApi(snapshot))
      .catch(() => {});
  }, workspaceSaveDebounceMs);
};

const applyWorkspaceLayoutStyles = () => {
  if (!assetWorkspace) {
    return;
  }

  state.layout = normalizeLayoutState(state.layout);

  if (isResizableLayoutDisabled()) {
    assetWorkspace.style.removeProperty("--asset-pane-width");
    assetWorkspace.style.removeProperty("--asset-pane-collapsed-width");
    assetWorkspace.style.removeProperty("--asset-column-location-width");
    assetWorkspace.style.removeProperty("--asset-column-description-width");
    assetWorkspace.classList.remove("is-hierarchy-collapsed");
    return;
  }

  assetWorkspace.style.setProperty("--asset-pane-width", `${state.layout.leftPaneWidth}px`);
  assetWorkspace.style.setProperty("--asset-pane-collapsed-width", `${layoutLimits.collapsedPaneWidth}px`);
  assetWorkspace.style.setProperty("--asset-column-location-width", `${state.layout.locationColumnWidth}px`);
  assetWorkspace.style.setProperty("--asset-column-description-width", `${state.layout.descriptionColumnWidth}px`);
  assetWorkspace.classList.toggle("is-hierarchy-collapsed", state.layout.isHierarchyCollapsed);
  assetWorkspace.querySelector(".asset-workspace__hierarchy")?.setAttribute(
    "aria-hidden",
    String(state.layout.isHierarchyCollapsed)
  );
  assetWorkspaceCollapseToggle?.setAttribute(
    "aria-label",
    state.layout.isHierarchyCollapsed ? "Expand asset browser" : "Collapse asset browser"
  );
  assetWorkspaceCollapseToggle?.setAttribute("aria-pressed", String(state.layout.isHierarchyCollapsed));
};

const beginLayoutResize = (type, pointerStartX) => {
  if (!assetWorkspace || isResizableLayoutDisabled() || state.layout.isHierarchyCollapsed) {
    return;
  }

  const workspaceWidth = getAssetWorkspaceWidth();
  if (!workspaceWidth) {
    return;
  }

  const startLayout = normalizeLayoutState(state.layout, workspaceWidth);
  const startPaneWidth = startLayout.leftPaneWidth;
  const startLocationWidth = startLayout.locationColumnWidth;

  body.classList.add("is-resizing-layout");

  const onPointerMove = (event) => {
    const deltaX = event.clientX - pointerStartX;
    if (type === "pane") {
      state.layout = normalizeLayoutState(
        {
          ...state.layout,
          leftPaneWidth: startPaneWidth + deltaX,
          lastExpandedPaneWidth: startPaneWidth + deltaX,
          locationColumnWidth: startLocationWidth,
        },
        workspaceWidth
      );
    } else {
      const nextLocationWidth = startLocationWidth + deltaX;
      const nextDescriptionWidth =
        startPaneWidth - layoutLimits.checkboxWidth - nextLocationWidth;
      state.layout = normalizeLayoutState(
        {
          ...state.layout,
          leftPaneWidth: startPaneWidth,
          locationColumnWidth: nextLocationWidth,
          descriptionColumnWidth: nextDescriptionWidth,
        },
        workspaceWidth
      );
    }

    applyWorkspaceLayoutStyles();
  };

  const finishResize = () => {
    body.classList.remove("is-resizing-layout");
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", finishResize);
    window.removeEventListener("pointercancel", finishResize);
    persistDraftSilently();
  };

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", finishResize);
  window.addEventListener("pointercancel", finishResize);
};

const recoverExistingWorkspaceState = (...drafts) => {
  const hierarchyDraft = drafts.map((draft) => normalizeWorkspaceHierarchyState(draft)).find(Boolean);
  if (hierarchyDraft) {
    return hierarchyDraft;
  }

  const modalDraft = drafts.map((draft) => normalizeWorkspaceModalDraftState(draft)).find(Boolean);
  if (modalDraft) {
    return modalDraft;
  }

  return null;
};

const initializeState = async () => {
  if (getLaunchMode() === "existing") {
    const apiDraft = await loadWorkspaceFromApi();
    const localDraft = loadExistingWorkspaceFromLocalStorage();
    const existingWorkspace = recoverExistingWorkspaceState(apiDraft, localDraft);
    if (existingWorkspace) {
      state = existingWorkspace;
      return;
    }
  }

  state = createMfaCrushSeedWorkspace();
};

let state = defaultState();
let childDraftState = defaultChildDraftState();
let equipmentInfoState = defaultEquipmentInfoState();
let openMaintenanceMenu = null;

const collapseHierarchyPane = () => {
  state.layout = normalizeLayoutState({
    ...state.layout,
    isHierarchyCollapsed: true,
    lastExpandedPaneWidth: state.layout.leftPaneWidth,
  });
};

const expandHierarchyPane = () => {
  state.layout = normalizeLayoutState({
    ...state.layout,
    isHierarchyCollapsed: false,
    leftPaneWidth: state.layout.lastExpandedPaneWidth || layoutDefaults.leftPaneWidth,
  });
};

const toggleHierarchyPaneCollapse = () => {
  if (isResizableLayoutDisabled()) {
    return;
  }

  if (state.layout.isHierarchyCollapsed) {
    expandHierarchyPane();
  } else {
    collapseHierarchyPane();
  }

  applyWorkspaceLayoutStyles();
  persistDraftSilently();
};

const setMaintenanceMenuState = (menu, shouldOpen) => {
  const trigger = menu?.querySelector("[data-menu-trigger]");
  const panel = menu?.querySelector(".maintenance-menu__panel");
  if (!trigger || !panel) {
    return;
  }

  menu.classList.toggle("is-open", shouldOpen);
  trigger.setAttribute("aria-expanded", String(shouldOpen));
  panel.hidden = !shouldOpen;
};

const closeMaintenanceMenus = () => {
  if (openMaintenanceMenu) {
    setMaintenanceMenuState(openMaintenanceMenu, false);
    openMaintenanceMenu = null;
  }
};

const toggleMaintenanceMenu = (menu) => {
  if (!menu) {
    return;
  }

  if (openMaintenanceMenu && openMaintenanceMenu !== menu) {
    setMaintenanceMenuState(openMaintenanceMenu, false);
  }

  const shouldOpen = openMaintenanceMenu !== menu;
  setMaintenanceMenuState(menu, shouldOpen);
  openMaintenanceMenu = shouldOpen ? menu : null;
};

const applyTheme = (theme) => {
  if (body) {
    body.dataset.theme = theme;
  }
};

const resetEntryEquipmentUnit = () => {
  state.entry.equipmentUnit = defaultEntryEquipmentUnit();
  state.entry.hasSubunit = false;
  state.entry.subunit = { code: "", name: "" };
  closeEntryEquipmentInfoPopup();
};

const applySidebarState = (isCollapsed) => {
  if (!appShell) {
    return;
  }

  appShell.classList.toggle("sidebar-collapsed", isCollapsed);
  sidebarToggle?.setAttribute("aria-expanded", String(!isCollapsed));
};

const getDisplayValue = (value, fallback) => (typeof value === "string" ? value.trim() : "") || fallback;
const hasValue = (value) => Boolean(typeof value === "string" && value.trim());
const hasNodeValue = (node) => hasValue(node.code || "") && hasValue(node.name || "");
const isNodeBlank = (node) => !hasValue(node.code || "") && !hasValue(node.name || "");
const isNodeCompleteOrBlank = (node) => hasNodeValue(node) || isNodeBlank(node);
const getNodeCodeValue = (node, fallback = "") => getDisplayValue(node.code || "", fallback);
const getNodeNameValue = (node, fallback = "") => getDisplayValue(node.name || "", fallback);
const getChildActions = (type) => nodeTypeMeta[type]?.childActions || [];
const isNodeDeletable = (node) => Boolean(node && deletableNodeTypes.has(node.type));
const buildInheritedCodePrefix = (segments) => {
  const prefix = segments
    .map((segment) => (typeof segment === "string" ? segment.trim() : ""))
    .filter(Boolean)
    .join("-");

  return prefix ? `${prefix}-` : "";
};
const applyInheritedPrefix = (fieldElement, prefixElement, prefixValue) => {
  if (!fieldElement || !prefixElement) {
    return;
  }

  prefixElement.textContent = prefixValue;
  fieldElement.classList.toggle("has-prefix", Boolean(prefixValue));
};

const getFullCodeFromPath = (path) =>
  path.reduce((fullCode, node) => joinInheritedCode(fullCode, String(node?.code || "").trim(), node?.type || ""), "");

const getFullNameFromPath = (path) =>
  path
    .map((node) => {
      const description = typeof node?.description === "string" ? node.description.trim() : "";
      const name = typeof node?.name === "string" ? node.name.trim() : "";
      return description || name;
    })
    .filter(Boolean)
    .join(" > ");

const formatFunctionalLocationPreview = (path) => {
  if (!path.length) {
    return "Select a node from the hierarchy.";
  }

  const fullCode = getFullCodeFromPath(path) || "Code pending";
  const fullName = getFullNameFromPath(path) || "Name pending";
  return `${fullCode} | ${fullName}`;
};

const getEntryPathSegments = (useFallbacks = true) => {
  const entry = state.entry;
  const segments = [
    {
      type: "plant",
      code: getNodeCodeValue(entry.plantUnit, useFallbacks ? "PLANT" : ""),
      name: getNodeNameValue(entry.plantUnit, useFallbacks ? nodeTypeMeta.plant.label : ""),
    },
  ];

  if (useFallbacks || hasNodeValue(entry.sectionSystem)) {
    segments.push({
      type: "section",
      code: getNodeCodeValue(entry.sectionSystem, useFallbacks ? "SYSTEM" : ""),
      name: getNodeNameValue(entry.sectionSystem, useFallbacks ? nodeTypeMeta.section.label : ""),
    });
  }

  entry.subsystems.forEach((subsystem, index) => {
    if (useFallbacks || hasNodeValue(subsystem)) {
      segments.push({
        type: "subsystem",
        code: getNodeCodeValue(subsystem, useFallbacks ? `SUB${index + 1}` : ""),
        name: getNodeNameValue(subsystem, useFallbacks ? `Sub-system ${index + 1}` : ""),
      });
    }
  });

  if (useFallbacks || hasNodeValue(entry.equipmentUnit)) {
    segments.push({
      type: "equipment",
      code: getNodeCodeValue(entry.equipmentUnit, useFallbacks ? "EQUIP" : ""),
      name: getNodeNameValue(entry.equipmentUnit, useFallbacks ? nodeTypeMeta.equipment.label : ""),
    });
  }

  if (entry.hasSubunit && (useFallbacks || hasNodeValue(entry.subunit))) {
    segments.push({
      type: "subunit",
      code: getNodeCodeValue(entry.subunit, useFallbacks ? "SUBUNIT" : ""),
      name: getNodeNameValue(entry.subunit, useFallbacks ? nodeTypeMeta.subunit.label : ""),
    });
  }

  return segments.filter((segment) => segment.code || segment.name);
};

const getFunctionSequenceCode = (siblings = []) => {
  const numericValues = siblings
    .map((entry) => Number.parseInt(String(entry?.code || "").trim(), 10))
    .filter((value) => Number.isFinite(value) && value > 0);
  return String((numericValues.length ? Math.max(...numericValues) : 0) + 1);
};

const getAlphabeticSequenceValue = (code) => {
  const letters = String(code || "").trim().toUpperCase();
  if (!letters || /[^A-Z]/.test(letters)) {
    return 0;
  }

  return letters.split("").reduce((total, letter) => total * 26 + (letter.charCodeAt(0) - 64), 0);
};

const getAlphabeticCodeFromValue = (value) => {
  let current = Number(value);
  if (!Number.isFinite(current) || current < 1) {
    return "A";
  }

  let result = "";
  while (current > 0) {
    current -= 1;
    result = String.fromCharCode(65 + (current % 26)) + result;
    current = Math.floor(current / 26);
  }

  return result;
};

const getFunctionalFailureSequenceCode = (siblings = []) => {
  const alphabetValues = siblings
    .map((entry) => getAlphabeticSequenceValue(entry?.code))
    .filter((value) => value > 0);
  return getAlphabeticCodeFromValue((alphabetValues.length ? Math.max(...alphabetValues) : 0) + 1);
};

const getTypedStrategyItemSequenceCode = (siblings = [], childType) => {
  const prefix = typedStrategyItemPrefixes[childType] || String(childType || "").trim().toUpperCase();
  const sequenceValues = siblings
    .map((entry) => {
      const match = String(entry?.code || "").trim().toUpperCase().match(new RegExp(`^${prefix}(\\d+)$`));
      return match ? Number.parseInt(match[1], 10) : 0;
    })
    .filter((value) => Number.isFinite(value) && value > 0);
  return `${prefix}${(sequenceValues.length ? Math.max(...sequenceValues) : 0) + 1}`;
};

const getNextAutoGeneratedCode = (parentNode, childType) => {
  const siblings = (parentNode?.children || []).filter((child) => child.type === childType);
  switch (childType) {
    case "function":
    case "cause":
      return getFunctionSequenceCode(siblings);
    case "functionalFailure":
      return getFunctionalFailureSequenceCode(siblings);
    case "cm":
      return getCmSequenceCode(siblings);
    case "pm":
      return getPmSequenceCode(siblings);
    case "ins":
      return getInsSequenceCode(siblings);
    case "effect":
      return getTypedStrategyItemSequenceCode(siblings, childType);
    default:
      return "";
  }
};

const getDefaultCmDraftName = (parentId) => {
  const parentInfo = findNodeInfo(state.hierarchy, parentId);
  return parentInfo ? getNextAutoGeneratedCode(parentInfo.node, "cm") : "";
};
const getDefaultPmDraftName = (parentId) => {
  const parentInfo = findNodeInfo(state.hierarchy, parentId);
  return parentInfo ? getNextAutoGeneratedCode(parentInfo.node, "pm") : "";
};
const getDefaultInsDraftName = (parentId) => {
  const parentInfo = findNodeInfo(state.hierarchy, parentId);
  return parentInfo ? getNextAutoGeneratedCode(parentInfo.node, "ins") : "";
};

const isCmNameAvailableForParent = (parentId, value) => {
  const normalizedCode = normalizeCmCodeInput(value);
  if (!normalizedCode) {
    return false;
  }

  const parentInfo = findNodeInfo(state.hierarchy, parentId);
  if (!parentInfo) {
    return false;
  }

  return !getNormalizedCmSiblingCodes((parentInfo.node.children || []).filter((child) => child.type === "cm")).has(normalizedCode);
};

const isCmDraftNameValid = (draft) => {
  if (!draft?.parentId) {
    return false;
  }

  const normalizedCode = normalizeCmCodeInput(draft?.cmName || "");
  if (!normalizedCode) {
    return false;
  }

  const parentInfo = findNodeInfo(state.hierarchy, draft.parentId);
  if (!parentInfo) {
    return false;
  }

  const siblings = (parentInfo.node.children || []).filter((child) => child.type === "cm" && child.id !== draft.editNodeId);
  return !getNormalizedCmSiblingCodes(siblings).has(normalizedCode);
};
const isPmNameAvailableForParent = (parentId, value) => {
  const normalizedCode = normalizePmCodeInput(value);
  if (!normalizedCode) {
    return false;
  }

  const parentInfo = findNodeInfo(state.hierarchy, parentId);
  if (!parentInfo) {
    return false;
  }

  return !getNormalizedPmSiblingCodes((parentInfo.node.children || []).filter((child) => child.type === "pm")).has(normalizedCode);
};
const isPmDraftNameValid = (draft) => {
  if (!draft?.parentId) {
    return false;
  }

  const normalizedCode = normalizePmCodeInput(draft?.cmName || "");
  if (!normalizedCode) {
    return false;
  }

  const parentInfo = findNodeInfo(state.hierarchy, draft.parentId);
  if (!parentInfo) {
    return false;
  }

  const siblings = (parentInfo.node.children || []).filter((child) => child.type === "pm" && child.id !== draft.editNodeId);
  return !getNormalizedPmSiblingCodes(siblings).has(normalizedCode);
};
const isInsNameAvailableForParent = (parentId, value) => {
  const normalizedCode = normalizeInsCodeInput(value);
  if (!normalizedCode) {
    return false;
  }

  const parentInfo = findNodeInfo(state.hierarchy, parentId);
  if (!parentInfo) {
    return false;
  }

  return !getNormalizedInsSiblingCodes((parentInfo.node.children || []).filter((child) => child.type === "ins")).has(normalizedCode);
};
const isInsDraftNameValid = (draft) => {
  if (!draft?.parentId) {
    return false;
  }

  const normalizedCode = normalizeInsCodeInput(draft?.insName || "");
  if (!normalizedCode) {
    return false;
  }

  const parentInfo = findNodeInfo(state.hierarchy, draft.parentId);
  if (!parentInfo) {
    return false;
  }

  const siblings = (parentInfo.node.children || []).filter((child) => child.type === "ins" && child.id !== draft.editNodeId);
  return !getNormalizedInsSiblingCodes(siblings).has(normalizedCode);
};

const getGeneratedChildDefinition = (nodeInfo, childType) => {
  const parentFullCode = getNodeFullCode(nodeInfo.node, nodeInfo.path);
  const localCode = getNextAutoGeneratedCode(nodeInfo.node, childType);
  return {
    localCode,
    fullCode: joinInheritedCode(parentFullCode, localCode, childType),
  };
};

const isEntryReady = () => {
  const entry = state.entry;
  const subsystemsComplete = entry.subsystems.every((item) => hasNodeValue(item));

  return (
    hasNodeValue(entry.plantUnit) &&
    isNodeCompleteOrBlank(entry.sectionSystem) &&
    subsystemsComplete &&
    isNodeCompleteOrBlank(entry.equipmentUnit) &&
    (!entry.hasSubunit || hasNodeValue(entry.subunit))
  );
};

const showNotice = (message) => {
  if (workflowNotice) {
    workflowNotice.hidden = false;
    workflowNotice.textContent = message;
  }
};

const hideNotice = () => {
  if (workflowNotice) {
    workflowNotice.hidden = true;
    workflowNotice.textContent = "";
  }
};

const persistDraft = (message = "") => {
  refreshDerivedFailureModeJson();
  state = {
    ...state,
    savedAt: new Date().toISOString(),
  };

  saveWorkspaceToLocalStorage(state);
  queueWorkspaceSave(state);
  if (message) {
    showNotice(message);
  } else {
    hideNotice();
  }
};

const persistDraftSilently = () => {
  refreshDerivedFailureModeJson();
  state = {
    ...state,
    savedAt: new Date().toISOString(),
  };

  saveWorkspaceToLocalStorage(state);
  queueWorkspaceSave(state);
};

const buildInitialHierarchyFromEntry = () => {
  const entry = state.entry;
  const plantCode = entry.plantUnit.code.trim();
  const root = createNode("plant", plantCode, plantCode, entry.plantUnit.name.trim());
  let current = root;
  let deepestId = root.id;

  if (hasNodeValue(entry.sectionSystem)) {
    const sectionCode = entry.sectionSystem.code.trim();
    const sectionNode = createNode(
      "section",
      sectionCode,
      joinInheritedCode(current.name, sectionCode, "section"),
      entry.sectionSystem.name.trim()
    );
    current.children.push(sectionNode);
    current = sectionNode;
    deepestId = sectionNode.id;
  }

  entry.subsystems.forEach((subsystem) => {
    if (!hasNodeValue(subsystem)) {
      return;
    }

    const subsystemCode = subsystem.code.trim();
    const subsystemNode = createNode(
      "subsystem",
      subsystemCode,
      joinInheritedCode(current.name, subsystemCode, "subsystem"),
      subsystem.name.trim()
    );
    current.children.push(subsystemNode);
    current = subsystemNode;
    deepestId = subsystemNode.id;
  });

  if (hasNodeValue(entry.equipmentUnit)) {
    const equipmentCode = entry.equipmentUnit.code.trim();
    const equipmentNode = createNode(
      "equipment",
      equipmentCode,
      joinInheritedCode(current.name, equipmentCode, "equipment"),
      entry.equipmentUnit.name.trim(),
      entry.equipmentUnit.equipmentContext
    );
    current.children.push(equipmentNode);
    current = equipmentNode;
    deepestId = equipmentNode.id;
  }

  if (entry.hasSubunit && hasNodeValue(entry.subunit)) {
    const subunitCode = entry.subunit.code.trim();
    const subunitNode = createNode(
      "subunit",
      subunitCode,
      joinInheritedCode(current.name, subunitCode, "subunit"),
      entry.subunit.name.trim()
    );
    current.children.push(subunitNode);
    deepestId = subunitNode.id;
  }

  return {
    hierarchy: [root],
    selectedNodeId: deepestId,
  };
};

const createSeedChildNode = (parentNode, type, code, description, extra = {}) => {
  const name = shortCodeHierarchyTypes.has(type) ? code : joinInheritedCode(parentNode.name, code, type);
  const node = createNode(
    type,
    code,
    name,
    description,
    extra.equipmentContext || null,
    extra.failureConfig || null,
    extra.cmConfig || null,
    extra.pmConfig || null,
    extra.insConfig || null
  );
  parentNode.children.push(node);
  return node;
};

const createSeedMaintenanceTaskConfig = ({
  intervalHours,
  durationHours,
  offset = "0",
  rampTimeHours = "",
  operationNumber = "",
  isEnabled = true,
  isFixed = false,
  isSecondaryAction = false,
  externalOperationCost = "",
  maintenanceType = "",
  type = "",
  labourDurationHours = "",
  resources = [],
  sparePartsRequired = [],
  toolsRequired = [],
}) => ({
  intervalHours: String(intervalHours || ""),
  durationHours: String(durationHours || ""),
  intervalShortDescription: deriveCmIntervalShortDescription(intervalHours),
  offset: String(offset),
  rampTimeHours: String(rampTimeHours || ""),
  operationNumber: String(operationNumber || ""),
  isEnabled: Boolean(isEnabled),
  isFixed: Boolean(isFixed),
  isSecondaryAction: Boolean(isSecondaryAction),
  externalOperationCost: String(externalOperationCost || ""),
  maintenanceType: String(maintenanceType || ""),
  type: String(type || ""),
  labourDurationHours: String(labourDurationHours || ""),
  resources: resources.map((resource) => createCmResourceAssignment(resource.resourceType, resource.durationHours)),
  sparePartsRequired: sparePartsRequired.map((part) => createCmSparePartAssignment(part)),
  toolsRequired: toolsRequired.map((tool) => createCmToolAssignment(tool)),
});

const createSeedInsConfig = ({
  inspectionType,
  scheduledTaskType,
  isEnabled = true,
  doNotDeliver = false,
  interval,
  pfInterval = "",
  detectionProbability = "",
  duration,
  laborLabor = "",
  resources = [],
  toolsRequired = [],
}) => ({
  inspectionType,
  scheduledTaskType,
  isEnabled,
  doNotDeliver,
  interval: String(interval || ""),
  intervalShortDescription: deriveCmIntervalShortDescription(interval),
  pfInterval: String(pfInterval || ""),
  detectionProbability: String(detectionProbability || ""),
  duration: String(duration || ""),
  laborLabor: String(laborLabor || ""),
  resources: resources.map((resource) => createInsResourceAssignment(resource.resourceType, resource.durationHours)),
  toolsRequired: toolsRequired.map((tool) => createInsToolAssignment(tool)),
});

const seedEffectPairs = [
  ["C1", "F1"],
  ["S1", "E1"],
  ["C2", "S2"],
  ["F2", "E2"],
  ["C3", "F3"],
];

const createMfaCrushSeedWorkspace = () => {
  const root = createNode("plant", "MFA", "MFA", "Mfamosing");
  const section = createSeedChildNode(root, "section", "CRUSH", "Crushing");
  const equipmentTemplates = [
    {
      code: "CV01",
      description: "Primary feed conveyor",
      equipmentContext: {
        equipmentFunction: "Convey ore from ROM hopper to crusher",
        equipmentType: "Conveyor",
        effectPerHourDown: "20K AUD/hr down",
        demandFrequency: "Continuous",
        redundancyMode: "None",
        redundancyPercent: "",
        maeCategory: "No",
        operatingContext: "Dusty transfer point with intermittent rocks and fines carryback.",
        criticality: "High",
      },
      functionDescription: "Convey ore from ROM hopper to jaw crusher",
      failureDescription: "Unable to convey ore from ROM hopper to jaw crusher",
      failureModes: [
        { componentName: "Conveyor motor", description: "Conveyor motor failed due to overheating" },
        { componentName: "Head pulley lagging", description: "Pulley lagging worn causing belt slip" },
        { componentName: "Take-up", description: "Take-up seized and belt tension lost" },
        { componentName: "Belt scraper", description: "Carryback caused material build-up on return idlers" },
        { componentName: "Speed switch", description: "Speed switch failed to detect low belt speed" },
      ],
    },
    {
      code: "FE01",
      description: "ROM belt feeder",
      equipmentContext: {
        equipmentFunction: "Meter ore feed from hopper to the primary conveyor",
        equipmentType: "Belt Feeder",
        effectPerHourDown: "15K AUD/hr down",
        demandFrequency: "Intermittent",
        redundancyMode: "None",
        redundancyPercent: "",
        maeCategory: "No",
        operatingContext: "Variable load from coarse ore surge hopper with dust ingress.",
        criticality: "High",
      },
      functionDescription: "Meter ore from hopper onto primary conveyor",
      failureDescription: "Unable to meter ore from hopper onto primary conveyor",
      failureModes: [
        { componentName: "Feeder gearbox", description: "Gearbox oil loss caused feeder seizure" },
        { componentName: "Skirt liner", description: "Skirt liner wear caused spillage at feeder discharge" },
        { componentName: "VSD", description: "VSD trip prevented feeder speed control" },
        { componentName: "Tail pulley", description: "Tail pulley bearings failed under high load" },
        { componentName: "Belt", description: "Feeder belt mistracked and damaged the edge" },
      ],
    },
    {
      code: "CR01",
      description: "Primary jaw crusher",
      equipmentContext: {
        equipmentFunction: "Reduce ROM ore size to downstream screening specification",
        equipmentType: "Jaw Crusher",
        effectPerHourDown: "35K AUD/hr down",
        demandFrequency: "Continuous",
        redundancyMode: "None",
        redundancyPercent: "",
        maeCategory: "No",
        operatingContext: "High-load crushing duty with shock loading and abrasive ore.",
        criticality: "High",
      },
      functionDescription: "Crush ROM ore to downstream product size",
      failureDescription: "Unable to reduce ore size to downstream product size",
      failureModes: [
        { componentName: "Swing jaw", description: "Jaw plates worn beyond effective crushing profile" },
        { componentName: "Hydraulic relief", description: "Hydraulic relief system failed during tramp event" },
        { componentName: "Main bearings", description: "Main bearing temperature rose above safe limit" },
        { componentName: "Drive motor", description: "Crusher drive motor protection tripped under load" },
        { componentName: "Toggle plate", description: "Toggle plate fractured during uncrushable event" },
      ],
    },
    {
      code: "SC01",
      description: "Sizing screen",
      equipmentContext: {
        equipmentFunction: "Separate crushed ore into compliant and oversize streams",
        equipmentType: "Vibrating Screen",
        effectPerHourDown: "18K AUD/hr down",
        demandFrequency: "Continuous",
        redundancyMode: "Custom",
        redundancyPercent: "50",
        maeCategory: "No",
        operatingContext: "High vibration duty with wet fines blinding risk.",
        criticality: "Medium",
      },
      functionDescription: "Screen crushed ore into product and recirculating streams",
      failureDescription: "Unable to separate crushed ore into intended size fractions",
      failureModes: [
        { componentName: "Exciter", description: "Exciter bearing wear reduced screen vibration amplitude" },
        { componentName: "Screen media", description: "Screen panels blinded and restricted throughput" },
        { componentName: "Springs", description: "Isolation springs collapsed and caused poor motion" },
        { componentName: "Motor coupling", description: "Motor coupling failed and stopped exciters" },
        { componentName: "Support frame", description: "Frame cracking reduced structural integrity" },
      ],
    },
    {
      code: "PU01",
      description: "Crusher lubrication pump",
      equipmentContext: {
        equipmentFunction: "Supply pressurised lubrication oil to the primary crusher",
        equipmentType: "Pump",
        effectPerHourDown: "12K AUD/hr down",
        demandFrequency: "Continuous",
        redundancyMode: "Standby",
        redundancyPercent: "",
        maeCategory: "No",
        operatingContext: "Warm oily environment with contamination risk in lube circuit.",
        criticality: "High",
      },
      functionDescription: "Deliver lubrication oil to crusher bearings and moving parts",
      failureDescription: "Unable to supply lubrication oil at required pressure",
      failureModes: [
        { componentName: "Pump motor", description: "Pump motor starter fault prevented duty pump start" },
        { componentName: "Mechanical seal", description: "Seal failure caused oil leakage and low header pressure" },
        { componentName: "Suction strainer", description: "Blocked suction strainer starved pump of oil" },
        { componentName: "Pressure switch", description: "Pressure switch drifted and gave false low-pressure trip" },
        { componentName: "Standby auto-changeover", description: "Duty-standby changeover failed during low-pressure event" },
      ],
    },
  ];

  equipmentTemplates.forEach((template, equipmentIndex) => {
    const equipment = createSeedChildNode(section, "equipment", template.code, template.description, {
      equipmentContext: template.equipmentContext,
    });
    const fnNode = createSeedChildNode(equipment, "function", "1", template.functionDescription);
    const ffNode = createSeedChildNode(fnNode, "functionalFailure", "A", template.failureDescription);

    template.failureModes.forEach((failureMode, failureIndex) => {
      const causeCode = String(failureIndex + 1);
      const causeNode = createSeedChildNode(ffNode, "cause", causeCode, failureMode.description, {
        failureConfig: {
          componentName: failureMode.componentName,
          distribution: failureIndex % 2 === 0 ? "Age related" : "Random (non age related)",
          mttf: String(12000 + equipmentIndex * 1800 + failureIndex * 950),
          demandFrequency: equipment.type === "equipment" ? template.equipmentContext.demandFrequency : "",
          isDormant: false,
          eta1: String(9000 + failureIndex * 500),
          beta1: failureIndex % 2 === 0 ? "2.1" : "1.6",
          gamma1: "0",
          alarmIsEnabled: failureIndex % 2 === 0,
          alarmDescription: failureIndex % 2 === 0 ? `${failureMode.componentName} alarm` : "",
          alarmPfInterval: failureIndex % 2 === 0 ? "720" : "",
          alarmDetectionProbability: failureIndex % 2 === 0 ? "85" : "",
        },
      });

      const [effectA, effectB] = seedEffectPairs[(equipmentIndex + failureIndex) % seedEffectPairs.length];
      [effectA, effectB].forEach((effectCode) => {
        const option = getEffectCatalogOption(effectCode);
        if (option) {
          createSeedChildNode(causeNode, "effect", option.code, option.description);
        }
      });

      createSeedChildNode(causeNode, "cm", "CM#01", `Replace ${failureMode.componentName.toLowerCase()}`, {
        cmConfig: createSeedMaintenanceTaskConfig({
          intervalHours: "",
          durationHours: "6",
          offset: "0",
          rampTimeHours: "2",
          operationNumber: "1010",
          isEnabled: true,
          type: "Corrective maintenance",
          labourDurationHours: "3",
          resources: [{ resourceType: "MECH TECH", durationHours: "3" }],
          sparePartsRequired: ["Motor", "Bearing"],
          toolsRequired: ["Spanner set", "Torque wrench"],
        }),
      });

      createSeedChildNode(causeNode, "pm", "PM#01", `Replace ${failureMode.componentName.toLowerCase()} at set interval`, {
        pmConfig: createSeedMaintenanceTaskConfig({
          intervalHours: String(4320 + failureIndex * 720),
          durationHours: "4",
          offset: "0",
          rampTimeHours: "1",
          operationNumber: "1110",
          isEnabled: true,
          isFixed: true,
          isSecondaryAction: false,
          externalOperationCost: "200",
          maintenanceType: "Routine replacement",
          type: "Preventive maintenance",
          labourDurationHours: "2",
          resources: [{ resourceType: "MECH TECH", durationHours: "2" }],
          sparePartsRequired: ["Seal kit"],
          toolsRequired: ["Spanner set"],
        }),
      });

      createSeedChildNode(causeNode, "ins", "INS#01", `Inspect ${failureMode.componentName.toLowerCase()} condition`, {
        insConfig: createSeedInsConfig({
          inspectionType: "Routine",
          scheduledTaskType: "Routine inspection",
          isEnabled: true,
          doNotDeliver: false,
          interval: "720",
          pfInterval: "168",
          detectionProbability: "70",
          duration: "1",
          laborLabor: "1",
          resources: [{ resourceType: "MECH TECH", durationHours: "1" }],
          toolsRequired: ["Spanner set"],
        }),
      });

      createSeedChildNode(causeNode, "ins", "INS#02", `Monitor ${failureMode.componentName.toLowerCase()} performance trend`, {
        insConfig: createSeedInsConfig({
          inspectionType: "Condition monitoring",
          scheduledTaskType: "Condition monitoring",
          isEnabled: true,
          doNotDeliver: false,
          interval: "336",
          pfInterval: "168",
          detectionProbability: "82",
          duration: "1.5",
          laborLabor: "1.5",
          resources: [{ resourceType: "AUTOMA.", durationHours: "1.5" }],
          toolsRequired: ["Multimeter"],
        }),
      });
    });
  });

  const hierarchy = [root];
  refreshFailureModeDbJsonForHierarchy(hierarchy);
  return {
    ...defaultState(),
    hierarchy,
    selectedNodeId: root.id,
    modalVisible: false,
  };
};

const getSelectedNodeInfo = () => {
  if (!state.selectedNodeId) {
    return null;
  }
  return findNodeInfo(state.hierarchy, state.selectedNodeId);
};

const getNodeLabel = (node) => nodeTypeMeta[node.type]?.label || "Asset node";
const getNodeTitle = (node) =>
  getNodeDescription(node, getNodeNameValue(node, nodeTypeMeta[node.type]?.placeholder || "Untitled node"));
const isMaintainableTarget = (node) => node.type === "equipment" || node.type === "subunit";
const getDefaultGeneratedCode = (nodeType) => {
  switch (nodeType) {
    case "section":
      return "SYS";
    case "subsystem":
      return "SS";
    case "equipment":
      return "EQ";
    case "subunit":
      return "SU";
    case "function":
      return "1";
    case "functionalFailure":
      return "A";
    case "cause":
      return "1";
    case "effect":
      return "EFF1";
    case "cm":
      return "CM#01";
    case "ins":
      return "INS#01";
    case "pm":
      return "PM#01";
    default:
      return "NODE";
  }
};
const collectNodeAndDescendantIds = (node, ids = new Set()) => {
  if (!node) {
    return ids;
  }

  ids.add(node.id);
  (node.children || []).forEach((child) => {
    collectNodeAndDescendantIds(child, ids);
  });
  return ids;
};
const getStrategyItemsForNodeInfo = (nodeInfo) => {
  if (!nodeInfo) {
    return [];
  }

  const allowedIds = collectNodeAndDescendantIds(nodeInfo.node);
  return state.maintainableItems
    .filter((item) => allowedIds.has(item.nodeId))
    .map((item) => ({
      item,
      nodeInfo: findNodeInfo(state.hierarchy, item.nodeId),
    }));
};
const sanitizeCodeSegment = (value, nodeType, siblings = []) => {
  const rawValue = String(value || "").trim().toUpperCase();
  let baseCode = rawValue
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!baseCode) {
    baseCode = getDefaultGeneratedCode(nodeType);
  }

  const siblingCodes = new Set(
    siblings
      .map((entry) => String(entry?.code || "").trim().toUpperCase())
      .filter(Boolean)
  );
  if (!siblingCodes.has(baseCode)) {
    return baseCode;
  }

  let suffix = 2;
  while (siblingCodes.has(`${baseCode}-${suffix}`)) {
    suffix += 1;
  }
  return `${baseCode}-${suffix}`;
};
const getChildActionLabel = (childType) => {
  switch (childType) {
    case "subsystem":
      return "Add Sub-system";
    case "equipment":
      return "Add Equipment Unit";
    case "subunit":
      return "Add Subunit";
    case "function":
      return "Add Function";
    case "functionalFailure":
      return "Add Functional Failure";
    case "cause":
      return "Add Failure Mode";
    case "effect":
      return "Add Effect";
    case "cm":
      return "Add CM";
    case "ins":
      return "Add INS";
    case "pm":
      return "Add PM";
    case "section":
      return "Add Section / System";
    default:
      return `Add ${getNodeLabel({ type: childType })}`;
  }
};
const getEffectCatalogOption = (code) =>
  effectCatalog.find((option) => option.code === String(code || "").trim().toUpperCase()) || null;
const getEffectCatalogLabel = (option) => `${option.code}, ${option.description}`;
const getUsedEffectCodesForParent = (parentNode) =>
  new Set(
    (parentNode?.children || [])
      .filter((child) => child.type === "effect")
      .map((child) => String(child.code || child.name || "").trim().toUpperCase())
      .filter(Boolean)
  );
const deriveCmIntervalShortDescription = (hoursValue) => {
  const hours = Number.parseFloat(String(hoursValue || "").trim());
  if (!Number.isFinite(hours) || hours <= 0) {
    return "";
  }

  if (hours < 168) {
    return `${Math.ceil(hours / 24)}D`;
  }

  if (hours < 720) {
    return `${Math.ceil(hours / 168)}W`;
  }

  if (hours < 8760) {
    return `${Math.ceil(hours / 720)}M`;
  }

  return `${Math.ceil(hours / 8760)}Y`;
};
const getCmSequenceCode = (siblings = []) => {
  const sequenceValues = siblings
    .map((entry) => {
      const match = String(entry?.code || "")
        .trim()
        .toUpperCase()
        .match(/^CM#?(\d+)$/);
      return match ? Number.parseInt(match[1], 10) : 0;
    })
    .filter((value) => Number.isFinite(value) && value > 0);
  const nextValue = (sequenceValues.length ? Math.max(...sequenceValues) : 0) + 1;
  return `CM#${String(nextValue).padStart(2, "0")}`;
};
const getPmSequenceCode = (siblings = []) => {
  const sequenceValues = siblings
    .map((entry) => {
      const match = String(entry?.code || "")
        .trim()
        .toUpperCase()
        .match(/^PM#?(\d+)$/);
      return match ? Number.parseInt(match[1], 10) : 0;
    })
    .filter((value) => Number.isFinite(value) && value > 0);
  const nextValue = (sequenceValues.length ? Math.max(...sequenceValues) : 0) + 1;
  return `PM#${String(nextValue).padStart(2, "0")}`;
};
const getInsSequenceCode = (siblings = []) => {
  const sequenceValues = siblings
    .map((entry) => {
      const match = String(entry?.code || "")
        .trim()
        .toUpperCase()
        .match(/^INS#?(\d+)$/);
      return match ? Number.parseInt(match[1], 10) : 0;
    })
    .filter((value) => Number.isFinite(value) && value > 0);
  const nextValue = (sequenceValues.length ? Math.max(...sequenceValues) : 0) + 1;
  return `INS#${String(nextValue).padStart(2, "0")}`;
};
const normalizeCmCodeInput = (value) => {
  const match = String(value || "")
    .trim()
    .toUpperCase()
    .match(/^CM#?(\d+)$/);
  if (!match) {
    return "";
  }

  return `CM#${String(Number.parseInt(match[1], 10)).padStart(2, "0")}`;
};
const getNormalizedCmSiblingCodes = (siblings = []) =>
  new Set(siblings.map((entry) => normalizeCmCodeInput(entry?.code || entry?.name || "")).filter(Boolean));
const normalizePmCodeInput = (value) => {
  const match = String(value || "")
    .trim()
    .toUpperCase()
    .match(/^PM#?(\d+)$/);
  if (!match) {
    return "";
  }

  return `PM#${String(Number.parseInt(match[1], 10)).padStart(2, "0")}`;
};
const getNormalizedPmSiblingCodes = (siblings = []) =>
  new Set(siblings.map((entry) => normalizePmCodeInput(entry?.code || entry?.name || "")).filter(Boolean));
const normalizeInsCodeInput = (value) => {
  const match = String(value || "")
    .trim()
    .toUpperCase()
    .match(/^INS#?(\d+)$/);
  if (!match) {
    return "";
  }

  return `INS#${String(Number.parseInt(match[1], 10)).padStart(2, "0")}`;
};
const getNormalizedInsSiblingCodes = (siblings = []) =>
  new Set(siblings.map((entry) => normalizeInsCodeInput(entry?.code || entry?.name || "")).filter(Boolean));
const areCmResourcesValid = (resources = []) =>
  Array.isArray(resources) &&
  resources.every(
    (resource) => resource && String(resource.resourceType || "").trim() && String(resource.durationHours || "").trim()
  );
const areCmSimpleAssignmentsValid = (items = [], fieldName) =>
  Array.isArray(items) && items.every((item) => item && String(item[fieldName] || "").trim());
const isCmCoreDraftReady = (draft) =>
  Boolean(
    isCmDraftNameValid(draft) &&
      String(draft?.description || "").trim() &&
      String(draft?.cmIntervalHours || "").trim() &&
      String(draft?.cmDurationHours || "").trim()
  );
const isPmCoreDraftReady = (draft) =>
  Boolean(
    isPmDraftNameValid(draft) &&
      String(draft?.description || "").trim() &&
      String(draft?.cmIntervalHours || "").trim() &&
      String(draft?.cmDurationHours || "").trim()
  );
const isInsDraftReady = (draft) =>
  Boolean(
    isInsDraftNameValid(draft) &&
      String(draft?.description || "").trim() &&
      String(draft?.insScheduledTaskType || "").trim() &&
      String(draft?.insInterval || "").trim() &&
      String(draft?.insDuration || "").trim() &&
      areCmResourcesValid(draft?.insResources) &&
      areCmSimpleAssignmentsValid(draft?.insToolsRequired, "tool")
  );
const buildCmConfigFromDraft = (draft) => ({
  intervalHours: String(draft?.cmIntervalHours || "").trim(),
  durationHours: String(draft?.cmDurationHours || "").trim(),
  intervalShortDescription: deriveCmIntervalShortDescription(draft?.cmIntervalHours),
  offset: String(draft?.cmOffset || "0").trim() || "0",
  rampTimeHours: String(draft?.cmRampTimeHours || "").trim(),
  operationNumber: String(draft?.cmOperationNumber || "").trim(),
  isEnabled: Boolean(draft?.cmIsEnabled),
  doNotDeliver: Boolean(draft?.cmDoNotDeliver),
  isFixed: Boolean(draft?.cmIsFixed),
  isSecondaryAction: Boolean(draft?.cmIsSecondaryAction),
  externalOperationCost: String(draft?.cmExternalOperationCost || "").trim(),
  maintenanceType: String(draft?.cmMaintenanceType || "").trim(),
  type: String(draft?.cmTaskType || "").trim(),
  pfInterval: String(draft?.cmPfInterval || "").trim(),
  detectionProbability: String(draft?.cmDetectionProbability || "").trim(),
  labourDurationHours: String(draft?.cmLabourDurationHours || "").trim(),
  resources: Array.isArray(draft?.cmResources)
    ? draft.cmResources
        .filter((resource) => String(resource?.resourceType || "").trim() || String(resource?.durationHours || "").trim())
        .map((resource) => ({
          id: typeof resource?.id === "string" && resource.id ? resource.id : createId("cm-resource"),
          resourceType: String(resource?.resourceType || "").trim(),
          durationHours: String(resource?.durationHours || "").trim(),
        }))
    : [],
  sparePartsRequired: Array.isArray(draft?.cmSparePartsRequired)
    ? draft.cmSparePartsRequired
        .filter((part) => String(part?.part || "").trim())
        .map((part) => ({
          id: typeof part?.id === "string" && part.id ? part.id : createId("cm-spare-part"),
          part: String(part?.part || "").trim(),
        }))
    : [],
  toolsRequired: Array.isArray(draft?.cmToolsRequired)
    ? draft.cmToolsRequired
        .filter((tool) => String(tool?.tool || "").trim())
        .map((tool) => ({
          id: typeof tool?.id === "string" && tool.id ? tool.id : createId("cm-tool"),
          tool: String(tool?.tool || "").trim(),
        }))
    : [],
});
const buildPmConfigFromDraft = (draft) => ({
  ...buildCmConfigFromDraft(draft),
});
const buildInsConfigFromDraft = (draft) => ({
  inspectionType: String(draft?.insInspectionType || "Routine") || "Routine",
  scheduledTaskType: String(draft?.insScheduledTaskType || "").trim(),
  isEnabled: Boolean(draft?.insIsEnabled),
  doNotDeliver: Boolean(draft?.insDoNotDeliver),
  interval: String(draft?.insInterval || "").trim(),
  intervalShortDescription: deriveCmIntervalShortDescription(draft?.insInterval),
  pfInterval: String(draft?.insPfInterval || "").trim(),
  detectionProbability: String(draft?.insDetectionProbability || "").trim(),
  duration: String(draft?.insDuration || "").trim(),
  laborLabor: String(draft?.insLaborLabor || "").trim(),
  resources: Array.isArray(draft?.insResources)
    ? draft.insResources
        .filter((resource) => String(resource?.resourceType || "").trim() || String(resource?.durationHours || "").trim())
        .map((resource) => ({
          id: typeof resource?.id === "string" && resource.id ? resource.id : createId("ins-resource"),
          resourceType: String(resource?.resourceType || "").trim(),
          durationHours: String(resource?.durationHours || "").trim(),
        }))
    : [],
  toolsRequired: Array.isArray(draft?.insToolsRequired)
    ? draft.insToolsRequired
        .filter((tool) => String(tool?.tool || "").trim())
        .map((tool) => ({
          id: typeof tool?.id === "string" && tool.id ? tool.id : createId("ins-tool"),
          tool: String(tool?.tool || "").trim(),
        }))
    : [],
});
const isChildDraftReady = () => {
  if (childDraftState.childType === "cm") {
    return childDraftState.cmStep === "core"
      ? isCmCoreDraftReady(childDraftState)
      : isCmCoreDraftReady(childDraftState) &&
          areCmResourcesValid(childDraftState.cmResources) &&
          areCmSimpleAssignmentsValid(childDraftState.cmSparePartsRequired, "part") &&
          areCmSimpleAssignmentsValid(childDraftState.cmToolsRequired, "tool");
  }

  if (childDraftState.childType === "pm") {
    return childDraftState.cmStep === "core"
      ? isPmCoreDraftReady(childDraftState)
      : isPmCoreDraftReady(childDraftState) &&
          areCmResourcesValid(childDraftState.cmResources) &&
          areCmSimpleAssignmentsValid(childDraftState.cmSparePartsRequired, "part") &&
          areCmSimpleAssignmentsValid(childDraftState.cmToolsRequired, "tool");
  }

  if (childDraftState.childType === "ins") {
    return isInsDraftReady(childDraftState);
  }

  if (childDraftState.childType === "cause") {
    return isCauseConfigDraftReady(childDraftState);
  }

  if (!childDraftState.description.trim()) {
    return false;
  }

  if (childDraftState.childType === "effect") {
    const effectOption = getEffectCatalogOption(childDraftState.codeSegment);
    if (!effectOption) {
      return false;
    }

    const parentInfo = childDraftState.parentId ? findNodeInfo(state.hierarchy, childDraftState.parentId) : null;
    return parentInfo ? !getUsedEffectCodesForParent(parentInfo.node).has(effectOption.code) : true;
  }

  if (autoGeneratedChildTypes.has(childDraftState.childType)) {
    return true;
  }

  if (!childDraftState.codeSegment.trim()) {
    return false;
  }

  if (childDraftState.childType === "equipment" && childDraftState.redundancyMode === "Custom") {
    return Boolean(String(childDraftState.redundancyPercent).trim());
  }

  return true;
};

const getChildDescriptionLabel = (childType) => {
  switch (childType) {
    case "function":
      return "Function description";
    case "functionalFailure":
      return "Functional failure description";
    case "cause":
      return "Failure Mode Description";
    case "effect":
      return "Effect description";
    case "cm":
      return "CM description";
    case "ins":
      return "INS description";
    case "pm":
      return "PM description";
    default:
      return "Description";
  }
};

const createCauseConfigDraftFromFailureConfig = (description = "", failureConfig = null) => {
  const config = normalizeCauseFailureConfig(failureConfig);
  return {
    description: String(description || ""),
    componentName: String(config.componentName || ""),
    distribution: String(config.distribution || "Age related") || "Age related",
    weibullSet: String(config.weibullSet || ""),
    mttf: String(config.mttf || ""),
    standardDeviation: String(config.standardDeviation || ""),
    causeDemandFrequency: String(config.demandFrequency || ""),
    standbyFailurePercent: String(config.standbyFailurePercent || ""),
    standbyAgeingPercent: String(config.standbyAgeingPercent || ""),
    isDormant: Boolean(config.isDormant),
    eta1: String(config.eta1 || ""),
    beta1: String(config.beta1 || ""),
    gamma1: String(config.gamma1 || ""),
    eta2: String(config.eta2 || ""),
    beta2: String(config.beta2 || ""),
    gamma2: String(config.gamma2 || ""),
    eta3: String(config.eta3 || ""),
    beta3: String(config.beta3 || ""),
    gamma3: String(config.gamma3 || ""),
    alarmIsEnabled: Boolean(config.alarmIsEnabled),
    alarmDescription: String(config.alarmDescription || ""),
    alarmPfInterval: String(config.alarmPfInterval || ""),
    alarmDetectionProbability: String(config.alarmDetectionProbability || ""),
  };
};

const isCauseConfigDraftReady = (draft) =>
  Boolean(String(draft?.description || "").trim() && String(draft?.componentName || "").trim());

const buildCauseFailureConfigFromDraft = (draft) => ({
  componentName: String(draft?.componentName || "").trim(),
  distribution: String(draft?.distribution || "Age related") || "Age related",
  weibullSet: String(draft?.weibullSet || "").trim(),
  mttf: String(draft?.mttf || "").trim(),
  standardDeviation: String(draft?.standardDeviation || "").trim(),
  demandFrequency: String(draft?.causeDemandFrequency || "").trim(),
  standbyFailurePercent: String(draft?.standbyFailurePercent || "").trim(),
  standbyAgeingPercent: String(draft?.standbyAgeingPercent || "").trim(),
  isDormant: Boolean(draft?.isDormant),
  eta1: String(draft?.eta1 || "").trim(),
  beta1: String(draft?.beta1 || "").trim(),
  gamma1: String(draft?.gamma1 || "").trim(),
  eta2: String(draft?.eta2 || "").trim(),
  beta2: String(draft?.beta2 || "").trim(),
  gamma2: String(draft?.gamma2 || "").trim(),
  eta3: String(draft?.eta3 || "").trim(),
  beta3: String(draft?.beta3 || "").trim(),
  gamma3: String(draft?.gamma3 || "").trim(),
  alarmIsEnabled: Boolean(draft?.alarmIsEnabled),
  alarmDescription: String(draft?.alarmDescription || "").trim(),
  alarmPfInterval: String(draft?.alarmPfInterval || "").trim(),
  alarmDetectionProbability: String(draft?.alarmDetectionProbability || "").trim(),
  dbJson: draft?.dbJson && typeof draft.dbJson === "object" ? draft.dbJson : null,
});

const isEquipmentInfoDraftReady = () => {
  if (!equipmentInfoState.draft) {
    return false;
  }

  if (!String(equipmentInfoState.draft.codeSegment || "").trim() || !String(equipmentInfoState.draft.description || "").trim()) {
    return false;
  }

  if (equipmentInfoState.draft.redundancyMode === "Custom") {
    return Boolean(String(equipmentInfoState.draft.redundancyPercent || "").trim());
  }

  return true;
};

const getRequiredFieldLabel = (label) =>
  `${label} <em class="field-required" aria-hidden="true">*</em><span class="sr-only">required</span>`;
const getNodeBrowserName = (node) =>
  getNodeNameValue(node, getNodeCodeValue(node, nodeTypeMeta[node.type]?.placeholder || "Untitled node"));
const getNodeDescription = (node, fallback = "") =>
  (typeof node?.description === "string" ? node.description.trim() : "") || fallback;
const getNodeDisplayName = (node) =>
  getNodeDescription(node, getNodeNameValue(node, getNodeCodeValue(node, nodeTypeMeta[node.type]?.placeholder || "Untitled node")));
const getNodeBrowserDescription = (nodePath, node) =>
  getNodeDescription(node) || getFullCodeFromPath(nodePath) || getNodeLabel(node);
const getNodeFullCode = (node, path = []) =>
  getNodeNameValue(node, getFullCodeFromPath(path) || getNodeCodeValue(node, nodeTypeMeta[node.type]?.placeholder || "Untitled node"));
const getParentPath = (path) => (Array.isArray(path) && path.length > 1 ? path.slice(0, -1) : []);
const getParentFullCodeFromPath = (path) => getFullCodeFromPath(getParentPath(path));
const getFailureModeJsonForPath = (path = []) => {
  const failureModeNode = getNearestAncestorNodeFromPath(path, "cause");
  return failureModeNode?.failureConfig?.dbJson && typeof failureModeNode.failureConfig.dbJson === "object"
    ? failureModeNode.failureConfig.dbJson
    : null;
};
const strategyTableColumns = [
  { key: "physicalAssetName", label: "Physical Asset Name" },
  { key: "physicalAssetDescription", label: "Physical Asset Description" },
  { key: "componentName", label: "Component Name" },
  { key: "failureModeName", label: "Failure Mode Name" },
  { key: "failureModeDescription", label: "Failure Mode Description" },
  { key: "failureModeEffectEffect", label: "Failure Mode Effect Effect" },
  { key: "failureModeEffectRedundancyFactor", label: "Failure Mode Effect Redundancy Factor" },
  { key: "failureModeIsDormant", label: "Failure Mode Is Dormant" },
  { key: "failureModeDemandFrequency", label: "Failure Mode Demand Frequency" },
  { key: "failureModeDistribution", label: "Failure Mode Distribution" },
  { key: "failureModeMttf", label: "Failure Mode MTTF" },
  { key: "failureModeEta1", label: "Failure Mode Eta 1" },
  { key: "failureModeBeta1", label: "Failure Mode Beta 1" },
  { key: "failureModeGamma1", label: "Failure Mode Gamma 1" },
  { key: "scheduledTaskType", label: "Scheduled Task Type", editable: true },
  { key: "scheduledTaskIsEnabled", label: "Scheduled Task Is Enabled", editable: true, inputType: "checkbox" },
  { key: "scheduledTaskDoNotDeliver", label: "Scheduled Task Do Not Deliver", editable: true, inputType: "checkbox" },
  { key: "scheduledTaskDescription", label: "Scheduled Task Description", editable: true },
  { key: "scheduledTaskInterval", label: "Scheduled Task Interval", editable: true, inputType: "number" },
  { key: "scheduledTaskIntervalShortDescription", label: "Scheduled Task Interval Short Description" },
  { key: "scheduledTaskPfInterval", label: "Scheduled Task PF Interval", editable: true, inputType: "number" },
  { key: "scheduledTaskDetectionProbability", label: "Scheduled Task Detection Probability", editable: true, inputType: "number" },
  { key: "scheduledTaskDuration", label: "Scheduled Task Duration", editable: true, inputType: "number" },
  { key: "scheduledTaskLaborLabor", label: "Scheduled Task Labor Labor", editable: true, inputType: "number" },
  { key: "failureModeAlarmIsEnabled", label: "Failure Mode Alarm Is Enabled" },
  { key: "failureModeAlarmDescription", label: "Failure Mode Alarm Description" },
  { key: "failureModeAlarmPfInterval", label: "Failure Mode Alarm PF Interval" },
  { key: "failureModeAlarmDetectionProbability", label: "Failure Mode Alarm Detection Probability" },
  { key: "failureModeCostBenefitRatio", label: "Failure Mode Cost Benefit Ratio" },
  { key: "failureModeTotalCost", label: "Failure Mode Total Cost" },
  { key: "failureModeEffectCost", label: "Failure Mode Effect Cost" },
  { key: "failureModeCorrectiveDownTime", label: "Failure Mode Corrective Down Time" },
  { key: "failureModeCorrectiveEventCount", label: "Failure Mode Corrective Event Count" },
  { key: "failureModeCorrectiveCost", label: "Failure Mode Corrective Cost" },
  { key: "failureModePlannedCost", label: "Failure Mode Planned Cost" },
  { key: "failureModeSecondaryActionCost", label: "Failure Mode Secondary Action Cost" },
  { key: "failureModeInspectionCost", label: "Failure Mode Inspection Cost" },
  { key: "failureModeFailureRate", label: "Failure Mode Failure Rate" },
  { key: "failureModeAvailability", label: "Failure Mode Availability" },
];
const defaultVisibleStrategyTableColumnKeys = [
  "physicalAssetName",
  "physicalAssetDescription",
  "componentName",
  "failureModeName",
  "failureModeDescription",
  "failureModeEffectEffect",
  "scheduledTaskType",
  "scheduledTaskDescription",
  "scheduledTaskInterval",
  "scheduledTaskIntervalShortDescription",
  "scheduledTaskDuration",
  "scheduledTaskIsEnabled",
];
const strategyTypeFilterOptions = ["All", "CM", "PM", "INS"];
const strategyTableEditableColumnKeys = new Set(
  strategyTableColumns.filter((column) => column.editable).map((column) => column.key)
);
const allStrategyTableColumnKeys = strategyTableColumns.map((column) => column.key);
const defaultStrategyTableState = () => ({
  searchQuery: "",
  strategyTypeFilter: "All",
  columnOrder: [...allStrategyTableColumnKeys],
  visibleColumnKeys: [...defaultVisibleStrategyTableColumnKeys],
  optionsOpen: false,
  rowMenuTaskNodeId: "",
});
const normalizeStrategyTableState = (value) => {
  const rawOrder = Array.isArray(value?.columnOrder) ? value.columnOrder.filter((key) => allStrategyTableColumnKeys.includes(key)) : [];
  const orderedKeys = [...new Set([...rawOrder, ...allStrategyTableColumnKeys])];
  const rawVisible = Array.isArray(value?.visibleColumnKeys)
    ? value.visibleColumnKeys.filter((key) => allStrategyTableColumnKeys.includes(key))
    : [...defaultVisibleStrategyTableColumnKeys];
  const visibleColumnKeys = rawVisible.length ? [...new Set(rawVisible)] : [...defaultVisibleStrategyTableColumnKeys];

  return {
    searchQuery: typeof value?.searchQuery === "string" ? value.searchQuery : "",
    strategyTypeFilter: strategyTypeFilterOptions.includes(value?.strategyTypeFilter) ? value.strategyTypeFilter : "All",
    columnOrder: orderedKeys,
    visibleColumnKeys,
    optionsOpen: false,
    rowMenuTaskNodeId: "",
  };
};
const createPersistableStrategyTableState = (strategyTable) => {
  const normalized = normalizeStrategyTableState(strategyTable);
  return {
    searchQuery: normalized.searchQuery,
    strategyTypeFilter: normalized.strategyTypeFilter,
    columnOrder: normalized.columnOrder,
    visibleColumnKeys: normalized.visibleColumnKeys,
  };
};
const normalizeStrategyTableStateSafely = (value) => {
  try {
    return normalizeStrategyTableState(value);
  } catch {
    return defaultStrategyTableState();
  }
};
const getEffectJsonEntryForNode = (path = [], node = null) => {
  const failureModeNode = getNearestAncestorNodeFromPath(path, "cause");
  const dbJson = getFailureModeJsonForPath(path);
  if (!failureModeNode || !dbJson || !Array.isArray(dbJson.effects) || !node) {
    return null;
  }

  const effectChildren = (failureModeNode.children || []).filter((child) => child.type === "effect");
  const effectIndex = effectChildren.findIndex((child) => child.id === node.id);
  return effectIndex >= 0 ? dbJson.effects[effectIndex] || null : null;
};
const getTaskJsonEntryForNode = (path = [], node = null) => {
  const failureModeNode = getNearestAncestorNodeFromPath(path, "cause");
  const dbJson = getFailureModeJsonForPath(path);
  if (!failureModeNode || !dbJson || !Array.isArray(dbJson.tasks) || !node) {
    return null;
  }

  const taskChildren = (failureModeNode.children || []).filter((child) => ["cm", "pm", "ins"].includes(child.type));
  const taskIndex = taskChildren.findIndex((child) => child.id === node.id);
  return taskIndex >= 0 ? dbJson.tasks[taskIndex] || null : null;
};
const getStrategyScopeNodeInfo = (nodeInfo) => {
  if (!nodeInfo) {
    return null;
  }

  if (nodeInfo.node.type === "effect") {
    const failureModeNode = getNearestAncestorNodeFromPath(nodeInfo.path, "cause");
    return failureModeNode ? findNodeInfo(state.hierarchy, failureModeNode.id) : nodeInfo;
  }

  return nodeInfo;
};
const collectStrategyTaskNodeInfos = (nodeInfo, rows = []) => {
  if (!nodeInfo) {
    return rows;
  }

  if (["cm", "pm", "ins"].includes(nodeInfo.node.type)) {
    rows.push(nodeInfo);
    return rows;
  }

  (nodeInfo.node.children || []).forEach((child) => {
    collectStrategyTaskNodeInfos(
      {
        node: child,
        parent: nodeInfo.node,
        path: [...nodeInfo.path, child],
      },
      rows
    );
  });
  return rows;
};
const getStrategyTaskNodeInfosForSelection = (nodeInfo) => {
  const scopeInfo = getStrategyScopeNodeInfo(nodeInfo);
  if (!scopeInfo) {
    return [];
  }

  return ["cm", "pm", "ins"].includes(scopeInfo.node.type) ? [scopeInfo] : collectStrategyTaskNodeInfos(scopeInfo);
};
const getCombinedFailureModeEffectSummary = (dbJson) =>
  Array.isArray(dbJson?.effects)
    ? dbJson.effects
        .map((entry) => String(entry?.["Failure Mode Effect Effect"] || "").trim())
        .filter(Boolean)
        .join(" | ")
    : "";
const getFailureModeEffectRedundancySummary = (dbJson) =>
  Array.isArray(dbJson?.effects)
    ? dbJson.effects
        .map((entry) => String(entry?.["Failure Mode Effect Redundancy Factor"] || "").trim())
        .find(Boolean) || ""
    : "";
const buildStrategyTableRow = (taskNodeInfo) => {
  const failureModeNode = getNearestAncestorNodeFromPath(taskNodeInfo.path, "cause");
  const failureModeInfo = failureModeNode ? findNodeInfo(state.hierarchy, failureModeNode.id) : null;
  const dbJson =
    failureModeInfo?.node?.failureConfig?.dbJson && typeof failureModeInfo.node.failureConfig.dbJson === "object"
      ? failureModeInfo.node.failureConfig.dbJson
      : failureModeInfo
        ? buildFailureModeDbJson(failureModeInfo.node, failureModeInfo.path)
        : null;
  const taskJson = getTaskJsonEntryForNode(taskNodeInfo.path, taskNodeInfo.node) || {};

  return {
    rowId: taskNodeInfo.node.id,
    taskNodeId: taskNodeInfo.node.id,
    taskNodeType: taskNodeInfo.node.type,
    taskCode: getNodeCodeValue(taskNodeInfo.node),
    failureModeNodeId: failureModeInfo?.node?.id || "",
    physicalAssetName: String(dbJson?.["Physical Asset Name"] || "").trim(),
    physicalAssetDescription: String(dbJson?.["Physical Asset Description"] || "").trim(),
    componentName: String(dbJson?.["Component Name"] || "").trim(),
    failureModeName: String(dbJson?.["Failure Mode Name"] || "").trim(),
    failureModeDescription: String(dbJson?.["Failure Mode Description"] || "").trim(),
    failureModeEffectEffect: getCombinedFailureModeEffectSummary(dbJson),
    failureModeEffectRedundancyFactor: getFailureModeEffectRedundancySummary(dbJson),
    failureModeIsDormant: Boolean(dbJson?.["Failure Mode Is Dormant"]),
    failureModeDemandFrequency: String(dbJson?.["Failure Mode Demand Frequency"] || "").trim(),
    failureModeDistribution: String(dbJson?.["Failure Mode Distribution"] || "").trim(),
    failureModeMttf: String(dbJson?.["Failure Mode MTTF"] || "").trim(),
    failureModeEta1: String(dbJson?.["Failure Mode Eta 1"] || "").trim(),
    failureModeBeta1: String(dbJson?.["Failure Mode Beta 1"] || "").trim(),
    failureModeGamma1: String(dbJson?.["Failure Mode Gamma 1"] || "").trim(),
    scheduledTaskType: String(taskJson?.["Scheduled Task Type"] || "").trim(),
    scheduledTaskIsEnabled: Boolean(taskJson?.["Scheduled Task Is Enabled"]),
    scheduledTaskDoNotDeliver: Boolean(taskJson?.["Scheduled Task Do Not Deliver"]),
    scheduledTaskDescription: String(taskJson?.["Scheduled Task Description"] || "").trim(),
    scheduledTaskInterval: String(taskJson?.["Scheduled Task Interval"] || "").trim(),
    scheduledTaskIntervalShortDescription: String(taskJson?.["Scheduled Task Interval Short Description"] || "").trim(),
    scheduledTaskPfInterval: String(taskJson?.["Scheduled Task PF Interval"] || "").trim(),
    scheduledTaskDetectionProbability: String(taskJson?.["Scheduled Task Detection Probability"] || "").trim(),
    scheduledTaskDuration: String(taskJson?.["Scheduled Task Duration"] || "").trim(),
    scheduledTaskLaborLabor: String(taskJson?.["Scheduled Task Labor Labor"] || "").trim(),
    failureModeAlarmIsEnabled: Boolean(dbJson?.["Failure Mode Alarm Is Enabled"]),
    failureModeAlarmDescription: String(dbJson?.["Failure Mode Alarm Description"] || "").trim(),
    failureModeAlarmPfInterval: String(dbJson?.["Failure Mode Alarm PF Interval"] || "").trim(),
    failureModeAlarmDetectionProbability: String(dbJson?.["Failure Mode Alarm Detection Probability"] || "").trim(),
    failureModeCostBenefitRatio: String(dbJson?.["Failure Mode Cost Benefit Ratio"] || "").trim(),
    failureModeTotalCost: String(dbJson?.["Failure Mode Total Cost"] || "").trim(),
    failureModeEffectCost: String(dbJson?.["Failure Mode Effect Cost"] || "").trim(),
    failureModeCorrectiveDownTime: String(dbJson?.["Failure Mode Corrective Down Time"] || "").trim(),
    failureModeCorrectiveEventCount: String(dbJson?.["Failure Mode Corrective Event Count"] || "").trim(),
    failureModeCorrectiveCost: String(dbJson?.["Failure Mode Corrective Cost"] || "").trim(),
    failureModePlannedCost: String(dbJson?.["Failure Mode Planned Cost"] || "").trim(),
    failureModeSecondaryActionCost: String(dbJson?.["Failure Mode Secondary Action Cost"] || "").trim(),
    failureModeInspectionCost: String(dbJson?.["Failure Mode Inspection Cost"] || "").trim(),
    failureModeFailureRate: String(dbJson?.["Failure Mode Failure Rate"] || "").trim(),
    failureModeAvailability: String(dbJson?.["Failure Mode Availability"] || "").trim(),
  };
};
const getStrategyTableRowsForSelection = (nodeInfo) =>
  getStrategyTaskNodeInfosForSelection(nodeInfo)
    .map((taskNodeInfo) => buildStrategyTableRow(taskNodeInfo))
    .sort((left, right) => left.taskCode.localeCompare(right.taskCode, undefined, { numeric: true, sensitivity: "base" }));
const getOrderedStrategyTableColumns = () => {
  const orderLookup = new Map(strategyTableColumns.map((column) => [column.key, column]));
  return state.strategyTable.columnOrder.map((key) => orderLookup.get(key)).filter(Boolean);
};
const getVisibleStrategyTableColumns = () => {
  const visibleKeys = new Set(state.strategyTable.visibleColumnKeys);
  return getOrderedStrategyTableColumns().filter((column) => visibleKeys.has(column.key));
};
const rowMatchesStrategyTableFilter = (row, query) => {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const haystack = [
    row.taskCode,
    row.scheduledTaskDescription,
    row.failureModeDescription,
    row.failureModeName,
    row.physicalAssetName,
    row.physicalAssetDescription,
    row.componentName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
};
const getFilteredStrategyTableRows = (rows = []) =>
  rows.filter((row) => {
    const matchesType =
      state.strategyTable.strategyTypeFilter === "All" ||
      String(row.taskNodeType || "").trim().toUpperCase() === state.strategyTable.strategyTypeFilter;
    return matchesType && rowMatchesStrategyTableFilter(row, state.strategyTable.searchQuery);
  });
const syncStrategyTableScrollbars = () => {
  if (!strategyList) {
    return;
  }

  const viewport = strategyList.querySelector(".strategy-grid__viewport");
  const table = strategyList.querySelector(".strategy-grid");
  const scrollbar = strategyList.querySelector(".strategy-grid__scrollbar");
  const scrollbarInner = strategyList.querySelector(".strategy-grid__scrollbar-inner");
  if (!(viewport instanceof HTMLElement) || !(table instanceof HTMLElement) || !(scrollbar instanceof HTMLElement) || !(scrollbarInner instanceof HTMLElement)) {
    return;
  }

  scrollbarInner.style.width = `${table.scrollWidth}px`;
  const syncFromViewport = () => {
    if (scrollbar.scrollLeft !== viewport.scrollLeft) {
      scrollbar.scrollLeft = viewport.scrollLeft;
    }
  };
  const syncFromScrollbar = () => {
    if (viewport.scrollLeft !== scrollbar.scrollLeft) {
      viewport.scrollLeft = scrollbar.scrollLeft;
    }
  };
  viewport.onscroll = syncFromViewport;
  scrollbar.onscroll = syncFromScrollbar;
  syncFromViewport();
};
const closeStrategyTableMenus = () => {
  state.strategyTable = {
    ...state.strategyTable,
    optionsOpen: false,
    rowMenuTaskNodeId: "",
  };
};
const toggleStrategyRowMenu = (taskNodeId) => {
  state.strategyTable = {
    ...state.strategyTable,
    optionsOpen: false,
    rowMenuTaskNodeId: state.strategyTable.rowMenuTaskNodeId === taskNodeId ? "" : taskNodeId,
  };
};
const toggleStrategyTableOptions = () => {
  state.strategyTable = {
    ...state.strategyTable,
    optionsOpen: !state.strategyTable.optionsOpen,
    rowMenuTaskNodeId: "",
  };
};
const moveStrategyTableColumn = (columnKey, direction) => {
  const currentOrder = [...state.strategyTable.columnOrder];
  const currentIndex = currentOrder.indexOf(columnKey);
  if (currentIndex < 0) {
    return;
  }

  const targetIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= currentOrder.length) {
    return;
  }

  [currentOrder[currentIndex], currentOrder[targetIndex]] = [currentOrder[targetIndex], currentOrder[currentIndex]];
  state.strategyTable = {
    ...state.strategyTable,
    columnOrder: currentOrder,
  };
  persistDraftSilently();
  renderAll({
    includeEntryDynamic: false,
  });
};
const setStrategyTableColumnVisibility = (columnKey, isVisible) => {
  const nextVisibleKeys = isVisible
    ? [...new Set([...state.strategyTable.visibleColumnKeys, columnKey])]
    : state.strategyTable.visibleColumnKeys.filter((key) => key !== columnKey);
  if (!nextVisibleKeys.length) {
    return;
  }

  state.strategyTable = {
    ...state.strategyTable,
    visibleColumnKeys: nextVisibleKeys,
  };
  persistDraftSilently();
  renderAll({
    includeEntryDynamic: false,
  });
};
const resetStrategyTablePreferences = () => {
  const defaults = defaultStrategyTableState();
  state.strategyTable = {
    ...state.strategyTable,
    searchQuery: defaults.searchQuery,
    strategyTypeFilter: defaults.strategyTypeFilter,
    columnOrder: defaults.columnOrder,
    visibleColumnKeys: defaults.visibleColumnKeys,
    optionsOpen: true,
    rowMenuTaskNodeId: "",
  };
  persistDraftSilently();
  renderAll({
    includeEntryDynamic: false,
  });
};
const getLeftPanelRowName = (node, path = []) => {
  if (node.type === "effect") {
    const effectJson = getEffectJsonEntryForNode(path, node);
    return String(node.code || effectJson?.["Failure Mode Effect Code"] || node.name || "").trim() || getNodeBrowserName(node);
  }

  if (["cm", "pm", "ins"].includes(node.type)) {
    const taskJson = getTaskJsonEntryForNode(path, node);
    return String(taskJson?.["Task Name"] || node.code || node.name || "").trim() || getNodeBrowserName(node);
  }

  return getNodeBrowserName(node);
};
const getLeftPanelRowDescription = (node, path = []) => {
  if (node.type === "cause") {
    const dbJson = getFailureModeJsonForPath(path);
    return String(dbJson?.["Failure Mode Description"] || "").trim() || getNodeBrowserDescription(path, node);
  }

  if (node.type === "effect") {
    const effectJson = getEffectJsonEntryForNode(path, node);
    const effectValue = String(effectJson?.["Failure Mode Effect Effect"] || "").trim();
    const redundancyFactor = String(effectJson?.["Failure Mode Effect Redundancy Factor"] || "").trim();
    if (effectValue && redundancyFactor) {
      return `${effectValue} · RF ${redundancyFactor}`;
    }
    return effectValue || getNodeBrowserDescription(path, node);
  }

  if (["cm", "pm", "ins"].includes(node.type)) {
    const taskJson = getTaskJsonEntryForNode(path, node);
    return String(taskJson?.["Scheduled Task Description"] || "").trim() || getNodeBrowserDescription(path, node);
  }

  return getNodeBrowserDescription(path, node);
};
const getNearestAncestorNodeFromPath = (path, type) =>
  Array.isArray(path) ? [...path].reverse().find((node) => node.type === type) || null : null;
const getFailureModeRedundancyFactor = (equipmentNode) => {
  if (!equipmentNode?.equipmentContext) {
    return "";
  }

  const { redundancyMode = "", redundancyPercent = "" } = equipmentNode.equipmentContext;
  if (String(redundancyMode || "").trim() === "Custom" && String(redundancyPercent || "").trim()) {
    return `${redundancyPercent}%`;
  }

  return String(redundancyMode || "").trim();
};
const buildFailureModeDbJson = (causeNode, path = []) => {
  const failureConfig = normalizeCauseFailureConfig(causeNode?.failureConfig);
  const equipmentNode = getNearestAncestorNodeFromPath(path, "equipment");
  const equipmentPath =
    equipmentNode && Array.isArray(path)
      ? path.slice(0, path.findIndex((node) => node.id === equipmentNode.id) + 1)
      : [];
  const effectRows = (causeNode?.children || [])
    .filter((child) => child.type === "effect")
    .map((effectNode) => ({
      "Failure Mode Effect Effect": getNodeDescription(effectNode),
      "Failure Mode Effect Redundancy Factor": getFailureModeRedundancyFactor(equipmentNode),
    }));
  const taskRows = (causeNode?.children || [])
    .filter((child) => ["cm", "pm", "ins"].includes(child.type))
    .map((taskNode) => {
      if (taskNode.type === "ins") {
        const config = normalizeInsConfig(taskNode.insConfig);
        return {
          "Task Name": getNodeCodeValue(taskNode),
          "Task Strategy": "INS",
          "Scheduled Task Type": String(config.scheduledTaskType || "").trim(),
          "Scheduled Task Is Enabled": Boolean(config.isEnabled),
          "Scheduled Task Do Not Deliver": Boolean(config.doNotDeliver),
          "Scheduled Task Description": getNodeDescription(taskNode),
          "Scheduled Task Interval": String(config.interval || "").trim(),
          "Scheduled Task Interval Short Description": String(config.intervalShortDescription || "").trim(),
          "Scheduled Task PF Interval": String(config.pfInterval || "").trim(),
          "Scheduled Task Detection Probability": String(config.detectionProbability || "").trim(),
          "Scheduled Task Duration": String(config.duration || "").trim(),
          "Scheduled Task Labor Labor": String(config.laborLabor || "").trim(),
        };
      }

      const config = taskNode.type === "pm" ? normalizePmConfig(taskNode.pmConfig) : normalizeCmConfig(taskNode.cmConfig);
      return {
        "Task Name": getNodeCodeValue(taskNode),
        "Task Strategy": taskNode.type.toUpperCase(),
        "Scheduled Task Type": String(config.type || "").trim(),
        "Scheduled Task Is Enabled": Boolean(config.isEnabled),
        "Scheduled Task Do Not Deliver": Boolean(config.doNotDeliver),
        "Scheduled Task Description": getNodeDescription(taskNode),
        "Scheduled Task Interval": String(config.intervalHours || "").trim(),
        "Scheduled Task Interval Short Description": String(config.intervalShortDescription || "").trim(),
        "Scheduled Task PF Interval": String(config.pfInterval || "").trim(),
        "Scheduled Task Detection Probability": String(config.detectionProbability || "").trim(),
        "Scheduled Task Duration": String(config.durationHours || "").trim(),
        "Scheduled Task Labor Labor": String(config.labourDurationHours || "").trim(),
      };
    });

  return {
    "Physical Asset Name": equipmentNode ? getNodeFullCode(equipmentNode, equipmentPath) : "",
    "Physical Asset Description": equipmentNode ? getNodeDescription(equipmentNode) : "",
    "Component Name": String(failureConfig.componentName || "").trim(),
    "Failure Mode Name": getNodeFullCode(causeNode, path),
    "Failure Mode Description": getNodeDescription(causeNode),
    "Failure Mode Is Dormant": Boolean(failureConfig.isDormant),
    "Failure Mode Demand Frequency": String(failureConfig.demandFrequency || "").trim(),
    "Failure Mode Distribution": String(failureConfig.distribution || "").trim(),
    "Failure Mode MTTF": String(failureConfig.mttf || "").trim(),
    "Failure Mode Eta 1": String(failureConfig.eta1 || "").trim(),
    "Failure Mode Beta 1": String(failureConfig.beta1 || "").trim(),
    "Failure Mode Gamma 1": String(failureConfig.gamma1 || "").trim(),
    "Failure Mode Alarm Is Enabled": Boolean(failureConfig.alarmIsEnabled),
    "Failure Mode Alarm Description": String(failureConfig.alarmDescription || "").trim(),
    "Failure Mode Alarm PF Interval": String(failureConfig.alarmPfInterval || "").trim(),
    "Failure Mode Alarm Detection Probability": String(failureConfig.alarmDetectionProbability || "").trim(),
    "Failure Mode Cost Benefit Ratio": "",
    "Failure Mode Total Cost": "",
    "Failure Mode Effect Cost": "",
    "Failure Mode Corrective Down Time": "",
    "Failure Mode Corrective Event Count": "",
    "Failure Mode Corrective Cost": "",
    "Failure Mode Planned Cost": "",
    "Failure Mode Secondary Action Cost": "",
    "Failure Mode Inspection Cost": "",
    "Failure Mode Failure Rate": "",
    "Failure Mode Availability": "",
    effects: effectRows,
    tasks: taskRows,
  };
};
const refreshFailureModeDbJsonForHierarchy = (nodes, parentPath = []) => {
  nodes.forEach((node) => {
    const path = [...parentPath, node];
    if (node.type === "cause") {
      node.failureConfig = {
        ...normalizeCauseFailureConfig(node.failureConfig),
        dbJson: buildFailureModeDbJson(node, path),
      };
    }
    if (Array.isArray(node.children) && node.children.length) {
      refreshFailureModeDbJsonForHierarchy(node.children, path);
    }
  });
};
const refreshDerivedFailureModeJson = () => {
  refreshFailureModeDbJsonForHierarchy(state.hierarchy);
};
const createEquipmentInfoDraft = (node) => {
  const context = node?.equipmentContext && typeof node.equipmentContext === "object" ? node.equipmentContext : defaultEquipmentContext();
  return {
    codeSegment: getNodeCodeValue(node),
    description: getNodeDescription(node),
    equipmentFunction: String(context.equipmentFunction || ""),
    equipmentType: String(context.equipmentType || ""),
    effectPerHourDown: String(context.effectPerHourDown || ""),
    demandFrequency: String(context.demandFrequency || ""),
    redundancyMode: String(context.redundancyMode || "None") || "None",
    redundancyPercent: String(context.redundancyPercent || ""),
    maeCategory: String(context.maeCategory || "No") || "No",
    operatingContext: String(context.operatingContext || ""),
    criticality: String(context.criticality || ""),
  };
};
const createCauseConfigDraft = (node) =>
  createCauseConfigDraftFromFailureConfig(getNodeDescription(node), node?.failureConfig || defaultCauseFailureConfig());
const createCmConfigDraft = (node) => {
  const config = normalizeCmConfig(node?.cmConfig);
  return {
    ...defaultChildDraftState(),
    childType: "cm",
    cmStep: "core",
    cmName: getNodeCodeValue(node),
    description: getNodeDescription(node),
    cmIntervalHours: String(config.intervalHours || ""),
    cmDurationHours: String(config.durationHours || ""),
    cmIntervalShortDescription: String(config.intervalShortDescription || ""),
    cmOffset: String(config.offset || "0"),
    cmRampTimeHours: String(config.rampTimeHours || ""),
    cmOperationNumber: String(config.operationNumber || ""),
    cmIsEnabled: Boolean(config.isEnabled),
    cmDoNotDeliver: Boolean(config.doNotDeliver),
    cmIsFixed: Boolean(config.isFixed),
    cmIsSecondaryAction: Boolean(config.isSecondaryAction),
    cmExternalOperationCost: String(config.externalOperationCost || ""),
    cmMaintenanceType: String(config.maintenanceType || ""),
    cmTaskType: String(config.type || ""),
    cmPfInterval: String(config.pfInterval || ""),
    cmDetectionProbability: String(config.detectionProbability || ""),
    cmLabourDurationHours: String(config.labourDurationHours || ""),
    cmResources: Array.isArray(config.resources)
      ? config.resources.map((resource) => createCmResourceAssignment(resource.resourceType, resource.durationHours))
      : [],
    cmSparePartsRequired: Array.isArray(config.sparePartsRequired)
      ? config.sparePartsRequired.map((part) => createCmSparePartAssignment(part.part))
      : [],
    cmToolsRequired: Array.isArray(config.toolsRequired)
      ? config.toolsRequired.map((tool) => createCmToolAssignment(tool.tool))
      : [],
  };
};
const createPmConfigDraft = (node) => {
  const config = normalizePmConfig(node?.pmConfig);
  return {
    ...defaultChildDraftState(),
    cmStep: "core",
    cmName: getNodeCodeValue(node),
    description: getNodeDescription(node),
    cmIntervalHours: String(config.intervalHours || ""),
    cmDurationHours: String(config.durationHours || ""),
    cmIntervalShortDescription: String(config.intervalShortDescription || ""),
    cmOffset: String(config.offset || "0"),
    cmRampTimeHours: String(config.rampTimeHours || ""),
    cmOperationNumber: String(config.operationNumber || ""),
    cmIsEnabled: Boolean(config.isEnabled),
    cmDoNotDeliver: Boolean(config.doNotDeliver),
    cmIsFixed: Boolean(config.isFixed),
    cmIsSecondaryAction: Boolean(config.isSecondaryAction),
    cmExternalOperationCost: String(config.externalOperationCost || ""),
    cmMaintenanceType: String(config.maintenanceType || ""),
    cmTaskType: String(config.type || ""),
    cmPfInterval: String(config.pfInterval || ""),
    cmDetectionProbability: String(config.detectionProbability || ""),
    cmLabourDurationHours: String(config.labourDurationHours || ""),
    cmResources: Array.isArray(config.resources)
      ? config.resources.map((resource) => createCmResourceAssignment(resource.resourceType, resource.durationHours))
      : [],
    cmSparePartsRequired: Array.isArray(config.sparePartsRequired)
      ? config.sparePartsRequired.map((part) => createCmSparePartAssignment(part.part))
      : [],
    cmToolsRequired: Array.isArray(config.toolsRequired)
      ? config.toolsRequired.map((tool) => createCmToolAssignment(tool.tool))
      : [],
  };
};
const createInsConfigDraft = (node) => {
  const config = normalizeInsConfig(node?.insConfig);
  return {
    ...defaultChildDraftState(),
    insName: getNodeCodeValue(node),
    description: getNodeDescription(node),
    insInspectionType: String(config.inspectionType || "Routine") || "Routine",
    insScheduledTaskType: String(config.scheduledTaskType || ""),
    insIsEnabled: Boolean(config.isEnabled),
    insDoNotDeliver: Boolean(config.doNotDeliver),
    insInterval: String(config.interval || ""),
    insIntervalShortDescription: String(config.intervalShortDescription || ""),
    insPfInterval: String(config.pfInterval || ""),
    insDetectionProbability: String(config.detectionProbability || ""),
    insDuration: String(config.duration || ""),
    insLaborLabor: String(config.laborLabor || ""),
    insResources: Array.isArray(config.resources)
      ? config.resources.map((resource) => createInsResourceAssignment(resource.resourceType, resource.durationHours))
      : [],
    insToolsRequired: Array.isArray(config.toolsRequired)
      ? config.toolsRequired.map((tool) => createInsToolAssignment(tool.tool))
      : [],
  };
};
const closeEquipmentInfo = () => {
  equipmentInfoState = defaultEquipmentInfoState();
};
const closeCauseConfig = () => {
  causeConfigState = defaultCauseConfigState();
};
const closePmConfig = () => {
  pmConfigState = defaultPmConfigState();
};
const closeInsConfig = () => {
  insConfigState = defaultInsConfigState();
};
const closeEquipmentInfoMenu = () => {
  equipmentInfoState = {
    ...equipmentInfoState,
    menuOpen: false,
  };
};
const toggleEquipmentInfoMenu = (nodeId) => {
  const isSameNode = equipmentInfoState.nodeId === nodeId;
  equipmentInfoState = {
    ...equipmentInfoState,
    nodeId,
    menuOpen: isSameNode ? !equipmentInfoState.menuOpen : true,
  };
};
const openEquipmentInfoMode = (nodeInfo, mode) => {
  if (!nodeInfo || nodeInfo.node.type !== "equipment") {
    closeEquipmentInfo();
    return;
  }

  closeChildCreator();
  equipmentInfoState = {
    mode,
    nodeId: nodeInfo.node.id,
    menuOpen: false,
    draft: mode === "edit" ? createEquipmentInfoDraft(nodeInfo.node) : null,
  };
};
const openCauseConfig = (nodeInfo) => {
  if (!nodeInfo || nodeInfo.node.type !== "cause") {
    closeCauseConfig();
    return;
  }

  closeChildCreator();
  closeEquipmentInfo();
  closePmConfig();
  closeInsConfig();
  causeConfigState = {
    nodeId: nodeInfo.node.id,
    draft: createCauseConfigDraft(nodeInfo.node),
    advancedOpen: false,
    alarmOpen: false,
  };
};
const openExistingTaskEditor = (nodeInfo) => {
  if (!nodeInfo || !["cm", "pm", "ins"].includes(nodeInfo.node.type) || !nodeInfo.parent) {
    closeChildCreator();
    return;
  }

  closeEquipmentInfo();
  closeCauseConfig();
  if (nodeInfo.node.type === "cm") {
    childDraftState = {
      ...createCmConfigDraft(nodeInfo.node),
      isOpen: true,
      parentId: nodeInfo.parent.id,
      editNodeId: nodeInfo.node.id,
    };
    return;
  }

  if (nodeInfo.node.type === "pm") {
    childDraftState = {
      ...createPmConfigDraft(nodeInfo.node),
      isOpen: true,
      parentId: nodeInfo.parent.id,
      childType: "pm",
      editNodeId: nodeInfo.node.id,
    };
    return;
  }

  childDraftState = {
    ...createInsConfigDraft(nodeInfo.node),
    isOpen: true,
    parentId: nodeInfo.parent.id,
    childType: "ins",
    editNodeId: nodeInfo.node.id,
  };
};
const updateInheritedCodesForSubtree = (node, parentFullCode = "") => {
  if (!node) {
    return;
  }

  node.name = shortCodeHierarchyTypes.has(node.type) ? String(node.code || "").trim() : joinInheritedCode(parentFullCode, node.code, node.type);
  (node.children || []).forEach((child) => {
    updateInheritedCodesForSubtree(child, node.name);
  });
};
const getNodeIcon = (type) => {
  switch (type) {
    case "plant":
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V8l4-3v15M10 20V11l4-3v12M16 20v-7l4-2v9M3 20h18"></path></svg>';
    case "section":
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v10H4z"></path><path d="M8 7V4h8v3"></path></svg>';
    case "subsystem":
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14v12H5z"></path><path d="M9 10h6M9 14h6"></path></svg>';
    case "equipment":
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16h14V8H5z"></path><path d="M8 16v3M16 16v3M9 11h6"></path></svg>';
    case "function":
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v10H5z"></path><path d="M8 10h8M8 14h5"></path></svg>';
    case "functionalFailure":
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v8"></path><path d="M8 8h8"></path><path d="M6 18h12"></path></svg>';
    case "cause":
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l7 4v6l-7 4-7-4V9z"></path></svg>';
    case "effect":
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path><path d="M15 8l4 4-4 4"></path></svg>';
    case "cm":
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17h10V7H7z"></path><path d="M10 10h4M10 14h4"></path></svg>';
    case "ins":
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h12v12H6z"></path><path d="M9 9h6v6H9z"></path></svg>';
    case "pm":
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v6l4 2"></path><circle cx="12" cy="12" r="7"></circle></svg>';
    case "subunit":
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17h10V7H7z"></path><path d="M10 10h4M10 14h4"></path></svg>';
    default:
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"></rect></svg>';
  }
};
const getHierarchyFilterValue = () => state.hierarchyFilter.trim().toLowerCase();
const isNodeCollapsed = (nodeId) => state.collapsedNodeIds.includes(nodeId);
const setNodeCollapsed = (nodeId, collapsed) => {
  if (collapsed) {
    if (!state.collapsedNodeIds.includes(nodeId)) {
      state.collapsedNodeIds.push(nodeId);
    }
    return;
  }

  state.collapsedNodeIds = state.collapsedNodeIds.filter((id) => id !== nodeId);
};
const nodeMatchesFilter = (nodePath, filterValue) => {
  if (!filterValue) {
    return true;
  }

  const node = nodePath[nodePath.length - 1];
  const searchText = [
    getFullCodeFromPath(nodePath),
    getFullNameFromPath(nodePath),
    node.code,
    node.name,
    getNodeLabel(node),
    getLeftPanelRowName(node, nodePath),
    getLeftPanelRowDescription(node, nodePath),
  ]
    .join(" ")
    .toLowerCase();

  return searchText.includes(filterValue);
};
const nodeOrDescendantMatchesFilter = (node, path, filterValue) => {
  if (!filterValue) {
    return true;
  }

  const nodePath = [...path, node];
  if (nodeMatchesFilter(nodePath, filterValue)) {
    return true;
  }

  return node.children.some((child) => nodeOrDescendantMatchesFilter(child, nodePath, filterValue));
};

const renderEntrySubsystemRows = () => {
  const baseSegments = [state.entry.plantUnit.code, state.entry.sectionSystem.code];
  subsystemList.innerHTML = state.entry.subsystems
    .map(
      (subsystem, index) => {
        const inheritedPrefix = buildInheritedCodePrefix([
          ...baseSegments,
          ...state.entry.subsystems.slice(0, index).map((item) => item.code),
        ]);

        return `
        <div class="asset-context-row asset-context-row--optional">
          <div class="asset-context-row__field asset-context-entry-block">
            <span class="asset-context-entry-block__label">Sub-system ${index + 1}</span>
            <div class="asset-context-entry-grid">
              <label class="field">
                <span>Code segment</span>
                <div class="hierarchy-code-field ${inheritedPrefix ? "has-prefix" : ""}">
                  <span class="hierarchy-code-field__prefix">${escapeHtml(inheritedPrefix)}</span>
                  <input data-entry-subsystem-id="${subsystem.id}" data-entry-subsystem-field="code" type="text" value="${escapeHtml(
                    subsystem.code
                  )}" placeholder="Enter code segment">
                </div>
              </label>
              <label class="field">
                <span>Name</span>
                <input data-entry-subsystem-id="${subsystem.id}" data-entry-subsystem-field="name" type="text" value="${escapeHtml(
                  subsystem.name
                )}" placeholder="Enter name">
              </label>
            </div>
          </div>
          <button class="asset-context-remove" type="button" data-remove-entry-subsystem="${subsystem.id}">Remove</button>
        </div>
      `;
      }
    )
    .join("");
};

const renderEntrySubunitRow = () => {
  if (!state.entry.hasSubunit) {
    subunitContainer.innerHTML = "";
    return;
  }

  const inheritedPrefix = buildInheritedCodePrefix([
    state.entry.plantUnit.code,
    state.entry.sectionSystem.code,
    ...state.entry.subsystems.map((item) => item.code),
    state.entry.equipmentUnit.code,
  ]);

  subunitContainer.innerHTML = `
    <div class="asset-context-row asset-context-row--optional">
      <div class="asset-context-row__field asset-context-entry-block">
        <span class="asset-context-entry-block__label">Subunit</span>
        <div class="asset-context-entry-grid">
          <label class="field">
            <span>Code segment</span>
            <div class="hierarchy-code-field ${inheritedPrefix ? "has-prefix" : ""}">
              <span class="hierarchy-code-field__prefix">${escapeHtml(inheritedPrefix)}</span>
              <input id="entrySubunitCodeInput" type="text" value="${escapeHtml(
                state.entry.subunit.code
              )}" placeholder="Enter code segment">
            </div>
          </label>
          <label class="field">
            <span>Name</span>
            <input id="entrySubunitNameInput" type="text" value="${escapeHtml(state.entry.subunit.name)}" placeholder="Enter name">
          </label>
        </div>
      </div>
      <button id="removeEntrySubunitButton" class="asset-context-remove" type="button">Remove</button>
    </div>
  `;
};

const openEntryEquipmentInfoPopup = () => {
  if (!hasNodeValue(state.entry.equipmentUnit)) {
    return;
  }

  entryEquipmentInfoState = {
    isOpen: true,
    draft: {
      ...defaultEquipmentContext(),
      ...(state.entry.equipmentUnit.equipmentContext || {}),
    },
  };
};

const closeEntryEquipmentInfoPopup = () => {
  entryEquipmentInfoState = defaultEntryEquipmentInfoState();
};

const saveEntryEquipmentInfoPopup = () => {
  state.entry.equipmentUnit.equipmentContext = {
    ...defaultEquipmentContext(),
    ...(entryEquipmentInfoState.draft || {}),
  };
  closeEntryEquipmentInfoPopup();
  persistDraftSilently();
  renderAll({
    includeEntryDynamic: false,
  });
  hideNotice();
};

const renderEntryEquipmentInfoPopup = () => {
  if (!equipmentEntryInfoPopup) {
    return;
  }

  if (!state.modalVisible || !entryEquipmentInfoState.isOpen) {
    equipmentEntryInfoPopup.hidden = true;
    equipmentEntryInfoPopup.innerHTML = "";
    return;
  }

  const draft = entryEquipmentInfoState.draft || defaultEquipmentContext();
  const entry = state.entry.equipmentUnit;
  const equipmentLabel = [entry.code.trim(), entry.name.trim()].filter(Boolean).join(" | ") || "Equipment Unit";

  equipmentEntryInfoPopup.hidden = false;
  equipmentEntryInfoPopup.innerHTML = `
    <div class="asset-context-subdialog__backdrop" aria-hidden="true"></div>
    <section class="asset-context-subdialog__panel" role="dialog" aria-modal="true" aria-labelledby="equipmentEntryInfoTitle">
      <header class="asset-context-subdialog__header">
        <strong class="asset-context-subdialog__eyebrow">Equipment information</strong>
        <h2 id="equipmentEntryInfoTitle">${escapeHtml(equipmentLabel)}</h2>
        <p>Capture additional equipment details without crowding the taxonomy form.</p>
      </header>

      <div class="asset-context-subdialog__body">
        <section class="asset-child-creator__section">
          <header class="asset-child-creator__section-head">
            <strong class="asset-child-creator__section-title">Equipment Context</strong>
          </header>
          <div class="asset-child-creator__row-grid">
            <label class="field">
              <span>Equipment Function</span>
              <input id="entryEquipmentInfoFunctionInput" type="text" value="${escapeHtml(draft.equipmentFunction)}" placeholder="Enter equipment function">
            </label>
            <label class="field">
              <span>Type of Equipment</span>
              <input id="entryEquipmentInfoTypeInput" type="text" value="${escapeHtml(draft.equipmentType)}" placeholder="Enter equipment type">
            </label>
          </div>
          <label class="field field--full">
            <span>Operating Context</span>
            <textarea id="entryEquipmentInfoOperatingContextInput" rows="3" placeholder="Add operating context">${escapeHtml(draft.operatingContext)}</textarea>
          </label>
        </section>

        <section class="asset-child-creator__section">
          <header class="asset-child-creator__section-head">
            <strong class="asset-child-creator__section-title">Consequence</strong>
          </header>
          <div class="asset-child-creator__row-grid">
            <label class="field">
              <span>Effect</span>
              <select id="entryEquipmentInfoEffectInput">
                <option value="">Select effect</option>
                ${effectPerHourDownOptions
                  .map(
                    (option) => `<option value="${escapeHtml(option)}" ${draft.effectPerHourDown === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                  )
                  .join("")}
              </select>
            </label>
            <label class="field">
              <span>Demand Frequency</span>
              <select id="entryEquipmentInfoDemandFrequencyInput">
                <option value="">Select demand frequency</option>
                ${demandFrequencyOptions
                  .map(
                    (option) => `<option value="${escapeHtml(option)}" ${draft.demandFrequency === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                  )
                  .join("")}
              </select>
            </label>
          </div>
          <div class="asset-child-creator__row-grid asset-child-creator__row-grid--triple">
            <label class="field">
              <span>Redundancy</span>
              <select id="entryEquipmentInfoRedundancyModeInput">
                ${redundancyOptions
                  .map(
                    (option) => `<option value="${escapeHtml(option)}" ${draft.redundancyMode === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                  )
                  .join("")}
              </select>
            </label>
            ${
              draft.redundancyMode === "Custom"
                ? `
                    <label class="field">
                      <span>Redundancy %</span>
                      <input id="entryEquipmentInfoRedundancyPercentInput" type="number" min="0" max="100" step="1" value="${escapeHtml(draft.redundancyPercent)}" placeholder="Enter percent">
                    </label>
                  `
                : `<div class="asset-child-creator__placeholder-cell" aria-hidden="true"></div>`
            }
            <label class="field">
              <span>Major Accident Event Category (MAE)</span>
              <select id="entryEquipmentInfoMaeCategoryInput">
                ${maeCategoryOptions
                  .map(
                    (option) => `<option value="${escapeHtml(option)}" ${draft.maeCategory === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                  )
                  .join("")}
              </select>
            </label>
          </div>
          <div class="asset-child-creator__row-grid">
            <label class="field">
              <span>Criticality</span>
              <select id="entryEquipmentInfoCriticalityInput">
                <option value="">Select criticality</option>
                ${criticalityOptions
                  .map(
                    (option) => `<option value="${escapeHtml(option)}" ${draft.criticality === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                  )
                  .join("")}
              </select>
            </label>
          </div>
        </section>

        <section class="asset-child-creator__section">
          <header class="asset-child-creator__section-head">
            <strong class="asset-child-creator__section-title">Linked References</strong>
            <span class="asset-child-creator__section-note">Connections will activate once FMEA and baseline strategy modules are enabled.</span>
          </header>
          <div class="asset-child-creator__references-grid">
            <button class="asset-child-creator__disabled-action" type="button" disabled>Link to FMEA</button>
            <label class="asset-child-creator__reference-field">
              <span>Baseline Strategy</span>
              <select disabled>
                <option>Not set</option>
              </select>
            </label>
            <button class="asset-child-creator__disabled-action" type="button" disabled>Attach Manuals</button>
          </div>
        </section>
      </div>

      <footer class="asset-context-subdialog__footer">
        <button id="cancelEntryEquipmentInfoButton" class="secondary-button" type="button">Cancel</button>
        <button id="saveEntryEquipmentInfoButton" class="primary-button" type="button">Save information</button>
      </footer>
    </section>
  `;
};

const renderEntryForm = (options = {}) => {
  if (options.includeDynamic !== false) {
    renderEntrySubsystemRows();
    renderEntrySubunitRow();
  }

  const entry = state.entry;
  const canEditSection = hasNodeValue(entry.plantUnit);
  const canEditEquipment =
    canEditSection && hasNodeValue(entry.sectionSystem) && entry.subsystems.every((item) => hasNodeValue(item));

  plantUnitCodeInput.value = entry.plantUnit.code;
  plantUnitNameInput.value = entry.plantUnit.name;
  sectionSystemCodeInput.value = entry.sectionSystem.code;
  sectionSystemNameInput.value = entry.sectionSystem.name;
  equipmentUnitCodeInput.value = entry.equipmentUnit.code;
  equipmentUnitNameInput.value = entry.equipmentUnit.name;

  applyInheritedPrefix(sectionSystemCodeField, sectionSystemCodePrefix, buildInheritedCodePrefix([entry.plantUnit.code]));
  applyInheritedPrefix(
    equipmentUnitCodeField,
    equipmentUnitCodePrefix,
    buildInheritedCodePrefix([entry.plantUnit.code, entry.sectionSystem.code, ...entry.subsystems.map((item) => item.code)])
  );

  sectionSystemCodeInput.disabled = !canEditSection;
  sectionSystemNameInput.disabled = !canEditSection;
  addSubsystemButton.disabled = !hasNodeValue(entry.sectionSystem) || !entry.subsystems.every((item) => hasNodeValue(item));
  equipmentUnitCodeInput.disabled = !canEditEquipment;
  equipmentUnitNameInput.disabled = !canEditEquipment;
  if (equipmentUnitMoreInfoButton) {
    equipmentUnitMoreInfoButton.disabled = !hasNodeValue(entry.equipmentUnit);
  }
  addSubunitButton.disabled = !hasNodeValue(entry.equipmentUnit) || entry.hasSubunit;

  const entrySubunitCodeInput = document.getElementById("entrySubunitCodeInput");
  const entrySubunitNameInput = document.getElementById("entrySubunitNameInput");
  if (entrySubunitCodeInput && entrySubunitNameInput) {
    entrySubunitCodeInput.value = entry.subunit.code;
    entrySubunitNameInput.value = entry.subunit.name;
    entrySubunitCodeInput.disabled = !hasNodeValue(entry.equipmentUnit);
    entrySubunitNameInput.disabled = !hasNodeValue(entry.equipmentUnit);
  }

  const entryPath = getEntryPathSegments(false).map((segment) => ({ code: segment.code, name: segment.name }));
  assetPathPreview.textContent = entryPath.length
    ? formatFunctionalLocationPreview(entryPath)
    : "Functional location preview updates as you define the hierarchy.";
  continueButton.disabled = !isEntryReady();
  renderEntryEquipmentInfoPopup();
};

const renderHierarchyNodes = (nodes, depth = 0, parentPath = [], filterValue = "") =>
  nodes
    .map((node) => {
      const nodePath = [...parentPath, node];
      if (!nodeOrDescendantMatchesFilter(node, parentPath, filterValue)) {
        return "";
      }

      const selectedClass = state.selectedNodeId === node.id ? "is-selected" : "";
      const fullCode = getFullCodeFromPath(nodePath) || getNodeCodeValue(node, "Code pending");
      const hasChildren = node.children.length > 0;
      const expanded = filterValue ? true : !isNodeCollapsed(node.id);
      const toggleControl = hasChildren
        ? `
            <button
              class="asset-browser-row__toggle"
              type="button"
              data-toggle-collapse="${node.id}"
              aria-expanded="${expanded ? "true" : "false"}"
              aria-label="${expanded ? "Collapse" : "Expand"} ${escapeHtml(getNodeTitle(node))}"
            >
              ${expanded ? "−" : "+"}
            </button>
          `
        : `<span class="asset-browser-row__toggle asset-browser-row__toggle--spacer" aria-hidden="true"></span>`;

      const description = getNodeDescription(node);
      const childrenMarkup =
        hasChildren && expanded
          ? renderHierarchyNodes(node.children, depth + 1, nodePath, filterValue)
          : "";

      return `
        <div class="asset-browser-row ${selectedClass}" role="row" aria-level="${depth + 1}">
          <button class="asset-browser-row__location" type="button" data-select-node="${node.id}" style="--depth:${depth}">
            <span class="asset-browser-row__tree">
              ${toggleControl}
              <span class="asset-browser-row__icon" aria-hidden="true">${getNodeIcon(node.type)}</span>
            </span>
            <span class="asset-browser-row__copy">
              <strong>${escapeHtml(fullCode)}</strong>
              <small>${escapeHtml(getNodeLabel(node))}</small>
            </span>
          </button>
          <button class="asset-browser-row__description" type="button" data-select-node="${node.id}">
            <span>${escapeHtml(description)}</span>
          </button>
        </div>
        ${childrenMarkup}
      `;
    })
    .join("");

const renderRegisterRow = ({ node, path, depth, hasChildren, expanded }) => {
  const isSelected = state.selectedNodeId === node.id;
  const selectedClass = isSelected ? "is-selected" : "";
  const nodeLabel = getLeftPanelRowName(node, path);
  const description = getLeftPanelRowDescription(node, path);
  const actions = getChildActions(node.type);
  const showAddButton = isSelected && actions.length;
  const toggleControl = hasChildren
    ? `
        <button
          class="asset-register-row__toggle"
          type="button"
          data-toggle-collapse="${node.id}"
          aria-expanded="${expanded ? "true" : "false"}"
          aria-label="${expanded ? "Collapse" : "Expand"} ${escapeHtml(nodeLabel)}"
        >
          ${expanded ? "&minus;" : "+"}
        </button>
      `
    : `<span class="asset-register-row__toggle asset-register-row__toggle--spacer" aria-hidden="true"></span>`;
  const descriptionMarkup = `
    <span>${escapeHtml(description)}</span>
    ${
      showAddButton
        ? `
          <button
            class="asset-register-row__add"
            type="button"
            data-open-child-creator="${node.id}"
            aria-label="Add child under ${escapeHtml(getNodeTitle(node))}"
            title="Add child"
          >
            +
          </button>
        `
        : ""
    }
  `;

  return `
    <div class="asset-register-row ${selectedClass}" role="row" aria-level="${depth + 1}" data-select-node="${node.id}">
      <div class="asset-register-row__check">
        <input class="asset-register-row__checkbox" type="checkbox" tabindex="-1" aria-label="Select ${escapeHtml(nodeLabel)}">
      </div>
      <div class="asset-register-row__location" style="--depth:${depth}">
        <span class="asset-register-row__tree">
          ${toggleControl}
          <span class="asset-register-row__icon" aria-hidden="true">${getNodeIcon(node.type)}</span>
        </span>
        <span class="asset-register-row__label">${escapeHtml(nodeLabel)}</span>
      </div>
      <div class="asset-register-row__description">
        ${descriptionMarkup}
      </div>
    </div>
  `;
};

const renderHierarchyRegisterNodes = (nodes, depth = 0, parentPath = [], filterValue = "") =>
  nodes
    .map((node) => {
      const nodePath = [...parentPath, node];
      if (!nodeOrDescendantMatchesFilter(node, parentPath, filterValue)) {
        return "";
      }

      const hasChildren = node.children.length > 0;
      const expanded = filterValue ? true : !isNodeCollapsed(node.id);
      const rowMarkup = renderRegisterRow({
        node,
        path: nodePath,
        depth,
        hasChildren,
        expanded,
        filterValue,
      });
      const childrenMarkup =
        hasChildren && expanded
          ? renderHierarchyRegisterNodes(node.children, depth + 1, nodePath, filterValue)
          : "";

      return `${rowMarkup}${childrenMarkup}`;
    })
    .join("");

const collectEquipmentRegisterRows = (nodes, parentPath = [], rows = []) => {
  nodes.forEach((node) => {
    const nodePath = [...parentPath, node];
    if (node.type === "equipment") {
      rows.push({
        node,
        path: nodePath,
      });
    }

    if (node.children.length) {
      collectEquipmentRegisterRows(node.children, nodePath, rows);
    }
  });

  return rows;
};

const renderEquipmentListRows = (filterValue = "") =>
  collectEquipmentRegisterRows(state.hierarchy)
    .filter(({ path }) => nodeMatchesFilter(path, filterValue))
    .map(({ node, path }) => {
      return renderRegisterRow({
        node,
        path,
        depth: 0,
        hasChildren: false,
        expanded: false,
      });
    })
    .join("");

const renderHierarchyTree = () => {
  if (!state.hierarchy.length) {
    assetHierarchyTree.innerHTML = `
      <article class="asset-workspace-empty">
        <strong>Start with the asset taxonomy modal</strong>
        <p>Define the initial plant, system, equipment, or subunit path, then continue into the workspace.</p>
      </article>
    `;
    return;
  }

  const filterValue = getHierarchyFilterValue();
  const isListView = state.layout.assetViewMode === assetViewModes.list;
  const treeMarkup = isListView
    ? renderEquipmentListRows(filterValue)
    : renderHierarchyRegisterNodes(state.hierarchy, 0, [], filterValue);
  assetHierarchyTree.innerHTML =
    treeMarkup ||
    `
      <article class="asset-workspace-empty asset-workspace-empty--soft">
        <strong>${isListView ? "No equipment matches this filter" : "No assets match this filter"}</strong>
        <p>${isListView ? "Try a broader search term or switch back to the grouped hierarchy view." : "Try a broader search term or clear the filter to see the full hierarchy."}</p>
      </article>
    `;
};

const closeChildCreator = () => {
  childDraftState = defaultChildDraftState();
};

const openChildCreator = (parentId, childType = "") => {
  const parentInfo = findNodeInfo(state.hierarchy, parentId);
  if (!parentInfo) {
    closeChildCreator();
    return;
  }

  const actions = getChildActions(parentInfo.node.type);
  if (!actions.length) {
    closeChildCreator();
    return;
  }

  closeEquipmentInfo();
  closeCauseConfig();
  closePmConfig();
  closeInsConfig();
  const nextChildType = actions.some((action) => action.type === childType) ? childType : actions[0].type;
  const nextDraft = defaultChildDraftState();
  childDraftState = {
    ...nextDraft,
    isOpen: true,
    parentId,
    childType: nextChildType,
    cmName: nextChildType === "cm" ? getDefaultCmDraftName(parentId) : nextChildType === "pm" ? getDefaultPmDraftName(parentId) : "",
    insName: nextChildType === "ins" ? getDefaultInsDraftName(parentId) : "",
  };
};

const saveEquipmentInfo = (nodeId, draft) => {
  const info = findNodeInfo(state.hierarchy, nodeId);
  if (!info || info.node.type !== "equipment") {
    return;
  }

  const nextCodeSegment = sanitizeCodeSegment(draft?.codeSegment || "", "equipment", (info.parent?.children || []).filter((child) => child.id !== nodeId));
  const parentFullCode = getParentFullCodeFromPath(info.path);
  info.node.code = nextCodeSegment;
  info.node.name = joinInheritedCode(parentFullCode, nextCodeSegment, info.node.type);
  info.node.description = String(draft?.description || "").trim();
  info.node.equipmentContext = {
    ...defaultEquipmentContext(),
    equipmentFunction: String(draft?.equipmentFunction || "").trim(),
    equipmentType: String(draft?.equipmentType || "").trim(),
    effectPerHourDown: String(draft?.effectPerHourDown || "").trim(),
    demandFrequency: String(draft?.demandFrequency || "").trim(),
    redundancyMode: String(draft?.redundancyMode || "None").trim() || "None",
    redundancyPercent:
      String(draft?.redundancyMode || "") === "Custom" ? String(draft?.redundancyPercent || "").trim() : "",
    maeCategory: String(draft?.maeCategory || "No").trim() || "No",
    operatingContext: String(draft?.operatingContext || "").trim(),
    criticality: String(draft?.criticality || "").trim(),
  };

  (info.node.children || []).forEach((child) => {
    updateInheritedCodesForSubtree(child, info.node.name);
  });

  equipmentInfoState = {
    mode: "view",
    nodeId,
    menuOpen: false,
    draft: null,
  };
  persistDraftSilently();
  renderAll({
    includeEntryDynamic: false,
  });
};

const saveCauseConfig = (nodeId, draft) => {
  const info = findNodeInfo(state.hierarchy, nodeId);
  if (!info || info.node.type !== "cause") {
    return;
  }

  info.node.description = String(draft?.description || "").trim();
  info.node.failureConfig = buildCauseFailureConfigFromDraft(draft);
  closeCauseConfig();
  persistDraftSilently();
  renderAll({
    includeEntryDynamic: false,
  });
};

const renderChildCreator = (nodeInfo, actions) => {
  if (!childCreatorPanel) {
    return;
  }

  const isActive = childDraftState.isOpen && childDraftState.parentId === nodeInfo.node.id && actions.length;
  childCreatorPanel.hidden = !isActive;

  if (!isActive) {
    childCreatorPanel.innerHTML = "";
    return;
  }

  const selectedChildType = actions.some((action) => action.type === childDraftState.childType)
    ? childDraftState.childType
    : actions[0].type;
  const isEditingExistingTask = Boolean(childDraftState.editNodeId);
  const showEquipmentFields = selectedChildType === "equipment";
  const showEffectCatalogSelector = selectedChildType === "effect";
  const showMaintenanceTaskEditor = maintenanceTaskChildTypes.has(selectedChildType);
  const showInsTaskEditor = selectedChildType === "ins";
  const isAutoGeneratedChild = autoGeneratedChildTypes.has(selectedChildType);
  const parentFullCode = getNodeFullCode(nodeInfo.node, nodeInfo.path);
  const inheritedPrefix = buildInheritedCodePrefix([parentFullCode]);
  const generatedDefinition = isAutoGeneratedChild ? getGeneratedChildDefinition(nodeInfo, selectedChildType) : null;
  const usedEffectCodes = showEffectCatalogSelector ? getUsedEffectCodesForParent(nodeInfo.node) : new Set();
  const childTypeControl =
    isEditingExistingTask
      ? ""
      : actions.length > 1
      ? `
          <div class="asset-child-creator__modebar">
            <div class="asset-child-creator__tabs" role="tablist" aria-label="Child type">
            ${actions
              .map(
                (action) => `
                  <button
                    class="asset-child-creator__tab ${selectedChildType === action.type ? "is-active" : ""}"
                    type="button"
                    role="tab"
                    aria-selected="${selectedChildType === action.type ? "true" : "false"}"
                    data-child-type-option="${action.type}"
                  >
                    ${escapeHtml(getChildActionLabel(action.type))}
                  </button>
                `
              )
              .join("")}
            </div>
          </div>
        `
      : `<input type="hidden" id="childCreatorTypeInput" value="${escapeHtml(selectedChildType)}">`;
  if (showMaintenanceTaskEditor) {
    const taskCode = getNextAutoGeneratedCode(nodeInfo.node, selectedChildType);
    const taskLabel = selectedChildType === "cm" ? "CM" : "PM";
    const intervalShortDescription = deriveCmIntervalShortDescription(childDraftState.cmIntervalHours);
    const cmResourceRows =
      childDraftState.cmResources.length > 0
        ? childDraftState.cmResources
            .map(
              (resource, index) => `
                <div class="cm-task-editor__resource-row">
                  <label class="cm-task-editor__resource-field">
                    <span class="cm-task-editor__label">Resource type ${index + 1}</span>
                    <select data-cm-resource-field="resourceType" data-cm-resource-id="${resource.id}">
                      <option value="">Select resource type</option>
                      ${cmResourceTypeOptions
                        .map(
                          (option) =>
                            `<option value="${escapeHtml(option)}" ${resource.resourceType === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                        )
                        .join("")}
                    </select>
                  </label>
                  <label class="cm-task-editor__resource-field">
                    <span class="cm-task-editor__label">Duration (hours)</span>
                    <input data-cm-resource-field="durationHours" data-cm-resource-id="${resource.id}" type="number" min="0" step="any" value="${escapeHtml(
                      resource.durationHours
                    )}" placeholder="Enter duration">
                  </label>
                  <button class="cm-task-editor__resource-remove" type="button" data-remove-cm-resource="${resource.id}">Remove</button>
                </div>
              `
            )
            .join("")
        : `<p class="cm-task-editor__resource-empty">No resources added yet.</p>`;
    const cmSparePartRows =
      childDraftState.cmSparePartsRequired.length > 0
        ? childDraftState.cmSparePartsRequired
            .map(
              (part, index) => `
                <div class="cm-task-editor__resource-row cm-task-editor__resource-row--compact">
                  <label class="cm-task-editor__resource-field">
                    <span class="cm-task-editor__label">Spare part ${index + 1}</span>
                    <select data-cm-spare-part-field="part" data-cm-spare-part-id="${part.id}">
                      <option value="">Select spare part</option>
                      ${cmSparePartOptions
                        .map(
                          (option) => `<option value="${escapeHtml(option)}" ${part.part === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                        )
                        .join("")}
                    </select>
                  </label>
                  <button class="cm-task-editor__resource-remove" type="button" data-remove-cm-spare-part="${part.id}">Remove</button>
                </div>
              `
            )
            .join("")
        : `<p class="cm-task-editor__resource-empty">No spare parts added yet.</p>`;
    const cmToolRows =
      childDraftState.cmToolsRequired.length > 0
        ? childDraftState.cmToolsRequired
            .map(
              (tool, index) => `
                <div class="cm-task-editor__resource-row cm-task-editor__resource-row--compact">
                  <label class="cm-task-editor__resource-field">
                    <span class="cm-task-editor__label">Tool ${index + 1}</span>
                    <select data-cm-tool-field="tool" data-cm-tool-id="${tool.id}">
                      <option value="">Select tool</option>
                      ${cmToolOptions
                        .map(
                          (option) => `<option value="${escapeHtml(option)}" ${tool.tool === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                        )
                        .join("")}
                    </select>
                  </label>
                  <button class="cm-task-editor__resource-remove" type="button" data-remove-cm-tool="${tool.id}">Remove</button>
                </div>
              `
            )
            .join("")
        : `<p class="cm-task-editor__resource-empty">No tools added yet.</p>`;
    childCreatorPanel.innerHTML = `
      <section class="asset-child-creator__form cm-task-editor">
        ${childTypeControl}
        <section class="asset-child-creator__section cm-task-editor__section">
          <header class="asset-child-creator__section-head">
            <strong class="asset-child-creator__section-title">${childDraftState.cmStep === "core" ? "Core" : "Resources"}</strong>
            <span class="asset-child-creator__section-note">Step ${childDraftState.cmStep === "core" ? "1" : "2"} of 2</span>
          </header>
          <div class="cm-task-editor__stack">
            <div class="cm-task-editor__field cm-task-editor__field--full">
              <span class="cm-task-editor__label">${getRequiredFieldLabel("Name")}</span>
              <input
                class="cm-task-editor__control"
                id="childCreatorCmNameInput"
                type="text"
                maxlength="10"
                value="${escapeHtml(childDraftState.cmName || taskCode)}"
                placeholder="Enter ${escapeHtml(taskLabel)} code"
                required
              >
            </div>
          ${
            childDraftState.cmStep === "core"
              ? `
                <label class="cm-task-editor__field cm-task-editor__field--full">
                  <span class="cm-task-editor__label">${getRequiredFieldLabel("Description")}</span>
                  <input class="cm-task-editor__control" id="childCreatorDescriptionInput" type="text" maxlength="40" value="${escapeHtml(
                      childDraftState.description
                    )}" placeholder="Enter ${escapeHtml(taskLabel)} description" required>
                </label>
                <div class="cm-task-editor__grid">
                  <label class="cm-task-editor__field">
                    <span class="cm-task-editor__label">${getRequiredFieldLabel("Interval")}</span>
                    <input class="cm-task-editor__control" id="childCreatorCmIntervalHoursInput" type="number" min="0" step="any" value="${escapeHtml(
                      childDraftState.cmIntervalHours
                    )}" placeholder="Enter interval hours" required>
                  </label>
                  <label class="cm-task-editor__field">
                    <span class="cm-task-editor__label">${getRequiredFieldLabel("Duration")}</span>
                    <input class="cm-task-editor__control" id="childCreatorCmDurationHoursInput" type="number" min="0" step="any" value="${escapeHtml(
                      childDraftState.cmDurationHours
                    )}" placeholder="Enter duration hours" required>
                  </label>
                  <label class="cm-task-editor__field">
                    <span class="cm-task-editor__label">Interval Short Description</span>
                    <input class="cm-task-editor__control" id="childCreatorCmIntervalShortInput" type="text" value="${escapeHtml(
                      intervalShortDescription
                    )}" readonly>
                  </label>
                </div>
                <div class="cm-task-editor__grid">
                  <label class="cm-task-editor__field">
                    <span class="cm-task-editor__label">Offset</span>
                    <input class="cm-task-editor__control" id="childCreatorCmOffsetInput" type="number" step="any" value="${escapeHtml(
                      childDraftState.cmOffset
                    )}" placeholder="Enter offset">
                  </label>
                  <label class="cm-task-editor__field">
                    <span class="cm-task-editor__label">Ramp time</span>
                    <input class="cm-task-editor__control" id="childCreatorCmRampTimeInput" type="number" min="0" step="any" value="${escapeHtml(
                      childDraftState.cmRampTimeHours
                    )}" placeholder="Enter ramp time hours">
                  </label>
                  <label class="cm-task-editor__field">
                    <span class="cm-task-editor__label">Operation number</span>
                    <input class="cm-task-editor__control" id="childCreatorCmOperationNumberInput" type="number" min="0" step="1" value="${escapeHtml(
                      childDraftState.cmOperationNumber
                    )}" placeholder="Enter operation number">
                  </label>
                </div>
              `
              : `
                <div class="cm-task-editor__flags">
                  <label class="cm-task-editor__flag">
                    <input id="childCreatorCmIsEnabledInput" type="checkbox" ${childDraftState.cmIsEnabled ? "checked" : ""}>
                    <span>Is enabled</span>
                  </label>
                  ${
                    selectedChildType === "pm"
                      ? `
                        <label class="cm-task-editor__flag">
                          <input id="childCreatorCmIsFixedInput" type="checkbox" ${childDraftState.cmIsFixed ? "checked" : ""}>
                          <span>Is Fixed</span>
                        </label>
                        <label class="cm-task-editor__flag">
                          <input id="childCreatorCmIsSecondaryActionInput" type="checkbox" ${
                            childDraftState.cmIsSecondaryAction ? "checked" : ""
                          }>
                          <span>Is secondary action</span>
                        </label>
                      `
                      : ""
                  }
                </div>
                <div class="cm-task-editor__grid">
                  <label class="cm-task-editor__field">
                    <span class="cm-task-editor__label">Type</span>
                    <input class="cm-task-editor__control" id="childCreatorCmTaskTypeInput" type="text" maxlength="40" value="${escapeHtml(
                      childDraftState.cmTaskType
                    )}" placeholder="Enter type">
                  </label>
                  ${
                    selectedChildType === "pm"
                      ? `
                        <label class="cm-task-editor__field">
                          <span class="cm-task-editor__label">External operation cost</span>
                          <input class="cm-task-editor__control" id="childCreatorCmExternalOperationCostInput" type="number" min="0" step="any" value="${escapeHtml(
                            childDraftState.cmExternalOperationCost
                          )}" placeholder="Enter external cost">
                        </label>
                        <label class="cm-task-editor__field">
                          <span class="cm-task-editor__label">Maintenance Type</span>
                          <input class="cm-task-editor__control" id="childCreatorCmMaintenanceTypeInput" type="text" maxlength="40" value="${escapeHtml(
                            childDraftState.cmMaintenanceType
                          )}" placeholder="Enter maintenance type">
                        </label>
                      `
                      : `<div class="asset-child-creator__placeholder-cell" aria-hidden="true"></div>
                         <div class="asset-child-creator__placeholder-cell" aria-hidden="true"></div>`
                  }
                </div>
                <label class="cm-task-editor__field cm-task-editor__field--wide">
                  <span class="cm-task-editor__label">Labour duration</span>
                  <input class="cm-task-editor__control" id="childCreatorCmLabourDurationInput" type="number" min="0" step="any" value="${escapeHtml(
                      childDraftState.cmLabourDurationHours
                    )}" placeholder="Enter labour duration">
                </label>
                <section class="asset-child-creator__section cm-task-editor__resources">
                  <header class="asset-child-creator__section-head">
                    <strong class="asset-child-creator__section-title">Resources</strong>
                    <button class="cm-task-editor__resource-add" type="button" id="addCmResourceButton">Add resource</button>
                  </header>
                  <div class="cm-task-editor__resource-list">
                    ${cmResourceRows}
                  </div>
                </section>
                <section class="asset-child-creator__section cm-task-editor__resources">
                  <header class="asset-child-creator__section-head">
                    <strong class="asset-child-creator__section-title">Spare Parts Required</strong>
                    <button class="cm-task-editor__resource-add" type="button" id="addCmSparePartButton">Add spare part</button>
                  </header>
                  <div class="cm-task-editor__resource-list">
                    ${cmSparePartRows}
                  </div>
                </section>
                <section class="asset-child-creator__section cm-task-editor__resources">
                  <header class="asset-child-creator__section-head">
                    <strong class="asset-child-creator__section-title">Tools Required</strong>
                    <button class="cm-task-editor__resource-add" type="button" id="addCmToolButton">Add tool</button>
                  </header>
                  <div class="cm-task-editor__resource-list">
                    ${cmToolRows}
                  </div>
                </section>
                ${
                  selectedChildType === "cm" && !isEditingExistingTask
                    ? `
                      <div class="cm-task-editor__flags cm-task-editor__flags--footer">
                        <label class="cm-task-editor__flag">
                          <input id="childCreatorCopyToPmOnSaveInput" type="checkbox" ${childDraftState.copyToPmOnSave ? "checked" : ""}>
                          <span>Copy to PM on save</span>
                        </label>
                      </div>
                    `
                    : ""
                }
              `
          }
          </div>
        </section>
        <div class="asset-child-creator__actions">
          <button id="cancelChildCreatorButton" class="secondary-button" type="button">Cancel</button>
          ${
            childDraftState.cmStep === "core"
              ? `<button id="nextCmStepButton" class="primary-button" type="button" ${
                  (selectedChildType === "cm" ? isCmCoreDraftReady(childDraftState) : isPmCoreDraftReady(childDraftState)) ? "" : "disabled"
                }>Next</button>`
              : `<button id="backCmStepButton" class="secondary-button" type="button">Back</button>
                 <button id="createChildButton" class="primary-button" type="button" ${
                   isChildDraftReady() ? "" : "disabled"
                 }>${isEditingExistingTask ? "Save" : "Create"}</button>`
          }
        </div>
      </section>
    `;
    return;
  }
  if (showInsTaskEditor) {
    const insCode = getNextAutoGeneratedCode(nodeInfo.node, "ins");
    const intervalShortDescription = deriveCmIntervalShortDescription(childDraftState.insInterval);
    const insResourceRows =
      childDraftState.insResources.length > 0
        ? childDraftState.insResources
            .map(
              (resource, index) => `
                <div class="cm-task-editor__resource-row">
                  <label class="cm-task-editor__resource-field">
                    <span class="cm-task-editor__label">Resource type ${index + 1}</span>
                    <select data-ins-resource-field="resourceType" data-ins-resource-id="${resource.id}">
                      <option value="">Select resource type</option>
                      ${cmResourceTypeOptions
                        .map(
                          (option) =>
                            `<option value="${escapeHtml(option)}" ${resource.resourceType === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                        )
                        .join("")}
                    </select>
                  </label>
                  <label class="cm-task-editor__resource-field">
                    <span class="cm-task-editor__label">Duration (hours)</span>
                    <input data-ins-resource-field="durationHours" data-ins-resource-id="${resource.id}" type="number" min="0" step="any" value="${escapeHtml(
                      resource.durationHours
                    )}" placeholder="Enter duration">
                  </label>
                  <button class="cm-task-editor__resource-remove" type="button" data-remove-ins-resource="${resource.id}">Remove</button>
                </div>
              `
            )
            .join("")
        : `<p class="cm-task-editor__resource-empty">No resources added yet.</p>`;
    const insToolRows =
      childDraftState.insToolsRequired.length > 0
        ? childDraftState.insToolsRequired
            .map(
              (tool, index) => `
                <div class="cm-task-editor__resource-row cm-task-editor__resource-row--compact">
                  <label class="cm-task-editor__resource-field">
                    <span class="cm-task-editor__label">Tool ${index + 1}</span>
                    <select data-ins-tool-field="tool" data-ins-tool-id="${tool.id}">
                      <option value="">Select tool</option>
                      ${cmToolOptions
                        .map(
                          (option) => `<option value="${escapeHtml(option)}" ${tool.tool === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                        )
                        .join("")}
                    </select>
                  </label>
                  <button class="cm-task-editor__resource-remove" type="button" data-remove-ins-tool="${tool.id}">Remove</button>
                </div>
              `
            )
            .join("")
        : `<p class="cm-task-editor__resource-empty">No tools added yet.</p>`;
    childCreatorPanel.innerHTML = `
      <section class="asset-child-creator__form cm-task-editor">
        ${childTypeControl}
        <section class="asset-child-creator__section cm-task-editor__section">
          <header class="asset-child-creator__section-head">
            <strong class="asset-child-creator__section-title">Scheduled Inspection Task</strong>
          </header>
          <div class="cm-task-editor__stack">
            <div class="cm-task-editor__field cm-task-editor__field--full">
              <span class="cm-task-editor__label">${getRequiredFieldLabel("Name")}</span>
              <input
                class="cm-task-editor__control"
                id="childCreatorInsNameInput"
                type="text"
                maxlength="12"
                value="${escapeHtml(childDraftState.insName || insCode)}"
                placeholder="Enter INS code"
                required
              >
            </div>
            <div class="cm-task-editor__grid">
              <label class="cm-task-editor__field">
                <span class="cm-task-editor__label">Inspection Type</span>
                <select class="cm-task-editor__control" id="childCreatorInsInspectionTypeInput">
                  ${["Routine", "Condition monitoring", "ODR"]
                    .map(
                      (option) =>
                        `<option value="${escapeHtml(option)}" ${childDraftState.insInspectionType === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                    )
                    .join("")}
                </select>
              </label>
              <label class="cm-task-editor__field">
                <span class="cm-task-editor__label">${getRequiredFieldLabel("Task Type")}</span>
                <input class="cm-task-editor__control" id="childCreatorInsScheduledTaskTypeInput" type="text" value="${escapeHtml(
                  childDraftState.insScheduledTaskType
                )}" placeholder="Enter task type" required>
              </label>
              <label class="cm-task-editor__field cm-task-editor__field--full">
                <span class="cm-task-editor__label">${getRequiredFieldLabel("Task Description")}</span>
                <input class="cm-task-editor__control" id="childCreatorDescriptionInput" type="text" maxlength="80" value="${escapeHtml(
                  childDraftState.description
                )}" placeholder="Enter task description" required>
              </label>
            </div>
            <div class="cm-task-editor__flags">
              <label class="cm-task-editor__flag">
                <input id="childCreatorInsIsEnabledInput" type="checkbox" ${childDraftState.insIsEnabled ? "checked" : ""}>
                <span>Task Is Enabled</span>
              </label>
              <label class="cm-task-editor__flag">
                <input id="childCreatorInsDoNotDeliverInput" type="checkbox" ${childDraftState.insDoNotDeliver ? "checked" : ""}>
                <span>Task Do Not Deliver</span>
              </label>
            </div>
            <div class="cm-task-editor__grid">
              <label class="cm-task-editor__field">
                <span class="cm-task-editor__label">${getRequiredFieldLabel("Task Interval")}</span>
                <input class="cm-task-editor__control" id="childCreatorInsIntervalInput" type="number" min="0" step="any" value="${escapeHtml(
                  childDraftState.insInterval
                )}" placeholder="Enter interval" required>
              </label>
              <label class="cm-task-editor__field">
                <span class="cm-task-editor__label">Task Interval Short Description</span>
                <input class="cm-task-editor__control" id="childCreatorInsIntervalShortInput" type="text" value="${escapeHtml(
                  intervalShortDescription
                )}" readonly>
              </label>
              <label class="cm-task-editor__field">
                <span class="cm-task-editor__label">Task PF Interval</span>
                <input class="cm-task-editor__control" id="childCreatorInsPfIntervalInput" type="number" min="0" step="any" value="${escapeHtml(
                  childDraftState.insPfInterval
                )}" placeholder="Enter PF interval">
              </label>
            </div>
            <div class="cm-task-editor__grid">
              <label class="cm-task-editor__field">
                <span class="cm-task-editor__label">Task Detection Probability</span>
                <input class="cm-task-editor__control" id="childCreatorInsDetectionProbabilityInput" type="number" min="0" max="100" step="any" value="${escapeHtml(
                  childDraftState.insDetectionProbability
                )}" placeholder="Enter detection probability">
              </label>
              <label class="cm-task-editor__field">
                <span class="cm-task-editor__label">${getRequiredFieldLabel("Task Duration")}</span>
                <input class="cm-task-editor__control" id="childCreatorInsDurationInput" type="number" min="0" step="any" value="${escapeHtml(
                  childDraftState.insDuration
                )}" placeholder="Enter duration" required>
              </label>
              <label class="cm-task-editor__field">
                <span class="cm-task-editor__label">Task Labor Labor</span>
                <input class="cm-task-editor__control" id="childCreatorInsLaborLaborInput" type="number" min="0" step="any" value="${escapeHtml(
                  childDraftState.insLaborLabor
                )}" placeholder="Enter labour">
              </label>
            </div>
            <section class="asset-child-creator__section cm-task-editor__resources">
              <header class="asset-child-creator__section-head">
                <strong class="asset-child-creator__section-title">Labour Resources</strong>
                <button class="cm-task-editor__resource-add" type="button" id="addInsResourceButton">Add resource</button>
              </header>
              <div class="cm-task-editor__resource-list">
                ${insResourceRows}
              </div>
            </section>
            <section class="asset-child-creator__section cm-task-editor__resources">
              <header class="asset-child-creator__section-head">
                <strong class="asset-child-creator__section-title">Tools Required</strong>
                <button class="cm-task-editor__resource-add" type="button" id="addInsToolButton">Add tool</button>
              </header>
              <div class="cm-task-editor__resource-list">
                ${insToolRows}
              </div>
            </section>
          </div>
        </section>
        <div class="asset-child-creator__actions">
          <button id="cancelChildCreatorButton" class="secondary-button" type="button">Cancel</button>
          <button id="createChildButton" class="primary-button" type="button" ${isChildDraftReady() ? "" : "disabled"}>${isEditingExistingTask ? "Save" : "Create"}</button>
        </div>
      </section>
    `;
    return;
  }
  const definitionSectionMarkup = showEffectCatalogSelector
    ? `
        <section class="asset-child-creator__section">
          <header class="asset-child-creator__section-head">
            <strong class="asset-child-creator__section-title">Definition</strong>
          </header>
          <label class="field field--full">
            <span>${getRequiredFieldLabel("Effect")}</span>
            <select id="childCreatorEffectOptionInput" required>
              <option value="">Select effect</option>
              ${effectCatalog
                .map((option) => {
                  const isUsed = usedEffectCodes.has(option.code);
                  const isSelected = childDraftState.codeSegment === option.code;
                  return `<option value="${escapeHtml(option.code)}" ${isSelected ? "selected" : ""} ${
                    isUsed && !isSelected ? "disabled" : ""
                  }>${escapeHtml(getEffectCatalogLabel(option))}${isUsed && !isSelected ? " (Already added)" : ""}</option>`;
                })
                .join("")}
            </select>
          </label>
        </section>
      `
    : isAutoGeneratedChild
    ? `
        <section class="asset-child-creator__section">
          <header class="asset-child-creator__section-head">
            <strong class="asset-child-creator__section-title">Definition</strong>
          </header>
          <div class="asset-child-creator__preview-grid">
            <div class="asset-child-creator__preview-item">
              <span>Name</span>
              <strong>${escapeHtml(generatedDefinition?.fullCode || parentFullCode)}</strong>
            </div>
          </div>
          ${
            selectedChildType === "cause"
              ? `
                <label class="field field--full">
                  <span>${getRequiredFieldLabel("Component Name")}</span>
                  <input
                    id="childCreatorComponentNameInput"
                    type="text"
                    value="${escapeHtml(childDraftState.componentName)}"
                    placeholder="Enter component name"
                    required
                  >
                </label>
              `
              : ""
          }
          <label class="field field--full">
            <span>${getRequiredFieldLabel(getChildDescriptionLabel(selectedChildType))}</span>
            <input
              id="childCreatorDescriptionInput"
              type="text"
              value="${escapeHtml(childDraftState.description)}"
              placeholder="Enter ${escapeHtml(getNodeLabel({ type: selectedChildType }).toLowerCase())} description"
              required
            >
          </label>
        </section>
      `
    : `
        <section class="asset-child-creator__section">
          <header class="asset-child-creator__section-head">
            <strong class="asset-child-creator__section-title">Definition</strong>
          </header>
          <div class="asset-child-creator__row-grid">
            <label class="field">
              <span>${getRequiredFieldLabel("Name")}</span>
              <div class="hierarchy-code-field ${inheritedPrefix ? "has-prefix" : ""}">
                <span class="hierarchy-code-field__prefix">${escapeHtml(inheritedPrefix)}</span>
                <input id="childCreatorNameInput" type="text" value="${escapeHtml(
                  childDraftState.codeSegment
                )}" placeholder="Enter code segment" required>
              </div>
            </label>
            <label class="field">
              <span>${getRequiredFieldLabel("Description")}</span>
              <input id="childCreatorDescriptionInput" type="text" value="${escapeHtml(
                childDraftState.description
              )}" placeholder="Enter description, e.g. Primary Crusher" required>
            </label>
          </div>
        </section>
      `;
  const equipmentFieldsMarkup = showEquipmentFields
    ? `
        <section class="asset-child-creator__section">
          <header class="asset-child-creator__section-head">
            <strong class="asset-child-creator__section-title">Equipment Context</strong>
          </header>
          <div class="asset-child-creator__row-grid">
            <label class="field">
              <span>Equipment Function</span>
              <input id="childCreatorEquipmentFunctionInput" type="text" value="${escapeHtml(childDraftState.equipmentFunction)}" placeholder="Enter equipment function">
            </label>
            <label class="field">
              <span>Type of Equipment</span>
              <input id="childCreatorEquipmentTypeInput" type="text" value="${escapeHtml(childDraftState.equipmentType)}" placeholder="Enter equipment type">
            </label>
          </div>
          <label class="field field--full">
            <span>Operating Context</span>
            <textarea id="childCreatorOperatingContextInput" rows="3" placeholder="Add operating context">${escapeHtml(childDraftState.operatingContext)}</textarea>
          </label>
        </section>
        <section class="asset-child-creator__section">
          <header class="asset-child-creator__section-head">
            <strong class="asset-child-creator__section-title">Consequence</strong>
          </header>
          <div class="asset-child-creator__row-grid">
            <label class="field">
              <span>Effect</span>
              <select id="childCreatorEffectInput">
                <option value="">Select effect</option>
                ${effectPerHourDownOptions
                  .map(
                    (option) => `<option value="${escapeHtml(option)}" ${childDraftState.effectPerHourDown === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                  )
                  .join("")}
              </select>
            </label>
            <label class="field">
              <span>Demand Frequency</span>
              <select id="childCreatorDemandFrequencyInput">
                <option value="">Select demand frequency</option>
                ${demandFrequencyOptions
                  .map(
                    (option) => `<option value="${escapeHtml(option)}" ${childDraftState.demandFrequency === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                  )
                  .join("")}
              </select>
            </label>
          </div>
          <div class="asset-child-creator__row-grid asset-child-creator__row-grid--triple">
            <label class="field">
              <span>Redundancy</span>
              <select id="childCreatorRedundancyModeInput">
                ${redundancyOptions
                  .map(
                    (option) => `<option value="${escapeHtml(option)}" ${childDraftState.redundancyMode === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                  )
                  .join("")}
              </select>
            </label>
            ${
              childDraftState.redundancyMode === "Custom"
                ? `
                    <label class="field">
                      <span>Redundancy %</span>
                      <input id="childCreatorRedundancyPercentInput" type="number" min="0" max="100" step="1" value="${escapeHtml(childDraftState.redundancyPercent)}" placeholder="Enter percent">
                    </label>
                  `
                : `<div class="asset-child-creator__placeholder-cell" aria-hidden="true"></div>`
            }
            <label class="field">
              <span>Major Accident Event Category (MAE)</span>
              <select id="childCreatorMaeCategoryInput">
                ${maeCategoryOptions
                  .map(
                    (option) => `<option value="${escapeHtml(option)}" ${childDraftState.maeCategory === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                  )
                  .join("")}
              </select>
            </label>
          </div>
          <div class="asset-child-creator__row-grid">
            <label class="field">
              <span>Criticality</span>
              <select id="childCreatorCriticalityInput">
                <option value="">Select criticality</option>
                ${criticalityOptions
                  .map(
                    (option) => `<option value="${escapeHtml(option)}" ${childDraftState.criticality === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                  )
                  .join("")}
              </select>
            </label>
          </div>
        </section>
        <section class="asset-child-creator__section">
          <header class="asset-child-creator__section-head">
            <strong class="asset-child-creator__section-title">Linked References</strong>
            <span class="asset-child-creator__section-note">Connections will activate once FMEA and baseline strategy modules are enabled.</span>
          </header>
          <div class="asset-child-creator__references-grid">
            <button class="asset-child-creator__disabled-action" type="button" disabled>Link to FMEA</button>
            <label class="asset-child-creator__reference-field">
              <span>Baseline Strategy</span>
              <select disabled>
                <option>Available later</option>
              </select>
            </label>
            <button class="asset-child-creator__disabled-action" type="button" disabled>Attach Manuals</button>
          </div>
        </section>
      `
    : "";

  childCreatorPanel.innerHTML = `
    <section class="asset-child-creator__form">
      ${childTypeControl}
      ${definitionSectionMarkup}
      ${
        selectedChildType === "cause"
          ? renderCauseConfigFields(childDraftState, {
              idPrefix: "childCreatorCause",
              isCreateMode: true,
              isAdvancedOpen: childDraftState.causeAdvancedOpen,
              isAlarmOpen: childDraftState.causeAlarmOpen,
            })
          : ""
      }
      ${equipmentFieldsMarkup}
      <div class="asset-child-creator__actions">
        <button id="cancelChildCreatorButton" class="secondary-button" type="button">Cancel</button>
        <button id="createChildButton" class="primary-button" type="button" ${isChildDraftReady() ? "" : "disabled"}>${isEditingExistingTask ? "Save" : "Create"}</button>
      </div>
    </section>
  `;
};

const renderCauseConfigFields = (draft, options = {}) => {
  const idPrefix = options.idPrefix || "causeConfig";
  const isCreateMode = Boolean(options.isCreateMode);
  const isAdvancedOpen = Boolean(options.isAdvancedOpen);
  const isAlarmOpen = Boolean(options.isAlarmOpen);
  const distributionOptions = ["Age related", "Random (non age related)"];
  return `
    <section class="asset-child-creator__section cause-config-panel">
      <header class="asset-child-creator__section-head">
        <strong class="asset-child-creator__section-title">Failure Mode Configuration</strong>
      </header>
      <div class="cause-config-panel__matrix cause-config-panel__matrix--simple">
        <div class="cause-config-panel__column">
          <label class="field">
            <span>Distribution</span>
            <select id="${idPrefix}DistributionInput">
              ${distributionOptions
                .map(
                  (option) =>
                    `<option value="${escapeHtml(option)}" ${draft.distribution === option ? "selected" : ""}>${escapeHtml(option)}</option>`
                  )
                .join("")}
            </select>
          </label>
          <label class="field">
            <span>MTTF</span>
            <input id="${idPrefix}MttfInput" type="number" min="0" step="any" value="${escapeHtml(draft.mttf)}" placeholder="Enter MTTF">
          </label>
          <label class="field cause-config-panel__checkbox-field">
            <span>Is Dormant</span>
            <input id="${idPrefix}IsDormantInput" type="checkbox" ${draft.isDormant ? "checked" : ""}>
          </label>
        </div>
      </div>
      <div class="cause-config-panel__advanced">
        <button
          id="${idPrefix}AdvancedToggleButton"
          class="cause-config-panel__advanced-toggle"
          type="button"
          aria-expanded="${isAdvancedOpen ? "true" : "false"}"
          data-toggle-cause-advanced="${isCreateMode ? "create" : "edit"}"
        >
          ${isAdvancedOpen ? "Hide advanced configuration" : "Advanced configuration"}
        </button>
        ${
          isAdvancedOpen
            ? `
              <div class="cause-config-panel__matrix">
                <div class="cause-config-panel__column">
                  <label class="field">
                    <span>Weibull Set</span>
                    <input id="${idPrefix}WeibullSetInput" type="text" value="${escapeHtml(draft.weibullSet)}" placeholder="Enter Weibull set">
                  </label>
                  <label class="field">
                    <span>Standard Deviation</span>
                    <input id="${idPrefix}StandardDeviationInput" type="number" min="0" step="any" value="${escapeHtml(
                      draft.standardDeviation
                    )}" placeholder="Enter standard deviation">
                  </label>
                  <label class="field">
                    <span>Demand Frequency</span>
                    <input id="${idPrefix}DemandFrequencyInput" type="number" min="0" step="any" value="${escapeHtml(
                      draft.causeDemandFrequency
                    )}" placeholder="Enter demand frequency">
                  </label>
                  <label class="field">
                    <span>Standby Failure %</span>
                    <input id="${idPrefix}StandbyFailurePercentInput" type="number" min="0" step="any" value="${escapeHtml(
                      draft.standbyFailurePercent
                    )}" placeholder="Enter standby failure percent">
                  </label>
                  <label class="field">
                    <span>Standby Ageing %</span>
                    <input id="${idPrefix}StandbyAgeingPercentInput" type="number" min="0" step="any" value="${escapeHtml(
                      draft.standbyAgeingPercent
                    )}" placeholder="Enter standby ageing percent">
                  </label>
                  <div class="cause-config-panel__load-action">
                    <button class="asset-child-creator__disabled-action" type="button" disabled>Load failure distribution</button>
                  </div>
                </div>
                <div class="cause-config-panel__column">
                  <label class="field">
                    <span>Eta 1</span>
                    <input id="${idPrefix}Eta1Input" type="number" min="0" step="any" value="${escapeHtml(draft.eta1)}" placeholder="Enter Eta 1">
                  </label>
                  <label class="field">
                    <span>Beta 1</span>
                    <input id="${idPrefix}Beta1Input" type="number" min="0" step="any" value="${escapeHtml(draft.beta1)}" placeholder="Enter Beta 1">
                  </label>
                  <label class="field">
                    <span>Gamma 1</span>
                    <input id="${idPrefix}Gamma1Input" type="number" min="0" step="any" value="${escapeHtml(draft.gamma1)}" placeholder="Enter Gamma 1">
                  </label>
                  <label class="field">
                    <span>Eta 2</span>
                    <input id="${idPrefix}Eta2Input" type="number" min="0" step="any" value="${escapeHtml(draft.eta2)}" placeholder="Enter Eta 2">
                  </label>
                  <label class="field">
                    <span>Beta 2</span>
                    <input id="${idPrefix}Beta2Input" type="number" min="0" step="any" value="${escapeHtml(draft.beta2)}" placeholder="Enter Beta 2">
                  </label>
                  <label class="field">
                    <span>Gamma 2</span>
                    <input id="${idPrefix}Gamma2Input" type="number" min="0" step="any" value="${escapeHtml(draft.gamma2)}" placeholder="Enter Gamma 2">
                  </label>
                  <label class="field">
                    <span>Eta 3</span>
                    <input id="${idPrefix}Eta3Input" type="number" min="0" step="any" value="${escapeHtml(draft.eta3)}" placeholder="Enter Eta 3">
                  </label>
                  <label class="field">
                    <span>Beta 3</span>
                    <input id="${idPrefix}Beta3Input" type="number" min="0" step="any" value="${escapeHtml(draft.beta3)}" placeholder="Enter Beta 3">
                  </label>
                  <label class="field">
                    <span>Gamma 3</span>
                    <input id="${idPrefix}Gamma3Input" type="number" min="0" step="any" value="${escapeHtml(draft.gamma3)}" placeholder="Enter Gamma 3">
                  </label>
                </div>
              </div>
            `
            : ""
        }
      </div>
      <div class="cause-config-panel__advanced">
        <button
          id="${idPrefix}AlarmToggleButton"
          class="cause-config-panel__advanced-toggle"
          type="button"
          aria-expanded="${isAlarmOpen ? "true" : "false"}"
          data-toggle-cause-alarm="${isCreateMode ? "create" : "edit"}"
        >
          ${isAlarmOpen ? "Hide alarm configuration" : "Alarm configuration"}
        </button>
        ${
          isAlarmOpen
            ? `
              <div class="cause-config-panel__matrix cause-config-panel__matrix--simple">
                <div class="cause-config-panel__column">
                  <label class="field cause-config-panel__checkbox-field">
                    <span>Alarm Is Enabled</span>
                    <input id="${idPrefix}AlarmIsEnabledInput" type="checkbox" ${draft.alarmIsEnabled ? "checked" : ""}>
                  </label>
                  <label class="field">
                    <span>Alarm Description</span>
                    <input id="${idPrefix}AlarmDescriptionInput" type="text" maxlength="40" value="${escapeHtml(
                      draft.alarmDescription
                    )}" placeholder="Enter alarm description">
                  </label>
                  <label class="field">
                    <span>Alarm PF Interval</span>
                    <input id="${idPrefix}AlarmPfIntervalInput" type="number" min="0" step="any" value="${escapeHtml(
                      draft.alarmPfInterval
                    )}" placeholder="Enter alarm PF interval">
                  </label>
                  <label class="field">
                    <span>Alarm Detection Probability</span>
                    <input id="${idPrefix}AlarmDetectionProbabilityInput" type="number" min="0" max="100" step="any" value="${escapeHtml(
                      draft.alarmDetectionProbability
                    )}" placeholder="Enter alarm detection probability">
                  </label>
                </div>
              </div>
            `
            : ""
        }
      </div>
    </section>
  `;
};

const renderCauseConfigEditor = (nodeInfo) => {
  if (!childCreatorPanel || !causeConfigState.draft) {
    return;
  }

  const draft = causeConfigState.draft;
  childCreatorPanel.hidden = false;
  childCreatorPanel.innerHTML = `
    <section class="asset-child-creator__form cause-config-panel__form">
      <section class="asset-child-creator__section">
        <header class="asset-child-creator__section-head">
          <strong class="asset-child-creator__section-title">Definition</strong>
        </header>
        <div class="asset-child-creator__preview-grid">
          <div class="asset-child-creator__preview-item">
            <span>Name</span>
            <strong>${escapeHtml(getNodeFullCode(nodeInfo.node, nodeInfo.path))}</strong>
          </div>
        </div>
        <label class="field field--full">
          <span>${getRequiredFieldLabel("Component Name")}</span>
          <input
            id="causeConfigComponentNameInput"
            type="text"
            value="${escapeHtml(draft.componentName)}"
            placeholder="Enter component name"
            required
          >
        </label>
        <label class="field field--full">
          <span>${getRequiredFieldLabel("Failure Mode Description")}</span>
          <input
            id="causeConfigDescriptionInput"
            type="text"
            value="${escapeHtml(draft.description)}"
            placeholder="Enter failure mode description"
            required
          >
        </label>
      </section>
      ${renderCauseConfigFields(draft, {
        idPrefix: "causeConfig",
        isCreateMode: false,
        isAdvancedOpen: causeConfigState.advancedOpen,
        isAlarmOpen: causeConfigState.alarmOpen,
      })}
      <div class="asset-child-creator__actions">
        <button id="resetCauseConfigButton" class="secondary-button" type="button">Cancel</button>
        <button id="saveCauseConfigButton" class="primary-button" type="button" ${isCauseConfigDraftReady(draft) ? "" : "disabled"}>Save</button>
      </div>
    </section>
  `;
};

const getEquipmentInfoValueMarkup = (label, value, isWide = false) => `
  <div class="equipment-info-panel__item ${isWide ? "equipment-info-panel__item--wide" : ""}">
    <span class="equipment-info-panel__label">${escapeHtml(label)}</span>
    <strong class="equipment-info-panel__value ${hasValue(value) ? "" : "is-empty"}">${escapeHtml(
      getDisplayValue(value, "Not set")
    )}</strong>
  </div>
`;

const renderEquipmentInfoView = (nodeInfo) => {
  if (!childCreatorPanel) {
    return;
  }

  const { node } = nodeInfo;
  const context = node.equipmentContext || defaultEquipmentContext();
  childCreatorPanel.hidden = false;
  childCreatorPanel.innerHTML = `
    <section class="equipment-info-panel">
      <section class="asset-child-creator__section">
        <header class="asset-child-creator__section-head">
          <strong class="asset-child-creator__section-title">Definition</strong>
        </header>
        <div class="equipment-info-panel__grid">
          ${getEquipmentInfoValueMarkup("Name", getNodeFullCode(node, nodeInfo.path))}
          ${getEquipmentInfoValueMarkup("Description", getNodeDescription(node))}
        </div>
      </section>
      <section class="asset-child-creator__section">
        <header class="asset-child-creator__section-head">
          <strong class="asset-child-creator__section-title">Equipment Context</strong>
        </header>
        <div class="equipment-info-panel__grid">
          ${getEquipmentInfoValueMarkup("Equipment Function", context.equipmentFunction)}
          ${getEquipmentInfoValueMarkup("Type of Equipment", context.equipmentType)}
          ${getEquipmentInfoValueMarkup("Operating Context", context.operatingContext, true)}
        </div>
      </section>
      <section class="asset-child-creator__section">
        <header class="asset-child-creator__section-head">
          <strong class="asset-child-creator__section-title">Consequence</strong>
        </header>
        <div class="equipment-info-panel__grid equipment-info-panel__grid--triple">
          ${getEquipmentInfoValueMarkup("Effect", context.effectPerHourDown)}
          ${getEquipmentInfoValueMarkup("Demand Frequency", context.demandFrequency)}
          ${getEquipmentInfoValueMarkup(
            "Redundancy",
            context.redundancyMode === "Custom" && hasValue(context.redundancyPercent)
              ? `${context.redundancyMode} (${context.redundancyPercent}%)`
              : context.redundancyMode
          )}
          ${getEquipmentInfoValueMarkup("Major Accident Event Category (MAE)", context.maeCategory)}
          ${getEquipmentInfoValueMarkup("Criticality", context.criticality)}
        </div>
      </section>
      <section class="asset-child-creator__section">
        <header class="asset-child-creator__section-head">
          <strong class="asset-child-creator__section-title">Linked References</strong>
        </header>
        <div class="equipment-info-panel__grid equipment-info-panel__grid--triple">
          ${getEquipmentInfoValueMarkup("Link to FMEA", "")}
          ${getEquipmentInfoValueMarkup("Baseline Strategy", "")}
          ${getEquipmentInfoValueMarkup("Attach Manuals", "")}
        </div>
      </section>
      <div class="asset-child-creator__actions">
        <button id="closeEquipmentInfoButton" class="secondary-button" type="button">Back</button>
        <button id="editEquipmentInfoButton" class="primary-button" type="button">Edit</button>
      </div>
    </section>
  `;
};

const renderEquipmentInfoEditor = (nodeInfo) => {
  if (!childCreatorPanel || !equipmentInfoState.draft) {
    return;
  }

  const draft = equipmentInfoState.draft;
  const parentPrefix = buildInheritedCodePrefix([getParentFullCodeFromPath(nodeInfo.path)]);
  childCreatorPanel.hidden = false;
  childCreatorPanel.innerHTML = `
    <section class="asset-child-creator__form">
      <section class="asset-child-creator__section">
        <header class="asset-child-creator__section-head">
          <strong class="asset-child-creator__section-title">Definition</strong>
        </header>
        <div class="asset-child-creator__row-grid">
          <label class="field">
            <span>${getRequiredFieldLabel("Name")}</span>
            <div class="hierarchy-code-field ${parentPrefix ? "has-prefix" : ""}">
              <span class="hierarchy-code-field__prefix">${escapeHtml(parentPrefix)}</span>
              <input id="equipmentInfoCodeSegmentInput" type="text" value="${escapeHtml(draft.codeSegment)}" placeholder="Enter code segment" required>
            </div>
          </label>
          <label class="field">
            <span>${getRequiredFieldLabel("Description")}</span>
            <input id="equipmentInfoDescriptionInput" type="text" value="${escapeHtml(draft.description)}" placeholder="Enter description, e.g. Main Belt Conveyor" required>
          </label>
        </div>
      </section>
      <section class="asset-child-creator__section">
        <header class="asset-child-creator__section-head">
          <strong class="asset-child-creator__section-title">Equipment Context</strong>
        </header>
        <div class="asset-child-creator__row-grid">
          <label class="field">
            <span>Equipment Function</span>
            <input id="equipmentInfoFunctionInput" type="text" value="${escapeHtml(draft.equipmentFunction)}" placeholder="Enter equipment function">
          </label>
          <label class="field">
            <span>Type of Equipment</span>
            <input id="equipmentInfoTypeInput" type="text" value="${escapeHtml(draft.equipmentType)}" placeholder="Enter equipment type">
          </label>
        </div>
        <label class="field field--full">
          <span>Operating Context</span>
          <textarea id="equipmentInfoOperatingContextInput" rows="3" placeholder="Add operating context">${escapeHtml(draft.operatingContext)}</textarea>
        </label>
      </section>
      <section class="asset-child-creator__section">
        <header class="asset-child-creator__section-head">
          <strong class="asset-child-creator__section-title">Consequence</strong>
        </header>
        <div class="asset-child-creator__row-grid">
          <label class="field">
            <span>Effect</span>
            <select id="equipmentInfoEffectInput">
              <option value="">Select effect</option>
              ${effectPerHourDownOptions.map((option) => `<option value="${escapeHtml(option)}" ${draft.effectPerHourDown === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Demand Frequency</span>
            <select id="equipmentInfoDemandFrequencyInput">
              <option value="">Select demand frequency</option>
              ${demandFrequencyOptions.map((option) => `<option value="${escapeHtml(option)}" ${draft.demandFrequency === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="asset-child-creator__row-grid asset-child-creator__row-grid--triple">
          <label class="field">
            <span>Redundancy</span>
            <select id="equipmentInfoRedundancyModeInput">
              ${redundancyOptions.map((option) => `<option value="${escapeHtml(option)}" ${draft.redundancyMode === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
            </select>
          </label>
          ${
            draft.redundancyMode === "Custom"
              ? `<label class="field">
                  <span>Redundancy %</span>
                  <input id="equipmentInfoRedundancyPercentInput" type="number" min="0" max="100" step="1" value="${escapeHtml(draft.redundancyPercent)}" placeholder="Enter percent">
                </label>`
              : `<div class="asset-child-creator__placeholder-cell" aria-hidden="true"></div>`
          }
          <label class="field">
            <span>Major Accident Event Category (MAE)</span>
            <select id="equipmentInfoMaeCategoryInput">
              ${maeCategoryOptions.map((option) => `<option value="${escapeHtml(option)}" ${draft.maeCategory === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="asset-child-creator__row-grid">
          <label class="field">
            <span>Criticality</span>
            <select id="equipmentInfoCriticalityInput">
              <option value="">Select criticality</option>
              ${criticalityOptions.map((option) => `<option value="${escapeHtml(option)}" ${draft.criticality === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
            </select>
          </label>
        </div>
      </section>
      <section class="asset-child-creator__section">
        <header class="asset-child-creator__section-head">
          <strong class="asset-child-creator__section-title">Linked References</strong>
          <span class="asset-child-creator__section-note">Connections will activate once FMEA and baseline strategy modules are enabled.</span>
        </header>
        <div class="asset-child-creator__references-grid">
          <button class="asset-child-creator__disabled-action" type="button" disabled>Link to FMEA</button>
          <label class="asset-child-creator__reference-field">
            <span>Baseline Strategy</span>
            <select disabled>
              <option>Available later</option>
            </select>
          </label>
          <button class="asset-child-creator__disabled-action" type="button" disabled>Attach Manuals</button>
        </div>
      </section>
      <div class="asset-child-creator__actions">
        <button id="cancelEquipmentInfoEditButton" class="secondary-button" type="button">Cancel</button>
        <button id="saveEquipmentInfoButton" class="primary-button" type="button" ${isEquipmentInfoDraftReady() ? "" : "disabled"}>Save</button>
      </div>
    </section>
  `;
};

const renderSelectedNodeActions = (nodeInfo, options = {}) => {
  if (!selectedNodeActions) {
    return;
  }

  const isAddMode = Boolean(options.isAddMode);
  const isEditorMode = Boolean(options.isEditorMode);
  const equipmentInfoMode = options.equipmentInfoMode || "closed";
  const showEquipmentInfoAction =
    Boolean(nodeInfo && nodeInfo.node.type === "equipment" && !isAddMode && !isEditorMode && equipmentInfoMode !== "edit");
  const showFailureModeAction =
    Boolean(nodeInfo && nodeInfo.node.type === "cause" && !isAddMode && !isEditorMode);
  const showTaskEditAction =
    Boolean(nodeInfo && ["cm", "pm", "ins"].includes(nodeInfo.node.type) && !isAddMode && !isEditorMode);
  const taskFailureModeNode = nodeInfo ? getNearestAncestorNodeFromPath(nodeInfo.path, "cause") : null;
  const showTaskFailureModeAction = Boolean(showTaskEditAction && taskFailureModeNode);
  const showDeleteAction =
    Boolean(nodeInfo && isNodeDeletable(nodeInfo.node) && !isAddMode && !isEditorMode && equipmentInfoMode !== "edit");

  if (!showEquipmentInfoAction && !showFailureModeAction && !showTaskEditAction && !showTaskFailureModeAction && !showDeleteAction) {
    selectedNodeActions.innerHTML = "";
    selectedNodeActions.hidden = true;
    return;
  }

  selectedNodeActions.hidden = false;
  selectedNodeActions.innerHTML = `
    ${
      showEquipmentInfoAction
        ? `
          <div class="maintenance-panel__menu">
            <button
              id="equipmentInfoMenuButton"
              class="secondary-button maintenance-info-action"
              type="button"
              aria-expanded="${equipmentInfoState.menuOpen && equipmentInfoState.nodeId === nodeInfo.node.id ? "true" : "false"}"
              data-toggle-equipment-info-menu="${escapeHtml(nodeInfo.node.id)}"
            >
              Info
            </button>
            ${
              equipmentInfoState.menuOpen && equipmentInfoState.nodeId === nodeInfo.node.id
                ? `
                  <div class="maintenance-panel__menu-popover" role="menu" aria-label="Equipment actions">
                    <button class="maintenance-panel__menu-item" type="button" role="menuitem" data-open-equipment-info="view" data-equipment-node="${escapeHtml(
                      nodeInfo.node.id
                    )}">
                      View equipment info
                    </button>
                    <button class="maintenance-panel__menu-item" type="button" role="menuitem" data-open-equipment-info="edit" data-equipment-node="${escapeHtml(
                      nodeInfo.node.id
                    )}">
                      Edit equipment info
                    </button>
                  </div>
                `
                : ""
            }
          </div>
        `
        : ""
    }
    ${
      showFailureModeAction
        ? `
          <button
            class="secondary-button"
            type="button"
            data-open-failure-mode-config="${escapeHtml(nodeInfo.node.id)}"
          >
            Edit failure mode
          </button>
        `
        : ""
    }
    ${
      showTaskEditAction
        ? `
          <button
            class="secondary-button"
            type="button"
            data-open-task-editor="${escapeHtml(nodeInfo.node.id)}"
          >
            Edit task
          </button>
        `
        : ""
    }
    ${
      showTaskFailureModeAction
        ? `
          <button
            class="secondary-button"
            type="button"
            data-open-failure-mode-config="${escapeHtml(taskFailureModeNode.id)}"
          >
            Edit failure mode
          </button>
        `
        : ""
    }
    ${
      showDeleteAction
        ? `
          <button
            id="deleteSelectedNodeButton"
            class="secondary-button maintenance-delete-action"
            type="button"
            data-delete-node="${escapeHtml(nodeInfo.node.id)}"
          >
            Delete
          </button>
        `
        : ""
    }
  `;
};

const getStrategyTableSelectionSummary = (nodeInfo, rowCount) => {
  if (!nodeInfo) {
    return "Select a node in the asset register to see related strategy rows.";
  }

  if (nodeInfo.node.type === "effect") {
    return rowCount
      ? `${rowCount} strategy row${rowCount === 1 ? "" : "s"} from the parent failure mode.`
      : "No strategy rows under the parent failure mode yet.";
  }

  return rowCount
    ? `${rowCount} strategy row${rowCount === 1 ? "" : "s"} under this selection.`
    : "No strategy rows under this selection yet.";
};
const renderStrategyTableCell = (row, column) => {
  const rawValue = row[column.key];
  const stringValue = typeof rawValue === "boolean" ? "" : String(rawValue || "");

  if (column.editable) {
    if (column.inputType === "checkbox") {
      return `
        <td class="strategy-grid__cell strategy-grid__cell--checkbox">
          <input
            class="strategy-grid__checkbox"
            type="checkbox"
            data-strategy-task-node="${escapeHtml(row.taskNodeId)}"
            data-strategy-column="${escapeHtml(column.key)}"
            ${rawValue ? "checked" : ""}
          >
        </td>
      `;
    }

    return `
      <td class="strategy-grid__cell strategy-grid__cell--editable">
        <input
          class="strategy-grid__field"
          type="${column.inputType === "number" ? "number" : "text"}"
          value="${escapeHtml(stringValue)}"
          data-strategy-task-node="${escapeHtml(row.taskNodeId)}"
          data-strategy-column="${escapeHtml(column.key)}"
          ${column.inputType === "number" ? 'step="any"' : ""}
        >
      </td>
    `;
  }

  if (typeof rawValue === "boolean") {
    return `
      <td class="strategy-grid__cell strategy-grid__cell--checkbox">
        <input class="strategy-grid__checkbox" type="checkbox" ${rawValue ? "checked" : ""} disabled>
      </td>
    `;
  }

  return `
    <td class="strategy-grid__cell" title="${escapeHtml(stringValue)}">
      <span class="strategy-grid__text ${stringValue ? "" : "is-empty"}">${escapeHtml(stringValue)}</span>
    </td>
  `;
};

const renderStrategyTableToolbar = (rows, filteredRows) => `
  <div class="strategy-table-toolbar">
    <label class="strategy-table-toolbar__search">
      <span>Search</span>
      <input
        id="strategyTableSearchInput"
        type="search"
        value="${escapeHtml(state.strategyTable.searchQuery)}"
        placeholder="Filter by asset, failure mode, component, or task"
      >
    </label>
    <label class="strategy-table-toolbar__filter">
      <span>Strategy type</span>
      <select id="strategyTableTypeFilterInput">
        ${strategyTypeFilterOptions
          .map(
            (option) => `<option value="${escapeHtml(option)}" ${state.strategyTable.strategyTypeFilter === option ? "selected" : ""}>${escapeHtml(option)}</option>`
          )
          .join("")}
      </select>
    </label>
    <div class="strategy-table-toolbar__summary">
      <strong>${filteredRows.length}</strong>
      <span>of ${rows.length} rows</span>
    </div>
    <div class="strategy-table-toolbar__options">
      <button
        id="strategyTableOptionsButton"
        class="secondary-button strategy-table-toolbar__button"
        type="button"
        aria-expanded="${state.strategyTable.optionsOpen ? "true" : "false"}"
      >
        Table options
      </button>
      ${
        state.strategyTable.optionsOpen
          ? `
            <div class="strategy-table-options" role="dialog" aria-label="Table options">
              <div class="strategy-table-options__header">
                <strong>Columns</strong>
                <button id="strategyTableResetColumnsButton" class="secondary-button strategy-table-options__reset" type="button">
                  Reset
                </button>
              </div>
              <div class="strategy-table-options__list">
                ${getOrderedStrategyTableColumns()
                  .map((column, index, columns) => {
                    const isVisible = state.strategyTable.visibleColumnKeys.includes(column.key);
                    return `
                      <div class="strategy-table-options__row">
                        <label class="strategy-table-options__toggle">
                          <input
                            type="checkbox"
                            data-strategy-column-visibility="${escapeHtml(column.key)}"
                            ${isVisible ? "checked" : ""}
                          >
                          <span>${escapeHtml(column.label)}</span>
                        </label>
                        <div class="strategy-table-options__move">
                          <button
                            class="secondary-button strategy-table-options__move-button"
                            type="button"
                            data-strategy-column-move="${escapeHtml(column.key)}"
                            data-direction="left"
                            ${index === 0 ? "disabled" : ""}
                          >
                            ←
                          </button>
                          <button
                            class="secondary-button strategy-table-options__move-button"
                            type="button"
                            data-strategy-column-move="${escapeHtml(column.key)}"
                            data-direction="right"
                            ${index === columns.length - 1 ? "disabled" : ""}
                          >
                            →
                          </button>
                        </div>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          `
          : ""
      }
    </div>
  </div>
`;

const renderStrategyRowActions = (row) => `
  <div class="strategy-row-menu">
    <button
      class="secondary-button strategy-row-menu__trigger"
      type="button"
      aria-label="Row actions"
      aria-expanded="${state.strategyTable.rowMenuTaskNodeId === row.taskNodeId ? "true" : "false"}"
      data-strategy-row-menu="${escapeHtml(row.taskNodeId)}"
    >
      ⋯
    </button>
    ${
      state.strategyTable.rowMenuTaskNodeId === row.taskNodeId
        ? `
          <div class="strategy-row-menu__popover" role="menu" aria-label="Strategy row actions">
            <button class="strategy-row-menu__item" type="button" role="menuitem" data-open-task-editor="${escapeHtml(row.taskNodeId)}">
              Edit task
            </button>
            <button class="strategy-row-menu__item" type="button" role="menuitem" data-open-failure-mode-config="${escapeHtml(row.failureModeNodeId)}">
              Edit failure mode
            </button>
          </div>
        `
        : ""
    }
  </div>
`;

const renderStrategyDrafts = (nodeInfo) => {
  if (!strategyList) {
    return;
  }

  if (!nodeInfo) {
    strategyList.hidden = false;
    strategyList.innerHTML = `
      <article class="asset-workspace-empty asset-workspace-empty--soft">
        <strong>No asset selected</strong>
        <p>Select a node in the asset register to see strategies related to that system or asset.</p>
      </article>
    `;
    return;
  }

  const strategyRows = getStrategyTableRowsForSelection(nodeInfo);
  const filteredRows = getFilteredStrategyTableRows(strategyRows);
  const visibleColumns = getVisibleStrategyTableColumns();
  strategyList.hidden = false;
  strategyList.innerHTML = strategyRows.length
    ? `
        <section class="strategy-draft-list__section strategy-draft-list__section--table">
          ${renderStrategyTableToolbar(strategyRows, filteredRows)}
          <div class="strategy-surface__header strategy-surface__header--spread">
            <div>
              <strong>Strategies</strong>
              <span>${filteredRows.length} visible row${filteredRows.length === 1 ? "" : "s"} | Saves on change</span>
            </div>
          </div>
          <div class="strategy-grid__viewport">
            <table class="strategy-grid" aria-label="Strategy table">
              <thead>
                <tr>
                  ${visibleColumns
                    .map((column) => `<th scope="col" class="strategy-grid__head">${escapeHtml(column.label)}</th>`)
                    .join("")}
                  <th scope="col" class="strategy-grid__head strategy-grid__head--actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${
                  filteredRows.length
                    ? filteredRows
                        .map(
                          (row) => `
                            <tr class="strategy-grid__row">
                              ${visibleColumns.map((column) => renderStrategyTableCell(row, column)).join("")}
                              <td class="strategy-grid__cell strategy-grid__cell--actions">
                                ${renderStrategyRowActions(row)}
                              </td>
                            </tr>
                          `
                        )
                        .join("")
                    : `
                        <tr class="strategy-grid__empty-row">
                          <td class="strategy-grid__empty-cell" colspan="${visibleColumns.length + 1}">
                            No rows match the current strategy filters.
                          </td>
                        </tr>
                      `
                }
              </tbody>
            </table>
          </div>
          <div class="strategy-grid__scrollbar" aria-hidden="true">
            <div class="strategy-grid__scrollbar-inner"></div>
          </div>
        </section>
      `
    : `
        <section class="strategy-draft-list__section">
          <div class="strategy-surface__header">
            <strong>Strategies</strong>
            <span>No strategy rows yet</span>
          </div>
          <article class="asset-workspace-empty asset-workspace-empty--soft">
            <strong>No strategy rows under this selection yet</strong>
            <p>Select another asset or add hierarchy children to keep building the strategy structure.</p>
          </article>
        </section>
      `;
  if (strategyRows.length) {
    syncStrategyTableScrollbars();
  }
};

const renderSelectedNodePanel = () => {
  const nodeInfo = getSelectedNodeInfo();
  if (!nodeInfo) {
    selectedNodeTypeLabel.textContent = "Strategies";
    backgroundDetailHeading.textContent = "No asset selected";
    backgroundDetailSummary.textContent = "Select a system or asset in the left register to view related strategies.";
    if (childCreatorPanel) {
      childCreatorPanel.hidden = true;
      childCreatorPanel.innerHTML = "";
    }
    renderSelectedNodeActions(null, { isAddMode: false, equipmentInfoMode: "closed" });
    closeChildCreator();
    closeEquipmentInfo();
    closeCauseConfig();
    renderStrategyDrafts(null);
    return;
  }

  const { node, path } = nodeInfo;
  const actions = getChildActions(node.type);
  const isEditingSelectedTask = Boolean(childDraftState.editNodeId) && childDraftState.editNodeId === node.id;
  if (childDraftState.editNodeId && childDraftState.editNodeId !== node.id) {
    closeChildCreator();
  }
  if (childDraftState.parentId && childDraftState.parentId !== node.id && !isEditingSelectedTask) {
    closeChildCreator();
  }
  if (equipmentInfoState.nodeId && equipmentInfoState.nodeId !== node.id) {
    closeEquipmentInfo();
  }
  if (causeConfigState.nodeId && causeConfigState.nodeId !== node.id) {
    closeCauseConfig();
  }
  const isAddMode = childDraftState.isOpen && childDraftState.parentId === node.id && actions.length > 0;
  const equipmentInfoMode =
    node.type === "equipment" && equipmentInfoState.nodeId === node.id ? equipmentInfoState.mode : "closed";
  const isCauseEditorMode = node.type === "cause" && causeConfigState.nodeId === node.id && causeConfigState.draft;
  const isTaskEditorMode = ["cm", "pm", "ins"].includes(node.type) && childDraftState.editNodeId === node.id && childDraftState.isOpen;

  if (isAddMode) {
    const selectedChildType = actions.some((action) => action.type === childDraftState.childType)
      ? childDraftState.childType
      : actions[0].type;
    selectedNodeTypeLabel.textContent = getChildActionLabel(selectedChildType);
    backgroundDetailHeading.textContent = getNodeDisplayName(node);
    backgroundDetailSummary.textContent = "";
    renderChildCreator(nodeInfo, actions);
    renderSelectedNodeActions(nodeInfo, { isAddMode: true, equipmentInfoMode: "closed" });
    if (strategyList) {
      strategyList.hidden = true;
      strategyList.innerHTML = "";
    }
    return;
  }

  if (equipmentInfoMode === "edit") {
    selectedNodeTypeLabel.textContent = "Edit Equipment Info";
    backgroundDetailHeading.textContent = getNodeDisplayName(node);
    backgroundDetailSummary.textContent = "";
    renderEquipmentInfoEditor(nodeInfo);
    renderSelectedNodeActions(nodeInfo, { isAddMode: false, equipmentInfoMode, isEditorMode: true });
    if (strategyList) {
      strategyList.hidden = true;
      strategyList.innerHTML = "";
    }
    return;
  }

  if (equipmentInfoMode === "view") {
    selectedNodeTypeLabel.textContent = "Equipment Info";
    backgroundDetailHeading.textContent = getNodeDisplayName(node);
    backgroundDetailSummary.textContent = "";
    renderEquipmentInfoView(nodeInfo);
    renderSelectedNodeActions(nodeInfo, { isAddMode: false, equipmentInfoMode });
    if (strategyList) {
      strategyList.hidden = true;
      strategyList.innerHTML = "";
    }
    return;
  }

  if (isCauseEditorMode) {
    selectedNodeTypeLabel.textContent = "Failure Mode Configuration";
    backgroundDetailHeading.textContent = getNodeDisplayName(node);
    backgroundDetailSummary.textContent = "";
    renderCauseConfigEditor(nodeInfo);
    renderSelectedNodeActions(nodeInfo, { isAddMode: false, equipmentInfoMode: "closed", isEditorMode: true });
    if (strategyList) {
      strategyList.hidden = true;
      strategyList.innerHTML = "";
    }
    return;
  }

  if (isTaskEditorMode && nodeInfo.parent) {
    const parentActions = getChildActions(nodeInfo.parent.type);
    selectedNodeTypeLabel.textContent = node.type === "cm" ? "CM" : node.type === "pm" ? "PM" : "INS";
    backgroundDetailHeading.textContent = getNodeDisplayName(node);
    backgroundDetailSummary.textContent = "";
    renderChildCreator(nodeInfo.parent ? findNodeInfo(state.hierarchy, nodeInfo.parent.id) : nodeInfo, parentActions);
    renderSelectedNodeActions(nodeInfo, { isAddMode: false, equipmentInfoMode: "closed", isEditorMode: true });
    if (strategyList) {
      strategyList.hidden = true;
      strategyList.innerHTML = "";
    }
    return;
  }

  selectedNodeTypeLabel.textContent = "Strategies";
  backgroundDetailHeading.textContent = getNodeDisplayName(node);
  backgroundDetailSummary.textContent = getStrategyTableSelectionSummary(
    nodeInfo,
    getFilteredStrategyTableRows(getStrategyTableRowsForSelection(nodeInfo)).length
  );
  if (childCreatorPanel) {
    childCreatorPanel.hidden = true;
    childCreatorPanel.innerHTML = "";
  }
  renderSelectedNodeActions(nodeInfo, { isAddMode: false, equipmentInfoMode: "closed" });
  renderStrategyDrafts(nodeInfo);
};

const renderWorkspaceState = () => {
  assetContextOverlay.hidden = !state.modalVisible;
  assetContextOverlay.classList.toggle("is-hidden", !state.modalVisible);
  assetContextOverlay.setAttribute("aria-hidden", String(!state.modalVisible));
  maintenanceWorkspace.classList.toggle("is-workspace-active", !state.modalVisible);
  assetWorkspace.classList.toggle("is-muted", state.modalVisible);
  applyWorkspaceLayoutStyles();
  if (assetHierarchyFilter) {
    assetHierarchyFilter.value = state.hierarchyFilter;
  }
  const isTreeView = state.layout.assetViewMode !== assetViewModes.list;
  assetHierarchyTreeViewButton?.classList.toggle("is-active", isTreeView);
  assetHierarchyTreeViewButton?.setAttribute("aria-pressed", String(isTreeView));
  assetHierarchyListViewButton?.classList.toggle("is-active", !isTreeView);
  assetHierarchyListViewButton?.setAttribute("aria-pressed", String(!isTreeView));
  renderHierarchyTree();
  renderSelectedNodePanel();
};

const renderAll = (options = {}) => {
  renderEntryForm({
    includeDynamic: options.includeEntryDynamic !== false,
  });
  renderWorkspaceState();
};

const updateStrategyTableTaskField = (taskNodeId, fieldKey, nextValue) => {
  const info = findNodeInfo(state.hierarchy, taskNodeId);
  if (!info || !["cm", "pm", "ins"].includes(info.node.type) || !strategyTableEditableColumnKeys.has(fieldKey)) {
    return;
  }

  if (fieldKey === "scheduledTaskDescription") {
    info.node.description = String(nextValue || "").trim();
  } else if (info.node.type === "ins") {
    const config = normalizeInsConfig(info.node.insConfig);
    switch (fieldKey) {
      case "scheduledTaskType":
        config.scheduledTaskType = String(nextValue || "").trim();
        break;
      case "scheduledTaskIsEnabled":
        config.isEnabled = Boolean(nextValue);
        break;
      case "scheduledTaskDoNotDeliver":
        config.doNotDeliver = Boolean(nextValue);
        break;
      case "scheduledTaskInterval":
        config.interval = String(nextValue || "").trim();
        config.intervalShortDescription = deriveCmIntervalShortDescription(config.interval);
        break;
      case "scheduledTaskPfInterval":
        config.pfInterval = String(nextValue || "").trim();
        break;
      case "scheduledTaskDetectionProbability":
        config.detectionProbability = String(nextValue || "").trim();
        break;
      case "scheduledTaskDuration":
        config.duration = String(nextValue || "").trim();
        break;
      case "scheduledTaskLaborLabor":
        config.laborLabor = String(nextValue || "").trim();
        break;
      default:
        break;
    }
    info.node.insConfig = config;
  } else {
    const config = info.node.type === "pm" ? normalizePmConfig(info.node.pmConfig) : normalizeCmConfig(info.node.cmConfig);
    switch (fieldKey) {
      case "scheduledTaskType":
        config.type = String(nextValue || "").trim();
        break;
      case "scheduledTaskIsEnabled":
        config.isEnabled = Boolean(nextValue);
        break;
      case "scheduledTaskDoNotDeliver":
        config.doNotDeliver = Boolean(nextValue);
        break;
      case "scheduledTaskInterval":
        config.intervalHours = String(nextValue || "").trim();
        config.intervalShortDescription = deriveCmIntervalShortDescription(config.intervalHours);
        break;
      case "scheduledTaskPfInterval":
        config.pfInterval = String(nextValue || "").trim();
        break;
      case "scheduledTaskDetectionProbability":
        config.detectionProbability = String(nextValue || "").trim();
        break;
      case "scheduledTaskDuration":
        config.durationHours = String(nextValue || "").trim();
        break;
      case "scheduledTaskLaborLabor":
        config.labourDurationHours = String(nextValue || "").trim();
        break;
      default:
        break;
    }
    if (info.node.type === "pm") {
      info.node.pmConfig = config;
    } else {
      info.node.cmConfig = config;
    }
  }

  persistDraftSilently();
  renderAll({
    includeEntryDynamic: false,
  });
};

const saveExistingTaskNode = (nodeId, draft) => {
  const info = findNodeInfo(state.hierarchy, nodeId);
  if (!info || !["cm", "pm", "ins"].includes(info.node.type)) {
    return;
  }

  if (info.node.type === "cm") {
    const normalizedCode = normalizeCmCodeInput(draft?.cmName || "");
    const siblings = (info.parent?.children || []).filter((child) => child.type === "cm" && child.id !== nodeId);
    if (!normalizedCode || getNormalizedCmSiblingCodes(siblings).has(normalizedCode)) {
      return;
    }
    info.node.code = normalizedCode;
    info.node.name = normalizedCode;
    info.node.description = String(draft?.description || "").trim();
    info.node.cmConfig = buildCmConfigFromDraft(draft);
  } else if (info.node.type === "pm") {
    const normalizedCode = normalizePmCodeInput(draft?.cmName || "");
    const siblings = (info.parent?.children || []).filter((child) => child.type === "pm" && child.id !== nodeId);
    if (!normalizedCode || getNormalizedPmSiblingCodes(siblings).has(normalizedCode)) {
      return;
    }
    info.node.code = normalizedCode;
    info.node.name = normalizedCode;
    info.node.description = String(draft?.description || "").trim();
    info.node.pmConfig = buildPmConfigFromDraft(draft);
  } else {
    const normalizedCode = normalizeInsCodeInput(draft?.insName || "");
    const siblings = (info.parent?.children || []).filter((child) => child.type === "ins" && child.id !== nodeId);
    if (!normalizedCode || getNormalizedInsSiblingCodes(siblings).has(normalizedCode)) {
      return;
    }
    info.node.code = normalizedCode;
    info.node.name = normalizedCode;
    info.node.description = String(draft?.description || "").trim();
    info.node.insConfig = buildInsConfigFromDraft(draft);
  }

  closeChildCreator();
  persistDraftSilently();
  renderAll({
    includeEntryDynamic: false,
  });
};

const createChildNode = (parentId, childType, draft) => {
  const info = findNodeInfo(state.hierarchy, parentId);
  if (!info) {
    return;
  }

  const parentFullCode = getNodeFullCode(info.node, info.path);
  const effectOption = childType === "effect" ? getEffectCatalogOption(draft?.codeSegment) : null;
  if (childType === "effect" && (!effectOption || getUsedEffectCodesForParent(info.node).has(effectOption.code))) {
    return;
  }

  const normalizedCmCode = childType === "cm" ? normalizeCmCodeInput(draft?.cmName || "") : "";
  if (childType === "cm" && (!normalizedCmCode || !isCmNameAvailableForParent(parentId, normalizedCmCode))) {
    return;
  }
  const normalizedPmCode = childType === "pm" ? normalizePmCodeInput(draft?.cmName || "") : "";
  if (childType === "pm" && (!normalizedPmCode || !isPmNameAvailableForParent(parentId, normalizedPmCode))) {
    return;
  }
  const normalizedInsCode = childType === "ins" ? normalizeInsCodeInput(draft?.insName || "") : "";
  if (childType === "ins" && (!normalizedInsCode || !isInsNameAvailableForParent(parentId, normalizedInsCode))) {
    return;
  }

  const codeSegment =
    childType === "effect"
      ? effectOption.code
      : childType === "cm"
        ? normalizedCmCode
      : childType === "pm"
        ? normalizedPmCode
      : childType === "ins"
        ? normalizedInsCode
      : autoGeneratedChildTypes.has(childType)
        ? getNextAutoGeneratedCode(info.node, childType)
        : sanitizeCodeSegment(draft?.codeSegment || "", childType, info.node.children);
  const fullCode = shortCodeHierarchyTypes.has(childType) ? codeSegment : joinInheritedCode(parentFullCode, codeSegment, childType);
  const description =
    childType === "effect"
      ? effectOption.description
      : String(draft?.description || "").trim();
  const equipmentContext =
    childType === "equipment"
      ? {
          equipmentFunction: String(draft?.equipmentFunction || "").trim(),
          equipmentType: String(draft?.equipmentType || "").trim(),
          effectPerHourDown: String(draft?.effectPerHourDown || "").trim(),
          demandFrequency: String(draft?.demandFrequency || "").trim(),
          redundancyMode: String(draft?.redundancyMode || "None").trim() || "None",
          redundancyPercent:
            String(draft?.redundancyMode || "") === "Custom" ? String(draft?.redundancyPercent || "").trim() : "",
          maeCategory: String(draft?.maeCategory || "No").trim() || "No",
          operatingContext: String(draft?.operatingContext || "").trim(),
          criticality: String(draft?.criticality || "").trim(),
        }
      : null;
  const failureConfig = childType === "cause" ? buildCauseFailureConfigFromDraft(draft) : null;
  const cmConfig = childType === "cm" ? buildCmConfigFromDraft(draft) : null;
  const pmConfig = childType === "pm" ? buildPmConfigFromDraft(draft) : null;
  const insConfig = childType === "ins" ? buildInsConfigFromDraft(draft) : null;
  const nodeName = shortCodeHierarchyTypes.has(childType) ? codeSegment : fullCode;
  const nextNode = createNode(childType, codeSegment, nodeName, description, equipmentContext, failureConfig, cmConfig, pmConfig, insConfig);
  info.node.children.push(nextNode);
  if (childType === "cm" && draft?.copyToPmOnSave) {
    const nextPmCode = getNextAutoGeneratedCode(info.node, "pm");
    const nextPmNode = createNode(
      "pm",
      nextPmCode,
      nextPmCode,
      description,
      null,
      null,
      null,
      {
        ...buildPmConfigFromDraft(draft),
      },
      null
    );
    info.node.children.push(nextPmNode);
  }
  setNodeCollapsed(parentId, false);
  state.selectedNodeId = nextNode.id;
  if (childType === "cause") {
    causeConfigState = {
      nodeId: nextNode.id,
      draft: createCauseConfigDraft(nextNode),
      advancedOpen: false,
      alarmOpen: false,
    };
  }
  closeChildCreator();
  persistDraftSilently();
  renderAll();
  hideNotice();
};

const deleteHierarchyNode = (nodeId) => {
  const info = findNodeInfo(state.hierarchy, nodeId);
  if (!info || !isNodeDeletable(info.node)) {
    return;
  }

  const deletedNodeIds = collectNodeAndDescendantIds(info.node);
  const descendantCount = deletedNodeIds.size - 1;
  const linkedItemCount = state.maintainableItems.filter((item) => deletedNodeIds.has(item.nodeId)).length;
  const nodeName = getNodeDisplayName(info.node);
  const linkedItemText =
    linkedItemCount > 0
      ? `\n\nThis will also remove ${linkedItemCount} linked maintainable item${linkedItemCount === 1 ? "" : "s"}.`
      : "";
  const message =
    descendantCount > 0
      ? `Delete "${nodeName}" and its ${descendantCount} descendant${descendantCount === 1 ? "" : "s"}?${linkedItemText}`
      : `Delete "${nodeName}"?${linkedItemText}`;

  if (!window.confirm(message)) {
    return;
  }

  state.hierarchy = removeNodeFromHierarchy(state.hierarchy, nodeId);
  state.maintainableItems = state.maintainableItems.filter((item) => !deletedNodeIds.has(item.nodeId));
  state.collapsedNodeIds = state.collapsedNodeIds.filter((id) => !deletedNodeIds.has(id));

  if (childDraftState.parentId && deletedNodeIds.has(childDraftState.parentId)) {
    closeChildCreator();
  }
  if (equipmentInfoState.nodeId && deletedNodeIds.has(equipmentInfoState.nodeId)) {
    closeEquipmentInfo();
  }
  if (causeConfigState.nodeId && deletedNodeIds.has(causeConfigState.nodeId)) {
    closeCauseConfig();
  }

  const fallbackNodeId = info.parent?.id || getFirstNode(state.hierarchy)?.id || "";
  state.selectedNodeId = fallbackNodeId;

  persistDraftSilently();
  renderAll({
    includeEntryDynamic: false,
  });
};

const storedTheme = window.localStorage.getItem(themeStorageKey);
if (storedTheme === "dark" || storedTheme === "light") {
  applyTheme(storedTheme);
}

const storedSidebarState = window.localStorage.getItem(sidebarStorageKey);
applySidebarState(storedSidebarState === null ? true : storedSidebarState === "true");

themeToggle?.addEventListener("click", () => {
  const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  window.localStorage.setItem(themeStorageKey, nextTheme);
});

sidebarToggle?.addEventListener("click", () => {
  const nextCollapsed = !appShell?.classList.contains("sidebar-collapsed");
  applySidebarState(nextCollapsed);
  window.localStorage.setItem(sidebarStorageKey, String(nextCollapsed));
});

assetContextForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});

[
  [plantUnitNameInput, "plantUnit", "name"],
  [sectionSystemNameInput, "sectionSystem", "name"],
  [equipmentUnitNameInput, "equipmentUnit", "name"],
].forEach(([element, group, field]) => {
  element?.addEventListener("input", (event) => {
    state.entry[group][field] = event.target.value;

    if (isNodeBlank(state.entry.plantUnit)) {
      state.entry = defaultEntryState();
    }

    if (!hasNodeValue(state.entry.sectionSystem)) {
      state.entry.subsystems = [];
      resetEntryEquipmentUnit();
    }

    if (!hasNodeValue(state.entry.equipmentUnit)) {
      state.entry.hasSubunit = false;
      state.entry.subunit = { code: "", name: "" };
      state.entry.equipmentUnit.equipmentContext = defaultEquipmentContext();
      closeEntryEquipmentInfoPopup();
    }

    persistDraftSilently();
    renderAll();
    hideNotice();
  });
});

plantUnitCodeInput?.addEventListener("input", (event) => {
  state.entry.plantUnit.code = event.target.value;

  if (isNodeBlank(state.entry.plantUnit)) {
    state.entry = defaultEntryState();
  }

  if (!hasNodeValue(state.entry.sectionSystem)) {
    state.entry.subsystems = [];
    resetEntryEquipmentUnit();
  }

  if (!hasNodeValue(state.entry.equipmentUnit)) {
    state.entry.hasSubunit = false;
    state.entry.subunit = { code: "", name: "" };
    state.entry.equipmentUnit.equipmentContext = defaultEquipmentContext();
    closeEntryEquipmentInfoPopup();
  }

  persistDraftSilently();
  renderAll();
  hideNotice();
});

sectionSystemCodeInput?.addEventListener("input", (event) => {
  state.entry.sectionSystem.code = event.target.value;

  if (!hasNodeValue(state.entry.sectionSystem)) {
    state.entry.subsystems = [];
    resetEntryEquipmentUnit();
  }

  if (!hasNodeValue(state.entry.equipmentUnit)) {
    state.entry.hasSubunit = false;
    state.entry.subunit = { code: "", name: "" };
    state.entry.equipmentUnit.equipmentContext = defaultEquipmentContext();
    closeEntryEquipmentInfoPopup();
  }

  persistDraftSilently();
  renderAll();
  hideNotice();
});

equipmentUnitCodeInput?.addEventListener("input", (event) => {
  state.entry.equipmentUnit.code = event.target.value;

  if (!hasNodeValue(state.entry.equipmentUnit)) {
    state.entry.hasSubunit = false;
    state.entry.subunit = { code: "", name: "" };
    state.entry.equipmentUnit.equipmentContext = defaultEquipmentContext();
    closeEntryEquipmentInfoPopup();
  }

  persistDraftSilently();
  renderAll();
  hideNotice();
});

equipmentUnitMoreInfoButton?.addEventListener("click", () => {
  openEntryEquipmentInfoPopup();
  renderAll({
    includeEntryDynamic: false,
  });
});

equipmentEntryInfoPopup?.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !entryEquipmentInfoState.isOpen) {
    return;
  }

  if (target.id === "entryEquipmentInfoFunctionInput") {
    entryEquipmentInfoState.draft.equipmentFunction = target.value;
  }

  if (target.id === "entryEquipmentInfoTypeInput") {
    entryEquipmentInfoState.draft.equipmentType = target.value;
  }

  if (target.id === "entryEquipmentInfoOperatingContextInput") {
    entryEquipmentInfoState.draft.operatingContext = target.value;
  }

  if (target.id === "entryEquipmentInfoRedundancyPercentInput") {
    entryEquipmentInfoState.draft.redundancyPercent = target.value;
  }
});

equipmentEntryInfoPopup?.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !entryEquipmentInfoState.isOpen) {
    return;
  }

  if (target.id === "entryEquipmentInfoEffectInput") {
    entryEquipmentInfoState.draft.effectPerHourDown = target.value;
  }

  if (target.id === "entryEquipmentInfoDemandFrequencyInput") {
    entryEquipmentInfoState.draft.demandFrequency = target.value;
  }

  if (target.id === "entryEquipmentInfoRedundancyModeInput") {
    entryEquipmentInfoState.draft.redundancyMode = target.value;
    if (target.value !== "Custom") {
      entryEquipmentInfoState.draft.redundancyPercent = "";
    }
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  if (target.id === "entryEquipmentInfoMaeCategoryInput") {
    entryEquipmentInfoState.draft.maeCategory = target.value;
  }

  if (target.id === "entryEquipmentInfoCriticalityInput") {
    entryEquipmentInfoState.draft.criticality = target.value;
  }
});

equipmentEntryInfoPopup?.addEventListener("click", (event) => {
  const backdrop = event.target.closest(".asset-context-subdialog__backdrop");
  if (backdrop) {
    closeEntryEquipmentInfoPopup();
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const cancelButton = event.target.closest("#cancelEntryEquipmentInfoButton");
  if (cancelButton) {
    closeEntryEquipmentInfoPopup();
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const saveButton = event.target.closest("#saveEntryEquipmentInfoButton");
  if (saveButton) {
    saveEntryEquipmentInfoPopup();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !entryEquipmentInfoState.isOpen) {
    return;
  }

  closeEntryEquipmentInfoPopup();
  renderAll({
    includeEntryDynamic: false,
  });
});

subsystemList?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-entry-subsystem-id]");
  if (!input) {
    return;
  }

  const subsystem = state.entry.subsystems.find((item) => item.id === input.dataset.entrySubsystemId);
  if (!subsystem) {
    return;
  }

  if (input.dataset.entrySubsystemField === "code") {
    subsystem.code = input.value;
  } else {
    subsystem.name = input.value;
  }

  persistDraftSilently();
  renderAll({
    includeEntryDynamic: false,
  });
  hideNotice();
});

subsystemList?.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-entry-subsystem]");
  if (!removeButton) {
    return;
  }

  state.entry.subsystems = state.entry.subsystems.filter((item) => item.id !== removeButton.dataset.removeEntrySubsystem);
  persistDraftSilently();
  renderAll();
  hideNotice();
});

subunitContainer?.addEventListener("input", (event) => {
  const codeInput = event.target.closest("#entrySubunitCodeInput");
  const nameInput = event.target.closest("#entrySubunitNameInput");
  if (!codeInput && !nameInput) {
    return;
  }

  if (codeInput) {
    state.entry.subunit.code = codeInput.value;
  }

  if (nameInput) {
    state.entry.subunit.name = nameInput.value;
  }

  persistDraftSilently();
  renderAll({
    includeEntryDynamic: false,
  });
  hideNotice();
});

subunitContainer?.addEventListener("click", (event) => {
  const removeButton = event.target.closest("#removeEntrySubunitButton");
  if (!removeButton) {
    return;
  }

  state.entry.hasSubunit = false;
  state.entry.subunit = { code: "", name: "" };
  persistDraftSilently();
  renderAll();
  hideNotice();
});

addSubsystemButton?.addEventListener("click", () => {
  state.entry.subsystems.push({
    id: createId("entry-subsystem"),
    code: "",
    name: "",
  });
  persistDraftSilently();
  renderAll();
  hideNotice();
});

addSubunitButton?.addEventListener("click", () => {
  state.entry.hasSubunit = true;
  persistDraftSilently();
  renderAll();
  hideNotice();
});

continueButton?.addEventListener("click", () => {
  if (!isEntryReady()) {
    return;
  }

  if (!state.hierarchy.length) {
    const nextHierarchy = buildInitialHierarchyFromEntry();
    state.hierarchy = nextHierarchy.hierarchy;
    state.selectedNodeId = nextHierarchy.selectedNodeId;
  }

  state.modalVisible = false;
  persistDraft();
  renderAll();
});

saveDraftButton?.addEventListener("click", () => {
  persistDraft("Draft saved.");
});

assetWorkspacePaneResizeHandle?.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) {
    return;
  }

  if (event.target.closest("#assetWorkspaceCollapseToggle")) {
    return;
  }

  event.preventDefault();
  beginLayoutResize("pane", event.clientX);
});

assetWorkspaceCollapseToggle?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  toggleHierarchyPaneCollapse();
});

assetRegisterColumnResizeHandle?.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) {
    return;
  }

  event.preventDefault();
  beginLayoutResize("column", event.clientX);
});

assetHierarchyTreeViewButton?.addEventListener("click", () => {
  if (state.layout.assetViewMode === assetViewModes.tree) {
    return;
  }

  state.layout = normalizeLayoutState({
    ...state.layout,
    assetViewMode: assetViewModes.tree,
  });
  persistDraftSilently();
  renderWorkspaceState();
});

assetHierarchyListViewButton?.addEventListener("click", () => {
  if (state.layout.assetViewMode === assetViewModes.list) {
    return;
  }

  state.layout = normalizeLayoutState({
    ...state.layout,
    assetViewMode: assetViewModes.list,
  });
  persistDraftSilently();
  renderWorkspaceState();
});

assetHierarchyFilter?.addEventListener("input", (event) => {
  state.hierarchyFilter = event.target.value;
  renderWorkspaceState();
});

assetHierarchyFilter?.addEventListener("search", (event) => {
  state.hierarchyFilter = event.target.value;
  renderWorkspaceState();
});

assetHierarchyTree?.addEventListener("click", (event) => {
  const collapseButton = event.target.closest("[data-toggle-collapse]");
  if (collapseButton) {
    const nodeId = collapseButton.dataset.toggleCollapse;
    setNodeCollapsed(nodeId, !isNodeCollapsed(nodeId));
    persistDraftSilently();
    renderWorkspaceState();
    return;
  }

  const addChildButton = event.target.closest("[data-open-child-creator]");
  if (addChildButton) {
    event.preventDefault();
    event.stopPropagation();
    openChildCreator(addChildButton.dataset.openChildCreator);
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  if (event.target.closest(".asset-register-row__checkbox")) {
    return;
  }

  const selectButton = event.target.closest("[data-select-node]");
  if (selectButton) {
    state.selectedNodeId = selectButton.dataset.selectNode;
    persistDraftSilently();
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }
});

const syncCauseFailureDraftField = (draft, target) => {
  if (!(target instanceof HTMLElement) || !draft) {
    return false;
  }

  const id = target.id || "";
  const fieldMappings = [
    ["ComponentNameInput", "componentName"],
    ["DistributionInput", "distribution"],
    ["WeibullSetInput", "weibullSet"],
    ["MttfInput", "mttf"],
    ["StandardDeviationInput", "standardDeviation"],
    ["DemandFrequencyInput", "causeDemandFrequency"],
    ["StandbyFailurePercentInput", "standbyFailurePercent"],
    ["StandbyAgeingPercentInput", "standbyAgeingPercent"],
    ["Eta1Input", "eta1"],
    ["Beta1Input", "beta1"],
    ["Gamma1Input", "gamma1"],
    ["Eta2Input", "eta2"],
    ["Beta2Input", "beta2"],
    ["Gamma2Input", "gamma2"],
    ["Eta3Input", "eta3"],
    ["Beta3Input", "beta3"],
    ["Gamma3Input", "gamma3"],
    ["AlarmDescriptionInput", "alarmDescription"],
    ["AlarmPfIntervalInput", "alarmPfInterval"],
    ["AlarmDetectionProbabilityInput", "alarmDetectionProbability"],
  ];

  for (const [suffix, field] of fieldMappings) {
    if (id.endsWith(suffix)) {
      draft[field] = target.value;
      return true;
    }
  }

  if (id.endsWith("IsDormantInput") && target instanceof HTMLInputElement) {
    draft.isDormant = target.checked;
    return true;
  }

  if (id.endsWith("AlarmIsEnabledInput") && target instanceof HTMLInputElement) {
    draft.alarmIsEnabled = target.checked;
    return true;
  }

  return false;
};

const syncChildCreatorDraftField = (target) => {
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const targetId = target.id || "";

  if (target.dataset.childTypeOption) {
    const nextChildType = target.dataset.childTypeOption;
    childDraftState = {
      ...defaultChildDraftState(),
      isOpen: true,
      parentId: childDraftState.parentId,
      childType: nextChildType,
      cmStep: "core",
      cmName: nextChildType === "cm" ? getDefaultCmDraftName(childDraftState.parentId) : nextChildType === "pm" ? getDefaultPmDraftName(childDraftState.parentId) : "",
      insName: nextChildType === "ins" ? getDefaultInsDraftName(childDraftState.parentId) : "",
      copyToPmOnSave: false,
    };
    renderSelectedNodePanel();
    return;
  }

  if (target.id === "childCreatorTypeInput") {
    childDraftState.childType = target.value;
  }

  if (target.id === "childCreatorNameInput") {
    childDraftState.codeSegment = target.value;
  }

  if (target.id === "childCreatorEffectOptionInput") {
    const effectOption = getEffectCatalogOption(target.value);
    childDraftState.codeSegment = effectOption?.code || "";
    childDraftState.description = effectOption?.description || "";
  }

  if (target.id === "childCreatorCmIntervalHoursInput") {
    childDraftState.cmIntervalHours = target.value;
    childDraftState.cmIntervalShortDescription = deriveCmIntervalShortDescription(target.value);
    const intervalShortInput = childCreatorPanel?.querySelector("#childCreatorCmIntervalShortInput");
    if (intervalShortInput) {
      intervalShortInput.value = childDraftState.cmIntervalShortDescription;
    }
  }

  if (target.id === "childCreatorCmDurationHoursInput") {
    childDraftState.cmDurationHours = target.value;
  }

  if (target.id === "childCreatorCmNameInput") {
    childDraftState.cmName = target.value;
  }

  if (target.id === "childCreatorCopyToPmOnSaveInput" && target instanceof HTMLInputElement) {
    childDraftState.copyToPmOnSave = target.checked;
  }

  if (target.id === "childCreatorCmOffsetInput") {
    childDraftState.cmOffset = target.value;
  }

  if (target.id === "childCreatorCmRampTimeInput") {
    childDraftState.cmRampTimeHours = target.value;
  }

  if (target.id === "childCreatorCmOperationNumberInput") {
    childDraftState.cmOperationNumber = target.value;
  }

  if (target.id === "childCreatorCmIsEnabledInput" && target instanceof HTMLInputElement) {
    childDraftState.cmIsEnabled = target.checked;
  }

  if (target.id === "childCreatorCmIsFixedInput" && target instanceof HTMLInputElement) {
    childDraftState.cmIsFixed = target.checked;
  }

  if (target.id === "childCreatorCmIsSecondaryActionInput" && target instanceof HTMLInputElement) {
    childDraftState.cmIsSecondaryAction = target.checked;
  }

  if (target.id === "childCreatorCmExternalOperationCostInput") {
    childDraftState.cmExternalOperationCost = target.value;
  }

  if (target.id === "childCreatorCmMaintenanceTypeInput") {
    childDraftState.cmMaintenanceType = target.value;
  }

  if (target.id === "childCreatorCmTaskTypeInput") {
    childDraftState.cmTaskType = target.value;
  }

  if (target.id === "childCreatorCmLabourDurationInput") {
    childDraftState.cmLabourDurationHours = target.value;
  }

  if (target.id === "childCreatorInsNameInput") {
    childDraftState.insName = target.value;
  }

  if (target.id === "childCreatorInsInspectionTypeInput") {
    childDraftState.insInspectionType = target.value;
  }

  if (target.id === "childCreatorInsScheduledTaskTypeInput") {
    childDraftState.insScheduledTaskType = target.value;
  }

  if (target.id === "childCreatorInsIsEnabledInput" && target instanceof HTMLInputElement) {
    childDraftState.insIsEnabled = target.checked;
  }

  if (target.id === "childCreatorInsDoNotDeliverInput" && target instanceof HTMLInputElement) {
    childDraftState.insDoNotDeliver = target.checked;
  }

  if (target.id === "childCreatorInsIntervalInput") {
    childDraftState.insInterval = target.value;
    childDraftState.insIntervalShortDescription = deriveCmIntervalShortDescription(target.value);
    const intervalShortInput = childCreatorPanel?.querySelector("#childCreatorInsIntervalShortInput");
    if (intervalShortInput) {
      intervalShortInput.value = childDraftState.insIntervalShortDescription;
    }
  }

  if (target.id === "childCreatorInsPfIntervalInput") {
    childDraftState.insPfInterval = target.value;
  }

  if (target.id === "childCreatorInsDetectionProbabilityInput") {
    childDraftState.insDetectionProbability = target.value;
  }

  if (target.id === "childCreatorInsDurationInput") {
    childDraftState.insDuration = target.value;
  }

  if (target.id === "childCreatorInsLaborLaborInput") {
    childDraftState.insLaborLabor = target.value;
  }

  if (target instanceof HTMLElement && target.dataset.insResourceId && target.dataset.insResourceField) {
    childDraftState.insResources = childDraftState.insResources.map((resource) =>
      resource.id === target.dataset.insResourceId
        ? {
            ...resource,
            [target.dataset.insResourceField]: target.value,
          }
        : resource
    );
  }

  if (target instanceof HTMLElement && target.dataset.insToolId && target.dataset.insToolField) {
    childDraftState.insToolsRequired = childDraftState.insToolsRequired.map((tool) =>
      tool.id === target.dataset.insToolId
        ? {
            ...tool,
            [target.dataset.insToolField]: target.value,
          }
        : tool
    );
  }

  if (target instanceof HTMLElement && target.dataset.cmResourceId && target.dataset.cmResourceField) {
    childDraftState.cmResources = childDraftState.cmResources.map((resource) =>
      resource.id === target.dataset.cmResourceId
        ? {
            ...resource,
            [target.dataset.cmResourceField]: target.value,
          }
        : resource
    );
  }

  if (target instanceof HTMLElement && target.dataset.cmSparePartId && target.dataset.cmSparePartField) {
    childDraftState.cmSparePartsRequired = childDraftState.cmSparePartsRequired.map((part) =>
      part.id === target.dataset.cmSparePartId
        ? {
            ...part,
            [target.dataset.cmSparePartField]: target.value,
          }
        : part
    );
  }

  if (target instanceof HTMLElement && target.dataset.cmToolId && target.dataset.cmToolField) {
    childDraftState.cmToolsRequired = childDraftState.cmToolsRequired.map((tool) =>
      tool.id === target.dataset.cmToolId
        ? {
            ...tool,
            [target.dataset.cmToolField]: target.value,
          }
        : tool
    );
  }

  if (target.id === "childCreatorDescriptionInput") {
    childDraftState.description = target.value;
  }

  if (target.id === "causeConfigDescriptionInput" && causeConfigState.draft) {
    causeConfigState.draft.description = target.value;
  }

  if (targetId.startsWith("childCreator") && syncCauseFailureDraftField(childDraftState, target)) {
    const createButton = childCreatorPanel?.querySelector("#createChildButton");
    if (createButton) {
      createButton.disabled = !isChildDraftReady();
    }
    return;
  }

  if (targetId.startsWith("causeConfig") && syncCauseFailureDraftField(causeConfigState.draft, target)) {
    const saveCauseButton = childCreatorPanel?.querySelector("#saveCauseConfigButton");
    if (saveCauseButton) {
      saveCauseButton.disabled = !isCauseConfigDraftReady(causeConfigState.draft);
    }
    return;
  }

  if (target.id === "childCreatorEquipmentFunctionInput") {
    childDraftState.equipmentFunction = target.value;
  }

  if (target.id === "childCreatorEquipmentTypeInput") {
    childDraftState.equipmentType = target.value;
  }

  if (target.id === "childCreatorEffectInput") {
    childDraftState.effectPerHourDown = target.value;
  }

  if (target.id === "childCreatorDemandFrequencyInput") {
    childDraftState.demandFrequency = target.value;
  }

  if (target.id === "childCreatorRedundancyModeInput") {
    childDraftState.redundancyMode = target.value;
    if (target.value !== "Custom") {
      childDraftState.redundancyPercent = "";
    }
    renderSelectedNodePanel();
    return;
  }

  if (target.id === "childCreatorRedundancyPercentInput") {
    childDraftState.redundancyPercent = target.value;
  }

  if (target.id === "childCreatorMaeCategoryInput") {
    childDraftState.maeCategory = target.value;
  }

  if (target.id === "childCreatorOperatingContextInput") {
    childDraftState.operatingContext = target.value;
  }

  if (target.id === "childCreatorCriticalityInput") {
    childDraftState.criticality = target.value;
  }

  if (!equipmentInfoState.draft) {
    const createButton = childCreatorPanel?.querySelector("#createChildButton");
    if (createButton) {
      createButton.disabled = !isChildDraftReady();
    }
    const nextCmStepButton = childCreatorPanel?.querySelector("#nextCmStepButton");
    if (nextCmStepButton) {
      nextCmStepButton.disabled =
        childDraftState.childType === "cm" ? !isCmCoreDraftReady(childDraftState) : !isPmCoreDraftReady(childDraftState);
    }
    const saveCauseButton = childCreatorPanel?.querySelector("#saveCauseConfigButton");
    if (saveCauseButton) {
      saveCauseButton.disabled = !isCauseConfigDraftReady(causeConfigState.draft);
    }
    return;
  }

  if (target.id === "equipmentInfoCodeSegmentInput") {
    equipmentInfoState.draft.codeSegment = target.value;
  }

  if (target.id === "equipmentInfoDescriptionInput") {
    equipmentInfoState.draft.description = target.value;
  }

  if (target.id === "equipmentInfoFunctionInput") {
    equipmentInfoState.draft.equipmentFunction = target.value;
  }

  if (target.id === "equipmentInfoTypeInput") {
    equipmentInfoState.draft.equipmentType = target.value;
  }

  if (target.id === "equipmentInfoEffectInput") {
    equipmentInfoState.draft.effectPerHourDown = target.value;
  }

  if (target.id === "equipmentInfoDemandFrequencyInput") {
    equipmentInfoState.draft.demandFrequency = target.value;
  }

  if (target.id === "equipmentInfoRedundancyModeInput") {
    equipmentInfoState.draft.redundancyMode = target.value;
    if (target.value !== "Custom") {
      equipmentInfoState.draft.redundancyPercent = "";
    }
    renderSelectedNodePanel();
    return;
  }

  if (target.id === "equipmentInfoRedundancyPercentInput") {
    equipmentInfoState.draft.redundancyPercent = target.value;
  }

  if (target.id === "equipmentInfoMaeCategoryInput") {
    equipmentInfoState.draft.maeCategory = target.value;
  }

  if (target.id === "equipmentInfoOperatingContextInput") {
    equipmentInfoState.draft.operatingContext = target.value;
  }

  if (target.id === "equipmentInfoCriticalityInput") {
    equipmentInfoState.draft.criticality = target.value;
  }

  const createButton = childCreatorPanel?.querySelector("#createChildButton");
  if (createButton) {
    createButton.disabled = !isChildDraftReady();
  }
  const nextCmStepButton = childCreatorPanel?.querySelector("#nextCmStepButton");
  if (nextCmStepButton) {
    nextCmStepButton.disabled =
      childDraftState.childType === "cm" ? !isCmCoreDraftReady(childDraftState) : !isPmCoreDraftReady(childDraftState);
  }
  const saveButton = childCreatorPanel?.querySelector("#saveEquipmentInfoButton");
  if (saveButton) {
    saveButton.disabled = !isEquipmentInfoDraftReady();
  }
  const saveCauseButton = childCreatorPanel?.querySelector("#saveCauseConfigButton");
  if (saveCauseButton) {
    saveCauseButton.disabled = !isCauseConfigDraftReady(causeConfigState.draft);
  }
};

childCreatorPanel?.addEventListener("input", (event) => {
  syncChildCreatorDraftField(event.target);
});

childCreatorPanel?.addEventListener("change", (event) => {
  syncChildCreatorDraftField(event.target);
});

childCreatorPanel?.addEventListener("click", (event) => {
  const causeAdvancedToggleButton = event.target.closest("[data-toggle-cause-advanced]");
  if (causeAdvancedToggleButton) {
    const mode = causeAdvancedToggleButton.dataset.toggleCauseAdvanced;
    if (mode === "create") {
      childDraftState.causeAdvancedOpen = !childDraftState.causeAdvancedOpen;
    } else {
      causeConfigState = {
        ...causeConfigState,
        advancedOpen: !causeConfigState.advancedOpen,
      };
    }
    renderSelectedNodePanel();
    return;
  }

  const causeAlarmToggleButton = event.target.closest("[data-toggle-cause-alarm]");
  if (causeAlarmToggleButton) {
    const mode = causeAlarmToggleButton.dataset.toggleCauseAlarm;
    if (mode === "create") {
      childDraftState.causeAlarmOpen = !childDraftState.causeAlarmOpen;
    } else {
      causeConfigState = {
        ...causeConfigState,
        alarmOpen: !causeConfigState.alarmOpen,
      };
    }
    renderSelectedNodePanel();
    return;
  }

  const childTypeButton = event.target.closest("[data-child-type-option]");
  if (childTypeButton) {
    syncChildCreatorDraftField(childTypeButton);
    return;
  }

  const nextCmStepButton = event.target.closest("#nextCmStepButton");
  if (nextCmStepButton && (childDraftState.childType === "cm" ? isCmCoreDraftReady(childDraftState) : isPmCoreDraftReady(childDraftState))) {
    childDraftState.cmName =
      childDraftState.childType === "cm"
        ? normalizeCmCodeInput(childDraftState.cmName) || childDraftState.cmName
        : normalizePmCodeInput(childDraftState.cmName) || childDraftState.cmName;
    childDraftState.cmStep = "resources";
    renderSelectedNodePanel();
    return;
  }

  const backCmStepButton = event.target.closest("#backCmStepButton");
  if (backCmStepButton) {
    childDraftState.cmStep = "core";
    renderSelectedNodePanel();
    return;
  }

  const addCmResourceButton = event.target.closest("#addCmResourceButton");
  if (addCmResourceButton) {
    childDraftState.cmResources = [...childDraftState.cmResources, createCmResourceAssignment()];
    renderSelectedNodePanel();
    return;
  }

  const addCmSparePartButton = event.target.closest("#addCmSparePartButton");
  if (addCmSparePartButton) {
    childDraftState.cmSparePartsRequired = [...childDraftState.cmSparePartsRequired, createCmSparePartAssignment()];
    renderSelectedNodePanel();
    return;
  }

  const addCmToolButton = event.target.closest("#addCmToolButton");
  if (addCmToolButton) {
    childDraftState.cmToolsRequired = [...childDraftState.cmToolsRequired, createCmToolAssignment()];
    renderSelectedNodePanel();
    return;
  }

  const addInsResourceButton = event.target.closest("#addInsResourceButton");
  if (addInsResourceButton) {
    childDraftState.insResources = [...childDraftState.insResources, createInsResourceAssignment()];
    renderSelectedNodePanel();
    return;
  }

  const addInsToolButton = event.target.closest("#addInsToolButton");
  if (addInsToolButton) {
    childDraftState.insToolsRequired = [...childDraftState.insToolsRequired, createInsToolAssignment()];
    renderSelectedNodePanel();
    return;
  }

  const removeCmResourceButton = event.target.closest("[data-remove-cm-resource]");
  if (removeCmResourceButton) {
    childDraftState.cmResources = childDraftState.cmResources.filter(
      (resource) => resource.id !== removeCmResourceButton.dataset.removeCmResource
    );
    renderSelectedNodePanel();
    return;
  }

  const removeCmSparePartButton = event.target.closest("[data-remove-cm-spare-part]");
  if (removeCmSparePartButton) {
    childDraftState.cmSparePartsRequired = childDraftState.cmSparePartsRequired.filter(
      (part) => part.id !== removeCmSparePartButton.dataset.removeCmSparePart
    );
    renderSelectedNodePanel();
    return;
  }

  const removeCmToolButton = event.target.closest("[data-remove-cm-tool]");
  if (removeCmToolButton) {
    childDraftState.cmToolsRequired = childDraftState.cmToolsRequired.filter(
      (tool) => tool.id !== removeCmToolButton.dataset.removeCmTool
    );
    renderSelectedNodePanel();
    return;
  }

  const removeInsResourceButton = event.target.closest("[data-remove-ins-resource]");
  if (removeInsResourceButton) {
    childDraftState.insResources = childDraftState.insResources.filter(
      (resource) => resource.id !== removeInsResourceButton.dataset.removeInsResource
    );
    renderSelectedNodePanel();
    return;
  }

  const removeInsToolButton = event.target.closest("[data-remove-ins-tool]");
  if (removeInsToolButton) {
    childDraftState.insToolsRequired = childDraftState.insToolsRequired.filter(
      (tool) => tool.id !== removeInsToolButton.dataset.removeInsTool
    );
    renderSelectedNodePanel();
    return;
  }

  const cancelButton = event.target.closest("#cancelChildCreatorButton");
  if (cancelButton) {
    if (childDraftState.editNodeId) {
      closeChildCreator();
      renderAll({
        includeEntryDynamic: false,
      });
      return;
    }
    closeChildCreator();
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const closeEquipmentInfoButton = event.target.closest("#closeEquipmentInfoButton");
  if (closeEquipmentInfoButton) {
    closeEquipmentInfo();
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const editEquipmentInfoButton = event.target.closest("#editEquipmentInfoButton");
  if (editEquipmentInfoButton) {
    const nodeInfo = getSelectedNodeInfo();
    openEquipmentInfoMode(nodeInfo, "edit");
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const cancelEquipmentInfoEditButton = event.target.closest("#cancelEquipmentInfoEditButton");
  if (cancelEquipmentInfoEditButton) {
    const nodeInfo = getSelectedNodeInfo();
    openEquipmentInfoMode(nodeInfo, "view");
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const saveEquipmentInfoButton = event.target.closest("#saveEquipmentInfoButton");
  if (saveEquipmentInfoButton && isEquipmentInfoDraftReady()) {
    saveEquipmentInfo(equipmentInfoState.nodeId, equipmentInfoState.draft);
    return;
  }

  const resetCauseConfigButton = event.target.closest("#resetCauseConfigButton");
  if (resetCauseConfigButton) {
    closeCauseConfig();
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const saveCauseConfigButton = event.target.closest("#saveCauseConfigButton");
  if (saveCauseConfigButton && isCauseConfigDraftReady(causeConfigState.draft)) {
    saveCauseConfig(causeConfigState.nodeId, causeConfigState.draft);
    return;
  }

  const createButton = event.target.closest("#createChildButton");
  if (!createButton || !isChildDraftReady()) {
    return;
  }

  if (childDraftState.editNodeId) {
    saveExistingTaskNode(childDraftState.editNodeId, childDraftState);
    return;
  }

  createChildNode(
    childDraftState.parentId,
    childDraftState.childType,
    childDraftState
  );
});

selectedNodeActions?.addEventListener("click", (event) => {
  const infoMenuButton = event.target.closest("[data-toggle-equipment-info-menu]");
  if (infoMenuButton) {
    event.stopPropagation();
    toggleEquipmentInfoMenu(infoMenuButton.dataset.toggleEquipmentInfoMenu);
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const equipmentInfoButton = event.target.closest("[data-open-equipment-info]");
  if (equipmentInfoButton) {
    event.stopPropagation();
    const nodeInfo = findNodeInfo(state.hierarchy, equipmentInfoButton.dataset.equipmentNode);
    openEquipmentInfoMode(nodeInfo, equipmentInfoButton.dataset.openEquipmentInfo);
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const failureModeButton = event.target.closest("[data-open-failure-mode-config]");
  if (failureModeButton) {
    event.stopPropagation();
    const nodeInfo = findNodeInfo(state.hierarchy, failureModeButton.dataset.openFailureModeConfig);
    if (nodeInfo) {
      state.selectedNodeId = nodeInfo.node.id;
      openCauseConfig(nodeInfo);
      renderAll({
        includeEntryDynamic: false,
      });
    }
    return;
  }

  const taskEditorButton = event.target.closest("[data-open-task-editor]");
  if (taskEditorButton) {
    event.stopPropagation();
    const nodeInfo = findNodeInfo(state.hierarchy, taskEditorButton.dataset.openTaskEditor);
    if (nodeInfo) {
      state.selectedNodeId = nodeInfo.node.id;
      openExistingTaskEditor(nodeInfo);
      renderAll({
        includeEntryDynamic: false,
      });
    }
    return;
  }

  const deleteButton = event.target.closest("[data-delete-node]");
  if (!deleteButton) {
    return;
  }

  deleteHierarchyNode(deleteButton.dataset.deleteNode);
});

strategyList?.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.id === "strategyTableSearchInput") {
    const searchValue = target.value;
    state.strategyTable = {
      ...state.strategyTable,
      searchQuery: searchValue,
    };
    renderAll({
      includeEntryDynamic: false,
    });
    window.requestAnimationFrame(() => {
      const nextSearchInput = strategyList?.querySelector("#strategyTableSearchInput");
      if (nextSearchInput instanceof HTMLInputElement) {
        nextSearchInput.focus();
        nextSearchInput.setSelectionRange(searchValue.length, searchValue.length);
      }
    });
  }
});

strategyList?.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const tableField = target.closest("[data-strategy-task-node][data-strategy-column]");
  if (tableField) {
    const nextValue = tableField instanceof HTMLInputElement && tableField.type === "checkbox" ? tableField.checked : tableField.value;
    updateStrategyTableTaskField(tableField.dataset.strategyTaskNode, tableField.dataset.strategyColumn, nextValue);
    return;
  }

  if (target.id === "strategyTableTypeFilterInput") {
    state.strategyTable = {
      ...state.strategyTable,
      strategyTypeFilter: target.value,
    };
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  if (target instanceof HTMLInputElement && target.dataset.strategyColumnVisibility) {
    setStrategyTableColumnVisibility(target.dataset.strategyColumnVisibility, target.checked);
  }
});

strategyList?.addEventListener("click", (event) => {
  const optionsButton = event.target.closest("#strategyTableOptionsButton");
  if (optionsButton) {
    toggleStrategyTableOptions();
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const resetColumnsButton = event.target.closest("#strategyTableResetColumnsButton");
  if (resetColumnsButton) {
    resetStrategyTablePreferences();
    return;
  }

  const moveColumnButton = event.target.closest("[data-strategy-column-move]");
  if (moveColumnButton) {
    moveStrategyTableColumn(moveColumnButton.dataset.strategyColumnMove, moveColumnButton.dataset.direction);
    return;
  }

  const rowMenuButton = event.target.closest("[data-strategy-row-menu]");
  if (rowMenuButton) {
    toggleStrategyRowMenu(rowMenuButton.dataset.strategyRowMenu);
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const failureModeButton = event.target.closest("[data-open-failure-mode-config]");
  if (failureModeButton) {
    const nodeInfo = findNodeInfo(state.hierarchy, failureModeButton.dataset.openFailureModeConfig);
    if (nodeInfo) {
      state.selectedNodeId = nodeInfo.node.id;
      closeStrategyTableMenus();
      openCauseConfig(nodeInfo);
      renderAll({
        includeEntryDynamic: false,
      });
    }
    return;
  }

  const taskEditorButton = event.target.closest("[data-open-task-editor]");
  if (taskEditorButton) {
    const nodeInfo = findNodeInfo(state.hierarchy, taskEditorButton.dataset.openTaskEditor);
    if (nodeInfo) {
      state.selectedNodeId = nodeInfo.node.id;
      closeStrategyTableMenus();
      openExistingTaskEditor(nodeInfo);
      renderAll({
        includeEntryDynamic: false,
      });
    }
  }
});

window.addEventListener("resize", () => {
  if (!assetWorkspace) {
    return;
  }

  state.layout = normalizeLayoutState(state.layout);
  applyWorkspaceLayoutStyles();
  syncStrategyTableScrollbars();
});

maintenanceMenuBar?.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-menu-trigger]");
  if (trigger) {
    toggleMaintenanceMenu(trigger.closest("[data-menu]"));
    return;
  }

  const menuItem = event.target.closest(".maintenance-menu__item");
  if (menuItem) {
    closeMaintenanceMenus();
  }
});

document.addEventListener("click", (event) => {
  if (!maintenanceMenuBar || maintenanceMenuBar.contains(event.target)) {
  } else {
    closeMaintenanceMenus();
  }

  if (event.target instanceof Element && event.target.closest("#selectedNodeActions")) {
    return;
  }

  if (event.target instanceof Element && event.target.closest("#strategyList")) {
  } else if (state.strategyTable.optionsOpen || state.strategyTable.rowMenuTaskNodeId) {
    closeStrategyTableMenus();
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  if (equipmentInfoState.menuOpen) {
    closeEquipmentInfoMenu();
    renderAll({
      includeEntryDynamic: false,
    });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMaintenanceMenus();
    if (state.strategyTable.optionsOpen || state.strategyTable.rowMenuTaskNodeId) {
      closeStrategyTableMenus();
      renderAll({
        includeEntryDynamic: false,
      });
      return;
    }
    if (equipmentInfoState.menuOpen) {
      closeEquipmentInfoMenu();
      renderAll({
        includeEntryDynamic: false,
      });
    }
  }
});

const bootApp = async () => {
  try {
    await initializeState();
  } catch {
    state = createMfaCrushSeedWorkspace();
  } finally {
    renderAll();
    if (maintenanceWorkspace) {
      maintenanceWorkspace.hidden = false;
    }
  }
};

bootApp();
