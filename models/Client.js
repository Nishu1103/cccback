const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String },
  contactDetails: { type: String, required: true },
  email: { type: String, required: true },
  kindOfBusiness: { type: String},
  requirement: { type: String},
  minimumArea: { type: String },
  city: { type: String },
  preferredArea: { type: String },
  otherPreferredAreas: { type: String },
  specificRequirements: { type: String },
  priority: { type: String, enum: ["Hot", "High", "Medium", "Cold", "Low"], required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },  
  linkedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  opportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }],
  isRead: { type: Boolean, default: false },
  isLeadConverted: { type: Boolean, default: false },
});




// clientSchema.pre('save', async function (next) {
//   const client = this;

//   // Check if any new properties were linked
//   if (client.isModified('linkedProperties')) {
//     const properties = client.linkedProperties;

//     // Loop through each property and create opportunities
//     for (let propertyId of properties) {
//       const property = await Property.findById(propertyId);

//       if (property) {
//         // Create an opportunity for each client-property link
//         const newOpportunity = new Opportunity({
//           client: client._id,
//           property: property._id,
//         });

//         await newOpportunity.save();

//         // Update the client and property to link this opportunity
//         client.opportunities.push(newOpportunity._id);
//         property.opportunities.push(newOpportunity._id);

//         await property.save();  // Save the property after linking the opportunity
//       }
//     }
//   }

//   next();  // Continue saving the client
// });


module.exports = mongoose.model("Client", clientSchema);
