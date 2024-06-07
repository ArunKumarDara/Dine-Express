const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const userExists = await userModel.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const user = new userModel(req.body);
    const response = await user.save();
    res.status(200).json({
      success: true,
      response: response,
      message: "Registration Successful, Please Login",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error || "User has entered invalid information",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const userExists = await userModel.findOne({ email: req.body.email });
    if (!userExists) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }
    const validatePassword = await bcrypt.compare(
      req.body.password,
      userExists.password
    );
    if (!validatePassword) {
      return res.status(200).json({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = jwt.sign({ userId: userExists._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      data: token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User has entered invalid information",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select("-password");
    res.send({
      success: true,
      message: "User Details Fetched Successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
