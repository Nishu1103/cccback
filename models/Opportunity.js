const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },

 
  status: {
    type: String,
    enum: ["Hold", "Follow Up", "Reject", "Approved", "LOI", "Agreement"],
    default: "Hold",
  },

  
  followUps: [
    {
      status: { type: String, enum: ["Hold", "Follow Up", "Reject", "Approved"], default: "Hold" },
      date: { type: Date, required: true },  
      remarks: { type: String },
    },
  ],

 
  siteVisits: [
    {
      date: { type: Date }, // Site visit date
      response: { type: String, enum: ["Hold", "Follow Up", "Reject", "Approved"] }, // Site visit response
      remarks: { type: String },  
      // status: { type: String, default: "Pending" }

    },
  ],

 
  loaDetails: {
    dateOfLOI: { type: Date },
    lockinPeriod: { type: String, enum: ["1 yr", "2 yr", "3 yr", "4 yr", "5 yr"] },
    startDate: { type: Date },
    endDate: { type: Date },
    image: { type: String }, // LOI image path
  },

  // Agreement Details
  agreementDetails: {
    date: { type: Date },
    rental: { type: Number },
    image: { type: String },  
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Opportunity", opportunitySchema);
