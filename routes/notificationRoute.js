const express = require("express");
const router = express.Router();

// Import notification controller methods
const {
    getNotifications,
    markAsRead
} = require("../controllers/notificationController");


router.get("/", getNotifications);

// Route to mark a notification as read
router.put("/:id/read", markAsRead);

module.exports = router;
