const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    petName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    price: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },

    petDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1250,
    },
    images: {
      type: Array,
      required: true,
    },

    breed: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product", petSchema);
