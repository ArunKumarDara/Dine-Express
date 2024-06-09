const express = require("express");
const {
  addMenuItem,
  getMenuItems,
} = require("../controller/menuItemsController");
const validateJwtToken = require("../middleware/authMiddleware");

const menuItemRouter = express.Router();

menuItemRouter.post("/addMenuItem", validateJwtToken, addMenuItem);
menuItemRouter.post(
  "/getMenuItemsByRestaurant",
  validateJwtToken,
  getMenuItems
);

module.exports = menuItemRouter;
