let projects = [];

let currentProject = null;
let currentWorkspace = null;
let currentScene = null;

/* NAV */

function show(id){
  document.querySelectorAll("#home,#projectScreen,#workspaceScreen")
    .forEach(e=>e.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function goHome(){ show("home"); renderProjects(); }
function goProject(){ show("projectScreen"); renderBars(); }

/* PROJECTS */

function createProject(){
  let name = prompt("Project name (optional):") || "Project " + (projects.length+1);

  let p = { name, workspaces:[], last:null };
  projects.push(p);
  renderProjects();
}

function renderProjects(){
  let el = document.getElementById("projects");
  el.innerHTML="";

  projects.forEach(p=>{
    let card=document.createElement("div");
    card.className="card";
    card.innerText=p.name;

    card.onclick=()=>{
      currentProject=p;
      document.getElementById("projectTitle").innerText=p.name;
      show("projectScreen");
      renderBars();
    };

    card.ondblclick=()=>{
      let n=prompt("Rename:",p.name);
      if(n) p.name=n;
      renderProjects();
    };

    el.appendChild(card);
  });
}

/* WORKSPACES */

function createWorkspace(){
  let name = prompt("Workspace name:") || "Workspace " + (currentProject.workspaces.length+1);

  currentProject.workspaces.push({
    name,
    scenes:[],
    last:null
  });

  renderBars();
}

function renderBars(){
  let el=document.getElementById("workspaceBars");
  el.innerHTML="";

  currentProject.workspaces.forEach(w=>{
    let bar=document.createElement("div");
    bar.className="bar";

    w.scenes.forEach(s=>{
      let seg=document.createElement("div");

      if(!s.content) seg.className="seg gray";
      else seg.className="seg white";

      if(w.last===s) seg.className="seg red";

      bar.appendChild(seg);
    });

    bar.onclick=()=>{
      currentWorkspace=w;
      document.getElementById("workspaceTitle").innerText=w.name;
      show("workspaceScreen");
      renderScenes();
    };

    bar.ondblclick=()=>{
      let n=prompt("Rename workspace:",w.name);
      if(n) w.name=n;
      renderBars();
    };

    el.appendChild(bar);
  });
}

/* SCENES */

function addScene(){
  let s={
    title:"Scene "+(currentWorkspace.scenes.length+1),
    content:""
  };

  currentWorkspace.scenes.push(s);
  currentScene=s;

  renderScenes();
  renderEditor();
}

function renderScenes(){
  let el=document.getElementById("scenes");
  el.innerHTML="";

  currentWorkspace.scenes.forEach(s=>{
    let div=document.createElement("div");
    div.className="scene";
    div.innerText=s.title;

    div.onclick=()=>{
      currentScene=s;
      currentWorkspace.last=s;
      renderScenes();
      renderEditor();
    };

    el.appendChild(div);
  });
}

/* EDITOR */

function renderEditor(){
  let editor=document.getElementById("editor");

  if(!currentScene){
    editor.innerText="Create scene";
    return;
  }

  editor.innerHTML=currentScene.content;

  editor.oninput=()=>{
    currentScene.content=editor.innerHTML;
  };
}

/* TOOLBAR */

let editor=document.getElementById("editor");
let toolbar=document.getElementById("toolbar");

editor.addEventListener("mouseup",()=>{
  let sel=window.getSelection();
  if(sel.toString().length===0){
    toolbar.classList.add("hidden");
    return;
  }

  let r=sel.getRangeAt(0).getBoundingClientRect();
  toolbar.style.top=r.top-40+"px";
  toolbar.style.left=r.left+"px";
  toolbar.classList.remove("hidden");
});

function wrapEntity(){
  let sel=window.getSelection();
  let range=sel.getRangeAt(0);

  let span=document.createElement("span");
  span.style.background="#264f78";

  range.surroundContents(span);
  toolbar.classList.add("hidden");
}

/* RIGHT CLICK */

document.getElementById("scenes").addEventListener("contextmenu",(e)=>{
  e.preventDefault();
  let name=prompt("Folder name:");
  if(!name) return;

  currentWorkspace.scenes.push({
    title:"📁 "+name,
    content:""
  });

  renderScenes();
});

/* INIT */

renderProjects();
