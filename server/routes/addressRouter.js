const express = require("express");
const {
  addAddress,
  getAllAddressByUser,
  editAddress,
} = require("../controller/addressController");
const validateJwtToken = require("../middleware/authMiddleware");

const addressRouter = express.Router();

addressRouter.post("/addAddress", validateJwtToken, addAddress);
addressRouter.post(
  "/getAllAddressByUser",
  validateJwtToken,
  getAllAddressByUser
);

addressRouter.post("/editAddress", validateJwtToken, editAddress);

module.exports = addressRouter;
