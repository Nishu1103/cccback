const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String },
  owner: { type: String},
  contact: { type: String},
  address: { type: String},
  pinPointLocation: { type: String},  
  floor: { type: Number },
  area: { type: Number},
  isRead: { type: Boolean, default: false },
  exactArea: { type: Number },  
  height: { type: Number },
  frontageRoad: { type: String},  
  expectedRent: { type: Number },
  rentType: { type: String, enum: ['Including AMC', 'Excluding AMC'] },  
  possession: { type: String, enum: ['Ready to Move','Under Construction','In 18 months','In 12 months', 'In 6 months' ,'occupied'] },
  propertyImages: [{ type: String }], 
  planLayouts: [{ type: String }], 
  linkedClients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
  opportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }]
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
