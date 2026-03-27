import React, { useState, useEffect } from "react";

const initialData = {
  todo: [],
  inProgress: [],
  done: [],
};

function App() {
  const [tasks, setTasks] = useState(initialData);
  const [title, setTitle] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title,
    };
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
    <div style={styles.column}>
      <h3>{title}</h3>
      {tasks[columnKey].map((task) => (
        <div key={task.id} style={styles.card}>
          <p>{task.title}</p>
          <div>
            {columnKey !== "todo" && (
              <button onClick={() => moveTask(task, columnKey, "todo")}>←</button>
            )}
            {columnKey !== "done" && (
              <button onClick={() => moveTask(task, columnKey, columnKey === "todo" ? "inProgress" : "done")}>→</button>
            )}
            <button onClick={() => deleteTask(task.id, columnKey)}>❌</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      <h1>Task Board</h1>

      <div style={styles.inputContainer}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div style={styles.board}>
        <Column title="To Do" columnKey="todo" />
        <Column title="In Progress" columnKey="inProgress" />
        <Column title="Done" columnKey="done" />
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial",
  },
  inputContainer: {
    marginBottom: "20px",
  },
  board: {
    display: "flex",
    justifyContent: "space-around",
  },
  column: {
    width: "30%",
    background: "#f4f4f4",
    padding: "10px",
    borderRadius: "10px",
  },
  card: {
    background: "white",
    margin: "10px 0",
    padding: "10px",
    borderRadius: "5px",
  },
};

export default App;
