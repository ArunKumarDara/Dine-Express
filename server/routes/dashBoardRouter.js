const express = require("express");
const {
  getDashBoardDetails,
  orderStatusDistribution,
} = require("../controller/dashBoardController");

const dashBoardRouter = express.Router();

dashBoardRouter.get("/dashboard", getDashBoardDetails);
dashBoardRouter.get("/orderStatusDistribution", orderStatusDistribution);

module.exports = dashBoardRouter;
