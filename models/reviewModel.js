const { Schema, model } = require("mongoose");

// Define the reviews schema
const reviewSchema = new Schema(
  {
    performance: {
      type: Schema.Types.ObjectId,
      ref: "performances",
      required: true,
    },
    reviewerName: { type: String, required: true },
    // rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String }
    // date: { type: Date, default: Date.now },
  },
  { versionKey: false }
); // Set versionKey property here

const ReviewModel = model("reviews", reviewSchema);
module.exports = ReviewModel;
