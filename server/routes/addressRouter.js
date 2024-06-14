const express = require("express");
const { addAddress } = require("../controller/addressController");
const validateJwtToken = require("../middleware/authMiddleware");

const addressRouter = express.Router();

addressRouter.post("/addAddress", validateJwtToken, addAddress);

module.exports = addressRouter;
