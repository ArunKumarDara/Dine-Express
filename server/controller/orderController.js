const orderModel = require("../model/orderModel");
const orderItemsModel = require("../model/orderItemsModel");

const addOrder = async (req, res) => {
  try {
    const lastOrder = await orderModel.findOne(
      {},
      {},
      { sort: { orderNo: -1 } }
    );
    const lastOrderNumber = lastOrder ? lastOrder.orderNo : 0;
    const order = new orderModel({
      ...req.body.payload1,
      orderNo: Number(lastOrderNumber) + 1,
    });
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

const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await orderModel.findByIdAndUpdate(
      { _id: orderId },
      { $set: { status: status } }
    );
    res.status(200).json({
      success: true,
      message: "Order status changed Successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating order status" || error.message,
    });
  }
};

const updateOrderById = async (req, res) => {
  const orderId = req.body.params.orderId;
  try {
    const order = await orderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: "payment_completed" } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Order updated Successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error fetching order" || error.message,
    });
  }
};

module.exports = {
  addOrder,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
  updateOrderById,
};
