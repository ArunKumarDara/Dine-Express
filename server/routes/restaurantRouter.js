const express = require("express");
const {
  getAllRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsByOwnerId,
} = require("../controller/restaurantController");
const validateJwtToken = require("../middleware/authMiddleware");

const restaurantRouter = express.Router();

restaurantRouter.get("/getAllRestaurants", validateJwtToken, getAllRestaurants);
restaurantRouter.post("/addRestaurant", validateJwtToken, addRestaurant);
restaurantRouter.post("/editRestaurant", validateJwtToken, updateRestaurant);
restaurantRouter.post(
  "/getRestaurantsByOwner",
  validateJwtToken,
  getRestaurantsByOwnerId
);
restaurantRouter.post("/deleteRestaurant", validateJwtToken, deleteRestaurant);

module.exports = restaurantRouter;
