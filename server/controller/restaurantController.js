const restaurantModel = require("../model/restaurantModel");

const getAllActiveRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({ isActive: true });
    res.status(200).json({
      success: true,
      message: "Active Restaurants fetched Successfully",
      data: restaurants,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel
      .find()
      .populate("owner")
      .sort({ createdAt: -1 });
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

const getRestaurantsByOwnerId = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({ owner: req.body.owner });
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

const actionOnRestaurant = async (req, res) => {
  const { _id, isActive } = req.body;
  try {
    const response = await restaurantModel.findOneAndUpdate(
      { _id: _id },
      { $set: { isActive: !isActive } }
    );
    res.send({
      success: true,
      message: "Restaurant enable/disable action done Successfully",
      data: response,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllActiveRestaurants,
  getAllRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsByOwnerId,
  actionOnRestaurant,
};
