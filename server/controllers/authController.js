import Travelers from "../models/travelerModel.js";
import { createJwt, hashPassword } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { comparePassword } from "../utils/index.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (!(firstName || lastName || email || password)) {
    next("Provide Required Field");
    return;
  }
  try {
    const existingtraveler = await Travelers.findOne({ email });
    if (existingtraveler) {
      next("Email is already in use");
      res.status(400).send({
        success: "failed",
        message: "Email is already in use",
      });
      return;
    } else {
      const hashedPassword = await hashPassword(password);
      const traveler = await Travelers.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      //SEND EMAIL VERIFICATION LINK TO THE TRAVELER
      sendVerificationEmail(traveler, res);
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("eamil,password", email, password);
  try {
    if (!(email || password)) {
      next("Please provide user credentials");
      return;
    }
    //find traveller by email
    // find user by email
    const traveler = await Travelers.findOne({ email })
      .select("+password")
      .populate({
        path: "friends",
        select: "firstName lastName location profileUrl -password",
      });
    console.log("logged traveler", traveler);
    if (!traveler) {
      next("Email Or Password Is Incorrect");
      return;
    }
    if (traveler.isGoogleAuth) {
      res.status(400).send({
        success: "failed",
        message: "Please Login Through Google Account",
      });
      return;
    }
    if (!traveler?.verified) {
      console.log("Your Email Account Is Not Verified ");

      res.status(201).send({
        success: "PENDING",
        message: "You Are Not verified",
      });
      return;
    }

    //compare paswword
    const isMatch = await comparePassword(password, traveler?.password);
    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    traveler.password = undefined;
    // const token = createJwt(traveler?._id);
    const { token, refreshToken } = createJwt(traveler?._id);

    res.status(201).json({
      success: true,
      message: "Login successfully",
      traveler,
      token,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const loginWithGoogle = async (req, res, next) => {
  const {
    email,
    sub,
    firstName,
    lastName,
    profileUrl,
    verified,
    isGoogleAuth,
  } = req.body;
  console.log("eamil from google", email);
  try {
    if (!email) {
      next("Please provide user credentials");
      return;
    }
    //find traveller by email

    const traveler = await Travelers.findOne({ email })
      .select("+password")
      .populate({
        path: "friends",
        select: "firstName lastName location profileUrl -password",
      });
    console.log("logged traveler", traveler);
    if (!traveler) {
      const token = createJwt(sub);
      console.log(token);
      const traveler = await Travelers.create({
        firstName,
        lastName,
        email,
        profileUrl,
        verified,
        isGoogleAuth,
      });
      res.status(201).send({
        success: "success",
        traveler,
        token,
      });
      return;
    }
    if (!traveler?.isGoogleAuth) {
      res.status(400).send({
        success: "failed",
        message:
          "You are not able to login by this google account choose alternative option",
      });
      return;
    }
    if (!traveler?.verified) {
      console.log("Your Email Account Is Not Verified Please Verify");
      res.status(201).send({
        success: "PENDING",
        message:
          "Verification email has been sent to your account. Check your email for further instructions.",
      });
      return;
    }

    // //compare paswword
    // const isMatch = await comparePassword(password, traveler?.password);
    // if (!isMatch) {
    //   next("Invalid email or password");
    //   return;
    // }

    // traveler.password = undefined;
    const token = createJwt(sub);

    res.status(201).json({
      success: true,
      message: "Login successfully",
      traveler,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const registerWithGoogle = async (req, res, next) => {
  const { firstName, lastName, email, sub, profileUrl } = req.body;
  console.log(firstName);
  if (!(firstName || lastName || email || sub)) {
    next("Provide Required Field");
    return;
  }
  try {
    const existingtraveler = await Travelers.findOne({ email });
    if (existingtraveler) {
      console.log("Email is already in use");
      next("Email is already in use");
      return;
    } else {
      // const hashedPassword = await hashPassword(password);
      const traveler = await Travelers.create({
        firstName,
        lastName,
        email,
        verified: true,
        profileUrl,
        isGoogleAuth: true,
      });
      const token = createJwt(sub);

      res.status(201).json({
        success: true,
        message: "Register successfully",
        traveler,
        token,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(400).json({
      success: false,
      message: "Email Already Registered",
    });
  }
};
