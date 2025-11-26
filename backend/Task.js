import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    estimateMin: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },

    // 👇 IMPORTANT: Correct subtasks structure
    subtasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubTask",
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
