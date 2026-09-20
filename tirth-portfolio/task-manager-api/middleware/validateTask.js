function validateTask(req, res, next) {
  const { title, completed, priority } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ error: "Completed must be a boolean" });
  }

  if (priority !== undefined && !["low", "medium", "high"].includes(priority)) {
    return res.status(400).json({ error: "Priority must be low, medium, or high" });
  }

  next();
}

module.exports = validateTask;
