const express = require("express");
const {
  getAllRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsByOwnerId,
} = require("../controller/restaurantController");

const restaurantRouter = express.Router();

restaurantRouter.get("/getAllRestaurants", getAllRestaurants);
restaurantRouter.post("/addRestaurant", addRestaurant);
restaurantRouter.post("/editRestaurant", updateRestaurant);
restaurantRouter.post("/getRestaurantsByOwner", getRestaurantsByOwnerId);
restaurantRouter.post("/deleteRestaurant", deleteRestaurant);

module.exports = restaurantRouter;
