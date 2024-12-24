const express = require("express");
const {
  createClient,
  getAllClients,
  updateClient,
  assignClient,
  deleteClient,
  getClient,
  viewClient,
  linkPropertiesToClient, // Import the new controller
} = require("../controllers/clientController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new client
router.post("/", authMiddleware, createClient);

// Get all clients
router.get("/", authMiddleware, getAllClients);

// Update client by ID
router.put("/:id", authMiddleware, updateClient);

// Assign a client to an employee
router.put("/:clientId/assign", authMiddleware, assignClient); // Assign a client to employee (based on clientId and employeeId)
-
// Link multiple properties to a client
router.put("/link-properties", authMiddleware, linkPropertiesToClient); // New route to link properties

// Delete a client by ID
router.delete("/:id", authMiddleware, deleteClient);

// Get a specific client by ID
router.get("/client/:id", authMiddleware, getClient);

// View a specific client by ID
router.get("/:id", authMiddleware, viewClient); // View a specific client

module.exports = router;
