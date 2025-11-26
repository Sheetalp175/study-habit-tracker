import Reminder from "../models/Reminder.js";

export const createReminder = async (req, res) => {
  const reminder = await Reminder.create({
    ...req.body,
    user_id: req.user._id
  });
  res.json(reminder);
};
