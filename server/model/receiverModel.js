const mongoose = require("mongoose");
const { Schema } = mongoose;

const receiverSchema = new Schema({
  receiverName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

module.exports = mongoose.model("receivers", receiverSchema);
