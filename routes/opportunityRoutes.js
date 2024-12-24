const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");
const PDFDocument = require('pdfkit');
const fs = require('fs');

  
router.put("/:id/site-visit", async (req, res) => {
  const { id } = req.params;
  const { date, response, remarks } = req.body;

  try {
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
 
                                                                             
    opportunity.siteVisits.push({ date, response, remarks });

    
    if (response) {
      opportunity.status = response;  
    }

    await opportunity.save();
    res.status(200).json({ message: "Site visit updated successfully", opportunity });


  } catch (error) {
    res.status(500).json({ message: "Error updating site visit", error });
  }
});

// Update LOA Details
router.put("/:id/loa", async (req, res) => {
  const { id } = req.params;
  const { dateOfLOI, lockinPeriod, startDate, endDate, image } = req.body;

  try {
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Update LOA details
    opportunity.loaDetails = { dateOfLOI, lockinPeriod, startDate, endDate, image };
    opportunity.status = "LOI"; // Move status to LOI stage

    await opportunity.save();
    res.status(200).json({ message: "LOA details updated successfully", opportunity });
  } catch (error) {
    res.status(500).json({ message: "Error updating LOA details", error });
  }
});

// Update Agreement Details
router.put("/:id/agreement", async (req, res) => {
  const { id } = req.params;
  const { date, rental, image } = req.body;

  try {
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Update Agreement details
    opportunity.agreementDetails = { date, rental, image };
    opportunity.status = "Agreement"; // Move status to Agreement stage

    await opportunity.save();
    res.status(200).json({ message: "Agreement details updated successfully", opportunity });
  } catch (error) {
    res.status(500).json({ message: "Error updating Agreement details", error });
  }
});

// Get All Opportunities
router.get("/", async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("client")
      .populate("property");
    res.status(200).json(opportunities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching opportunities", error });
  }
});

// Get Opportunity by ID
router.get("/:id", async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate("client")
      .populate("property");
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    res.status(200).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: "Error fetching opportunity", error });
  }
});

router.put("/:id/follow-ups", async (req, res) => {
  try {
    const { followUps } = req.body; // Array of follow-up objects
    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      { $set: { followUps: followUps } },
      { new: true }
    );

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json(opportunity); // Return updated opportunity with follow-ups
  } catch (error) {
    console.error("Error updating follow-ups:", error);
    res.status(500).json({ message: "Error updating follow-ups" });
  }
});

router.delete("/:id/delete", async (req, res) => {
  try {
    const opportunity = await Opportunity.findByIdAndDelete(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    res.status(200).json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting opportunity", error });
  }
});

router.get('/pdf/:oppId', async (req, res) => {
  const opportunityId = req.params.oppId;  // Corrected this line

  try {
      // Fetch opportunity data from the database
      const opportunity = await Opportunity.findById(opportunityId)
          .populate('client') // Populate client data
          .populate('property'); // Populate property data

      if (!opportunity) {
          return res.status(404).send('Opportunity not found');
      }

      // Create the PDF
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="opportunity-details.pdf"');
      
      doc.pipe(res);

      // Add Client Details
      doc.fontSize(18).text('Client Details', { underline: true });
      doc.fontSize(12).text(`Name: ${opportunity.client.name}`);
      doc.text(`Contact: ${opportunity.client.contactDetails}`);
      doc.text(`Email: ${opportunity.client.email}`);
      doc.text(`Priority: ${opportunity.client.priority}`);

      doc.addPage();  // New Page for Property Details

      // Add Property Details
      doc.fontSize(18).text('Property Details', { underline: true });
      doc.fontSize(12).text(`Name: ${opportunity.property.name}`);
      doc.text(`Owner: ${opportunity.property.owner}`);
      doc.text(`Contact: ${opportunity.property.contact}`);
      doc.text(`Address: ${opportunity.property.address}`);
      doc.text(`Pin Point Location: ${opportunity.property.pinPointLocation}`);
      doc.text(`Floor: ${opportunity.property.floor}`);
      doc.text(`Area: ${opportunity.property.area}`);
      doc.text(`Expected Rent: ${opportunity.property.expectedRent}`);

      doc.end();
  } catch (err) {
      console.error('Error generating PDF:', err);
      res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
