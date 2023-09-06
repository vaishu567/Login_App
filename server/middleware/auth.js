const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const Auth = asyncHandler(async (req, res, next) => {
  //access authorizze to validate request
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  //retrive the user details of the logged in user:
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
});

const localVariables = (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};

module.exports = { Auth, localVariables };
