const addressModel = require("../model/addressModel");

const addAddress = async (req, res) => {
  try {
    console.log(req.body);
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

module.exports = {
  addAddress,
};
