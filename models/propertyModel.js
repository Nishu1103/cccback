const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  pinPointLocation: { type: String, required: true },  
  floor: { type: Number, required: true },
  area: { type: Number, required: true },
  isRead: { type: Boolean, default: false },
  exactArea: { type: Number, required: true },  
  height: { type: Number, required: true },
  frontageRoad: { type: String, required: true },  
  expectedRent: { type: Number, required: true },
  rentType: { type: String, enum: ['Including AMC', 'Excluding AMC'], required: true },  
  possession: { type: String, enum: ['Ready to Move','Under Construction','In 18 months','In 12 months', 'In 6 months' ,'occupied'], required: true },
  propertyImages: [{ type: String }], 
  planLayouts: [{ type: String }], 
  linkedClients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
  opportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }]
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
