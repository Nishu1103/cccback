const User = require("../models/User");
const { generateToken } = require("../config/jwt");
const createNotification = require("../utils/notification");

// Super Admin and Manager can add employees
exports.addEmployee = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // // Authorization check
    // if (req.user.role !== "Super Admin" && req.user.role !== "Manager") {
    //   return res.status(403).json({ message: "Access denied." });
    // }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }

    // Create new employee
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "Employee", // Default role
    });




    await createNotification("Employee", "Created", user._id, user.name);

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Fetch all employees (Only Super Admin and Manager)
exports.getAllEmployees = async (req, res) => {
  try {
    // Authorization check
    // if (req.user.role !== "Super Admin" && req.user.role !== "Manager") {
    //   return res.status(403).json({ message: "Access denied." });
    // }

    const employees = await User.find({ role: "Employee" })
    .populate("assignedClients", "name email contactDetails");

    if (employees.length === 0) {
      return res.status(404).json({ success: false, message: "No employees found." });
    }

    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch employee by ID (Only Super Admin and Manager)
exports.getEmployeeById = async (req, res) => {
  
  try {
    // Authorization check
    // if (req.user.role !== "Super Admin" && req.user.role !== "Manager") {
    //   return res.status(403).json({ message: "Access denied." });
    // }
    const id = req.params.id;
    const employee = await User.findById(id)
    .populate("assignedClients", "name email contactDetails") ; 
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found."
        });
        }
        res.status(200).json({ success: true, data: employee });
        } catch (error) {
          res.status(500).json({ success: false, error: error.message });
        }
        };



