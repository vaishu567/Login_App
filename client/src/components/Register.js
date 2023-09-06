import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidation } from "../helper/validate";
import { useState } from "react";
import convertToBase64 from "../helper/convert";
import { registerUser } from "../helper/helper";
import styles from "../styles/Username.module.css";

const Register = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" });
      console.log(values);
      const registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: "Creating....",
        success: <b>Registration Successful...!</b>,
        error: <b>Registration Failure</b>,
      });
      // registerPromise.then(function () {
      navigate("/");
      // });
    },
  });

  /**formik doesn't support file upload so we need to create this handler*/
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen ">
        <div
          className={styles.glass}
          style={{ width: "45%", padding: "35px", paddingBottom: "10px" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register Here!</h4>
            <span className="py-3 text-xl w-2/3 text-center text-gray-500">
              Happy to join you!
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  className={styles.profile_img}
                  alt="avatar"
                />
              </label>
              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
              />
            </div>
            <div className="textbox flex flex-col items-center gap-4">
              <input
                type="email"
                placeholder="Email*"
                className={styles.textbox}
                {...formik.getFieldProps("email")}
                style={{ height: "30%" }}
              />
              <input
                type="text"
                placeholder="Username*"
                className={styles.textbox}
                {...formik.getFieldProps("username")}
                style={{ height: "30%" }}
              />
              <input
                type="text"
                placeholder="Password*"
                className={styles.textbox}
                {...formik.getFieldProps("password")}
                style={{ height: "30%" }}
              />
              <button
                type="submit"
                className={styles.btn}
                style={{ height: "30%" }}
              >
                Register
              </button>
            </div>
            <div className="text-center py-2 pb-2 ">
              <span className="text-gray-500">
                Already Registered?{" "}
                <Link className="text-purple-500" to="/">
                  Login now!
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
