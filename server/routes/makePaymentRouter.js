const express = require("express");
const makePayment = require("../controller/paymentController");
const validateJwtToken = require("../middleware/authMiddleware");
const paymentRouter = express.Router();

paymentRouter.post("/makePayment", validateJwtToken, makePayment);

module.exports = paymentRouter;
