const express = require("express");
const router = express.Router();

const ArtistModel = require("../models/artistModel");

router.get("/", async (req, res) => {
  try {
    // Fetch all artists from the database
    const artists = await ArtistModel.find();

    // Send the artists array as JSON
    return res.send(artists); // or res.json(artists) - both are fine
  } catch (error) {
    // Send a 500 status code and error message
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const artistName = req.params.name;
    const artist = await ArtistModel.findOne({ name: artistName });

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// New route to fetch artist by email
router.get("/email", async (req, res) => {
  try {
    const email = req.query.email; // Get email from the query parameters

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const artist = await ArtistModel.findOne({ email });

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
