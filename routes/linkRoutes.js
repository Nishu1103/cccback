const express = require('express');
const {
  linkPropertyToClient,
  unlinkPropertyFromClient,
  getClientWithProperties,
  getPropertyWithClients,
} = require("../controllers/linkController");

const router = express.Router();
// Link Property to Client
router.post("/link-property", linkPropertyToClient);

// Unlink Property from Client
router.post("/unlink-property", unlinkPropertyFromClient);

// Get Client with Linked Properties
router.get("/client/:clientId", getClientWithProperties);

// Get Property with Linked Clients
router.get("/property/:propertyId", getPropertyWithClients);

module.exports = router;
