const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  addReceiverDetails,
  getReceiverDetails,
  updateUserProfile,
  googleAuthentication,
} = require("../controller/userController");
const validateJwtToken = require("../middleware/authMiddleware");
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", validateJwtToken, logoutUser);
userRouter.get("/getCurrentUser", validateJwtToken, getCurrentUser);
userRouter.post("/addReceiverDetails", validateJwtToken, addReceiverDetails);
userRouter.post("/getReceiverDetails", validateJwtToken, getReceiverDetails);
userRouter.post("/updateUserProfile", validateJwtToken, updateUserProfile);
userRouter.post("/googleAuthentication", googleAuthentication);

module.exports = userRouter;
