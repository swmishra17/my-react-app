import React, { useState, useEffect } from "react";
import "./App.css";

const initialData = {
  todo: [],
  inProgress: [],
  done: [],
};

function App() {
  const [tasks, setTasks] = useState(initialData);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title.trim()) return;
    const newTask = { id: Date.now(), title };
    setTasks({ ...tasks, todo: [...tasks.todo, newTask] });
    setTitle("");
  };

  const deleteTask = (id, column) => {
    const updated = tasks[column].filter((t) => t.id !== id);
    setTasks({ ...tasks, [column]: updated });
  };

  const moveTask = (task, from, to) => {
    const fromList = tasks[from].filter((t) => t.id !== task.id);
    const toList = [...tasks[to], task];
    setTasks({ ...tasks, [from]: fromList, [to]: toList });
  };

  const Column = ({ title, columnKey }) => (
    <div className="column">
      <h3>{title}</h3>
      {tasks[columnKey].map((task) => (
        <div key={task.id} className="task-card">
          <p>{task.title}</p>
          <div className="task-actions">
            {columnKey !== "todo" && (
              <button className="action-btn" onClick={() => moveTask(task, columnKey, "todo")}>↩</button>
            )}
            {columnKey !== "done" && (
              <button className="action-btn" onClick={() => moveTask(task, columnKey, columnKey === "todo" ? "inProgress" : "done")}>↪</button>
            )}
            <button className="action-btn delete" onClick={() => deleteTask(task.id, columnKey)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="app-wrapper">
      <div className="board-header">
        <h1>Task Board</h1>
        <p>Organize your workflow with drag-free task management.</p>
      </div>

      <div className="input-area">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="task-input"
        />
        <button className="add-btn" onClick={addTask}>Add Task</button>
      </div>

      <div className="board-grid">
        <Column title="To Do" columnKey="todo" />
        <Column title="In Progress" columnKey="inProgress" />
        <Column title="Done" columnKey="done" />
      </div>
    </div>
  );
}

export default App;
