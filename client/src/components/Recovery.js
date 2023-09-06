import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuthStore from "../store/store";
import { generateOTP, verifyOTP } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Username.module.css";

const Password = () => {
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const extra = async () => {
      const OTP = await generateOTP(username);
      if (OTP) {
        console.log(OTP);
        return toast.success("OTP has been send to your email!");
      } else {
        return toast.error("Problem while generating OTP!");
      }
    };
    extra();
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code: OTP });
      if (status === 201) {
        toast.success("Verify Successfully!");
        return navigate("/reset");
      }
    } catch (error) {
      return toast.error("Wrong OTP! Check email again!");
    }
  }
  // handler of resend OTP
  function resendOTP() {
    let sentPromise = generateOTP(username);

    toast.promise(sentPromise, {
      loading: "Sending...",
      success: <b>OTP has been send to your email!</b>,
      error: <b>Could not Send it!</b>,
    });

    sentPromise.then((OTP) => {
      console.log(OTP);
    });
  }
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Recover Here!</h4>
            <span className="pb-12 pt-6 text-xl w-2/3 text-center text-gray-500">
              You must enter OTP to recover your password.
            </span>
          </div>
          <form className="py-1" onSubmit={onSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center ">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter a 6 digit OTP sent to your email address.
                </span>
                <input
                  type="text"
                  placeholder="enter OTP"
                  className={styles.textbox}
                  onChange={(e) => setOTP(e.target.value)}
                />
              </div>

              <button type="submit" className={styles.btn}>
                Recover
              </button>
            </div>
          </form>
          <div className="text-center py-4">
            <span className="text-gray-500">
              Can't get OTP?{" "}
              <button className="text-purple-500" onClick={resendOTP}>
                Resend
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Password;
