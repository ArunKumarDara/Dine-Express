const express = require("express");
const {
  addAddress,
  getAllAddressByUser,
  editAddress,
  deleteAddress,
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
addressRouter.post("/deleteAddress", validateJwtToken, deleteAddress);

module.exports = addressRouter;
