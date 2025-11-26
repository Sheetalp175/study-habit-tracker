import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  message: String,
  reminder_time: Date,
});

export default mongoose.model("Reminder", reminderSchema);
