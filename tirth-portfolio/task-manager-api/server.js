require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Task = require("./models/Task");
const User = require("./models/User");
const authMiddleware = require("./middleware/auth");
const validateTask = require("./middleware/validateTask");

const app = express();
const PORT = process.env.PORT || 5000;

// Check environment variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing MONGO_URI or JWT_SECRET in .env");
  process.exit(1);
}

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.url} - ${new Date().toISOString()}`
  );
  next();
});

// =========================
// HOME / HEALTH CHECK
// =========================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Task Manager API is running",
  });
});

// =========================
// AUTH - REGISTER
// =========================

app.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

// =========================
// AUTH - LOGIN
// =========================

app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

// =========================
// CURRENT USER
// =========================

app.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// =========================
// GET ALL TASKS
// =========================

app.get("/tasks", authMiddleware, async (req, res, next) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// =========================
// GET SINGLE TASK
// =========================

app.get(
  "/tasks/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

      if (!task) {
        return res.status(404).json({
          error: "Task not found",
        });
      }

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }
);

// =========================
// CREATE TASK
// =========================

app.post(
  "/tasks",
  authMiddleware,
  validateTask,
  async (req, res, next) => {
    try {
      const task = await Task.create({
        ...req.body,
        user: req.user.id,
      });

      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }
);

// =========================
// UPDATE TASK
// =========================

app.put(
  "/tasks/:id",
  authMiddleware,
  validateTask,
  async (req, res, next) => {
    try {
      const task = await Task.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.id,
        },
        {
          title: req.body.title,
          description: req.body.description ?? "",
          completed: req.body.completed ?? false,
          priority: req.body.priority ?? "medium",
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!task) {
        return res.status(404).json({
          error: "Task not found",
        });
      }

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }
);

// =========================
// DELETE TASK
// =========================

app.delete(
  "/tasks/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

      if (!task) {
        return res.status(404).json({
          error: "Task not found",
        });
      }

      res.status(200).json({
        message: "Task deleted successfully",
        task,
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================
// 404 HANDLER
// =========================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// =========================
// GLOBAL ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      details: Object.values(err.errors).map(
        (item) => item.message
      ),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Invalid ID format",
    });
  }

  res.status(500).json({
    error: "Something went wrong",
  });
});

// =========================
// START SERVER + MONGODB
// =========================

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();

module.exports = app;