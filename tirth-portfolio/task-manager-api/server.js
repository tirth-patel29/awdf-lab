const express = require("express");

const app = express();
const PORT = 5000;

app.use(express.json());

// Temporary in-memory task storage
let tasks = [
  {
    id: 1,
    title: "Complete Practical 4",
    description: "Build REST API using Node.js and Express",
    completed: false,
  },
];

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.url} - ${new Date().toISOString()}`
  );

  next();
});

// GET /tasks
// Return all tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// POST /tasks
// Create a new task
app.post("/tasks", (req, res) => {
  const { title, description, completed } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Title is required",
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description: description || "",
    completed: completed || false,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// PUT /tasks/:id
// Update an existing task
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  const { title, description, completed } = req.body;

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.completed = completed ?? task.completed;

  res.status(200).json(task);
});

// DELETE /tasks/:id
// Delete an existing task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1);

  res.status(200).json({
    message: "Task deleted successfully",
    task: deletedTask[0],
  });
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Task Manager API is running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});