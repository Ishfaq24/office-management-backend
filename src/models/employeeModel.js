import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    department: { type: String },
    salary: { type: Number, required: true },
    dateOfJoining: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Employee', employeeSchema);
