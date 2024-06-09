const express = require("express");
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const userRouter = require("./routes/userRouter");
const cors = require("cors");
const restaurantRouter = require("./routes/restaurantRouter");
const menuItemRouter = require("./routes/menuItemsRouter");

const app = express();
const port = process.env.PORT || 3000;

console.log(dbConfig);

app.use(express.json());
app.use(cors());

app.use("/app/v1/users", userRouter);
app.use("/app/v1/users", restaurantRouter);
app.use("/app/v1/users", menuItemRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
