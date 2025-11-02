import Department from "../models/departmentModel.js";

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public or Private (based on auth setup)
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch departments", error });
  }
};

// @desc    Get single department by ID
// @route   GET /api/departments/:id
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Create new department
// @route   POST /api/departments
export const createDepartment = async (req, res) => {
  const { name, description, head } = req.body;

  try {
    const exists = await Department.findOne({ name });
    if (exists) return res.status(400).json({ message: "Department already exists" });

    const department = await Department.create({ name, description, head });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: "Failed to create department", error });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
export const updateDepartment = async (req, res) => {
  const { name, description, head, totalEmployees } = req.body;

  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    department.name = name || department.name;
    department.description = description || department.description;
    department.head = head || department.head;
    department.totalEmployees = totalEmployees ?? department.totalEmployees;

    const updated = await department.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update department", error });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    await department.deleteOne();
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete department", error });
  }
};
