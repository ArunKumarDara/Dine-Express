const itemsModel = require("../model/itemsModel");

const addMenuItem = async (req, res) => {
  try {
    const menuItem = new itemsModel(req.body);
    const response = await menuItem.save();
    res.status(200).json({
      success: true,
      message: "Menu Item Added Successfully",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Cannot add menu item",
    });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const response = await itemsModel
      .find({
        availableIn: req.body.restaurantId,
      })
      .populate("availableIn");
    res.status(200).json({
      success: true,
      message: "Menu Items fetched Successfully",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Cannot fetch Menu Items",
    });
  }
};

module.exports = {
  addMenuItem,
  getMenuItems,
};
