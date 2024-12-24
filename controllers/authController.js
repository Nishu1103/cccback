const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Parse Super Admin and Manager arrays from env
    const superAdmins = process.env.SUPER_ADMINS.split(",");
    const superAdminPasswords = process.env.SUPER_ADMIN_PASSWORDS.split(",");

    const managers = process.env.MANAGERS.split(",");
    const managerPasswords = process.env.MANAGER_PASSWORDS.split(",");

    // Check if the user is a Super Admin
    const superAdminIndex = superAdmins.indexOf(email);
    if (superAdminIndex !== -1 && password === superAdminPasswords[superAdminIndex]) {
      const token = generateToken(null, "Super Admin");
      return res.status(200).json({
        success: true,
        message: "Super Admin logged in successfully",
        token,
        role: "Super Admin", // Add role to the response
      });
    }

    // Check if the user is a Manager
    const managerIndex = managers.indexOf(email);
    if (managerIndex !== -1 && password === managerPasswords[managerIndex]) {
      const token = generateToken(null, "Manager");
      return res.status(200).json({
        success: true,
        message: "Manager logged in successfully",
        token,
        role: "Manager", // Add role to the response
      });
    }

    // Check database for the user using email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = generateToken(user._id, user.role);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role, // Send role from the database
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
