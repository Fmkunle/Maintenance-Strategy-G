const body = document.body;
const appShell = document.querySelector(".app-shell");
const sidebarToggle = document.getElementById("sidebarToggle");
const themeToggle = document.getElementById("themeToggle");

const workflowNotice = document.getElementById("workflowNotice");
const assetContextForm = document.getElementById("assetContextForm");
const siteNameInput = document.getElementById("siteNameInput");
const systemNameInput = document.getElementById("systemNameInput");
const assetNameInput = document.getElementById("assetNameInput");
const assetPathPreview = document.getElementById("assetPathPreview");
const saveDraftButton = document.getElementById("saveDraftButton");
const continueButton = document.getElementById("continueButton");

const backgroundDraftTitle = document.getElementById("backgroundDraftTitle");
const backgroundDraftPath = document.getElementById("backgroundDraftPath");
const backgroundDetailHeading = document.getElementById("backgroundDetailHeading");
const backgroundDetailSummary = document.getElementById("backgroundDetailSummary");
const backgroundSiteValue = document.getElementById("backgroundSiteValue");
const backgroundSystemValue = document.getElementById("backgroundSystemValue");
const backgroundAssetValue = document.getElementById("backgroundAssetValue");

const themeStorageKey = "agenticai-theme";
const sidebarStorageKey = "agenticai-sidebar-collapsed";
const draftStorageKey = "maintenance-strategy-step1-draft";

const defaultState = () => ({
  site: "",
  system: "",
  asset: "",
  savedAt: "",
});

const normalizeState = (draft) => {
  const site =
    typeof draft?.site === "string"
      ? draft.site
      : typeof draft?.site?.name === "string"
      ? draft.site.name
      : "";

  const deepestLevelName = Array.isArray(draft?.levels)
    ? [...draft.levels]
        .reverse()
        .find((level) => typeof level?.name === "string" && level.name.trim())
        ?.name || ""
    : "";

  const system =
    typeof draft?.system === "string"
      ? draft.system
      : deepestLevelName;

  const asset =
    typeof draft?.asset === "string"
      ? draft.asset
      : typeof draft?.equipment?.name === "string"
      ? draft.equipment.name
      : "";

  return {
    site,
    system,
    asset,
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

const getDisplayValue = (value, fallback) => value.trim() || fallback;

const getPathPreview = () =>
  [
    getDisplayValue(state.site, "Site"),
    getDisplayValue(state.system, "System"),
    getDisplayValue(state.asset, "Asset"),
  ].join(" > ");

const isStepReady = () =>
  Boolean(state.site.trim() && state.system.trim() && state.asset.trim());

const showNotice = (message) => {
  if (!workflowNotice) {
    return;
  }

  workflowNotice.hidden = false;
  workflowNotice.textContent = message;
};

const hideNotice = () => {
  if (!workflowNotice) {
    return;
  }

  workflowNotice.hidden = true;
  workflowNotice.textContent = "";
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

const renderBackground = () => {
  const hasFullPath = isStepReady();
  const pathPreview = getPathPreview();

  backgroundDraftTitle.textContent = state.asset.trim() || "New strategy draft";
  backgroundDraftPath.textContent = hasFullPath
    ? pathPreview
    : "Complete the asset context to place this draft.";

  backgroundDetailHeading.textContent = hasFullPath
    ? state.asset.trim()
    : "Asset context pending";

  backgroundDetailSummary.textContent = hasFullPath
    ? `This strategy will be created under ${pathPreview}.`
    : "The strategy will appear here once the site, system, and asset are defined.";

  backgroundSiteValue.textContent = getDisplayValue(state.site, "Not set");
  backgroundSystemValue.textContent = getDisplayValue(state.system, "Not set");
  backgroundAssetValue.textContent = getDisplayValue(state.asset, "Not set");
};

const renderForm = () => {
  siteNameInput.value = state.site;
  systemNameInput.value = state.system;
  assetNameInput.value = state.asset;

  systemNameInput.disabled = !state.site.trim();
  assetNameInput.disabled = !state.system.trim();

  assetPathPreview.textContent = getPathPreview();
  continueButton.disabled = !isStepReady();
};

const renderAll = () => {
  renderForm();
  renderBackground();
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

siteNameInput?.addEventListener("input", (event) => {
  state.site = event.target.value;

  if (!state.site.trim()) {
    state.system = "";
    state.asset = "";
  }

  renderAll();
  hideNotice();
});

systemNameInput?.addEventListener("input", (event) => {
  state.system = event.target.value;

  if (!state.system.trim()) {
    state.asset = "";
  }

  renderAll();
  hideNotice();
});

assetNameInput?.addEventListener("input", (event) => {
  state.asset = event.target.value;
  renderAll();
  hideNotice();
});

saveDraftButton?.addEventListener("click", () => {
  persistDraft("Draft saved locally.");
  renderBackground();
});

continueButton?.addEventListener("click", () => {
  if (!isStepReady()) {
    return;
  }

  persistDraft("Asset context saved. This draft is ready for the next step.");
  renderBackground();
});

renderAll();
