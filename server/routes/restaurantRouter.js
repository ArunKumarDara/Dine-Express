const express = require("express");
const {
  getAllRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controller/restaurantController");

const restaurantRouter = express.Router();

restaurantRouter.get("/getAllRestaurants", getAllRestaurants);
restaurantRouter.post("/addRestaurant", addRestaurant);
restaurantRouter.post("/editRestaurant", updateRestaurant);
restaurantRouter.post("/deleteRestaurant", deleteRestaurant);

module.exports = restaurantRouter;
