const orderModel = require("../model/orderModel");
const orderItemsModel = require("../model/orderItemsModel");

const addOrder = async (req, res) => {
  try {
    const order = new orderModel(req.body.payload1);
    const response = await order.save();

    for (let i = 0; i < req.body.payload2.length; i++) {
      const orderItems = new orderItemsModel({
        orderId: response._id,
        itemId: req.body.payload2[i]._id,
        quantity: req.body.payload2[i].quantity,
      });
      await orderItems.save();
    }
    res.status(200).json({
      success: true,
      message: "Order created Successfully, please wait...",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.body.userId })
      .populate("restaurant")
      .sort({ createdAt: -1 })
      .lean();

    for (let each of orders) {
      const items = await orderItemsModel
        .find({ orderId: each._id })
        .populate("itemId");
      each.menuItems = items.map((item) => {
        return {
          item: item.itemId,
          quantity: item.quantity,
        };
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched Successfully",
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error fetching orders" || error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("restaurant")
      .populate("user")
      .populate("deliverTo")
      .sort({ createdAt: -1 })
      .lean();

    for (let each of orders) {
      const items = await orderItemsModel
        .find({ orderId: each._id })
        .populate("itemId");
      each.menuItems = items.map((item) => {
        return {
          item: item.itemId,
          quantity: item.quantity,
        };
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched Successfully",
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error fetching orders" || error.message,
    });
  }
};

module.exports = {
  addOrder,
  getOrdersByUserId,
  getAllOrders,
};
