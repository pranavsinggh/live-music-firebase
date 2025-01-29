import React, { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { __AUTH } from "../../backend/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const PhoneAuth = () => {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  let [phone, setPhone] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Initialize reCAPTCHA
      const recaptchaVerifier = new RecaptchaVerifier(
        __AUTH,
        "sign-in-button",
        {
          size: "invisible",
          callback: response => {
            console.log("reCAPTCHA solved:", response);
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired. Please try again.");
          },
        },
        __AUTH
      );

      // Sign in with phone number
      const confirm = await signInWithPhoneNumber(
        __AUTH,
        phone,
        recaptchaVerifier
      );

      // Prompt user for OTP
      const otp = prompt("Enter the OTP sent to your phone:");
      if (!otp) throw new Error("OTP cannot be empty");

      // Confirm the OTP
      const user = await confirm.confirm(otp);
      console.log("User authenticated:", user);

      navigate("/"); // Navigate to the desired route
    } catch (error) {
      console.error("Error during authentication:", error);
      // Optionally show a toast or alert for the error
    } finally {
      setIsLoading(false);
      // Optionally reset phone input
      // setPhone("");
    }
  };

  return (
    <section>
      <article className="min-[100%-70px] bg-gray-850 flex flex-col justify-center py-12">
        <header>
          <h1 className="mt-10 text-center text-3xl leading-5 text-purple-600 max-w">
            Login with OTP
          </h1>
        </header>
        <main className="mt-8 m-auto">
          <form
            className="w-[400px] flex flex-col justify-center bg-gray-700 p-2 rounded-xl border-b-2 border-b-purple-700"
            onSubmit={handleSubmit}
          >
            <div className="p-2">
              <label
                htmlFor="phone"
                className="block font-medium text-gray-100 leading-5 py-2 text-lg "
              >
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                id="phone"
                name="phone"
                className="w-full p-2 rounded-sm border-gray-500 border-2 bg-transparent"
                value={phone}
                required
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <div className="p-2"></div>
            <div className="p-2 flex gap-4 text-white text-md">
              <span className="text-sm font-thin">Login with Mail ? </span>
              <span>
                <NavLink
                  to="/auth/login"
                  className="text-white text-sm font-thin bg-slate-500 rounded-sm hover:bg-pink-700 border-purple-700 border-b p-2 hover:border-pink-500"
                >
                  Mail Login
                </NavLink>
              </span>
            </div>

            <div className="p-2">
              <button className="bg-[#eb6378] w-full flex justify-center py-2 px-4 border-transparent text-md font-medium my-1 rounded-md text-white hover:bg-purple-600 focus:outline-none">
                {isLoading ? "...Loading" : "Send OTP"}
              </button>
            </div>
          </form>
        </main>
      </article>
    </section>
  );
};

export default PhoneAuth;
