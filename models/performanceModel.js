const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const performanceSchema = new Schema(
  {
    name: { type: String, required: false},
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "artists",
      required: true,
    },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }, // Ensure price is non-negative
  },
  { versionKey: false }
); // Set versionKey property here

const PerformanceModel = model("performances", performanceSchema);
module.exports = PerformanceModel;
