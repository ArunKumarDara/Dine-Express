const express = require("express");
const orderRouter = express.Router();
const { addOrder } = require("../controller/orderController");
const validateJwtToken = require("../middleware/authMiddleware");

orderRouter.post("/addOrder", validateJwtToken, addOrder);

module.exports = orderRouter;
