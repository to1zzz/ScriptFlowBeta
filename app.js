const { useState } = React;

function App() {
  const [projects, setProjects] = useState([
    { id: 1, name: "Project" }
  ]);
  const [currentProject, setCurrentProject] = useState(null);

  if (!currentProject) {
    return (
      <Home
        projects={projects}
        setProjects={setProjects}
        openProject={setCurrentProject}
      />
    );
  }

  return (
    <Workspace
      project={currentProject}
      goBack={() => setCurrentProject(null)}
    />
  );
}

/* ===== HOME ===== */
function Home({ projects, setProjects, openProject }) {
  const [menu, setMenu] = useState(null);

  const addProject = () => {
    setProjects([
      ...projects,
      { id: Date.now(), name: "Project" }
    ]);
  };

  const rename = (p) => {
    const name = prompt("New name:", p.name);
    if (!name) return;
    setProjects(projects.map(x =>
      x.id === p.id ? { ...x, name } : x
    ));
  };

  const remove = (p) => {
    setProjects(projects.filter(x => x.id !== p.id));
  };

  return (
    <div className="home" onClick={() => setMenu(null)}>
      <h1>ScriptFlow</h1>

      <div className="projects">
        {projects.map(p => (
          <div
            key={p.id}
            className="project"
            onClick={() => openProject(p)}
            onContextMenu={(e) => {
              e.preventDefault();
              setMenu({ x: e.clientX, y: e.clientY, p });
            }}
          >
            {p.name}
          </div>
        ))}
      </div>

      <br />
      <button onClick={addProject}>+ New Project</button>

      {menu && (
        <div
          className="context-menu"
          style={{ top: menu.y, left: menu.x }}
        >
          <div onClick={() => rename(menu.p)}>Rename</div>
          <div className="danger" onClick={() => remove(menu.p)}>Delete</div>
        </div>
      )}
    </div>
  );
}

/* ===== WORKSPACE ===== */
function Workspace({ project, goBack }) {
  const [scenes, setScenes] = useState([
    { id: 1, name: "Scene", text: "" }
  ]);
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(null);

  const addScene = () => {
    setScenes([...scenes, {
      id: Date.now(),
      name: "Scene",
      text: ""
    }]);
  };

  const rename = (s) => {
    const name = prompt("New name:", s.name);
    if (!name) return;
    setScenes(scenes.map(x =>
      x.id === s.id ? { ...x, name } : x
    ));
  };

  const remove = (s) => {
    setScenes(scenes.filter(x => x.id !== s.id));
    setActive(0);
  };

  const updateText = (e) => {
    const newScenes = [...scenes];
    newScenes[active].text = e.target.innerText;
    setScenes(newScenes);
  };

  return (
    <div className="workspace" onClick={() => setMenu(null)}>
      <div style={{ padding: "10px" }}>
        <button onClick={goBack}>← Back</button>
        <h2>{project.name}</h2>
      </div>

      <div className="workspace-body">
        {/* sidebar */}
        <div className="sidebar">
          {scenes.map((s, i) => (
            <div
              key={s.id}
              className={"scene " + (i === active ? "active" : "")}
              onClick={() => setActive(i)}
              onContextMenu={(e) => {
                e.preventDefault();
                setMenu({ x: e.clientX, y: e.clientY, s });
              }}
            >
              {s.name}
            </div>
          ))}

          <button className="add-scene" onClick={addScene}>
            + Scene
          </button>
        </div>

        {/* editor */}
        <div className="editor-container">
          <div
            className="editor"
            contentEditable
            suppressContentEditableWarning
            onInput={updateText}
          >
            {scenes[active].text}
          </div>

          {/* нижняя панель */}
          <div className="toolbar">
            <button onClick={() => document.execCommand("bold")}>B</button>
            <button onClick={() => document.execCommand("italic")}>I</button>
            <button onClick={() => document.execCommand("insertText", false, "INT.")}>INT</button>
            <button onClick={() => document.execCommand("insertText", false, "EXT.")}>EXT</button>
          </div>
        </div>
      </div>

      {menu && (
        <div
          className="context-menu"
          style={{ top: menu.y, left: menu.x }}
        >
          <div onClick={() => rename(menu.s)}>Rename</div>
          <div className="danger" onClick={() => remove(menu.s)}>Delete</div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
