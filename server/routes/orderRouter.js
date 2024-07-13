const express = require("express");
const orderRouter = express.Router();
const {
  addOrder,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
  updateOrderById,
} = require("../controller/orderController");
const validateJwtToken = require("../middleware/authMiddleware");

orderRouter.post("/addOrder", validateJwtToken, addOrder);
orderRouter.post("/getOrdersByUserId", validateJwtToken, getOrdersByUserId);
orderRouter.get("/getAllOrders", validateJwtToken, getAllOrders);
orderRouter.post("/updateOrderStatus", validateJwtToken, updateOrderStatus);
orderRouter.post("/updateOrderById", validateJwtToken, updateOrderById);

module.exports = orderRouter;
