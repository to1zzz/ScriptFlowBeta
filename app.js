const app = document.getElementById("app");

let state = {
  view: "home",
  projects: [],
  currentProject: null,
  currentWorkspace: null,
  currentScene: null
};

let contextTarget = null;

/* ---------- STORAGE ---------- */

function save() {
  localStorage.setItem("scriptflow", JSON.stringify(state));
}

function load() {
  const data = localStorage.getItem("scriptflow");
  if (data) state = JSON.parse(data);
}

function uid() {
  return Date.now().toString();
}

/* ---------- CONTEXT MENU ---------- */

function showMenu(e, type, id) {
  e.preventDefault();

  contextTarget = { type, id };

  removeMenu();

  const menu = document.createElement("div");
  menu.className = "context-menu";
  menu.style.top = e.pageY + "px";
  menu.style.left = e.pageX + "px";

  menu.innerHTML = `
    <div class="context-item" onclick="renameItem()">Rename</div>
    <div class="context-item context-delete" onclick="deleteItem()">Delete</div>
  `;

  document.body.appendChild(menu);

  document.addEventListener("click", removeMenu);
}

function removeMenu() {
  const m = document.querySelector(".context-menu");
  if (m) m.remove();
}

/* ---------- ACTIONS ---------- */

function renameItem() {
  const name = prompt("New name");
  if (!name) return;

  if (contextTarget.type === "project") {
    const p = state.projects.find(p => p.id === contextTarget.id);
    p.name = name;
  }

  if (contextTarget.type === "workspace") {
    const p = state.projects.find(p => p.id === state.currentProject);
    const w = p.workspaces.find(w => w.id === contextTarget.id);
    w.name = name;
  }

  save();
  render();
}

function deleteItem() {
  if (contextTarget.type === "project") {
    state.projects = state.projects.filter(p => p.id !== contextTarget.id);
  }

  if (contextTarget.type === "workspace") {
    const p = state.projects.find(p => p.id === state.currentProject);
    p.workspaces = p.workspaces.filter(w => w.id !== contextTarget.id);
  }

  save();
  render();
}

/* ---------- HOME ---------- */

function renderHome() {
  app.innerHTML = `
    <div class="header">ScriptFlow</div>

    <div class="grid">
      ${state.projects.map(p => `
        <div class="card"
          onclick="openProject('${p.id}')"
          oncontextmenu="showMenu(event,'project','${p.id}')">
          ${p.name}
        </div>
      `).join("")}
    </div>

    <button class="btn" onclick="createProject()">+ New Project</button>
  `;
}

function createProject() {
  const name = prompt("Project name") || "Project";

  state.projects.push({
    id: uid(),
    name,
    workspaces: []
  });

  save();
  render();
}

function openProject(id) {
  state.currentProject = id;
  state.view = "project";
  render();
}

/* ---------- PROJECT ---------- */

function renderProject() {
  const project = state.projects.find(p => p.id === state.currentProject);

  app.innerHTML = `
    <div class="header">
      <button onclick="goHome()">← Back</button>
      ${project.name}
    </div>

    <div class="grid">
      ${project.workspaces.map(w => `
        <div class="card"
          onclick="openWorkspace('${w.id}')"
          oncontextmenu="showMenu(event,'workspace','${w.id}')">
          ${w.name}
        </div>
      `).join("")}
    </div>

    <button class="btn" onclick="createWorkspace()">+ Workspace</button>
  `;
}

function createWorkspace() {
  const p = state.projects.find(p => p.id === state.currentProject);

  const name = prompt("Workspace name") || "Workspace";

  p.workspaces.push({
    id: uid(),
    name,
    scenes: []
  });

  save();
  render();
}

function openWorkspace(id) {
  state.currentWorkspace = id;
  state.view = "workspace";
  render();
}

/* ---------- WORKSPACE ---------- */

function renderWorkspace() {
  const p = state.projects.find(p => p.id === state.currentProject);
  const w = p.workspaces.find(w => w.id === state.currentWorkspace);

  app.innerHTML = `
    <div class="header">
      <button onclick="renderProject()">← Back</button>
      ${w.name}
    </div>

    <div class="editor">
      <div class="sidebar">
        ${w.scenes.map(s => `
          <div class="scene ${state.currentScene === s.id ? "active" : ""}"
               onclick="selectScene('${s.id}')">
            ${s.name}
          </div>
        `).join("")}

        <button onclick="createScene()">+ Scene</button>
      </div>

      <div class="editor-area">
        <textarea oninput="updateText(this.value)">
${getText()}
        </textarea>
      </div>
    </div>
  `;
}

/* ---------- SCENES ---------- */

function createScene() {
  const p = state.projects.find(p => p.id === state.currentProject);
  const w = p.workspaces.find(w => w.id === state.currentWorkspace);

  const s = {
    id: uid(),
    name: "Scene",
    text: ""
  };

  w.scenes.push(s);
  state.currentScene = s.id;

  save();
  render();
}

function selectScene(id) {
  state.currentScene = id;
  render();
}

function updateText(val) {
  const p = state.projects.find(p => p.id === state.currentProject);
  const w = p.workspaces.find(w => w.id === state.currentWorkspace);
  const s = w.scenes.find(s => s.id === state.currentScene);

  if (s) s.text = val;
  save();
}

function getText() {
  const p = state.projects.find(p => p.id === state.currentProject);
  const w = p.workspaces.find(w => w.id === state.currentWorkspace);
  const s = w.scenes.find(s => s.id === state.currentScene);

  return s ? s.text : "";
}

/* ---------- NAV ---------- */

function goHome() {
  state.view = "home";
  render();
}

/* ---------- INIT ---------- */

function render() {
  if (state.view === "home") renderHome();
  if (state.view === "project") renderProject();
  if (state.view === "workspace") renderWorkspace();
}

load();
render();
