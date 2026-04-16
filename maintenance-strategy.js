const body = document.body;
const appShell = document.querySelector(".app-shell");
const sidebarToggle = document.getElementById("sidebarToggle");
const themeToggle = document.getElementById("themeToggle");

const maintenanceWorkspace = document.getElementById("maintenanceWorkspace");
const assetWorkspace = document.getElementById("assetWorkspace");
const assetHierarchyTree = document.getElementById("assetHierarchyTree");
const selectedNodeTypeLabel = document.getElementById("selectedNodeTypeLabel");
const addSelectedChildButton = document.getElementById("addSelectedChildButton");
const selectedNodeQuickActions = document.getElementById("selectedNodeQuickActions");
const selectedNodeCodeInput = document.getElementById("selectedNodeCodeInput");
const selectedNodeNameInput = document.getElementById("selectedNodeNameInput");
const selectedNodePathPreview = document.getElementById("selectedNodePathPreview");
const maintainableItemHint = document.getElementById("maintainableItemHint");
const addMaintainableItemButton = document.getElementById("addMaintainableItemButton");
const maintainableItemList = document.getElementById("maintainableItemList");
const strategyList = document.getElementById("strategyList");

const assetContextOverlay = document.getElementById("assetContextOverlay");
const workflowNotice = document.getElementById("workflowNotice");
const assetContextForm = document.getElementById("assetContextForm");
const plantUnitCodeInput = document.getElementById("plantUnitCodeInput");
const plantUnitNameInput = document.getElementById("plantUnitNameInput");
const sectionSystemCodeInput = document.getElementById("sectionSystemCodeInput");
const sectionSystemNameInput = document.getElementById("sectionSystemNameInput");
const subsystemList = document.getElementById("subsystemList");
const addSubsystemButton = document.getElementById("addSubsystemButton");
const equipmentUnitCodeInput = document.getElementById("equipmentUnitCodeInput");
const equipmentUnitNameInput = document.getElementById("equipmentUnitNameInput");
const addSubunitButton = document.getElementById("addSubunitButton");
const subunitContainer = document.getElementById("subunitContainer");
const assetPathPreview = document.getElementById("assetPathPreview");
const saveDraftButton = document.getElementById("saveDraftButton");
const continueButton = document.getElementById("continueButton");

const backgroundDraftTitle = document.getElementById("backgroundDraftTitle");
const backgroundDraftPath = document.getElementById("backgroundDraftPath");
const backgroundDetailHeading = document.getElementById("backgroundDetailHeading");
const backgroundDetailSummary = document.getElementById("backgroundDetailSummary");

const themeStorageKey = "agenticai-theme";
const sidebarStorageKey = "agenticai-sidebar-collapsed";
const draftStorageKey = "maintenance-strategy-step1-draft";
const launchStateStorageKey = "maintenance-strategy-launch-state";
const sessionActiveStorageKey = "maintenance-strategy-session-active";

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

const createNode = (type, code = "", name = "") => ({
  id: createId(type),
  type,
  code,
  name,
  children: [],
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
  addMenuNodeId: "",
  modalVisible: true,
  savedAt: "",
});

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const normalizeEntryNode = (value, fallbackCode = "", fallbackName = "") => ({
  code:
    typeof value?.code === "string"
      ? value.code
      : typeof fallbackCode === "string"
      ? fallbackCode
      : "",
  name:
    typeof value?.name === "string"
      ? value.name
      : typeof value === "string"
      ? value
      : typeof fallbackName === "string"
      ? fallbackName
      : "",
});

const normalizeEntry = (draft) => {
  const base = defaultEntryState();
  const deepestLevelName = Array.isArray(draft?.levels)
    ? [...draft.levels]
        .reverse()
        .find((level) => typeof level?.name === "string" && level.name.trim())
        ?.name || ""
    : "";

  return {
    ...base,
    plantUnit: normalizeEntryNode(
      draft?.entry?.plantUnit,
      "",
      typeof draft?.plantUnit === "string"
        ? draft.plantUnit
        : typeof draft?.site === "string"
        ? draft.site
        : typeof draft?.site?.name === "string"
        ? draft.site.name
        : ""
    ),
    sectionSystem: normalizeEntryNode(
      draft?.entry?.sectionSystem,
      "",
      typeof draft?.sectionSystem === "string"
        ? draft.sectionSystem
        : typeof draft?.system === "string"
        ? draft.system
        : deepestLevelName
    ),
    subsystems: Array.isArray(draft?.entry?.subsystems)
      ? draft.entry.subsystems.map((item, index) => ({
          id: item?.id || createId(`entry-subsystem-${index}`),
          code: typeof item?.code === "string" ? item.code : "",
          name: typeof item?.name === "string" ? item.name : typeof item === "string" ? item : "",
        }))
      : Array.isArray(draft?.subsystems)
      ? draft.subsystems.map((item, index) => ({
          id: item?.id || createId(`entry-subsystem-${index}`),
          code: typeof item?.code === "string" ? item.code : "",
          name: typeof item?.name === "string" ? item.name : typeof item === "string" ? item : "",
        }))
      : [],
    equipmentUnit: normalizeEntryNode(
      draft?.entry?.equipmentUnit,
      "",
      typeof draft?.equipmentUnit === "string"
        ? draft.equipmentUnit
        : typeof draft?.asset === "string"
        ? draft.asset
        : typeof draft?.equipment?.name === "string"
        ? draft.equipment.name
        : ""
    ),
    hasSubunit:
      typeof draft?.entry?.hasSubunit === "boolean"
        ? draft.entry.hasSubunit
        : typeof draft?.hasSubunit === "boolean"
        ? draft.hasSubunit
        : Boolean(
            draft?.entry?.subunit?.name ||
              draft?.entry?.subunit?.code ||
              draft?.entry?.subunit ||
              draft?.subunit
          ),
    subunit: normalizeEntryNode(draft?.entry?.subunit, "", typeof draft?.subunit === "string" ? draft.subunit : ""),
  };
};

const normalizeNode = (node, fallbackType = "subsystem") => {
  const type = nodeTypeMeta[node?.type] ? node.type : fallbackType;
  return {
    id: node?.id || createId(type),
    type,
    code: typeof node?.code === "string" ? node.code : "",
    name: typeof node?.name === "string" ? node.name : "",
    children: Array.isArray(node?.children)
      ? node.children.map((child) => normalizeNode(child, "subsystem"))
      : [],
  };
};

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

const normalizeMaintainableItems = (items, nodes) => {
  const validNodeIds = new Set();

  const collectIds = (list) => {
    list.forEach((node) => {
      validNodeIds.add(node.id);
      if (node.children.length) {
        collectIds(node.children);
      }
    });
  };

  collectIds(nodes);

  return Array.isArray(items)
    ? items
        .map((item, index) => ({
          id: item?.id || createId(`maintainable-item-${index}`),
          nodeId: typeof item?.nodeId === "string" ? item.nodeId : "",
          name: typeof item?.name === "string" ? item.name : "",
        }))
        .filter((item) => validNodeIds.has(item.nodeId))
    : [];
};

const normalizeState = (draft) => {
  const base = defaultState();
  const hierarchy = Array.isArray(draft?.hierarchy)
    ? draft.hierarchy.map((node) => normalizeNode(node, "plant"))
    : [];
  const firstNode = getFirstNode(hierarchy);
  const selectedNodeId =
    typeof draft?.selectedNodeId === "string" && findNodeInfo(hierarchy, draft.selectedNodeId)
      ? draft.selectedNodeId
      : firstNode?.id || "";

  return {
    ...base,
    entry: normalizeEntry(draft),
    hierarchy,
    maintainableItems: normalizeMaintainableItems(draft?.maintainableItems, hierarchy),
    selectedNodeId,
    addMenuNodeId: "",
    modalVisible: typeof draft?.modalVisible === "boolean" ? draft.modalVisible : hierarchy.length === 0,
    savedAt: typeof draft?.savedAt === "string" ? draft.savedAt : "",
  };
};

const readStoredLaunchMode = () => {
  try {
    const rawState = window.sessionStorage.getItem(launchStateStorageKey);
    if (!rawState) {
      return "";
    }

    const parsedState = JSON.parse(rawState);
    return parsedState?.mode === "new" || parsedState?.mode === "existing" ? parsedState.mode : "";
  } catch (error) {
    return "";
  }
};

const readLaunchMode = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get("mode") || params.get("intent");
    if (urlMode === "new" || urlMode === "existing") {
      return urlMode;
    }

    return readStoredLaunchMode();
  } catch (error) {
    return "";
  }
};

const hasActiveMaintenanceSession = () => {
  try {
    return window.sessionStorage.getItem(sessionActiveStorageKey) === "true";
  } catch (error) {
    return false;
  }
};

const markActiveMaintenanceSession = () => {
  try {
    window.sessionStorage.setItem(sessionActiveStorageKey, "true");
  } catch (error) {
    // Ignore session storage issues and continue with local draft persistence.
  }
};

const consumeLaunchMode = () => {
  try {
    window.sessionStorage.removeItem(launchStateStorageKey);
    const params = new URLSearchParams(window.location.search);
    let hasLaunchParam = false;

    if (params.has("mode")) {
      params.delete("mode");
      hasLaunchParam = true;
    }

    if (params.has("intent")) {
      params.delete("intent");
      hasLaunchParam = true;
    }

    if (!hasLaunchParam) {
      return;
    }

    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash || ""}`;
    window.history.replaceState({}, "", nextUrl);
  } catch (error) {
    // Ignore launch cleanup issues and continue with the current page state.
  }
};

const loadPersistedDraftState = () => {
  try {
    const storedDraft = window.localStorage.getItem(draftStorageKey);
    if (!storedDraft) {
      return defaultState();
    }

    return normalizeState(JSON.parse(storedDraft));
  } catch (error) {
    return defaultState();
  }
};

const loadInitialState = () => {
  const launchMode = readLaunchMode();

  if (launchMode === "new") {
    return defaultState();
  }

  if (launchMode === "existing") {
    return loadPersistedDraftState();
  }

  if (hasActiveMaintenanceSession()) {
    return loadPersistedDraftState();
  }

  return defaultState();
};

let state = loadInitialState();
consumeLaunchMode();
markActiveMaintenanceSession();

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

  window.localStorage.setItem(draftStorageKey, JSON.stringify(state));
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

  window.localStorage.setItem(draftStorageKey, JSON.stringify(state));
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

const renderEntrySubsystemRows = () => {
  subsystemList.innerHTML = state.entry.subsystems
    .map(
      (subsystem, index) => `
        <div class="asset-context-row asset-context-row--optional">
          <div class="asset-context-row__field asset-context-entry-block">
            <span class="asset-context-entry-block__label">Sub-system ${index + 1}</span>
            <div class="asset-context-entry-grid">
              <label class="field">
                <span>Code segment</span>
                <input data-entry-subsystem-id="${subsystem.id}" data-entry-subsystem-field="code" type="text" value="${escapeHtml(
                  subsystem.code
                )}" placeholder="Enter code segment">
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
      `
    )
    .join("");
};

const renderEntrySubunitRow = () => {
  if (!state.entry.hasSubunit) {
    subunitContainer.innerHTML = "";
    return;
  }

  subunitContainer.innerHTML = `
    <div class="asset-context-row asset-context-row--optional">
      <div class="asset-context-row__field asset-context-entry-block">
        <span class="asset-context-entry-block__label">Subunit</span>
        <div class="asset-context-entry-grid">
          <label class="field">
            <span>Code segment</span>
            <input id="entrySubunitCodeInput" type="text" value="${escapeHtml(state.entry.subunit.code)}" placeholder="Enter code segment">
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

const renderHierarchyNodes = (nodes, depth = 0, parentPath = []) =>
  nodes
    .map((node) => {
      const nodePath = [...parentPath, node];
      const selectedClass = state.selectedNodeId === node.id ? "is-selected" : "";
      const menuOpen = state.addMenuNodeId === node.id;
      const childActions = getChildActions(node.type);
      const fullCode = getFullCodeFromPath(nodePath) || getNodeCodeValue(node, "Code pending");
      const childMenu =
        menuOpen && childActions.length
          ? `
            <div class="asset-hierarchy-node__menu" style="--depth:${depth + 1}">
              ${childActions
                .map(
                  (action) => `
                    <button class="asset-hierarchy-node__menu-button" type="button" data-add-child-parent="${node.id}" data-child-type="${action.type}">
                      ${escapeHtml(action.label)}
                    </button>
                  `
                )
                .join("")}
            </div>
          `
          : "";

      return `
        <div class="asset-hierarchy-branch">
          <div class="asset-hierarchy-node ${selectedClass}" style="--depth:${depth}">
            <button class="asset-hierarchy-node__main" type="button" data-select-node="${node.id}">
              <span class="asset-hierarchy-node__type">${escapeHtml(getNodeLabel(node))}</span>
              <strong>${escapeHtml(fullCode)}</strong>
              <span class="asset-hierarchy-node__name">${escapeHtml(getNodeTitle(node))}</span>
            </button>
            <button
              class="asset-hierarchy-node__add"
              type="button"
              data-toggle-add-menu="${node.id}"
              aria-expanded="${menuOpen ? "true" : "false"}"
              ${childActions.length ? "" : "disabled"}
            >
              +
            </button>
          </div>
          ${childMenu}
          ${node.children.length ? renderHierarchyNodes(node.children, depth + 1, nodePath) : ""}
        </div>
      `;
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

  assetHierarchyTree.innerHTML = renderHierarchyNodes(state.hierarchy);
};

const renderSelectedNodePanel = () => {
  const nodeInfo = getSelectedNodeInfo();
  if (!nodeInfo) {
    selectedNodeTypeLabel.textContent = "Asset node";
    backgroundDetailHeading.textContent = "No asset selected";
    backgroundDetailSummary.textContent = "Select a node from the hierarchy to extend the taxonomy and configure maintainable items.";
    selectedNodeCodeInput.value = "";
    selectedNodeNameInput.value = "";
    selectedNodeCodeInput.disabled = true;
    selectedNodeNameInput.disabled = true;
    selectedNodePathPreview.textContent = "Select a node from the hierarchy.";
    selectedNodeQuickActions.innerHTML = "";
    addSelectedChildButton.hidden = true;
    return;
  }

  const { node, path } = nodeInfo;
  const actions = getChildActions(node.type);

  selectedNodeTypeLabel.textContent = getNodeLabel(node);
  backgroundDetailHeading.textContent = getFullCodeFromPath(path) || getNodeCodeValue(node, "Code pending");
  backgroundDetailSummary.textContent = getFullNameFromPath(path) || getNodeTitle(node);
  selectedNodeCodeInput.disabled = false;
  selectedNodeNameInput.disabled = false;
  selectedNodeCodeInput.value = node.code;
  selectedNodeNameInput.value = node.name;
  selectedNodePathPreview.textContent = formatFunctionalLocationPreview(path);
  selectedNodeQuickActions.innerHTML = actions.length
    ? actions
        .map(
          (action) => `
            <button class="asset-node-actions__button" type="button" data-add-child-parent="${node.id}" data-child-type="${action.type}">
              ${escapeHtml(action.label)}
            </button>
          `
        )
        .join("")
    : `<span class="asset-workspace__hint">This node is the lowest hierarchy level in the tree.</span>`;

  addSelectedChildButton.hidden = !actions.length;
  addSelectedChildButton.disabled = !actions.length;
  addSelectedChildButton.textContent = actions[0]?.label || "Add child";
  addSelectedChildButton.dataset.parentId = node.id;
  addSelectedChildButton.dataset.childType = actions[0]?.type || "";
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

const addChildNode = (parentId, childType) => {
  const info = findNodeInfo(state.hierarchy, parentId);
  if (!info) {
    return;
  }

  const nextNode = createNode(childType);
  info.node.children.push(nextNode);
  state.selectedNodeId = nextNode.id;
  state.addMenuNodeId = "";
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
  [plantUnitCodeInput, "plantUnit", "code"],
  [plantUnitNameInput, "plantUnit", "name"],
  [sectionSystemCodeInput, "sectionSystem", "code"],
  [sectionSystemNameInput, "sectionSystem", "name"],
  [equipmentUnitCodeInput, "equipmentUnit", "code"],
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

subsystemList?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-entry-subsystem-id]");
  if (!input) {
    return;
  }

  const subsystem = state.entry.subsystems.find((item) => item.id === input.dataset.entrySubsystemId);
  if (!subsystem) {
    return;
  }

  subsystem[input.dataset.entrySubsystemField] = input.value;
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
  state.addMenuNodeId = "";
  persistDraft();
  renderAll();
});

saveDraftButton?.addEventListener("click", () => {
  persistDraft("Draft saved locally.");
});

assetHierarchyTree?.addEventListener("click", (event) => {
  const selectButton = event.target.closest("[data-select-node]");
  if (selectButton) {
    state.selectedNodeId = selectButton.dataset.selectNode;
    state.addMenuNodeId = "";
    persistDraftSilently();
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const toggleButton = event.target.closest("[data-toggle-add-menu]");
  if (toggleButton) {
    const nodeId = toggleButton.dataset.toggleAddMenu;
    state.addMenuNodeId = state.addMenuNodeId === nodeId ? "" : nodeId;
    renderAll({
      includeEntryDynamic: false,
    });
    return;
  }

  const addChildButton = event.target.closest("[data-add-child-parent]");
  if (addChildButton) {
    addChildNode(addChildButton.dataset.addChildParent, addChildButton.dataset.childType);
  }
});

selectedNodeQuickActions?.addEventListener("click", (event) => {
  const addChildButton = event.target.closest("[data-add-child-parent]");
  if (!addChildButton) {
    return;
  }

  addChildNode(addChildButton.dataset.addChildParent, addChildButton.dataset.childType);
});

addSelectedChildButton?.addEventListener("click", () => {
  const parentId = addSelectedChildButton.dataset.parentId;
  const childType = addSelectedChildButton.dataset.childType;
  if (!parentId || !childType) {
    return;
  }

  addChildNode(parentId, childType);
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

renderAll();
