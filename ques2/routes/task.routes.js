const express = require("express");
const router = express.Router();
const { validateTask } = require("../middleware/task.middleware");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTasks,
} = require("../controllers/task.controller");

router.post("/tasks", validateTask, createTask);
router.get("/tasks", getTasks);
router.patch("/tasks/:id", validateTask, updateTask);
router.delete("/tasks", deleteTasks);

module.exports = router;
