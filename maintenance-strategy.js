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
const selectedNodeCodeInput = document.getElementById("selectedNodeCodeInput");
const selectedNodeNameInput = document.getElementById("selectedNodeNameInput");
const selectedNodeDescriptionInput = document.getElementById("selectedNodeDescriptionInput");
const selectedNodePathSection = document.getElementById("selectedNodePathSection");
const selectedNodePathPreview = document.getElementById("selectedNodePathPreview");
const childCreatorPanel = document.getElementById("childCreatorPanel");
const selectedNodeChildrenList = document.getElementById("selectedNodeChildrenList");
const maintainableItemHint = document.getElementById("maintainableItemHint");
const addMaintainableItemButton = document.getElementById("addMaintainableItemButton");
const maintainableItemList = document.getElementById("maintainableItemList");
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
const addSubunitButton = document.getElementById("addSubunitButton");
const subunitContainer = document.getElementById("subunitContainer");
const assetPathPreview = document.getElementById("assetPathPreview");
const saveDraftButton = document.getElementById("saveDraftButton");
const continueButton = document.getElementById("continueButton");

if (maintenanceWorkspace) {
  maintenanceWorkspace.hidden = true;
}

const backgroundDraftTitle = document.getElementById("backgroundDraftTitle");
const backgroundDraftPath = document.getElementById("backgroundDraftPath");
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
    childActions: [{ type: "subunit", label: "Add subunit" }],
  },
  subunit: {
    label: "Subunit",
    placeholder: "New subunit",
    childActions: [],
  },
};

const createId = (prefix) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const createNode = (type, code = "", name = "", description = "") => ({
  id: createId(type),
  type,
  code,
  name,
  description,
  children: [],
});

const defaultChildDraftState = () => ({
  isOpen: false,
  parentId: "",
  childType: "",
  code: "",
  name: "",
  description: "",
});

const defaultEntryState = () => ({
  plantUnit: { code: "", name: "" },
  sectionSystem: { code: "", name: "" },
  subsystems: [],
  equipmentUnit: { code: "", name: "" },
  hasSubunit: false,
  subunit: { code: "", name: "" },
});

const defaultState = () => ({
  entry: defaultEntryState(),
  hierarchy: [],
  maintainableItems: [],
  selectedNodeId: "",
  collapsedNodeIds: [],
  hierarchyFilter: "",
  layout: { ...layoutDefaults },
  modalVisible: true,
  savedAt: "",
});

let workspaceSaveTimer = null;
let workspaceSaveSequence = Promise.resolve();

const getLaunchMode = () => {
  const mode = new URLSearchParams(window.location.search).get("mode");
  return mode === "existing" ? "existing" : "new";
};

const normalizeEntryNode = (value) => ({
  code: typeof value?.code === "string" ? value.code : "",
  name: typeof value?.name === "string" ? value.name : "",
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
  equipmentUnit: normalizeEntryNode(entry?.equipmentUnit),
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

const isExistingWorkspaceCandidate = (draft) => {
  if (!draft || typeof draft !== "object") {
    return false;
  }

  return Boolean(
    draft.modalVisible === false &&
      Array.isArray(draft.hierarchy) &&
      draft.hierarchy.length > 0
  );
};

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

const normalizeHierarchyNode = (node, fallbackType = "subsystem") => {
  const type = nodeTypeMeta[node?.type] ? node.type : fallbackType;
  return {
    id: typeof node?.id === "string" && node.id ? node.id : createId(type),
    type,
    code: typeof node?.code === "string" ? node.code : "",
    name: typeof node?.name === "string" ? node.name : "",
    description: typeof node?.description === "string" ? node.description : "",
    children: Array.isArray(node?.children)
      ? node.children.map((child) => normalizeHierarchyNode(child, "subsystem"))
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

const normalizeWorkspaceState = (draft) => {
  if (!isExistingWorkspaceCandidate(draft)) {
    return null;
  }

  const hierarchy = draft.hierarchy.map((node) => normalizeHierarchyNode(node, "plant"));
  if (!hierarchy.length) {
    return null;
  }

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
    layout: normalizeLayoutState(draft?.layout),
    modalVisible: false,
    savedAt: typeof draft?.savedAt === "string" ? draft.savedAt : "",
  };
};

const loadExistingWorkspaceFromLocalStorage = () => {
  try {
    const rawDraft = window.localStorage.getItem(draftStorageKey);
    if (!rawDraft) {
      return null;
    }

    return normalizeWorkspaceState(JSON.parse(rawDraft));
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

    return normalizeWorkspaceState(await response.json());
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

const initializeState = async () => {
  if (getLaunchMode() === "existing") {
    const existingWorkspace = (await loadWorkspaceFromApi()) || loadExistingWorkspaceFromLocalStorage();
    if (existingWorkspace) {
      state = existingWorkspace;
      return;
    }
  }

  state = defaultState();
};

let state = defaultState();
let childDraftState = defaultChildDraftState();
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
  path
    .map((node) => node.code.trim())
    .filter(Boolean)
    .join("-");

const getFullNameFromPath = (path) =>
  path
    .map((node) => node.name.trim())
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
  state = {
    ...state,
    savedAt: new Date().toISOString(),
  };

  saveWorkspaceToLocalStorage(state);
  queueWorkspaceSave(state);
};

const buildInitialHierarchyFromEntry = () => {
  const entry = state.entry;
  const root = createNode("plant", entry.plantUnit.code.trim(), entry.plantUnit.name.trim());
  let current = root;
  let deepestId = root.id;

  if (hasNodeValue(entry.sectionSystem)) {
    const sectionNode = createNode("section", entry.sectionSystem.code.trim(), entry.sectionSystem.name.trim());
    current.children.push(sectionNode);
    current = sectionNode;
    deepestId = sectionNode.id;
  }

  entry.subsystems.forEach((subsystem) => {
    if (!hasNodeValue(subsystem)) {
      return;
    }

    const subsystemNode = createNode("subsystem", subsystem.code.trim(), subsystem.name.trim());
    current.children.push(subsystemNode);
    current = subsystemNode;
    deepestId = subsystemNode.id;
  });

  if (hasNodeValue(entry.equipmentUnit)) {
    const equipmentNode = createNode("equipment", entry.equipmentUnit.code.trim(), entry.equipmentUnit.name.trim());
    current.children.push(equipmentNode);
    current = equipmentNode;
    deepestId = equipmentNode.id;
  }

  if (entry.hasSubunit && hasNodeValue(entry.subunit)) {
    const subunitNode = createNode("subunit", entry.subunit.code.trim(), entry.subunit.name.trim());
    current.children.push(subunitNode);
    deepestId = subunitNode.id;
  }

  return {
    hierarchy: [root],
    selectedNodeId: deepestId,
  };
};

const getSelectedNodeInfo = () => {
  if (!state.selectedNodeId) {
    return null;
  }
  return findNodeInfo(state.hierarchy, state.selectedNodeId);
};

const getNodeLabel = (node) => nodeTypeMeta[node.type]?.label || "Asset node";
const getNodeTitle = (node) => getNodeNameValue(node, nodeTypeMeta[node.type]?.placeholder || "Untitled node");
const isMaintainableTarget = (node) => node.type === "equipment" || node.type === "subunit";
const getNodeDisplayName = (node) => getNodeNameValue(node, nodeTypeMeta[node.type]?.placeholder || "Untitled node");
const getNodeDescription = (node, fallback = "") =>
  (typeof node?.description === "string" ? node.description.trim() : "") || fallback;
const getNodeBrowserDescription = (nodePath, node) =>
  getNodeDescription(node) || getFullCodeFromPath(nodePath) || getNodeLabel(node);
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
    getNodeDescription(node),
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
  const nodeLabel = getNodeDisplayName(node);
  const description = getNodeBrowserDescription(path, node);
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
            aria-label="Add child under ${escapeHtml(nodeLabel)}"
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

  const nextChildType = actions.some((action) => action.type === childType) ? childType : actions[0].type;
  childDraftState = {
    isOpen: true,
    parentId,
    childType: nextChildType,
    code: "",
    name: "",
    description: "",
  };
};

const isChildDraftReady = () => Boolean(childDraftState.code.trim() || childDraftState.name.trim());

const getChildDraftPreview = (parentPath, childType) => {
  const childSegment = {
    code: childDraftState.code.trim() || "NEW",
    name: childDraftState.name.trim() || getNodeLabel({ type: childType }),
  };
  return formatFunctionalLocationPreview([...parentPath, childSegment]);
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
  const inheritedPrefix = buildInheritedCodePrefix(nodeInfo.path.map((segment) => segment.code));
  const preview = getChildDraftPreview(nodeInfo.path, selectedChildType);
  const childTypeControl =
    actions.length === 1
      ? `
          <input type="hidden" id="childCreatorTypeInput" value="${escapeHtml(selectedChildType)}">
          <span class="asset-child-creator__static-type">${escapeHtml(getNodeLabel({ type: selectedChildType }))}</span>
        `
      : `
          <select id="childCreatorTypeInput">
            ${actions
              .map(
                (action) => `
                  <option value="${escapeHtml(action.type)}" ${selectedChildType === action.type ? "selected" : ""}>
                    ${escapeHtml(getNodeLabel({ type: action.type }))}
                  </option>
                `
              )
              .join("")}
          </select>
        `;

  childCreatorPanel.innerHTML = `
    <section class="asset-child-creator__form">
      <div class="strategy-surface__header strategy-surface__header--spread">
        <div>
          <strong>Add child under ${escapeHtml(getNodeDisplayName(nodeInfo.node))}</strong>
          <span>${escapeHtml(getFullCodeFromPath(nodeInfo.path) || getNodeCodeValue(nodeInfo.node, "Code pending"))}</span>
        </div>
      </div>
      <p class="asset-child-creator__summary">
        Complete the fields below to add a new ${escapeHtml(getNodeLabel({ type: selectedChildType }).toLowerCase())} under the selected hierarchy node.
      </p>
      <div class="asset-context-entry-grid">
        <label class="field">
          <span>Child type</span>
          ${childTypeControl}
        </label>
        <label class="field">
          <span>Code segment</span>
          <div class="hierarchy-code-field ${inheritedPrefix ? "has-prefix" : ""}">
            <span class="hierarchy-code-field__prefix">${escapeHtml(inheritedPrefix)}</span>
            <input id="childCreatorCodeInput" type="text" value="${escapeHtml(childDraftState.code)}" placeholder="Enter code segment">
          </div>
        </label>
      </div>
      <div class="asset-context-entry-grid">
        <label class="field field--full">
          <span>Name</span>
          <input id="childCreatorNameInput" type="text" value="${escapeHtml(childDraftState.name)}" placeholder="Enter name">
        </label>
      </div>
      <label class="field field--full">
        <span>Description</span>
        <textarea id="childCreatorDescriptionInput" rows="3" placeholder="Enter description">${escapeHtml(childDraftState.description)}</textarea>
      </label>
      <div class="asset-context-path asset-context-path--inline">
        <span class="asset-context-path__label">New child functional location preview</span>
        <strong id="childCreatorPathPreview">${escapeHtml(preview)}</strong>
      </div>
      <div class="asset-child-creator__actions">
        <button id="cancelChildCreatorButton" class="secondary-button" type="button">Cancel</button>
        <button id="createChildButton" class="primary-button" type="button" ${isChildDraftReady() ? "" : "disabled"}>Create</button>
      </div>
    </section>
  `;
};

const renderSelectedNodeChildren = (nodeInfo) => {
  if (!selectedNodeChildrenList) {
    return;
  }

  const children = nodeInfo.node.children || [];
  selectedNodeChildrenList.innerHTML = `
    <section class="asset-child-list__section">
      <div class="strategy-surface__header">
        <strong>Children</strong>
        <span>${children.length ? `${children.length} item${children.length === 1 ? "" : "s"}` : "No children yet"}</span>
      </div>
      ${
        children.length
          ? `
            <div class="asset-child-list__items">
              ${children
                .map((child) => {
                  const childInfo = findNodeInfo(state.hierarchy, child.id);
                  const description = getNodeDescription(child) || getFullCodeFromPath(childInfo?.path || []) || getNodeLabel(child);
                  return `
                    <button class="asset-child-list__item" type="button" data-select-node="${child.id}">
                      <span class="asset-child-list__eyebrow">${escapeHtml(getNodeLabel(child))}</span>
                      <strong>${escapeHtml(getNodeDisplayName(child))}</strong>
                      <span class="asset-child-list__meta">${escapeHtml(
                        getFullCodeFromPath(childInfo?.path || []) || getNodeCodeValue(child, "Code pending")
                      )}</span>
                      <p>${escapeHtml(description)}</p>
                    </button>
                  `;
                })
                .join("")}
            </div>
          `
          : `
            <article class="asset-workspace-empty asset-workspace-empty--soft">
              <strong>No child nodes yet</strong>
              <p>Use the + on the selected row in the asset register to build out this part of the hierarchy.</p>
            </article>
          `
      }
    </section>
  `;
};

const renderSelectedNodePanel = () => {
  const nodeInfo = getSelectedNodeInfo();
  if (!nodeInfo) {
    selectedNodeTypeLabel.textContent = "Asset node";
    backgroundDetailHeading.textContent = "No asset selected";
    backgroundDetailSummary.textContent = "Select a node from the hierarchy to extend the taxonomy and configure maintainable items.";
    selectedNodeCodeInput.value = "";
    selectedNodeNameInput.value = "";
    selectedNodeDescriptionInput.value = "";
    selectedNodeCodeInput.disabled = true;
    selectedNodeNameInput.disabled = true;
    selectedNodeDescriptionInput.disabled = true;
    selectedNodeForm.hidden = false;
    if (selectedNodePathSection) {
      selectedNodePathSection.hidden = false;
    }
    selectedNodePathPreview.textContent = "Select a node from the hierarchy.";
    if (childCreatorPanel) {
      childCreatorPanel.hidden = true;
      childCreatorPanel.innerHTML = "";
    }
    if (selectedNodeChildrenList) {
      selectedNodeChildrenList.hidden = false;
      selectedNodeChildrenList.innerHTML = "";
    }
    closeChildCreator();
    return;
  }

  const { node, path } = nodeInfo;
  const actions = getChildActions(node.type);
  if (childDraftState.parentId && childDraftState.parentId !== node.id) {
    closeChildCreator();
  }
  const isAddMode = childDraftState.isOpen && childDraftState.parentId === node.id && actions.length > 0;

  if (isAddMode) {
    const selectedChildType = actions.some((action) => action.type === childDraftState.childType)
      ? childDraftState.childType
      : actions[0].type;
    selectedNodeTypeLabel.textContent = `Add ${getNodeLabel({ type: selectedChildType })}`;
    backgroundDetailHeading.textContent = `Add child under ${getNodeDisplayName(node)}`;
    backgroundDetailSummary.textContent = `Complete the form to add a new ${getNodeLabel({ type: selectedChildType }).toLowerCase()} beneath the selected hierarchy node.`;
    selectedNodeCodeInput.value = "";
    selectedNodeNameInput.value = "";
    selectedNodeDescriptionInput.value = "";
    selectedNodeCodeInput.disabled = true;
    selectedNodeNameInput.disabled = true;
    selectedNodeDescriptionInput.disabled = true;
    selectedNodeForm.hidden = true;
    if (selectedNodePathSection) {
      selectedNodePathSection.hidden = true;
    }
    if (selectedNodeChildrenList) {
      selectedNodeChildrenList.hidden = true;
      selectedNodeChildrenList.innerHTML = "";
    }
    renderChildCreator(nodeInfo, actions);
    return;
  }

  selectedNodeTypeLabel.textContent = getNodeLabel(node);
  backgroundDetailHeading.textContent = getFullCodeFromPath(path) || getNodeCodeValue(node, "Code pending");
  backgroundDetailSummary.textContent = getFullNameFromPath(path) || getNodeTitle(node);
  selectedNodeCodeInput.disabled = false;
  selectedNodeNameInput.disabled = false;
  selectedNodeDescriptionInput.disabled = false;
  selectedNodeCodeInput.value = node.code;
  selectedNodeNameInput.value = node.name;
  selectedNodeDescriptionInput.value = node.description || "";
  selectedNodeForm.hidden = false;
  if (selectedNodePathSection) {
    selectedNodePathSection.hidden = false;
  }
  selectedNodePathPreview.textContent = formatFunctionalLocationPreview(path);
  if (childCreatorPanel) {
    childCreatorPanel.hidden = true;
    childCreatorPanel.innerHTML = "";
  }
  if (selectedNodeChildrenList) {
    selectedNodeChildrenList.hidden = false;
  }
  renderSelectedNodeChildren(nodeInfo);
};

const renderStrategyDrafts = (selectedItems, canAddItems) => {
  if (!canAddItems) {
    strategyList.innerHTML = `
      <article class="asset-workspace-empty asset-workspace-empty--soft">
        <strong>Strategies will appear here later</strong>
        <p>Select an equipment unit or subunit, then add maintainable items to start building strategy content.</p>
      </article>
    `;
    return;
  }

  strategyList.innerHTML = selectedItems.length
    ? selectedItems
        .map(
          (item, index) => `
            <article class="strategy-draft-card">
              <span class="strategy-draft-card__eyebrow">Strategy draft</span>
              <strong>${escapeHtml(getDisplayValue(item.name, `Maintainable item ${index + 1}`))}</strong>
              <p>Failure logic and maintenance strategy design will be configured for this item in the next workflow steps.</p>
            </article>
          `
        )
        .join("")
    : `
        <article class="asset-workspace-empty asset-workspace-empty--soft">
          <strong>No strategy drafts yet</strong>
          <p>Add a maintainable item to create room for strategy definition on the selected asset.</p>
        </article>
      `;
};

const renderMaintainableItems = () => {
  const nodeInfo = getSelectedNodeInfo();
  const node = nodeInfo?.node || null;
  const canAddItems = Boolean(node && isMaintainableTarget(node));
  const selectedItems = canAddItems ? state.maintainableItems.filter((item) => item.nodeId === node.id) : [];

  addMaintainableItemButton.disabled = !canAddItems;

  if (!canAddItems) {
    maintainableItemHint.textContent = "Select an equipment unit or subunit to define maintainable items.";
    maintainableItemList.innerHTML = "";
    renderStrategyDrafts([], false);
    return;
  }

  maintainableItemHint.textContent = `Maintainable items for ${formatFunctionalLocationPreview(nodeInfo.path)}.`;

  if (!selectedItems.length) {
    maintainableItemList.innerHTML = `
      <article class="asset-workspace-empty asset-workspace-empty--soft">
        <strong>No maintainable items yet</strong>
        <p>Add the maintainable items that belong under this selected asset. They stay out of the hierarchy tree to keep it clean.</p>
      </article>
    `;
  } else {
    maintainableItemList.innerHTML = selectedItems
      .map(
        (item, index) => `
          <article class="maintainable-item-card">
            <label class="field field--full">
              <span>Maintainable item ${index + 1}</span>
              <input type="text" data-maintainable-item-id="${item.id}" value="${escapeHtml(item.name)}" placeholder="Enter maintainable item">
            </label>
          </article>
        `
      )
      .join("");
  }

  renderStrategyDrafts(selectedItems, true);
};

const renderWorkspaceSummary = () => {
  if (!state.hierarchy.length) {
    const entrySegments = getEntryPathSegments(false).map((segment) => ({ code: segment.code, name: segment.name }));
    backgroundDraftTitle.textContent = getFullCodeFromPath(entrySegments) || "New strategy draft";
    backgroundDraftPath.textContent = getFullNameFromPath(entrySegments) || "Functional location name pending";
    return;
  }

  const fallbackNode = getFirstNode(state.hierarchy);
  const nodeInfo = getSelectedNodeInfo() || (fallbackNode ? findNodeInfo(state.hierarchy, fallbackNode.id) : null);
  if (!nodeInfo) {
    backgroundDraftTitle.textContent = "New strategy draft";
    backgroundDraftPath.textContent = "Asset hierarchy pending.";
    return;
  }

  backgroundDraftTitle.textContent = getFullCodeFromPath(nodeInfo.path) || getNodeCodeValue(nodeInfo.node, "Code pending");
  backgroundDraftPath.textContent = getFullNameFromPath(nodeInfo.path) || getNodeTitle(nodeInfo.node);
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
  renderWorkspaceSummary();
  renderHierarchyTree();
  renderSelectedNodePanel();
  renderMaintainableItems();
};

const renderAll = (options = {}) => {
  renderEntryForm({
    includeDynamic: options.includeEntryDynamic !== false,
  });
  renderWorkspaceState();
};

const createChildNode = (parentId, childType, code = "", name = "", description = "") => {
  const info = findNodeInfo(state.hierarchy, parentId);
  if (!info) {
    return;
  }

  const nextNode = createNode(childType, code.trim(), name.trim(), description.trim());
  info.node.children.push(nextNode);
  setNodeCollapsed(parentId, false);
  state.selectedNodeId = nextNode.id;
  closeChildCreator();
  persistDraftSilently();
  renderAll();
  hideNotice();
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
      state.entry.equipmentUnit = { code: "", name: "" };
      state.entry.hasSubunit = false;
      state.entry.subunit = { code: "", name: "" };
    }

    if (!hasNodeValue(state.entry.equipmentUnit)) {
      state.entry.hasSubunit = false;
      state.entry.subunit = { code: "", name: "" };
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
    state.entry.equipmentUnit = { code: "", name: "" };
    state.entry.hasSubunit = false;
    state.entry.subunit = { code: "", name: "" };
  }

  if (!hasNodeValue(state.entry.equipmentUnit)) {
    state.entry.hasSubunit = false;
    state.entry.subunit = { code: "", name: "" };
  }

  persistDraftSilently();
  renderAll();
  hideNotice();
});

sectionSystemCodeInput?.addEventListener("input", (event) => {
  state.entry.sectionSystem.code = event.target.value;

  if (!hasNodeValue(state.entry.sectionSystem)) {
    state.entry.subsystems = [];
    state.entry.equipmentUnit = { code: "", name: "" };
    state.entry.hasSubunit = false;
    state.entry.subunit = { code: "", name: "" };
  }

  if (!hasNodeValue(state.entry.equipmentUnit)) {
    state.entry.hasSubunit = false;
    state.entry.subunit = { code: "", name: "" };
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
  }

  persistDraftSilently();
  renderAll();
  hideNotice();
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

selectedNodeNameInput?.addEventListener("input", (event) => {
  const info = getSelectedNodeInfo();
  if (!info) {
    return;
  }

  info.node.name = event.target.value;
  persistDraftSilently();
  renderWorkspaceState();
});

selectedNodeCodeInput?.addEventListener("input", (event) => {
  const info = getSelectedNodeInfo();
  if (!info) {
    return;
  }

  info.node.code = event.target.value;
  persistDraftSilently();
  renderWorkspaceState();
});

selectedNodeDescriptionInput?.addEventListener("input", (event) => {
  const info = getSelectedNodeInfo();
  if (!info) {
    return;
  }

  info.node.description = event.target.value;
  persistDraftSilently();
  renderWorkspaceState();
});

const syncChildCreatorDraftField = (target) => {
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.id === "childCreatorTypeInput") {
    childDraftState.childType = target.value;
    renderSelectedNodePanel();
    return;
  }

  if (target.id === "childCreatorCodeInput") {
    childDraftState.code = target.value;
  }

  if (target.id === "childCreatorNameInput") {
    childDraftState.name = target.value;
  }

  if (target.id === "childCreatorDescriptionInput") {
    childDraftState.description = target.value;
  }

  const createButton = childCreatorPanel?.querySelector("#createChildButton");
  if (createButton) {
    createButton.disabled = !isChildDraftReady();
  }

  const preview = childCreatorPanel?.querySelector("#childCreatorPathPreview");
  const parentInfo = childDraftState.parentId ? findNodeInfo(state.hierarchy, childDraftState.parentId) : null;
  if (preview && parentInfo) {
    preview.textContent = getChildDraftPreview(parentInfo.path, childDraftState.childType || getChildActions(parentInfo.node.type)[0]?.type || "subunit");
  }
};

childCreatorPanel?.addEventListener("input", (event) => {
  syncChildCreatorDraftField(event.target);
});

childCreatorPanel?.addEventListener("change", (event) => {
  syncChildCreatorDraftField(event.target);
});

childCreatorPanel?.addEventListener("click", (event) => {
  const cancelButton = event.target.closest("#cancelChildCreatorButton");
  if (cancelButton) {
    closeChildCreator();
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const createButton = event.target.closest("#createChildButton");
  if (!createButton || !isChildDraftReady()) {
    return;
  }

  createChildNode(
    childDraftState.parentId,
    childDraftState.childType,
    childDraftState.code,
    childDraftState.name,
    childDraftState.description
  );
});

selectedNodeChildrenList?.addEventListener("click", (event) => {
  const childButton = event.target.closest("[data-select-node]");
  if (!childButton) {
    return;
  }

  state.selectedNodeId = childButton.dataset.selectNode;
  persistDraftSilently();
  renderAll({
    includeEntryDynamic: false,
  });
});

addMaintainableItemButton?.addEventListener("click", () => {
  const info = getSelectedNodeInfo();
  if (!info || !isMaintainableTarget(info.node)) {
    return;
  }

  state.maintainableItems.push({
    id: createId("maintainable-item"),
    nodeId: info.node.id,
    name: "",
  });
  persistDraftSilently();
  renderWorkspaceState();
});

maintainableItemList?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-maintainable-item-id]");
  if (!input) {
    return;
  }

  const item = state.maintainableItems.find((entry) => entry.id === input.dataset.maintainableItemId);
  if (!item) {
    return;
  }

  item.name = input.value;
  persistDraftSilently();
  renderStrategyDrafts(
    state.maintainableItems.filter((entry) => entry.nodeId === item.nodeId),
    true
  );
});

window.addEventListener("resize", () => {
  if (!assetWorkspace) {
    return;
  }

  state.layout = normalizeLayoutState(state.layout);
  applyWorkspaceLayoutStyles();
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
    return;
  }

  closeMaintenanceMenus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMaintenanceMenus();
  }
});

const bootApp = async () => {
  try {
    await initializeState();
  } finally {
    renderAll();
    if (maintenanceWorkspace) {
      maintenanceWorkspace.hidden = false;
    }
  }
};

bootApp();
