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
const selectedNodeNameInput = document.getElementById("selectedNodeNameInput");
const selectedNodePathPreview = document.getElementById("selectedNodePathPreview");
const maintainableItemHint = document.getElementById("maintainableItemHint");
const addMaintainableItemButton = document.getElementById("addMaintainableItemButton");
const maintainableItemList = document.getElementById("maintainableItemList");
const strategyList = document.getElementById("strategyList");

const assetContextOverlay = document.getElementById("assetContextOverlay");
const workflowNotice = document.getElementById("workflowNotice");
const assetContextForm = document.getElementById("assetContextForm");
const plantUnitInput = document.getElementById("plantUnitInput");
const sectionSystemInput = document.getElementById("sectionSystemInput");
const subsystemList = document.getElementById("subsystemList");
const addSubsystemButton = document.getElementById("addSubsystemButton");
const equipmentUnitInput = document.getElementById("equipmentUnitInput");
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

const createNode = (type, name = "") => ({
  id: createId(type),
  type,
  name,
  children: [],
});

const defaultEntryState = () => ({
  plantUnit: "",
  sectionSystem: "",
  subsystems: [],
  equipmentUnit: "",
  hasSubunit: false,
  subunit: "",
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
    plantUnit:
      typeof draft?.entry?.plantUnit === "string"
        ? draft.entry.plantUnit
        : typeof draft?.plantUnit === "string"
        ? draft.plantUnit
        : typeof draft?.site === "string"
        ? draft.site
        : typeof draft?.site?.name === "string"
        ? draft.site.name
        : "",
    sectionSystem:
      typeof draft?.entry?.sectionSystem === "string"
        ? draft.entry.sectionSystem
        : typeof draft?.sectionSystem === "string"
        ? draft.sectionSystem
        : typeof draft?.system === "string"
        ? draft.system
        : deepestLevelName,
    subsystems: Array.isArray(draft?.entry?.subsystems)
      ? draft.entry.subsystems.map((item, index) => ({
          id: item?.id || createId(`entry-subsystem-${index}`),
          name: typeof item?.name === "string" ? item.name : typeof item === "string" ? item : "",
        }))
      : Array.isArray(draft?.subsystems)
      ? draft.subsystems.map((item, index) => ({
          id: item?.id || createId(`entry-subsystem-${index}`),
          name: typeof item?.name === "string" ? item.name : typeof item === "string" ? item : "",
        }))
      : [],
    equipmentUnit:
      typeof draft?.entry?.equipmentUnit === "string"
        ? draft.entry.equipmentUnit
        : typeof draft?.equipmentUnit === "string"
        ? draft.equipmentUnit
        : typeof draft?.asset === "string"
        ? draft.asset
        : typeof draft?.equipment?.name === "string"
        ? draft.equipment.name
        : "",
    hasSubunit:
      typeof draft?.entry?.hasSubunit === "boolean"
        ? draft.entry.hasSubunit
        : typeof draft?.hasSubunit === "boolean"
        ? draft.hasSubunit
        : Boolean(draft?.entry?.subunit || draft?.subunit),
    subunit:
      typeof draft?.entry?.subunit === "string"
        ? draft.entry.subunit
        : typeof draft?.subunit === "string"
        ? draft.subunit
        : "",
  };
};

const normalizeNode = (node, fallbackType = "subsystem") => {
  const type = nodeTypeMeta[node?.type] ? node.type : fallbackType;
  return {
    id: node?.id || createId(type),
    type,
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

const loadDraft = () => {
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

let state = loadDraft();

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

const getDisplayValue = (value, fallback) => value.trim() || fallback;
const hasValue = (value) => Boolean(value.trim());
const getChildActions = (type) => nodeTypeMeta[type]?.childActions || [];

const getEntryPathSegments = (useFallbacks = true) => {
  const entry = state.entry;
  const segments = [getDisplayValue(entry.plantUnit, useFallbacks ? nodeTypeMeta.plant.label : "")];

  if (hasValue(entry.sectionSystem)) {
    segments.push(getDisplayValue(entry.sectionSystem, useFallbacks ? nodeTypeMeta.section.label : ""));
  }

  entry.subsystems.forEach((subsystem, index) => {
    if (useFallbacks || hasValue(subsystem.name)) {
      segments.push(getDisplayValue(subsystem.name, useFallbacks ? `Sub-system ${index + 1}` : ""));
    }
  });

  if (hasValue(entry.equipmentUnit)) {
    segments.push(getDisplayValue(entry.equipmentUnit, useFallbacks ? nodeTypeMeta.equipment.label : ""));
  }

  if (entry.hasSubunit && (useFallbacks || hasValue(entry.subunit))) {
    segments.push(getDisplayValue(entry.subunit, useFallbacks ? nodeTypeMeta.subunit.label : ""));
  }

  return segments.filter(Boolean);
};

const isEntryReady = () => {
  const entry = state.entry;
  const subsystemsComplete = entry.subsystems.every((item) => hasValue(item.name));

  return hasValue(entry.plantUnit) && subsystemsComplete && (!entry.hasSubunit || hasValue(entry.subunit));
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
  const root = createNode("plant", entry.plantUnit.trim());
  let current = root;
  let deepestId = root.id;

  if (hasValue(entry.sectionSystem)) {
    const sectionNode = createNode("section", entry.sectionSystem.trim());
    current.children.push(sectionNode);
    current = sectionNode;
    deepestId = sectionNode.id;
  }

  entry.subsystems.forEach((subsystem) => {
    if (!hasValue(subsystem.name)) {
      return;
    }

    const subsystemNode = createNode("subsystem", subsystem.name.trim());
    current.children.push(subsystemNode);
    current = subsystemNode;
    deepestId = subsystemNode.id;
  });

  if (hasValue(entry.equipmentUnit)) {
    const equipmentNode = createNode("equipment", entry.equipmentUnit.trim());
    current.children.push(equipmentNode);
    current = equipmentNode;
    deepestId = equipmentNode.id;
  }

  if (entry.hasSubunit && hasValue(entry.subunit)) {
    const subunitNode = createNode("subunit", entry.subunit.trim());
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
const getNodeTitle = (node) => getDisplayValue(node.name, nodeTypeMeta[node.type]?.placeholder || "Untitled node");
const isMaintainableTarget = (node) => node.type === "equipment" || node.type === "subunit";

const renderEntrySubsystemRows = () => {
  subsystemList.innerHTML = state.entry.subsystems
    .map(
      (subsystem, index) => `
        <div class="asset-context-row asset-context-row--optional">
          <label class="field field--full asset-context-row__field">
            <span>Sub-system ${index + 1}</span>
            <input data-entry-subsystem-id="${subsystem.id}" type="text" value="${escapeHtml(
              subsystem.name
            )}" placeholder="Enter sub-system">
          </label>
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
      <label class="field field--full asset-context-row__field">
        <span>Subunit</span>
        <input id="entrySubunitInput" type="text" value="${escapeHtml(state.entry.subunit)}" placeholder="Enter subunit">
      </label>
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
  const canEditSection = hasValue(entry.plantUnit);
  const canEditEquipment = canEditSection && hasValue(entry.sectionSystem) && entry.subsystems.every((item) => hasValue(item.name));

  plantUnitInput.value = entry.plantUnit;
  sectionSystemInput.value = entry.sectionSystem;
  equipmentUnitInput.value = entry.equipmentUnit;

  sectionSystemInput.disabled = !canEditSection;
  addSubsystemButton.disabled = !canEditSection || !hasValue(entry.sectionSystem) || !entry.subsystems.every((item) => hasValue(item.name));
  equipmentUnitInput.disabled = !canEditEquipment;
  addSubunitButton.disabled = !hasValue(entry.equipmentUnit) || entry.hasSubunit;

  const entrySubunitInput = document.getElementById("entrySubunitInput");
  if (entrySubunitInput) {
    entrySubunitInput.value = entry.subunit;
    entrySubunitInput.disabled = !hasValue(entry.equipmentUnit);
  }

  assetPathPreview.textContent = getEntryPathSegments(true).join(" > ");
  continueButton.disabled = !isEntryReady();
};

const renderHierarchyNodes = (nodes, depth = 0) =>
  nodes
    .map((node) => {
      const selectedClass = state.selectedNodeId === node.id ? "is-selected" : "";
      const menuOpen = state.addMenuNodeId === node.id;
      const childActions = getChildActions(node.type);
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
              <strong>${escapeHtml(getNodeTitle(node))}</strong>
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
          ${node.children.length ? renderHierarchyNodes(node.children, depth + 1) : ""}
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
    selectedNodeNameInput.value = "";
    selectedNodeNameInput.disabled = true;
    selectedNodePathPreview.textContent = "Select a node from the hierarchy.";
    selectedNodeQuickActions.innerHTML = "";
    addSelectedChildButton.hidden = true;
    return;
  }

  const { node, path } = nodeInfo;
  const actions = getChildActions(node.type);

  selectedNodeTypeLabel.textContent = getNodeLabel(node);
  backgroundDetailHeading.textContent = getNodeTitle(node);
  backgroundDetailSummary.textContent = `Extend the hierarchy below ${getNodeLabel(node).toLowerCase()} or work on its maintainable items.`;
  selectedNodeNameInput.disabled = false;
  selectedNodeNameInput.value = node.name;
  selectedNodePathPreview.textContent = path.map((item) => getNodeTitle(item)).join(" > ");
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

  maintainableItemHint.textContent = `Maintainable items for ${getNodeTitle(node)}.`;

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
    backgroundDraftTitle.textContent = getDisplayValue(state.entry.equipmentUnit, "New strategy draft");
    backgroundDraftPath.textContent = getEntryPathSegments(true).join(" > ");
    return;
  }

  const fallbackNode = getFirstNode(state.hierarchy);
  const nodeInfo = getSelectedNodeInfo() || (fallbackNode ? findNodeInfo(state.hierarchy, fallbackNode.id) : null);
  if (!nodeInfo) {
    backgroundDraftTitle.textContent = "New strategy draft";
    backgroundDraftPath.textContent = "Asset hierarchy pending.";
    return;
  }

  backgroundDraftTitle.textContent = getNodeTitle(nodeInfo.node);
  backgroundDraftPath.textContent = nodeInfo.path.map((node) => getNodeTitle(node)).join(" > ");
};

const renderWorkspaceState = () => {
  assetContextOverlay.hidden = !state.modalVisible;
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

plantUnitInput?.addEventListener("input", (event) => {
  state.entry.plantUnit = event.target.value;

  if (!hasValue(state.entry.plantUnit)) {
    state.entry = defaultEntryState();
  }

  persistDraftSilently();
  renderAll();
  hideNotice();
});

sectionSystemInput?.addEventListener("input", (event) => {
  state.entry.sectionSystem = event.target.value;

  if (!hasValue(state.entry.sectionSystem)) {
    state.entry.subsystems = [];
    state.entry.equipmentUnit = "";
    state.entry.hasSubunit = false;
    state.entry.subunit = "";
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

  subsystem.name = input.value;
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

equipmentUnitInput?.addEventListener("input", (event) => {
  state.entry.equipmentUnit = event.target.value;

  if (!hasValue(state.entry.equipmentUnit)) {
    state.entry.hasSubunit = false;
    state.entry.subunit = "";
  }

  persistDraftSilently();
  renderAll();
  hideNotice();
});

subunitContainer?.addEventListener("input", (event) => {
  const input = event.target.closest("#entrySubunitInput");
  if (!input) {
    return;
  }

  state.entry.subunit = input.value;
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
  state.entry.subunit = "";
  persistDraftSilently();
  renderAll();
  hideNotice();
});

addSubsystemButton?.addEventListener("click", () => {
  state.entry.subsystems.push({
    id: createId("entry-subsystem"),
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
