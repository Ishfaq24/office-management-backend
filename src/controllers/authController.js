import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    console.log("📦 Register Body:", req.body);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User exists");
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password, // ⚠️ plain password here, let the model hash it
      role: role || 'employee',
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("📩 Login attempt:", email, password);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("🔐 Stored Hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password match result:", isMatch);

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials (wrong password)" });

    const token = generateToken(user._id);
    res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }, token });
  } catch (error) {
    next(error);
  }
};



// @desc    Get logged-in user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
