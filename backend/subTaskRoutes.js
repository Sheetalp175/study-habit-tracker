import express from "express";
import {
  createSubTask,
  getSubTasks,
  updateSubTask,
  deleteSubTask
} from "../controllers/subtaskController.js";

import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Create subtask
router.post("/:taskId", auth, createSubTask);

// Get all subtasks for a task
router.get("/:taskId", auth, getSubTasks);

// Update subtask status or title
router.put("/:id", auth, updateSubTask);

// Delete subtask
router.delete("/:id", auth, deleteSubTask);

export default router;
