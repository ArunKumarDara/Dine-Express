const express = require("express");
const orderRouter = express.Router();
const {
  addOrder,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
} = require("../controller/orderController");
const validateJwtToken = require("../middleware/authMiddleware");

orderRouter.post("/addOrder", validateJwtToken, addOrder);
orderRouter.post("/getOrdersByUserId", validateJwtToken, getOrdersByUserId);
orderRouter.get("/getAllOrders", validateJwtToken, getAllOrders);
orderRouter.post("/updateOrderStatus", validateJwtToken, updateOrderStatus);

module.exports = orderRouter;
