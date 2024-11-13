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
    review: { type: String }
  },
  { versionKey: false }
); // Set versionKey property here

const ReviewModel = model("reviews", reviewSchema);
module.exports = ReviewModel;
