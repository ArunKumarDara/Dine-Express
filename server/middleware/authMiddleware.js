const jwt = require("jsonwebtoken");

const validateJwtToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = validateJwtToken;
