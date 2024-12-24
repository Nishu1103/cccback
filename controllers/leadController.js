const Lead = require("../models/Lead");
const Client = require("../models/Client");
const  createNotification = require("../utils/notification");

// Create a new lead
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    await createNotification("Lead", "Created", lead._id, lead.name);
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch all leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Convert lead to client
exports.convertToClient = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    const client = await Client.create({
      name: lead.name,
      contactDetails: lead.contactNumber,
      email: lead.email,
      // sourceOfConnection: lead.sourceOfConnection,
      priority: req.body.priority,
    });

    // await lead.remove();
    await Lead.findByIdAndDelete(req.params.id);
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update lead by ID
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    await createNotification("Lead", "Updated", lead._id, lead.name);

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// Delete lead by ID
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });


    await createNotification("Lead", "Deleted", lead._id, lead.name);
    res.status(200).json({ success: true, message: "Lead successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
