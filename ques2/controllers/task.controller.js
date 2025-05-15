const Task = require("../models/task.model");

// Create Task
const createTask = async (req, res) => {
  try {
    const existing = await Task.findOne({ title: req.body.title });
    if (existing) return res.status(409).json({ message: "Task title must be unique" });

    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Tasks
const getTasks = async (req, res) => {
  try {
    const { priority, isCompleted } = req.query;
    const filter = {};
    if (priority) filter.priority = priority;
    if (isCompleted) filter.isCompleted = isCompleted === "true";
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = {};

    ["title", "description", "priority"].forEach((field) => {
      if (req.body[field]) updateFields[field] = req.body[field];
    });

    if (req.body.isCompleted === true) {
      updateFields.isCompleted = true;
      updateFields.completionDate = new Date();
    }

    const task = await Task.findByIdAndUpdate(id, updateFields, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Tasks by Priority
const deleteTasks = async (req, res) => {
  try {
    const { priority } = req.query;
    if (!priority) return res.status(400).json({ message: "Priority query param is required" });

    const result = await Task.deleteMany({ priority });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTasks };
