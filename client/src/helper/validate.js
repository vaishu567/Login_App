import toast from "react-hot-toast";
import { authenticate } from "./helper";
// validate login page username:
const usernameValidate = async (values) => {
  const errors = usernameVerify({}, values);
  if (values.username) {
    //check user exist or not
    const { status } = await authenticate(values.username);
    console.log(status);
    if (status !== 200) {
      errors.exist = toast.error("User does not exist...!");
    }
  }
  return errors;
};

//validate login page password:
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);

  return errors;
}

//validate reset password:
export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Password doesn't match!");
  }

  return errors;
}

//validate register from:
export async function registerValidation(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);

  return errors;
}

export async function profileValidation(values) {
  const errors = emailVerify({}, values);

  return errors;
}

//***************************************************/

// validate username//
function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username must be provided..!");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid Username.!");
  }

  return error;
}

// validate password//
const passwordVerify = (errors = {}, values) => {
  const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

  if (!values.password) {
    errors.password = toast.error("Password required!");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Wrong password!");
  } else if (values.password.length < 4) {
    errors.password = toast.error("Password must be at least 4 characters!");
  } else if (!specialChars.test(values.password)) {
    errors.password = toast.error(
      "Password must have at least one special character!"
    );
  }

  return errors;
};

//validate email//
function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Email is required!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid Email!");
  }

  return error;
}

export { usernameValidate };
