const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  streetAddress: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
    default: "Cameroon",
  },
  postalCode: {
    type: String,
    default: "00000",
  },
  fullAddress: {
    type: String,
  },
  coordinates: {
    lat: {
      type: Number,
      default: 0,
    },
    lng: {
      type: Number,
      default: 0,
    },
  },
});

module.exports = addressSchema;
