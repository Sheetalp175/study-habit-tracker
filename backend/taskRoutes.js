// backend/routes/taskRoutes.js
import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import auth from "../middleware/authMiddleware.js";
import { getWeeklyStats } from "../controllers/taskController.js";

const router = express.Router();

router.route("/").get(auth, getTasks).post(auth, createTask);
router.route("/:id").put(auth, updateTask).delete(auth, deleteTask);
router.get("/stats/weekly", auth, getWeeklyStats);

export default router;
