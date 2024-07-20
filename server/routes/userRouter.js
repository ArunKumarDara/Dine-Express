const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  addReceiverDetails,
  getReceiverDetails,
  updateUserProfile,
} = require("../controller/userController");
const validateJwtToken = require("../middleware/authMiddleware");
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/getCurrentUser", validateJwtToken, getCurrentUser);
userRouter.post("/addReceiverDetails", validateJwtToken, addReceiverDetails);
userRouter.post("/getReceiverDetails", validateJwtToken, getReceiverDetails);
userRouter.post("/updateUserProfile", validateJwtToken, updateUserProfile);

module.exports = userRouter;
