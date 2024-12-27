const express = require("express");
const {
  createLead,
  convertToClient,
  getAllLeads,
  updateLead,
  deleteLead,
  

} = require("../controllers/leadController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Create a new lead
router.post("/add", createLead);

// Get all leads
router.get("/", getAllLeads);

// Convert a lead to a client
router.post("/:id/convert-to-client",authMiddleware, convertToClient);

// Update a lead
router.put("/update/:id", updateLead);

// Delete a lead
router.delete("/delete/:id", deleteLead);

 

module.exports = router;
