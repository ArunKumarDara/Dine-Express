const orderModel = require("../model/orderModel");

const addOrder = async (req, res) => {
  try {
    const order = new orderModel(req.body);
    const response = order.save();
    res.status(200).json({
      success: true,
      message: "Order created Successfully, please wait...",
      data: response,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addOrder,
};
