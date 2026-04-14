const body = document.body;
const appShell = document.querySelector(".app-shell");
const sidebarToggle = document.getElementById("sidebarToggle");
const themeToggle = document.getElementById("themeToggle");
const hierarchyTree = document.getElementById("hierarchyTree");
const selectedPathPills = document.getElementById("selectedPathPills");
const selectedNodeTitle = document.getElementById("selectedNodeTitle");
const selectedNodeDescription = document.getElementById("selectedNodeDescription");
const selectedNodeMeta = document.getElementById("selectedNodeMeta");
const selectedNodeFields = document.getElementById("selectedNodeFields");
const removeSelectedNodeButton = document.getElementById("removeSelectedNodeButton");
const scopeSelector = document.getElementById("scopeSelector");
const componentList = document.getElementById("componentList");
const strategyNameInput = document.getElementById("strategyNameInput");
const operatingDutyInput = document.getElementById("operatingDutyInput");
const environmentInput = document.getElementById("environmentInput");
const criticalityInput = document.getElementById("criticalityInput");
const redundancyInput = document.getElementById("redundancyInput");
const accessConstraintsInput = document.getElementById("accessConstraintsInput");
const notesInput = document.getElementById("notesInput");
const completenessValue = document.getElementById("completenessValue");
const completenessBar = document.getElementById("completenessBar");
const readinessChecklist = document.getElementById("readinessChecklist");
const scopeSummaryLabel = document.getElementById("scopeSummaryLabel");
const scopeSummaryPath = document.getElementById("scopeSummaryPath");
const draftStatusLabel = document.getElementById("draftStatusLabel");
const draftStatusMeta = document.getElementById("draftStatusMeta");
const workflowNotice = document.getElementById("workflowNotice");
const addLevelButton = document.getElementById("addLevelButton");
const addComponentButton = document.getElementById("addComponentButton");
const addComponentButtonSecondary = document.getElementById("addComponentButtonSecondary");
const saveDraftButton = document.getElementById("saveDraftButton");
const continueButton = document.getElementById("continueButton");

const themeStorageKey = "agenticai-theme";
const sidebarStorageKey = "agenticai-sidebar-collapsed";
const draftStorageKey = "maintenance-strategy-step1-draft";
const levelLabelSuggestions = ["Area", "Section", "Sub-section", "System", "Sub-system"];

const createId = (prefix) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const createLevel = (index = 0) => ({
  id: createId("level"),
  label: levelLabelSuggestions[index] || `Level ${index + 1}`,
  name: "",
  code: "",
  description: "",
});

const createComponent = () => ({
  id: createId("component"),
  name: "",
  code: "",
  description: "",
});

const defaultState = () => ({
  strategyName: "",
  selectedScope: "equipment",
  selectedNodeKey: "site",
  savedAt: "",
  site: {
    name: "",
    code: "",
    description: "",
  },
  levels: [createLevel(0)],
  equipment: {
    name: "",
    tag: "",
    description: "",
    function: "",
    assetClass: "",
    currentMaintenanceBasis: "",
  },
  components: [],
  context: {
    operatingDuty: "",
    environment: "",
    criticality: "",
    redundancy: "",
    accessConstraints: "",
    notes: "",
  },
});

const normalizeState = (draft) => {
  const base = defaultState();
  const nextState = {
    ...base,
    ...draft,
    site: {
      ...base.site,
      ...(draft?.site || {}),
    },
    equipment: {
      ...base.equipment,
      ...(draft?.equipment || {}),
    },
    context: {
      ...base.context,
      ...(draft?.context || {}),
    },
    levels: Array.isArray(draft?.levels)
      ? draft.levels.map((level, index) => ({
          id: level?.id || createId("level"),
          label: level?.label || levelLabelSuggestions[index] || `Level ${index + 1}`,
          name: level?.name || "",
          code: level?.code || "",
          description: level?.description || "",
        }))
      : base.levels,
    components: Array.isArray(draft?.components)
      ? draft.components.map((component) => ({
          id: component?.id || createId("component"),
          name: component?.name || "",
          code: component?.code || "",
          description: component?.description || "",
        }))
      : [],
  };

  if (!["system", "equipment", "component"].includes(nextState.selectedScope)) {
    nextState.selectedScope = "equipment";
  }

  if (!nextState.selectedNodeKey) {
    nextState.selectedNodeKey = "site";
  }

  if (!isNodeKeyValid(nextState, nextState.selectedNodeKey)) {
    nextState.selectedNodeKey = "site";
  }

  return nextState;
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

function isNodeKeyValid(currentState, nodeKey) {
  if (nodeKey === "site" || nodeKey === "equipment") {
    return true;
  }

  if (nodeKey.startsWith("level:")) {
    const levelId = nodeKey.slice("level:".length);
    return currentState.levels.some((level) => level.id === levelId);
  }

  if (nodeKey.startsWith("component:")) {
    const componentId = nodeKey.slice("component:".length);
    return currentState.components.some((component) => component.id === componentId);
  }

  return false;
}

const applyTheme = (theme) => {
  if (!body) {
    return;
  }

  body.dataset.theme = theme;
};

const applySidebarState = (isCollapsed) => {
  if (!appShell) {
    return;
  }

  appShell.classList.toggle("sidebar-collapsed", isCollapsed);
  sidebarToggle?.setAttribute("aria-expanded", String(!isCollapsed));
};

const storedTheme = window.localStorage.getItem(themeStorageKey);
if (storedTheme === "dark" || storedTheme === "light") {
  applyTheme(storedTheme);
}

const storedSidebarState = window.localStorage.getItem(sidebarStorageKey);
applySidebarState(storedSidebarState === null ? true : storedSidebarState === "true");

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getLevelPlaceholder = (level) =>
  level.label ? `Unnamed ${level.label.toLowerCase()}` : "Unnamed level";

const getComponentDisplayName = (component, index) =>
  component.name.trim() || `Component ${index + 1}`;

const getSelectedNode = () => {
  if (state.selectedNodeKey === "site") {
    return {
      key: "site",
      type: "site",
      removable: false,
      data: state.site,
    };
  }

  if (state.selectedNodeKey === "equipment") {
    return {
      key: "equipment",
      type: "equipment",
      removable: false,
      data: state.equipment,
    };
  }

  if (state.selectedNodeKey.startsWith("level:")) {
    const levelId = state.selectedNodeKey.slice("level:".length);
    const level = state.levels.find((item) => item.id === levelId);

    if (level) {
      return {
        key: state.selectedNodeKey,
        type: "level",
        removable: true,
        data: level,
      };
    }
  }

  if (state.selectedNodeKey.startsWith("component:")) {
    const componentId = state.selectedNodeKey.slice("component:".length);
    const component = state.components.find((item) => item.id === componentId);

    if (component) {
      return {
        key: state.selectedNodeKey,
        type: "component",
        removable: true,
        data: component,
      };
    }
  }

  state.selectedNodeKey = "site";
  return getSelectedNode();
};

const getPathSegmentsForNode = (nodeKey) => {
  const segments = [
    {
      kind: "Site",
      value: state.site.name.trim() || "Site",
    },
  ];

  state.levels.forEach((level) => {
    segments.push({
      kind: level.label || "Level",
      value: level.name.trim() || getLevelPlaceholder(level),
    });

    if (`level:${level.id}` === nodeKey) {
      return;
    }
  });

  if (nodeKey === "site") {
    return segments.slice(0, 1);
  }

  if (nodeKey.startsWith("level:")) {
    const levelId = nodeKey.slice("level:".length);
    const stopIndex = state.levels.findIndex((level) => level.id === levelId);
    return segments.slice(0, stopIndex + 2);
  }

  segments.push({
    kind: "Equipment",
    value: state.equipment.name.trim() || "Equipment",
  });

  if (nodeKey === "equipment") {
    return segments;
  }

  if (nodeKey.startsWith("component:")) {
    const componentId = nodeKey.slice("component:".length);
    const componentIndex = state.components.findIndex((component) => component.id === componentId);

    if (componentIndex >= 0) {
      segments.push({
        kind: "Component",
        value: getComponentDisplayName(state.components[componentIndex], componentIndex),
      });
    }
  }

  return segments;
};

const getDeepestNamedLevel = () => {
  for (let index = state.levels.length - 1; index >= 0; index -= 1) {
    if (state.levels[index].name.trim()) {
      return state.levels[index];
    }
  }

  return null;
};

const getScopeTarget = () => {
  if (state.selectedScope === "system") {
    const level = getDeepestNamedLevel();
    return {
      label: level?.label || "System",
      path: getPathSegmentsForNode(level ? `level:${level.id}` : "site"),
    };
  }

  if (state.selectedScope === "component") {
    const selectedComponent =
      getSelectedNode().type === "component"
        ? getSelectedNode().data
        : state.components.find((component) => component.name.trim()) || state.components[0];

    if (selectedComponent) {
      return {
        label: "Component",
        path: getPathSegmentsForNode(`component:${selectedComponent.id}`),
      };
    }

    return {
      label: "Component",
      path: getPathSegmentsForNode("equipment"),
    };
  }

  return {
    label: "Equipment",
    path: getPathSegmentsForNode("equipment"),
  };
};

const getReadinessChecks = () => {
  const hasStrategyName = Boolean(state.strategyName.trim());
  const hasSite = Boolean(state.site.name.trim());
  const hasSystemPath = state.selectedScope !== "system" || Boolean(getDeepestNamedLevel());
  const hasEquipment = state.selectedScope === "system" || Boolean(state.equipment.name.trim());
  const hasFunction = state.selectedScope === "system" || Boolean(state.equipment.function.trim());
  const hasAssetClass = state.selectedScope === "system" || Boolean(state.equipment.assetClass.trim());
  const hasOperatingDuty = Boolean(state.context.operatingDuty);
  const hasCriticality = Boolean(state.context.criticality);
  const hasComponent =
    state.selectedScope !== "component" ||
    state.components.some((component) => component.name.trim());

  return [
    {
      label: "Strategy name defined",
      complete: hasStrategyName,
    },
    {
      label: "Site identified",
      complete: hasSite,
    },
    {
      label: "System path defined for system-level scope",
      complete: hasSystemPath,
    },
    {
      label: "Equipment identified when scope goes below system",
      complete: hasEquipment,
    },
    {
      label: "Function captured",
      complete: hasFunction,
    },
    {
      label: "Asset class captured",
      complete: hasAssetClass,
    },
    {
      label: "Operating duty captured",
      complete: hasOperatingDuty,
    },
    {
      label: "Criticality captured",
      complete: hasCriticality,
    },
    {
      label: "Component added for component-level scope",
      complete: hasComponent,
    },
  ];
};

const isStepReady = () => getReadinessChecks().every((item) => item.complete);

const formatSavedTime = (value) => {
  if (!value) {
    return "Changes are stored locally in this browser.";
  }

  const savedDate = new Date(value);
  return `Last saved ${savedDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })}`;
};

const persistDraft = (options = {}) => {
  const nextState = {
    ...state,
    savedAt: new Date().toISOString(),
  };

  state = nextState;
  window.localStorage.setItem(draftStorageKey, JSON.stringify(nextState));
  renderDraftStatus(options.message || "");
};

const renderDraftStatus = (message) => {
  draftStatusLabel.textContent = state.savedAt ? "Saved locally" : "Not saved";
  draftStatusMeta.textContent = message || formatSavedTime(state.savedAt);
};

const renderPathPills = () => {
  const pathSegments = getPathSegmentsForNode(state.selectedNodeKey);
  selectedPathPills.innerHTML = pathSegments
    .map(
      (segment) =>
        `<span class="maintenance-path__pill"><strong>${escapeHtml(segment.kind)}</strong>${escapeHtml(
          segment.value
        )}</span>`
    )
    .join("");
};

const renderHierarchy = () => {
  const levelMarkup = state.levels
    .map((level, index) => {
      const nodeKey = `level:${level.id}`;
      const isSelected = state.selectedNodeKey === nodeKey;
      return `
        <button class="hierarchy-node ${isSelected ? "is-selected" : ""}" type="button" data-node-key="${nodeKey}" style="--depth:${
          index + 1
        }">
          <span class="hierarchy-node__type">${escapeHtml(level.label || "Level")}</span>
          <strong>${escapeHtml(level.name.trim() || getLevelPlaceholder(level))}</strong>
          <span>${escapeHtml(level.code.trim() || "Optional code or functional location")}</span>
        </button>
      `;
    })
    .join("");

  const componentMarkup = state.components
    .map((component, index) => {
      const nodeKey = `component:${component.id}`;
      const isSelected = state.selectedNodeKey === nodeKey;
      return `
        <button class="hierarchy-node hierarchy-node--component ${
          isSelected ? "is-selected" : ""
        }" type="button" data-node-key="${nodeKey}" style="--depth:${state.levels.length + 2}">
          <span class="hierarchy-node__type">Component</span>
          <strong>${escapeHtml(getComponentDisplayName(component, index))}</strong>
          <span>${escapeHtml(component.code.trim() || "Optional component code")}</span>
        </button>
      `;
    })
    .join("");

  hierarchyTree.innerHTML = `
    <button class="hierarchy-node ${state.selectedNodeKey === "site" ? "is-selected" : ""}" type="button" data-node-key="site" style="--depth:0">
      <span class="hierarchy-node__type">Site</span>
      <strong>${escapeHtml(state.site.name.trim() || "Site")}</strong>
      <span>${escapeHtml(state.site.code.trim() || "Site code or business unit")}</span>
    </button>
    ${levelMarkup}
    <button class="hierarchy-node ${state.selectedNodeKey === "equipment" ? "is-selected" : ""}" type="button" data-node-key="equipment" style="--depth:${
      state.levels.length + 1
    }">
      <span class="hierarchy-node__type">Equipment</span>
      <strong>${escapeHtml(state.equipment.name.trim() || "Equipment")}</strong>
      <span>${escapeHtml(state.equipment.tag.trim() || "Equipment tag or asset code")}</span>
    </button>
    ${componentMarkup}
  `;
};

const renderSelectedNodePanel = () => {
  const node = getSelectedNode();

  const titleMap = {
    site: "Site details",
    level: "Location or system level",
    equipment: "Equipment details",
    component: "Component details",
  };

  const descriptionMap = {
    site: "Anchor the strategy to the correct site or operating location.",
    level: "Use flexible labels such as area, section, system, sub-system, or functional location.",
    equipment: "Capture the asset identity and minimum context needed for equipment-level strategy building.",
    component: "Use component breakdown only where the maintenance logic needs to go below the equipment level.",
  };

  const metaBadges = getPathSegmentsForNode(node.key)
    .map(
      (segment) =>
        `<span class="maintenance-node-meta__badge">${escapeHtml(segment.kind)}: ${escapeHtml(
          segment.value
        )}</span>`
    )
    .join("");

  selectedNodeTitle.textContent = titleMap[node.type];
  selectedNodeDescription.textContent = descriptionMap[node.type];
  selectedNodeMeta.innerHTML = metaBadges;
  removeSelectedNodeButton.hidden = !node.removable;

  if (node.type === "site") {
    selectedNodeFields.innerHTML = `
      ${renderField("Name", "name", node.data.name, "Example: Christmas Creek", "text")}
      ${renderField("Code", "code", node.data.code, "Example: CCK", "text")}
      ${renderField(
        "Description",
        "description",
        node.data.description,
        "Optional business or location notes",
        "textarea",
        true
      )}
    `;
    return;
  }

  if (node.type === "level") {
    selectedNodeFields.innerHTML = `
      ${renderField("Level label", "label", node.data.label, "Example: Area, Section, System", "text")}
      ${renderField("Level name", "name", node.data.name, "Example: Crushing and Conveying", "text")}
      ${renderField("Code", "code", node.data.code, "Optional location or functional code", "text")}
      ${renderField(
        "Description",
        "description",
        node.data.description,
        "Optional notes about this level",
        "textarea",
        true
      )}
    `;
    return;
  }

  if (node.type === "equipment") {
    selectedNodeFields.innerHTML = `
      ${renderField("Equipment name", "name", node.data.name, "Example: CV-101 Conveyor Drive", "text")}
      ${renderField("Tag / code", "tag", node.data.tag, "Example: CV-101-DR-01", "text")}
      ${renderField("Function", "function", node.data.function, "Example: Transfer ore to surge bin", "text")}
      ${renderField("Asset class", "assetClass", node.data.assetClass, "Example: Conveyor drive", "text")}
      ${renderField(
        "Current maintenance basis",
        "currentMaintenanceBasis",
        node.data.currentMaintenanceBasis,
        "Example: Time-based PM",
        "text"
      )}
      ${renderField(
        "Description",
        "description",
        node.data.description,
        "Optional equipment notes",
        "textarea",
        true
      )}
    `;
    return;
  }

  selectedNodeFields.innerHTML = `
    ${renderField("Component name", "name", node.data.name, "Example: Input shaft bearing", "text")}
    ${renderField("Component code", "code", node.data.code, "Optional code", "text")}
    ${renderField(
      "Description",
      "description",
      node.data.description,
      "Optional failure or context notes",
      "textarea",
      true
    )}
  `;
};

function renderField(label, field, value, placeholder, type, fullWidth = false) {
  const selectedNode = getSelectedNode();
  const inputMarkup =
    type === "textarea"
      ? `<textarea data-field="${field}" rows="4" placeholder="${escapeHtml(placeholder)}">${escapeHtml(
          value || ""
        )}</textarea>`
      : `<input data-field="${field}" type="${type}" value="${escapeHtml(value || "")}" placeholder="${escapeHtml(
          placeholder
        )}">`;

  return `
    <label class="field ${fullWidth ? "field--full" : ""}" data-node-type="${selectedNode.type}">
      <span>${escapeHtml(label)}</span>
      ${inputMarkup}
    </label>
  `;
}

const renderScopeSelector = () => {
  scopeSelector.querySelectorAll(".scope-card").forEach((button) => {
    const isSelected = button.dataset.scope === state.selectedScope;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
};

const renderComponentList = () => {
  if (!state.components.length) {
    componentList.innerHTML = `
      <article class="component-card component-card--empty">
        <strong>No components added yet</strong>
        <p>Stay at equipment level for the MVP, or add only the critical assemblies that need separate maintenance logic.</p>
      </article>
    `;
    return;
  }

  componentList.innerHTML = state.components
    .map((component, index) => {
      const componentKey = `component:${component.id}`;
      const isSelected = state.selectedNodeKey === componentKey;
      return `
        <article class="component-card ${isSelected ? "is-selected" : ""}">
          <button class="component-card__main" type="button" data-node-key="${componentKey}">
            <span class="component-card__index">Component ${index + 1}</span>
            <strong>${escapeHtml(getComponentDisplayName(component, index))}</strong>
            <p>${escapeHtml(component.description.trim() || component.code.trim() || "No description added yet.")}</p>
          </button>
          <button class="component-card__remove" type="button" data-remove-component="${component.id}">Remove</button>
        </article>
      `;
    })
    .join("");
};

const renderReadiness = () => {
  const checks = getReadinessChecks();
  const completeCount = checks.filter((item) => item.complete).length;
  const score = Math.round((completeCount / checks.length) * 100);
  const ready = isStepReady();

  completenessValue.textContent = `${score}%`;
  completenessBar.style.width = `${score}%`;
  readinessChecklist.innerHTML = checks
    .map(
      (item) => `
        <li class="readiness-list__item ${item.complete ? "is-complete" : "is-incomplete"}">
          <span class="readiness-list__dot" aria-hidden="true"></span>
          <span>${escapeHtml(item.label)}</span>
        </li>
      `
    )
    .join("");

  continueButton.disabled = !ready;
};

const renderScopeSummary = () => {
  const target = getScopeTarget();
  scopeSummaryLabel.textContent = `${target.label} scope`;
  scopeSummaryPath.textContent = target.path.map((segment) => segment.value).join(" > ");
};

const renderAll = () => {
  renderPathPills();
  renderHierarchy();
  renderSelectedNodePanel();
  renderScopeSelector();
  renderComponentList();
  renderReadiness();
  renderScopeSummary();
  renderDraftStatus("");
};

const syncStaticInputsFromState = () => {
  strategyNameInput.value = state.strategyName;
  operatingDutyInput.value = state.context.operatingDuty;
  environmentInput.value = state.context.environment;
  criticalityInput.value = state.context.criticality;
  redundancyInput.value = state.context.redundancy;
  accessConstraintsInput.value = state.context.accessConstraints;
  notesInput.value = state.context.notes;
};

const showNotice = (message) => {
  workflowNotice.hidden = false;
  workflowNotice.textContent = message;
};

const hideNotice = () => {
  workflowNotice.hidden = true;
  workflowNotice.textContent = "";
};

const updateSelectedNodeField = (field, value) => {
  const selectedNode = getSelectedNode();

  if (selectedNode.type === "site") {
    state.site[field] = value;
    return;
  }

  if (selectedNode.type === "equipment") {
    state.equipment[field] = value;
    return;
  }

  if (selectedNode.type === "level") {
    selectedNode.data[field] = value;
    return;
  }

  selectedNode.data[field] = value;
};

const addLevel = () => {
  const nextLevel = createLevel(state.levels.length);
  state.levels.push(nextLevel);
  state.selectedNodeKey = `level:${nextLevel.id}`;
  persistDraft();
  renderAll();
  hideNotice();
};

const addComponent = () => {
  const nextComponent = createComponent();
  state.components.push(nextComponent);
  state.selectedNodeKey = `component:${nextComponent.id}`;
  persistDraft();
  renderAll();
  hideNotice();
};

const removeSelectedNode = () => {
  const selectedNode = getSelectedNode();
  if (!selectedNode.removable) {
    return;
  }

  if (selectedNode.type === "level") {
    state.levels = state.levels.filter((level) => level.id !== selectedNode.data.id);
    state.selectedNodeKey = state.levels.length
      ? `level:${state.levels[Math.max(0, state.levels.length - 1)].id}`
      : "site";
  }

  if (selectedNode.type === "component") {
    state.components = state.components.filter((component) => component.id !== selectedNode.data.id);
    state.selectedNodeKey = "equipment";
  }

  persistDraft();
  renderAll();
  hideNotice();
};

const removeComponentById = (componentId) => {
  state.components = state.components.filter((component) => component.id !== componentId);
  if (!isNodeKeyValid(state, state.selectedNodeKey)) {
    state.selectedNodeKey = "equipment";
  }
  persistDraft();
  renderAll();
  hideNotice();
};

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

hierarchyTree?.addEventListener("click", (event) => {
  const nodeButton = event.target.closest("[data-node-key]");
  if (!nodeButton) {
    return;
  }

  state.selectedNodeKey = nodeButton.dataset.nodeKey;
  renderAll();
  hideNotice();
});

componentList?.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-component]");
  if (removeButton) {
    removeComponentById(removeButton.dataset.removeComponent);
    return;
  }

  const nodeButton = event.target.closest("[data-node-key]");
  if (!nodeButton) {
    return;
  }

  state.selectedNodeKey = nodeButton.dataset.nodeKey;
  renderAll();
  hideNotice();
});

selectedNodeFields?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-field]");
  if (!input) {
    return;
  }

  updateSelectedNodeField(input.dataset.field, input.value);
  persistDraft();
  renderPathPills();
  renderHierarchy();
  renderComponentList();
  renderReadiness();
  renderScopeSummary();
  renderDraftStatus("");

  if (input.dataset.field === "label") {
    renderSelectedNodePanel();
  }
});

scopeSelector?.addEventListener("click", (event) => {
  const scopeButton = event.target.closest("[data-scope]");
  if (!scopeButton) {
    return;
  }

  state.selectedScope = scopeButton.dataset.scope;

  if (state.selectedScope === "component" && !state.components.length) {
    const nextComponent = createComponent();
    state.components.push(nextComponent);
    state.selectedNodeKey = `component:${nextComponent.id}`;
  }

  if (state.selectedScope === "system" && !state.levels.length) {
    const nextLevel = createLevel(0);
    state.levels.push(nextLevel);
    state.selectedNodeKey = `level:${nextLevel.id}`;
  }

  persistDraft();
  renderAll();
  hideNotice();
});

strategyNameInput?.addEventListener("input", (event) => {
  state.strategyName = event.target.value;
  persistDraft();
  renderReadiness();
  renderDraftStatus("");
  hideNotice();
});

[
  [operatingDutyInput, "operatingDuty"],
  [environmentInput, "environment"],
  [criticalityInput, "criticality"],
  [redundancyInput, "redundancy"],
  [accessConstraintsInput, "accessConstraints"],
  [notesInput, "notes"],
].forEach(([element, field]) => {
  element?.addEventListener("input", (event) => {
    state.context[field] = event.target.value;
    persistDraft();
    renderReadiness();
    renderDraftStatus("");
    hideNotice();
  });
});

addLevelButton?.addEventListener("click", addLevel);
addComponentButton?.addEventListener("click", addComponent);
addComponentButtonSecondary?.addEventListener("click", addComponent);
removeSelectedNodeButton?.addEventListener("click", removeSelectedNode);

saveDraftButton?.addEventListener("click", () => {
  persistDraft({
    message: "Draft saved locally in this browser.",
  });
  showNotice("Draft saved locally. You can come back to this Step 1 screen and continue editing.");
});

continueButton?.addEventListener("click", () => {
  persistDraft({
    message: "Step 1 is complete and saved locally.",
  });
  showNotice(
    "Step 1 is complete. The next workflow to build is Failure Definition, so this draft is ready to hand off into that step."
  );
});

syncStaticInputsFromState();
renderAll();
