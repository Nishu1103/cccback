const Property = require("../models/propertyModel");
const  createNotification = require("../utils/notification");
 
exports.createProperty = async (req, res) => {
    try {
      const { 
        name, 
        owner, 
        contact, 
        address, 
        pinPointLocation, 
        floor, 
        area, 
        exactArea, 
        height, 
        frontageRoad, 
        expectedRent, 
        rentType, 
        possession, 
        propertyImages, 
        planLayouts 
      } = req.body;

      const property = new Property({
        name,
        owner,
        contact,
        address,
        pinPointLocation,
        floor,
        area,
        exactArea,
        height,
        frontageRoad,
        expectedRent,
        rentType,
        possession,
        propertyImages,
        planLayouts,
      });

      await property.save();

      await createNotification("Property", "Created", property._id, property.name);
      res.status(201).json({ success: true, message: "Property created successfully", property });


    } catch (error) {
      console.error("Error creating property:", error);
      res.status(400).json({ success: false, message: "Error creating property", error });
    }
};

// Get All Properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();

    // await createNotification("Property", "Created", property._id, property.name);/

    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Get Single Property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("linkedClients")
      .populate("opportunities");
    if (!property) {
      return res.status(404).json({ success: false, error: "Property not found" });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Update Property by ID
exports.updateProperty = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    // Handle file uploads
    if (req.files["propertyImages"]) {
      updatedData.propertyImages = req.files["propertyImages"].map((file) => file.path);
    }
    if (req.files["planLayouts"]) {
      updatedData.planLayouts = req.files["planLayouts"].map((file) => file.path);
    }

    const property = await Property.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!property) {
      return res.status(404).json({ success: false, error: "Property not found" });
    }

    await createNotification("Property", "Updated", property._id, property.name);
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, error: "Property not found" });
    }

    await createNotification("Property", "Deleted", property._id, property.name);
    res.status(200).json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
