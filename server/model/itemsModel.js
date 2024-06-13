const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isVeg: {
    type: Boolean,
    default: true,
    required: true,
  },
  image: {
    type: String,
  },
  rating: {
    type: Number,
    default: 4.3,
  },
  availableIn: {
    type: Schema.Types.ObjectId,
    ref: "restaurants",
  },
});

module.exports = mongoose.model("items", itemsSchema);
