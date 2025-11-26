import SubTask from "../models/SubTask.js";

export const createSubTask = async (req, res) => {
  try {
    const { title } = req.body;

    const subtask = await SubTask.create({
      taskId: req.params.taskId,
      title,
    });

    res.status(201).json(subtask);
  } catch (err) {
    res.status(500).json({ message: "Error creating subtask", error: err.message });
  }
};

export const getSubTasks = async (req, res) => {
  try {
    const subtasks = await SubTask.find({ taskId: req.params.taskId });
    res.json(subtasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subtasks", error: err.message });
  }
};

export const updateSubTask = async (req, res) => {
  try {
    const updated = await SubTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating subtask", error: err.message });
  }
};

export const deleteSubTask = async (req, res) => {
  try {
    await SubTask.findByIdAndDelete(req.params.id);
    res.json({ message: "Subtask deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting subtask", error: err.message });
  }
};
