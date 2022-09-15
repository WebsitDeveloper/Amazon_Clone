const jwt = require("jsonwebtoken");
const USER = require("../models/userSchema");
const secretKey = process.env.KEY;

//define middle ware
const authenticate = async (req, res, next) => {
  try {
    // cookie store in token variable and get cookie value
    const token = req.cookies.test;
    // cookie value math with secretKey if match they return id and with the help of id we find user
    const verifyToken = jwt.verify(token, secretKey);
    console.log(verifyToken);
    // jo user mile ga usi user me item ko store krna
    const rootUser = await USER.findOne({
      _id /*database id*/: verifyToken._id /*token id*/,
      "tokens.token": token,
    });
    console.log("rootuser");
    // if user not find we through an error
    if (!rootUser) {
      throw new Error("user not found!!!");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id; // user ID

    next();
  } catch (error) {
    res.status(400).send("unauthorized: No token provide");
    console.log(error);
  }
};

module.exports = authenticate;
