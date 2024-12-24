const Notification = require("../models/Notification");

const createNotification = async (type, action, entityId, entityName) => {
  try {
    const message = `${type} "${entityName}" was ${action}.`;
    const notification = new Notification({
      type,
      action,
      entityId,
      entityName,
      message,
    });
    await notification.save();
  } catch (error) {
    console.error("Error creating notification:", error.message);
  }
};

module.exports = createNotification;
