const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const otpGenerator = require("otp-generator");

/** middleware for verify user */
// const verifyUser = asyncHandler(async (req, res, next) => {
const verifyUser = async (req, res, next) => {
  const { username } = req.method == "GET" ? req.query : req.body;

  // Replace this logic with your actual user authentication logic
  try {
    // Assuming you have a function to find a user by username
    // Replace this with your actual implementation
    const user = await UserModel.findOne({ username });

    if (!user) {
      // User not found
      return res.status(404).json({ error: "User not found!" });
    }
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while authenticating." });
  }
};
// });

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/

const register = asyncHandler(async (req, res) => {
  const { username, password, profile, email } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Looks like you have missed the mandatory field!");
  }
  const existEmail = await UserModel.findOne({ email });
  if (existEmail) {
    res.status(400);
    throw new Error("Please use unique Email");
  }
  const existUsername = await UserModel.findOne({ username });
  if (existUsername) {
    res.status(400);
    throw new Error("Please use unique username");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hash Password: ", hashedPassword);
  if (hashedPassword) {
    const user = await UserModel.create({
      username,
      password: hashedPassword,
      profile: profile || "",
      email,
    });

    console.log(`User created: ${user}`);
    if (user) {
      res.status(201).json({ msg: "User Registration is Successful!" });
    } else {
      res.status(400);
      throw new Error("Registartion Failed");
    }
  } else {
    res.status(400);
    throw new Error("Enable to hash password");
  }
});

//----------------------------------------------------------------

/** POST: http://localhost:8080/api/login 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
}
*/
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are required!");
  }
  const userr = await UserModel.findOne({ username });

  if (userr && bcrypt.compare(password, userr.password)) {
    //create jwt token for authentication:
    const token = jwt.sign(
      { userId: userr._id, username: userr.username },
      process.env.ACCESS_TOKEN_SECRET, // Change this to your own secret key
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      msg: "Login Successful!",
      username: userr.username,
      token: token,
    });
  } else {
    res.status(401);
    throw new Error("Credentials are not valid!");
  }
});
// -------------------------------------------------------------------------------

/**GET: http://localhost:8080/api/user/example123 */
const getUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (username) {
    const user = await UserModel.findOne({ username });
    if (user) {
      /**remove password from user */
      //mongoose return unnecesary data with object so convert it into json
      const { password, ...rest } = Object.assign({}, user.toJSON());
      res.status(201).json(rest);
    } else {
      res.status(501);
      throw new Error(`User ${username} not found!`);
    }
  } else {
    res.status(501);
    throw new Error("Invalid username!");
  }
});

//----------------------------------------------------------------

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/

const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const User = await UserModel.findById(userId);

  if (!User) {
    res.status(404);
    throw new Error("User not found!");
  }
  // if (User.user_id.toString() !== req.user.id) {
  //   res.status(403);
  //   throw new Error("User don't have permission to update other user contacts");
  // }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("User updated successfully!");
    return res.status(200).json("User updated successfully!");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**GET: http://localhost:8080/api/generateOTP*/
const generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
};

/**GET: http://localhost:8080/api/verifyOTP*/
const verifyOTP = async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; //reset the OTP value
    req.app.locals.resetSession = true; //start session for reset password
    return res.status(201).send({ msg: "Verified Successfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
};

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
const createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
};

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
const resetPassword = asyncHandler(async (req, res) => {
  if (!req.app.locals.resetSession) {
    return res.status(440).send({ error: "Session expired!" });
  } else {
    const { username, password } = req.body;
    if (!username && !password) {
      res.status(404);
      throw new Error("provide credentials");
    } else {
      const user = await UserModel.findOne({ username });
      if (user) {
        const hashedPasswordNew = await bcrypt.hash(password, 10);
        const updateddata = await UserModel.updateOne(
          {
            username: user.username,
          },
          { password: hashedPasswordNew }
        );
        if (updateddata) {
          req.app.locals.resetSession = false;
          res.status(201).json({ msg: "reset password done successfully!" });
          console.log("reset password done successfully!");
        } else {
          res.status(500);
          throw new Error("Couldn't hash new password");
        }
      } else {
        return res.status(404).send({ error: "Username not found!" });
      }
    }
  }
});

module.exports = {
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
  verifyUser,
};
