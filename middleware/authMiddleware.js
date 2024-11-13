const jwt = require("jsonwebtoken");
const Artist = require("../models/artistModel");
const PurchaseModel = require("../models/purchaseModel"); // Adjust the path as necessary
const functions = require('firebase-functions');

const jwtSecret = process.env.NODE_ENV === 'production' 
    ? functions.config().jwt.secret // For production (from Firebase environment config)
    : process.env.JWT_SECRET; // For development (from .env file or local environment)

const authenticateToken = async (req, res, next) => {
  // Check for token in the headers (either 'x-auth-token' or 'Authorization')
  const token =
    req.header("x-auth-token") ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.artistId = decoded.id; // Store the artist ID in the request
    req.artist = await Artist.findById(req.artistId).select("-password");

    if (!req.artist) {
      return res.status(404).json({ msg: "Artist not found" });
    }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = { authenticateToken };
