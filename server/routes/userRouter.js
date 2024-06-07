const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controller/userController");
const validateJwtToken = require("../middleware/authMiddleware");
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/getCurrentUser", validateJwtToken, getCurrentUser);

module.exports = userRouter;
