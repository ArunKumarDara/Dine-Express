const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "orders",
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("payments", paymentSchema);
