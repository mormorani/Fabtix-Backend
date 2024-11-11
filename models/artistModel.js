const { Schema, model } = require("mongoose");

const artistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL of the artist's image
    },
    youtubeLink: {
      type: String, // URL of the artist's YouTube channel or video
    },
  },
  { versionKey: false }
);

const ArtistModel = model("artists", artistSchema);
module.exports = ArtistModel;
