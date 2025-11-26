// backend/controllers/taskController.js
import Task from "../models/Task.js";

// ✅ Create a new Task
// POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, estimateMin, deadline } = req.body;

    if (!title || !estimateMin || !deadline) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const task = new Task({
      userId: req.user.id, // comes from JWT middleware
      title,
      estimateMin,
      deadline,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get all tasks for logged-in user
// GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update a Task
// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete a Task
// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
// 📊 Weekly Stats Controller
export const getWeeklyStats = async (req, res) => {
  try {
    const last7 = new Date();
    last7.setDate(last7.getDate() - 7);

    const tasks = await Task.find({
      user_id: req.user._id,
      createdAt: { $gte: last7 }
    });

    // Count tasks created per day
    const stats = {
      days: [],
      count: []
    };

    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);

      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const tasksForDay = tasks.filter(
        (t) => new Date(t.createdAt) >= day && new Date(t.createdAt) < nextDay
      );

      stats.days.unshift(day.toLocaleDateString());
      stats.count.unshift(tasksForDay.length);
    }

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats" });
  }
};

