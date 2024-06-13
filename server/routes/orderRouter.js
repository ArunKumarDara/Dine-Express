const express = require("express");
const orderRouter = express.Router();
const {
  addOrder,
  getOrdersByUserId,
} = require("../controller/orderController");
const validateJwtToken = require("../middleware/authMiddleware");

orderRouter.post("/addOrder", validateJwtToken, addOrder);
orderRouter.get("/getOrdersByUserId", validateJwtToken, getOrdersByUserId);

module.exports = orderRouter;
