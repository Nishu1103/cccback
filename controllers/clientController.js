const Client = require("../models/Client");
const User = require("../models/User"); // Assuming you have User model to reference for employee
const Property = require("../models/propertyModel");
const mongoose = require("mongoose");
const createNotification = require("../utils/notification");
// Create a new client
exports.createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    await createNotification("Client", "Created", client._id, client.name);
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate("assignedTo", "name email role") // Populate assignedTo with name, email, and role
      .populate("linkedProperties") // Populate linked properties
      .populate("linkedClients")
      .populate("opportunities"); // Populate opportunities

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().populate("assignedTo", "name email role"); // Populating employee details
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update client by ID
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    await createNotification("Client", "Updated", client._id, client.name);
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Assign client to an employee
// exports.assignClient = async (req, res) => {
//   try {
//     const { clientId, employeeId } = req.body;

//     // Check if the employee exists
//     const employee = await User.findById(employeeId);
//     if (!employee || employee.role !== "Employee") {
//       return res.status(400).json({ success: false, message: "Invalid employee" });
//     }

//     // Assign the client to the employee
//     const client = await Client.findByIdAndUpdate(clientId, { assignedTo: employeeId }, { new: true });
//     if (!client) {
//       return res.status(404).json({ success: false, message: "Client not found" });
//     }

//     res.status(200).json({ success: true, data: client });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


exports.assignClient = async (req, res) => {
  try {
    const { clientId } = req.params; // Extract clientId from URL
    const { employeeId } = req.body; // Extract employeeId from body

    // Validate clientId and employeeId
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ success: false, error: "Invalid client ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ success: false, error: "Invalid employee ID" });
    }

    // Check if the employee exists and has the role 'Employee'
    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== "Employee") {
      return res.status(400).json({ success: false, error: "Invalid employee or not authorized" });
    }

    // Find and update client
    const client = await Client.findByIdAndUpdate(
      clientId,
      { assignedTo: employeeId }, // Update assignment
      { new: true } // Return the updated client
    );

    // If client not found
    if (!client) {
      return res.status(404).json({ success: false, error: "Client not found" });
    }

    employee.assignedClients.push(clientId);
    await employee.save();

    await createNotification("Client", "Assigned", client._id, client.name);


    // Success response
    res.status(200).json({
      success: true,
      message: "Client assigned successfully",
      data: client,
    });
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({ success: false, error: error.message });
  }
};
0

// Delete client by ID
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    await createNotification("Client", "Deleted", client._id, client.name);
    res.status(200).json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// View a single client by ID
exports.viewClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate("assignedTo", "name email role");
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.linkPropertiesToClient = async (req, res) => {
  const { clientId, propertyIds } = req.body;

  // Validate IDs
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    return res.status(400).json({ success: false, error: "Invalid client ID" });
  }

  if (!Array.isArray(propertyIds) || propertyIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
    return res.status(400).json({ success: false, error: "Invalid property IDs" });
  }

  try {
    // Check if the client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, error: "Client not found" });
    }

    // Find all valid properties
    const properties = await Property.find({ _id: { $in: propertyIds } });
    if (properties.length === 0) {
      return res.status(404).json({ success: false, error: "No properties found with provided IDs" });
    }

    // Link properties to the client
    const propertyIdsSet = new Set(properties.map(property => property._id.toString()));
    client.linkedProperties = Array.from(new Set([...client.linkedProperties, ...propertyIdsSet]));

    // Link the client to each property
    await Promise.all(
      properties.map(async property => {
        if (!property.linkedClients.includes(clientId)) {
          property.linkedClients.push(clientId);
          await property.save();
        }
      })
    );

    // Save the updated client
    await client.save();

    await createNotification("Client", "Linked", client._id, client.name);

    res.status(200).json({ success: true, message: "Properties linked to client successfully", data: client });
  } catch (error) {
    console.error("Error linking properties to client:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};