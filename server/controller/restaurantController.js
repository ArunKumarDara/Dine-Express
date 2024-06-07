const restaurantModel = require("../model/restaurantModel");

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find().populate("owner");
    res.status(200).json({
      success: true,
      message: "Restaurants fetched Successfully",
      data: restaurants,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

const addRestaurant = async (req, res) => {
  try {
    const restaurant = new restaurantModel(req.body);
    const response = await restaurant.save();
    res.status(200).json({
      success: true,
      message: "Restaurant added successfully",
      data: response,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    await restaurantModel.findByIdAndUpdate(req.body.restaurantId, req.body);
    res.send({
      success: true,
      message: "Restaurant Updated Successfully",
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    await restaurantModel.findByIdAndDelete(req.body.restaurantId);
    res.send({
      success: true,
      message: "Restaurant Deleted Successfully",
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
