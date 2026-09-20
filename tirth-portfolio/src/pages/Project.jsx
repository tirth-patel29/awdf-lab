import { useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "../lib/api";

const emptyForm = { title: "", description: "", completed: false, priority: "medium" };

function Project() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await updateTask(editingId, form);
        setMessage("Task updated successfully.");
      } else {
        await createTask(form);
        setMessage("Task created successfully.");
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setForm({
      title: task.title,
      description: task.description || "",
      completed: task.completed,
      priority: task.priority || "medium",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    setError("");
    setMessage("");
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task._id !== id));
      setMessage("Task deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    `${task.title} ${task.description}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <section>
        <h1>Task Manager</h1>
        <p>Tasks are now loaded from the Express + MongoDB backend.</p>

        <form className="task-form" onSubmit={handleSubmit}>
          <label>Task Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter task title"
            required
          />

          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Enter task description"
            rows="3"
          />

          <div className="form-row">
            <label>
              Priority
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.completed}
                onChange={(e) => setForm({ ...form, completed: e.target.checked })}
              />
              Completed
            </label>
          </div>

          <div className="button-row">
            <button disabled={saving}>{saving ? "Saving..." : editingId ? "Update Task" : "Add Task"}</button>
            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </section>

      <section>
        <div className="section-heading">
          <h2>Your Tasks</h2>
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
          />
        </div>

        {loading && <p>Loading tasks...</p>}
        {!loading && filteredTasks.length === 0 && <p>No tasks found.</p>}

        <div className="task-list">
          {filteredTasks.map((task) => (
            <article className="task-card" key={task._id}>
              <div>
                <span className={`priority priority-${task.priority}`}>{task.priority}</span>
                <h3>{task.title}</h3>
                <p>{task.description || "No description."}</p>
                <p className={task.completed ? "completed" : "pending"}>
                  {task.completed ? "Completed" : "Pending"}
                </p>
              </div>
              <div className="button-row">
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button className="danger-button" onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Project;
