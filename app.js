let projects = [];
let currentProject = null;
let currentScene = null;

/* NAVIGATION */

function goProjects() {
  hideAll();
  show("projectsScreen");
  renderProjects();
}

function openWorkspace(project) {
  currentProject = project;
  hideAll();
  show("workspace");

  document.getElementById("projectName").innerText = project.name;

  renderScenes();
}

function hideAll() {
  document.querySelectorAll(".screen, #workspace")
    .forEach(el => el.classList.add("hidden"));
}

function show(id) {
  document.getElementById(id).classList.remove("hidden");
}

/* PROJECTS */

function createProject() {
  const name = prompt("Project name:");
  if (!name) return;

  const p = {
    name,
    scenes: [],
    folders: []
  };

  projects.push(p);
  renderProjects();
}

function renderProjects() {
  const tabs = document.getElementById("projectTabs");
  const bars = document.getElementById("projectBars");

  tabs.innerHTML = "";
  bars.innerHTML = "";

  projects.forEach(p => {

    const tab = document.createElement("div");
    tab.className = "project-tab";
    tab.innerText = p.name;

    tab.onclick = () => openWorkspace(p);

    tabs.appendChild(tab);

    const bar = document.createElement("div");
    bar.className = "bar";

    p.scenes.forEach(s => {
      const seg = document.createElement("div");
      seg.className = "seg";
      bar.appendChild(seg);
    });

    bars.appendChild(bar);
  });
}

/* SCENES */

function addScene() {
  if (!currentProject) return;

  const s = {
    title: "Scene " + (currentProject.scenes.length + 1),
    content: ""
  };

  currentProject.scenes.push(s);
  currentScene = s;

  renderScenes();
  renderEditor();
}

function renderScenes() {
  const el = document.getElementById("scenes");
  el.innerHTML = "";

  currentProject.scenes.forEach(s => {
    const div = document.createElement("div");
    div.className = "scene";
    div.innerText = s.title;

    div.onclick = () => {
      currentScene = s;
      renderScenes();
      renderEditor();
    };

    if (currentScene === s) {
      div.classList.add("active");
    }

    el.appendChild(div);
  });
}

function renderEditor() {
  const editor = document.getElementById("editor");

  if (!currentScene) {
    editor.innerText = "Create a scene";
    return;
  }

  editor.innerText = currentScene.content;

  editor.oninput = () => {
    currentScene.content = editor.innerText;
  };
}
