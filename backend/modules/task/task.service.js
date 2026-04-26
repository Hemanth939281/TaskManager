import Task from "./task.model.js";
import User from "../user/user.model.js";
import AppError from "../../utils/AppError.js";

export const getTasks = async ({ user }) => {
  if (user.role === "admin") {
    return await Task.find()
      .sort({ createdAt: -1 })
      .populate([
        { path: "assignedTo", select: "name email" },
        { path: "createdBy", select: "name email" },
      ]);
  }

  return await Task.find({ assignedTo: user.id })
    .sort({ createdAt: -1 })
    .populate([
      { path: "assignedTo", select: "name email" },
      { path: "createdBy", select: "name email" },
    ]);
};

export const createTask = async (body, user) => {
  const { title, description, assignedTo, dueDate } = body;

  if (!title || !assignedTo) {
    throw new AppError("Title and assignedTo are required", 400);
  }

  const assignedUser = await User.findById(assignedTo);
  if (!assignedUser) {
    throw new AppError("Assigned user not found", 404);
  }
  if (user.role !== "admin") {
    throw new AppError("Only admin can create tasks", 403);
  }

  const task = await Task.create({
    title,
    description,
    assignedTo,
    createdBy: user.id,
    dueDate,
  });

  return task;
};

export const updateTaskStatus = async (taskId, status, user) => {
  const validStatus = ["pending", "in-progress", "completed"];

  if (!validStatus.includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (user.role !== "admin" && task.assignedTo.toString() !== user.id) {
    throw new AppError("Forbidden", 403);
  }

  task.status = status;
  await task.save();

  return task;
};


export const updateTask = async (taskId, body)  => {
   const task = await Task.findById(taskId);
  if(!task){
    throw new AppError("Task not found", 404);
  }
  return await Task.findByIdAndUpdate(taskId, body, { new: true});

}


export const deleteTask = async (taskId) => {
  const task = await Task.findById(taskId);
  if(!task){
    throw new AppError("Task not found", 404);
  }
  return await Task.findByIdAndDelete(taskId);
}
