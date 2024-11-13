const express = require("express");
const ReviewModel = require("../models/reviewModel"); // Adjust the path as necessary
const PerformanceModel = require("../models/performanceModel"); // Adjust the path as necessary
const PurchaseModel = require("../models/purchaseModel"); // Adjust the path as
const router = express.Router();

// Route to create a review for a performance
router.post("/", async (req, res) => {
  try {
    const { performance, reviewerName, review, email } = req.body;

    // Verify the performance exists
    const performanceExists = await PerformanceModel.findById(performance);
    if (!performanceExists) {
      return res.status(404).json({ message: "Performance not found" });
    }

    // Verify purchase 
    const purchase = await PurchaseModel.findOne({
      performance,
      userEmail: email,
    });

    if (!purchase) {
        return res.status(404).json({ message: 'Purchase not found' });
    }

    const newReview = new ReviewModel({
      performance,
      reviewerName,
      review,
    });
     
    const savedReview = await newReview.save();
    res
      .status(201)
      .json({ message: "Review submitted successfully", savedReview });
  } catch (error) {
    console.error("Error occurred:", error); // Log the error
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to get all reviews for a specific performance
router.get("/:performanceId", async (req, res) => {
  try {
    const { performanceId } = req.params;

    // Fetch reviews for the performance
    const reviews = await ReviewModel.find({
      performance: performanceId,
    }).populate("performance");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await ReviewModel.find()
      .populate({
        path: "performance",
        populate: {
          path: "artist",
          select: "name", // Select only the 'name' field from artist
        },
      })
      .exec(); // Optional: Populate with performance details
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
