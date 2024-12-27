const express = require("express");
const { addEmployee, getAllEmployees,
    getEmployeeById,
    getProfile
 } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-employee",authMiddleware, addEmployee);
router.get("/employees", authMiddleware, getAllEmployees);
router.get("/employee/:id", authMiddleware, getEmployeeById);
router.get("/profile", authMiddleware, getProfile);


module.exports = router;
