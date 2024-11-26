const express = require("express");
const PerformanceModel = require("../models/performanceModel");
const ArtistModel = require("../models/artistModel");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");

// Route to get all performances
router.get("/", async (req, res) => {
  try {
    const performances = await PerformanceModel.find().populate("artist"); // Optional: Populate with artist details
    res.status(200).json(performances);
  } catch (error) {
    console.error("Error fetching performances:", error); // Log the error details
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to add a performance
router.post("/create", authenticateToken, async (req, res) => {
  try {

    const artistId = req.artist.id; // The ID of the logged-in artist, from the JWT token

    // Check if the artist exists
    const artist = await ArtistModel.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    // Create a new performance
    const newPerformance = new PerformanceModel({
      // name: req.body.name,
      artist: artistId,
      date: req.body.date,
      location: req.body.location,
      price: req.body.price
    });

    // Save the performance
    const savedPerformance = await newPerformance.save();

    res.status(201).json({
      message: "Performance created successfully",
      performance: savedPerformance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to update a performance by ID
router.put("/:id", authenticateToken, async (req, res) => {
  try {

    const performanceId = req.params.id;
    const artistId = req.artist.id; // Extracted from the JWT token by the middleware
    // Validate input (you can add more validation as needed)
    if (!performanceId) {
      return res.status(400).json({ message: "Performance ID is required" });
    }

    // Find the performance by ID and ensure it's associated with the current artist
    let performance = await PerformanceModel.findOne({ _id: performanceId, artist: artistId });

    if (!performance) {
        return res.status(404).json({ message: 'Performance not found or not authorized to update' });
    }

    // Update the performance with new details from the request body
    performance.date = req.body.date || performance.date;
    performance.location = req.body.location || performance.location;
    performance.price = req.body.price || performance.price;

    // Save the updated performance
    const updatedPerformance = await performance.save();

    res.status(200).json({
        message: 'Performance updated successfully',
        performance: updatedPerformance
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get performances by artist ID
router.get("/performances", authenticateToken, async (req, res) => {
  try {
    const artistId = req.artist._id; // Get the artist ID from the authenticated token
    if (!artistId) {
      return res.status(400).json({ message: "Artist ID is required" });
    }

    // Find performances without populating reviews
    const performances = await PerformanceModel.find({ artist: artistId });

    if (!performances || performances.length === 0) {
      return res.status(404).json({ message: "No performances found for this artist" });
    }

    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to find performances by artist name
router.get("/:artistName", async (req, res) => {
  try {
    const artistName = req.params.artistName;

    // Find the artist by name
    const artist = await ArtistModel.findOne({ name: artistName });

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    // Find performances by artist ID
    const performances = await PerformanceModel.find({ artist: artist._id });

    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
