const addressModel = require("../model/addressModel");

const addAddress = async (req, res) => {
  try {
    const userAddresses = await addressModel.find({ user: req.body.userId });
    if (req.body.isPrimary) {
      userAddresses.forEach(async (userAddress) => {
        userAddress.isPrimary = false;
        await userAddress.save();
      });
    }
    const address = new addressModel({ ...req.body, user: req.body.userId });
    const response = await address.save();
    res.status(200).json({
      success: true,
      message: "Address added successfully",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error || "Cannot add address",
    });
  }
};

const getAllAddressByUser = async (req, res) => {
  try {
    const response = await addressModel.find({ user: req.body.userId });
    res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Cannot fetch address",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const userAddresses = await addressModel.find({ user: req.body.userId });
    if (req.body.address.isPrimary) {
      userAddresses.forEach(async (userAddress) => {
        userAddress.isPrimary = false;
        await userAddress.save();
      });
    }
    const response = await addressModel.findByIdAndUpdate(
      req.body.addressId,
      req.body.address
    );
    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Cannot update address",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    await addressModel.findByIdAndDelete(req.body.addressId);
    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Cannot delete address",
    });
  }
};

const getPrimaryAddress = async (req, res) => {
  try {
    const response = await addressModel.findOne({
      user: req.body.userId,
      isPrimary: true,
    });
    res.status(200).json({
      success: true,
      message: "Primary address fetched successfully",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Cannot fetch primary address",
    });
  }
};

module.exports = {
  addAddress,
  getAllAddressByUser,
  editAddress,
  deleteAddress,
  getPrimaryAddress,
};
