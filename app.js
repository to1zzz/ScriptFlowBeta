import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [projects, setProjects] = useState([
    { id: 1, name: "Project 1", workspaces: [] }
  ]);

  const [currentProject, setCurrentProject] = useState(null);

  // --- PROJECTS ---
  const createProject = () => {
    const name = prompt("Project name") || `Project ${projects.length + 1}`;
    setProjects([...projects, { id: Date.now(), name, workspaces: [] }]);
  };

  const deleteProject = (id) => {
    if (window.confirm("Delete project?")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  // --- WORKSPACES ---
  const createWorkspace = () => {
    const name =
      prompt("Workspace name") ||
      `Workspace ${currentProject.workspaces.length + 1}`;

    const updated = {
      ...currentProject,
      workspaces: [
        ...currentProject.workspaces,
        { id: Date.now(), name }
      ]
    };

    updateProject(updated);
  };

  const updateProject = (updated) => {
    setProjects(projects.map(p => (p.id === updated.id ? updated : p)));
    setCurrentProject(updated);
  };

  // --- HOME SCREEN ---
  if (!currentProject) {
    return (
      <div className="home">
        <h1 className="logo">SF ScriptFlow</h1>

        <div className="grid">
          {projects.map((p) => (
            <div
              key={p.id}
              className="card"
              onClick={() => setCurrentProject(p)}
              onContextMenu={(e) => {
                e.preventDefault();
                deleteProject(p.id);
              }}
            >
              {p.name}
            </div>
          ))}
        </div>

        <button className="btn" onClick={createProject}>
          + New Project
        </button>
      </div>
    );
  }

  // --- PROJECT SCREEN ---
  return (
    <div className="project">
      <button className="back" onClick={() => setCurrentProject(null)}>
        ← Back
      </button>

      <h2>{currentProject.name}</h2>

      <div className="grid">
        {currentProject.workspaces.map((w) => (
          <div key={w.id} className="card">
            {w.name}
          </div>
        ))}
      </div>

      <button className="btn" onClick={createWorkspace}>
        + Workspace
      </button>
    </div>
  );
}
