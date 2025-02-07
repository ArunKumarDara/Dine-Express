const userModel = require("../model/userModel");
const receiverModel = require("../model/receiverModel");
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
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.ORIGIN_URL
          : "localhost",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
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

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("authToken");
    res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Cannot Logout",
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

const addReceiverDetails = async (req, res) => {
  try {
    const userReceivers = await receiverModel.find({ userId: req.body.userId });
    userReceivers?.forEach(async (userReceiver) => {
      userReceiver.status = false;
      await userReceiver.save();
    });
    const receiverDetails = new receiverModel({
      ...req.body,
      userId: req.body.userId,
    });
    const response = await receiverDetails.save();
    res.status(200).json({
      success: true,
      message: "receiver details added successfully",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error || "Cannot add receiver details",
    });
  }
};

const getReceiverDetails = async (req, res) => {
  try {
    const response = await receiverModel.findOne({
      userId: req.body.userId,
      status: true,
    });
    res.status(200).json({
      success: true,
      message: "receiver details fetched successfully",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error || "Cannot fetch receiver details",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { userId, firstName, lastName, phoneNumber, email } = req.body;
    const updatedData = {
      firstName,
      lastName,
      phoneNumber,
      email,
    };
    const user = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: updatedData },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Cannot update user profile",
    });
  }
};

const googleAuthentication = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.status(200).json({
        success: true,
        message: "Login Successful",
        data: token,
      });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);
      const newUser = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: hashedPassword,
      });
      const response = await newUser.save();
      const token = jwt.sign({ userId: response._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.status(200).json({
        success: true,
        message: "Login Successful",
        data: token,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Cannot sign in with google",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  addReceiverDetails,
  getReceiverDetails,
  updateUserProfile,
  googleAuthentication,
};
