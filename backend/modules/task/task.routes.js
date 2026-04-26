import express from "express";
import { getTasks, createTask, updateTaskStatus, updateTask, deleteTask } from "./task.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleAuthorizationMiddleware } from "../../middlewares/roleAuthorizationMiddleware.js"

const router = express.Router();

// All routes protected
router.use(authMiddleware);

// GET all / role-based
router.get("/", getTasks);

// ADMIN only
router.post("/", roleAuthorizationMiddleware("admin"), createTask);

// Update status (admin or assigned user)
router.put("/:id/status", updateTaskStatus);

// Update task (Admin only)
router.put("/:id/", roleAuthorizationMiddleware("admin"), updateTask);

// delete task (Admin only)
router.delete("/:id", roleAuthorizationMiddleware("admin"), deleteTask)

export default router;
