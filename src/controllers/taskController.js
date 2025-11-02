import Task from '../models/taskModel.js';
import Employee from '../models/employeeModel.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Admin)
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, dueDate, priority } = req.body;

    if (!title || !assignedTo) {
      return res.status(400).json({ message: 'Title and assigned employee are required' });
    }

    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      return res.status(404).json({ message: 'Assigned employee not found' });
    }

    const newTask = await Task.create({
      title,
      description,
      assignedTo,
      status,
      dueDate,
      priority,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email position');
    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    console.error('Error in getAllTasks:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error('Error in getTaskById:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private (Admin)
export const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, dueDate, priority } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (assignedTo) {
      const employee = await Employee.findById(assignedTo);
      if (!employee) {
        return res.status(404).json({ message: 'Assigned employee not found' });
      }
      task.assignedTo = assignedTo;
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;

    const updatedTask = await task.save();
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get tasks assigned to logged-in employee
// @route   GET /api/tasks/mytasks
// @access  Private (Employee)
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id });
    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    console.error('Error in getMyTasks:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
