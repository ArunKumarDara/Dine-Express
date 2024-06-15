const express = require("express");
const {
  addAddress,
  getAllAddressByUser,
} = require("../controller/addressController");
const validateJwtToken = require("../middleware/authMiddleware");

const addressRouter = express.Router();

addressRouter.post("/addAddress", validateJwtToken, addAddress);
addressRouter.post(
  "/getAllAddressByUser",
  validateJwtToken,
  getAllAddressByUser
);

module.exports = addressRouter;
