const Client = require("../models/Client");
const Property = require("../models/propertyModel");
const Opportunity = require("../models/Opportunity");
const createNotification = require("../utils/notification");

// Link Property to Client
// const linkPropertyToClient = async (req, res) => {
//   const { clientId, propertyId } = req.body;

//   try {
//     // Update Client
//     const client = await Client.findByIdAndUpdate(
//       clientId,
//       { $addToSet: { linkedProperties: propertyId } }, 
//       { new: true }
//     );

//     // Update Property
//     const property = await Property.findByIdAndUpdate(
//       propertyId,
//       { $addToSet: { linkedClients: clientId } },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Property linked to Client successfully!",
//       client,
//       property,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error linking property to client", error });
//   }
// };

// module.exports = { linkPropertyToClient };
const linkPropertyToClient = async (req, res) => {
  const { clientId, propertyId } = req.body;

  try {
    // Fetch Client and Property
    const client = await Client.findById(clientId);
    const property = await Property.findById(propertyId);

    if (!client || !property) {
      return res.status(404).json({ success: false, message: "Client or Property not found" });
    }

    // Update Client
    if (!client.linkedProperties.includes(propertyId)) {
      client.linkedProperties.push(propertyId);
    }

    // Update Property
    if (!property.linkedClients.includes(clientId)) {
      property.linkedClients.push(clientId);
    }

    // Check if Opportunity already exists
    let opportunity = await Opportunity.findOne({ client: clientId, property: propertyId });

    if (!opportunity) {
      // Create Opportunity if not already created
      opportunity = new Opportunity({
        client: clientId,
        property: propertyId,
      });
      await opportunity.save();

      // Add Opportunity references
      client.opportunities.push(opportunity._id);
      property.opportunities.push(opportunity._id);
    }

    // Save Client and Property
    await client.save();
    await property.save();






    // Create a notification

    await createNotification({
      type: "Client",
      action: "Created",
      entityId: clientId,
      entityName: client.name,
      message: "Client created successfully!",
    });

    res.status(200).json({
      success: true,
      message: "Property linked to Client and Opportunity created successfully!",
      client,
      property,
      opportunity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error linking property to client", error });
  }
};


const unlinkPropertyFromClient = async (req, res) => {
    const { clientId, propertyId } = req.body;
  
    try {
      // Update Client
      const client = await Client.findByIdAndUpdate(
        clientId,
        { $pull: { linkedProperties: propertyId } }, // Remove from array
        { new: true }
      );
  
      // Update Property
      const property = await Property.findByIdAndUpdate(
        propertyId,
        { $pull: { linkedClients: clientId } },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: "Property unlinked from Client successfully!",
        client,
        property,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error unlinking property from client", error });
    }
  };
  
  // module.exports = { unlinkPropertyFromClient };
  

  const getClientWithProperties = async (req, res) => {
    const { clientId } = req.params;
  
    try {
      const client = await Client.findById(clientId).populate("linkedProperties");
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
  
      res.status(200).json({ success: true, data: client });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching client details", error });
    }
  };
  
  // module.exports = { getClientWithProperties };
  

  const getPropertyWithClients = async (req, res) => {
    const { propertyId } = req.params;
  
    try {
      const property = await Property.findById(propertyId).populate("linkedClients");
      if (!property) {
        return res.status(404).json({ success: false, message: "Property not found" });
      }
  
      res.status(200).json({ success: true, data: property });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching property details", error });
    }
  };
  
  // module.exports = { getPropertyWithClients };

  module.exports = {
    linkPropertyToClient,
    unlinkPropertyFromClient,
    getClientWithProperties,
    getPropertyWithClients,
  };
  
  