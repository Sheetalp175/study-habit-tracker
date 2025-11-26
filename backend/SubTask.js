import mongoose from "mongoose";

const subTaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// DEFAULT EXPORT REQUIRED
export default mongoose.model("SubTask", subTaskSchema);
