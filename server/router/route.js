const { Router } = require("express");
const router = Router();
// import all controllers:
const {
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
  verifyUser,
} = require("../controllers/appController");
const registerMail = require("../controllers/mailer");

const { Auth, localVariables } = require("../middleware/auth");

/** POST Methods */
router.post("/register", register); // register user

router.post("/registerMail", registerMail); //send email
router.post("/authenticate", verifyUser, (req, res) => {
  res.status(200).json({ message: "User authenticated successfully!" });
}); //authenticate user
router.post("/login", verifyUser, login); //login user

/** GET Methods */
router.get("/user/:username", getUser); // user with username
router.get("/generateOTP", verifyUser, localVariables, generateOTP); // generateOTP random
router.get("/verifyOTP", verifyOTP); //verify generatedOTP
router.get("/createResetSession", createResetSession); //reset all the variables

/** PUT Methods */
router.put("/updateuser", Auth, updateUser); //is used to update the user profile
router.put("/resetPassword", verifyUser, resetPassword); // use to reset the password

module.exports = router;
