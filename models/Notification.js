const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // Lead, Client, Property, Opportunity, User
    action: { type: String, required: true }, // Created, Updated, Deleted
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the affected entity
    entityName: { type: String }, // Optional: Name of the entity (e.g., Client name)
    message: { type: String, required: true }, // Custom notification message
    isRead: { type: Boolean, default: false }, // Mark if notification is read
    createdAt: { type: Date, default: Date.now }, // Timestamp
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
