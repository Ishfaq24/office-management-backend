import Employee from '../models/employeeModel.js';

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private (Admin)
export const createEmployee = async (req, res) => {
  try {
    const { name, email, position, department, salary } = req.body;

    if (!name || !email || !position || !salary) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    console.log('🧠 Headers:', req.headers.authorization);


    const existing = await Employee.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Employee already exists' });

    const newEmployee = await Employee.create({
      name,
      email,
      position,
      department,
      salary,
    });

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      employee: newEmployee,
    });
  } catch (error) {
    console.error('Error in createEmployee:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({ success: true, count: employees.length, employees });
  } catch (error) {
    console.error('Error in getAllEmployees:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error('Error in getEmployeeById:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin)
export const updateEmployee = async (req, res) => {
  try {
    const { name, email, position, department, salary } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.position = position || employee.position;
    employee.department = department || employee.department;
    employee.salary = salary || employee.salary;

    const updated = await employee.save();
    res.status(200).json({ success: true, message: 'Employee updated', employee: updated });
  } catch (error) {
    console.error('Error in updateEmployee:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin)
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    await employee.deleteOne();
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error in deleteEmployee:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
