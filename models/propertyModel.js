const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String },
  owner: { type: String},
  contact: { type: String},
  address: { type: String},
  pinPointLocation: { type: String},  
  floor: { type: String },
  area: { type: String},
  isRead: { type: Boolean, default: false },
  exactArea: { type: String },  
  height: { type: String },
  frontageRoad: { type: String},  
  expectedRent: { type: String },
  rentType: { type: String },  
  possession: { type: String },
  propertyImages: [{ type: String }], 
  planLayouts: [{ type: String }], 
  linkedClients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
  opportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }]
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
