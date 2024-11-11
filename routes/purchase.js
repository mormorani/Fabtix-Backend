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

    // Generate a unique purchase token
    // const purchaseToken = Math.random().toString(36).substr(2);

    // Create a new purchase record
    const newPurchase = new PurchaseModel({
    //   token: purchaseToken,
      performance: performanceId,
      userEmail: email,
    });

    const savedPurchase = await newPurchase.save();
    // Set the token in a cookie with an expiration date (e.g., 30 days)
    // res.cookie("purchaseToken", purchaseToken, {
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    //   httpOnly: true, // Prevent JavaScript access
    //   secure: true, // Only send over HTTPS
    //   sameSite: "Strict", // Prevent CSRF attacks by restricting cross-site requests
    // });
    // Respond to the client with the purchase details
    res.status(200).json({ message: "Purchase successful", savedPurchase });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
