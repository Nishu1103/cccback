const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },

  // Status progression
  status: {
    type: String,
    enum: ["Hold", "Follow Up", "Reject", "Approved", "LOI", "Agreement"],
    default: "Hold",
  },

  // Follow-up Date (new field)
  followUps: [
    {
      status: { type: String, enum: ["Cold", "Hot", "Approved"], required: true },
      date: { type: Date, required: true }, // Follow-up date
      remarks: { type: String },
    },
  ],

  // Site Visit Management
  siteVisits: [
    {
      date: { type: Date }, // Site visit date
      response: { type: String, enum: ["Hold", "Follow Up", "Reject", "Approved"] }, // Site visit response
      remarks: { type: String }, // Remarks for site visit
    },
  ],

  // LOA (Letter of Agreement) Details
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
    image: { type: String }, // Agreement image path
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Opportunity", opportunitySchema);
