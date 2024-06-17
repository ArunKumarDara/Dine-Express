const express = require("express");
const {
  getAllActiveRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsByOwnerId,
  getAllRestaurants,
  actionOnRestaurant,
} = require("../controller/restaurantController");
const validateJwtToken = require("../middleware/authMiddleware");

const restaurantRouter = express.Router();

restaurantRouter.get(
  "/getAllActiveRestaurants",
  validateJwtToken,
  getAllActiveRestaurants
);
restaurantRouter.get("/getAllRestaurants", validateJwtToken, getAllRestaurants);
restaurantRouter.post(
  "/actionOnRestaurant",
  validateJwtToken,
  actionOnRestaurant
);
restaurantRouter.post("/addRestaurant", validateJwtToken, addRestaurant);
restaurantRouter.post("/editRestaurant", validateJwtToken, updateRestaurant);
restaurantRouter.post(
  "/getRestaurantsByOwner",
  validateJwtToken,
  getRestaurantsByOwnerId
);
restaurantRouter.post("/deleteRestaurant", validateJwtToken, deleteRestaurant);

module.exports = restaurantRouter;
