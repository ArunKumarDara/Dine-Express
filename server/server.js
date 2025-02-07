const express = require("express");
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const userRouter = require("./routes/userRouter");
const cors = require("cors");
const restaurantRouter = require("./routes/restaurantRouter");
const menuItemRouter = require("./routes/menuItemsRouter");
const orderRouter = require("./routes/orderRouter");
const addressRouter = require("./routes/addressRouter");
const dashBoardRouter = require("./routes/dashBoardRouter");
const paymentRouter = require("./routes/makePaymentRouter");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// app.use(cors());
app.use("/app/v1/users", userRouter);
app.use("/app/v1/users", restaurantRouter);
app.use("/app/v1/users", menuItemRouter);
app.use("/app/v1/users", paymentRouter);
app.use("/app/v1/users", orderRouter);
app.use("/app/v1/users", addressRouter);
app.use("/app/v1/admin", restaurantRouter);
app.use("/app/v1/admin", orderRouter);
app.use("/app/v1/admin", dashBoardRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
