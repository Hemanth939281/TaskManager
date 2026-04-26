import * as taskService from "./task.service.js";

// GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks({ user: req.user });

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/tasks (admin only)
export const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user);

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/tasks/:id - task status update
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await taskService.updateTaskStatus(id, status, req.user);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/tasks/:id - task update
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await taskService.updateTask(id, req.body);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// DEL /api/tasks/:id - task deletion
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await taskService.deleteTask(id);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

