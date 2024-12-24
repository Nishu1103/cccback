const express = require("express");
const { addEmployee, getAllEmployees,
    getEmployeeById
 } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-employee", authMiddleware, addEmployee);
router.get("/employees", authMiddleware, getAllEmployees);
router.get("/employee/:id", authMiddleware, getEmployeeById);

module.exports = router;
