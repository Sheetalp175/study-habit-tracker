// backend/routes/userRoutes.js
import authMiddleware from "../middleware/authMiddleware.js";

import express from "express";
import { registerUser, authUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/update-streak", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000) // subtract 1 day
      .toISOString()
      .split("T")[0];

    if (user.lastActiveDate === today) {
      return res.json({ streak: user.streakCount });
    }

    if (user.lastActiveDate === yesterday) {
      user.streakCount += 1;
    } else {
      user.streakCount = 1; // new streak starts
    }

    user.lastActiveDate = today;
    await user.save();

    res.json({ streak: user.streakCount });
  } catch (err) {
    res.status(500).json({ message: "Streak update failed" });
  }
});

export default router;
