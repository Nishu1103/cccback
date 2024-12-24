const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  sourceOfConnection: { type: String},
  priority: { type: String, enum: ["Hot", "High", "Medium", "Cold", "Low"], required: true },
  remarks: { type: String },
  isRead: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lead", leadSchema);
