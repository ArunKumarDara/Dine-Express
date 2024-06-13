const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderItemsSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "orders",
    required: true,
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: "items",
    required: true,
  },
});

module.exports = mongoose.model("orderItems", orderItemsSchema);
