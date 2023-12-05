import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { TbSocial } from "react-icons/tb";
import { BsShare } from "react-icons/bs";
import { AiOutlineInteraction } from "react-icons/ai";
import { ImConnection } from "react-icons/im";
import CustomButton from "../components/CustomButton";
import Loading from "../components/Loading";
import TextInput from "../components/TextInput";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import { BgImage } from "../assests";
import { apiRequest, createOrGetUser } from "../utils";
import { UserLogin } from "../redux/userSlice";
import { CiLight } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("useEffect triggered with user:", user);

    if (user && user.token) {
      console.log("User is authenticated, navigating to /");
      navigate("/");
    } else {
      console.log("User is not authenticated, navigating to /login");
      navigate("/login");
    }
  }, [user, navigate]);

  const createOrGetUser = async (response) => {
    const decode = jwtDecode(response.credential);
    const {
      given_name: firstName,
      family_name: lastName,
      email,
      picture: profileUrl,
      sub,
    } = decode;
    const newData = {
      firstName,
      lastName,
      email,
      profileUrl,
      sub,
      verified: true,
      isGoogleAuth: true,
    };
    setIsSubmitting(true);
    try {
      const res = await apiRequest({
        url: "http://localhost:8800/auth/loginWithGoogle",
        data: newData,
        method: "POST",
      });
      console.log("res from login", res);
      if (res?.success === "failed") {
        setErrMsg(res);
      } else {
        setErrMsg(res);
        console.log("hello from sattus success");
        console.log("err", errMsg);
        const newData = {
          token: res?.token,
          ...res?.traveler,
          refreshToken: res?.refreshToken,
        };
        console.log("newdata", newData);
        dispatch(UserLogin(newData));
        window.location.replace("/");
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest({
        url: "http://localhost:8800/auth/login",
        data: data,
        method: "POST",
      });
      console.log("res from login", res);
      if (res?.success === "failed") {
        setErrMsg(res);
      } else {
        setErrMsg(res);
        console.log("err", errMsg);
        const newData = { token: res?.token, ...res?.traveler };

        console.log("newdata", newData);
        dispatch(UserLogin(newData));
        window.location.replace("/");
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl">
        {/* LEFT */}
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center ">
          <div className="w-full flex gap-2 items-center mb-6">
            <div className="p-2 bg-[#065ad8] rounded text-white">
              <TbSocial />
            </div>
            <span className="text-2xl text-[#065ad8] font-semibold">
              Travel Planner
            </span>
          </div>

          <p className="text-ascent-1 text-base font-semibold">
            Log in to your account
          </p>
          <span className="text-sm mt-2 text-ascent-2">Welcome back</span>

          <form
            className="py-8 flex flex-col gap-5="
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              name="email"
              placeholder="email@example.com"
              label="Email Address"
              type="email"
              register={register("email", {
                required: "Email Address is required",
              })}
              styles="w-full rounded-full"
              labelStyle="ml-2"
              error={errors.email ? errors.email.message : ""}
            />

            <TextInput
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
              styles="w-full rounded-full"
              labelStyle="ml-2"
              register={register("password", {
                required: "Password is required!",
              })}
              error={errors.password ? errors.password?.message : ""}
            />

            <Link
              to="/reset-password"
              className="text-sm text-right text-blue font-semibold"
            >
              Forgot Password ?
            </Link>

            {errMsg?.message && (
              <span
                className={`text-sm ${
                  errMsg?.status === "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )}

            {isSubmitting ? (
              <Loading />
            ) : (
              <>
                <CustomButton
                  type="submit"
                  containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                  title="Login"
                />
                <br />
                <GoogleLogin
                  onSuccess={(response) => createOrGetUser(response)}
                  onError={(error) => console.log(error)}
                />
              </>
            )}
          </form>

          <p className="text-ascent-2 text-sm text-center">
            Don't have an account?
            <Link
              to="/register"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer"
            >
              Create Account
            </Link>
          </p>

          {/* <Link
            to="/googleSignUp"
            className="text-[#065ad8] font-semibold ml-2  text-center cursor-pointer"
          >
            SignUp With Google
          </Link> */}
        </div>
        {/* RIGHT */}
        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={BgImage}
              alt="BgImage"
              className="w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover"
            />

            <div className="absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full">
              <BsShare size={14} />
              <span className="text-xs font-medium">Share</span>
            </div>

            <div className="absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full">
              <ImConnection />
              <span className="text-xs font-medium">Connect</span>
            </div>

            <div className="absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full">
              <AiOutlineInteraction />
              <span className="text-xs font-medium">Interact</span>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-white text-base">
              Connect with friedns & have share for fun
            </p>
            <span className="text-sm text-white/80">
              Share memories with friends and the world.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
