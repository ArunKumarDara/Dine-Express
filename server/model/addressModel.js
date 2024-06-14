const mongoose = require("mongoose");

const { Schema } = mongoose;

const addressSchema = new Schema({
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
  },
  pinCode: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("address", addressSchema);
