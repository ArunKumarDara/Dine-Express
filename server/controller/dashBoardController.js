const orderModel = require("../model/orderModel");
const userModel = require("../model/userModel");

const getDashBoardDetails = async (req, res) => {
  try {
    const users = await userModel.find();
    const numberOfUsers = users.length;
    const orders = await orderModel.find();
    const totalOrderAmount = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const numberOfOrders = orders.length;
    res.status(200).json({
      success: true,
      message: "Dashboard details fetched successfully",
      data: {
        numberOfUsers,
        numberOfOrders,
        totalOrderAmount,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Cannot fetch dashboard details",
    });
  }
};

const orderStatusDistribution = async (req, res) => {
  try {
    const orders = await orderModel.find();
    const statusCounts = {
      Deliver: 0,
      Pending: 0,
      Cancelled: 0,
    };

    orders.forEach((order) => {
      if (order.status === "Deliver") {
        statusCounts.Deliver += 1;
      } else if (order.status === "Pending") {
        statusCounts.Pending += 1;
      } else if (order.status === "Cancelled") {
        statusCounts.Cancelled += 1;
      }
    });
    res.status(200).json({
      success: true,
      message: "order status distribution fetched successfully",
      data: statusCounts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Cannot fetch order status distribution",
    });
  }
};

module.exports = { getDashBoardDetails, orderStatusDistribution };
