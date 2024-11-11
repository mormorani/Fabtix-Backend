const { Schema, model } = require("mongoose");

// Define the purchases schema
const purchaseSchema = new Schema(
  {
    // token: { type: String, required: true }, // Unique token for each purchase
    performance: {
      type: Schema.Types.ObjectId,
      ref: "performances",
      required: true,
    },
    purchaseDate: { type: Date, default: Date.now },
    userEmail: { type: String, required: true }
  },
  { versionKey: false }
); // Set versionKey property here

const PurchaseModel = model("purchases", purchaseSchema);
module.exports = PurchaseModel;