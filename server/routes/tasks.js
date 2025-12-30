import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/* READ - Get all tasks */
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

/* CREATE - Add task */
router.post("/", auth, async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    userId: req.userId,
  });
  res.status(201).json(task);
});

/* UPDATE - Edit task */
router.put("/:id", auth, async (req, res) => {
  const updatedTask = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { title: req.body.title },
    { new: true }
  );
  res.json(updatedTask);
});

/* DELETE - Remove task */
router.delete("/:id", auth, async (req, res) => {
  await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });
  res.json({ message: "Task deleted" });
});
// TOGGLE COMPLETE
router.patch("/:id", auth, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

export default router;
