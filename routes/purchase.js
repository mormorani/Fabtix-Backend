const express = require("express");
const PerformanceModel = require("../models/performanceModel"); // Adjust the path as necessary
const PurchaseModel = require("../models/purchaseModel"); // Adjust the path as
const router = express.Router();

// Route to create a purchase for a performance
router.post("/", async (req, res) => {
  try {
    const { performanceId, email } = req.body;

    console.log(performanceId);
    console.log(email);
    // Verify the performance exists
    const performanceExists = await PerformanceModel.findById(performanceId);
    if (!performanceExists) {
      return res.status(404).json({ message: "Performance not found" });
    }

    // Create a new purchase record
    const newPurchase = new PurchaseModel({
    //   token: purchaseToken,
      performance: performanceId,
      userEmail: email,
    });

    const savedPurchase = await newPurchase.save();
    // Respond to the client with the purchase details
    res.status(200).json({ message: "Purchase successful", savedPurchase });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
