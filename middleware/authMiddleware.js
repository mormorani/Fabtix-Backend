const jwt = require("jsonwebtoken");
const Artist = require("../models/artistModel");
const PurchaseModel = require("../models/purchaseModel"); // Adjust the path as necessary

const authenticateToken = async (req, res, next) => {
  // Check for token in the headers (either 'x-auth-token' or 'Authorization')
  const token =
    req.header("x-auth-token") ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

// Middleware to verify the purchase token
// const verifyPurchaseToken = async (req, res, next) => {
//   // Log incoming request cookies
//   console.log("Incoming cookies:", req.cookies);

//   // Get purchase token from cookies
//   const purchaseToken = req.cookies.purchaseToken; // Get the purchase token from cookies
//   console.log("Purchase token:", purchaseToken);

//   if (!purchaseToken) {
//     return res.status(401).json({ message: "No purchase token found" });
//   }

//   try {
//     const purchase = await PurchaseModel.findOne({ token: purchaseToken });
//     if (!purchase) {
//       return res.status(401).json({ message: "Invalid purchase token" });
//     }

//     // Token is valid; attach purchase information to request for further use
//     req.purchase = purchase; // You can access this later in your route handlers
//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     console.error("Error verifying purchase token:", error);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

module.exports = { authenticateToken };
