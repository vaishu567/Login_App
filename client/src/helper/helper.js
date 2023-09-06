import axios from "axios";
import jwt_decode from "jwt-decode";
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;
/**Make API Requests */

/** To get username from Token */
export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Cannot find Token");
  let decode = jwt_decode(token);
  console.log(decode);
  return decode;
}

/**authenticate function */
export async function authenticate(username) {
  try {
    return await axios.post("http://localhost:8080/api/authenticate", {
      username,
    });
  } catch (error) {
    return { error: "Username doesn't exist...!" };
  }
}

/**get User details */
const getUser = async ({ username }) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/user/${username}`
    );
    return { data };
  } catch (error) {
    return { error: "Password doesn't Match..!" };
  }
};

/**register user function */
const registerUser = async (credentials) => {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`http://localhost:8080/api/register`, credentials);

    const { username, email } = credentials;

    /**send email */
    if (status === 201) {
      await axios.post(`http://localhost:8080/api/registerMail`, {
        username,
        userEmail: email,
        text: msg,
      });
    }
    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
};

/**login user function */
const verifyPassword = async ({ username, password }) => {
  try {
    if (username) {
      const response = await axios.post(`http://localhost:8080/api/login`, {
        username,
        password,
      });
      console.log(response);
      const data = response.data;
      return Promise.resolve(data);
    }
  } catch (error) {
    console.error("Login Error:", error);
    return Promise.reject({ error: "Password doesn't Match...!" });
  }
};

/**update user profile function */
const updateUser = async (response) => {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put(
      "http://localhost:8080/api/updateuser",
      response,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't update user profile..!" });
  }
};

/**generate OTP */
const generateOTP = async (username) => {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("http://localhost:8080/api/generateOTP", {
      params: { username },
    });
    //send mail with OTP:
    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });
      let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
      await axios.post("http://localhost:8080/api/registerMail", {
        username,
        userEmail: email,
        text,
        subject: "Password Recovery OTP",
      });
    }
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error });
  }
};

/**verify OTP */
const verifyOTP = async ({ username, code }) => {
  try {
    const { data, status } = await axios.get(
      "http://localhost:8080/api/verifyOTP",
      {
        params: { username, code },
      }
    );
    return { data, status };
  } catch (error) {
    return Promise.reject(error);
  }
};

/** reset password */
const resetPassword = async ({ username, password }) => {
  try {
    const { data, status } = await axios.put(
      "http://localhost:8080/api/resetPassword",
      {
        username,
        password,
      }
    );
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
};

// const createSession = async ({ username, password }) => {
//   try {
//     const { data, status } = await axios.put(
//       "http://localhost:8080/api/resetPassword",
//       {
//         username,
//         password,
//       }
//     );
//     return Promise.resolve({ data, status });
//   } catch (error) {
//     return Promise.reject({ error });
//   }
// };

export {
  getUser,
  registerUser,
  verifyPassword,
  updateUser,
  generateOTP,
  verifyOTP,
  resetPassword,
};
