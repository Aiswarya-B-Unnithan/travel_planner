import mongoose from "mongoose";
import Verification from "../models/emailVerifiaction.js";
import Travelers from "../models/travelerModel.js";
import { comparePassword, createJwt, hashPassword } from "../utils/index.js";
import { upload } from "../middleware/multer.js";
import cloudinary from "cloudinary";
import PasswordReset from "../models/passwordResetModel.js";
import { resetPasswordLink } from "../utils/sendEmail.js";

export const verifyEmail = async (req, res) => {
  console.log("hello");
  const { userId, token } = req.params;
  console.log("req.params", token);
  try {
    const result = await Verification.findOne({ userId });

    if (result) {
      const { expiresAt, token: hashedToken } = result;
      console.log("result", hashedToken);
      // token has expires
      if (expiresAt < Date.now()) {
        Verification.findOneAndDelete({ userId })
          .then(() => {
            Travelers.findOneAndDelete({ _id: userId })
              .then(() => {
                const message = "Verification token has expired.";
                res.redirect(`/users/verified?status=error&message=${message}`);
              })
              .catch((err) => {
                res.redirect(`/users/verified?status=error&message=`);
              });
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/users/verified?message=`);
          });
      } else {
        //token valid
        console.log("token is valid");
        comparePassword(token, hashedToken)
          .then((isMatch) => {
            console.log("match found", isMatch);
            if (isMatch) {
              console.log("stucess");
              Travelers.findOneAndUpdate({ _id: userId }, { verified: true })
                .then(() => {
                  console.log("sucess");
                  Verification.findOneAndDelete({ userId }).then(() => {
                    const message = "Email verified successfully";
                    res.redirect("http://localhost:3000");
                  });
                })
                .catch((err) => {
                  console.log("match not found");
                  console.log(err);
                  const message = "Verification failed or link is invalid";
                  res.redirect(
                    `/users/verified?status=error&message=${message}`
                  );
                });
            } else {
              // invalid token
              const message = "Verification failed or link is invalid";
              res.redirect(`/users/verified?status=error&message=${message}`);
            }
          })
          .catch((err) => {
            console.log(err);
            res.redirect(`/users/verified?message=`);
          });
      }
    } else {
      const message = "Invalid verification link. Try again later.";
      res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(error);
    res.redirect(`/users/verified?message=`);
  }
};
export const updateUser = async (req, res, next) => {
  console.log("body", req.body);
  try {
    const {
      firstName,
      lastName,
      location,
      profileUrl,
      profession,
      travelPreference,
    } = req.body;

    if (
      !(
        firstName ||
        lastName ||
        contact ||
        profession ||
        location ||
        travelPreference
      )
    ) {
      next("Please provide all required fields");
      return;
    }

    const { userId } = req.body;
    console.log(
      "from usercontroller",
      firstName,
      lastName,
      location,
      travelPreference
    );

    // Create the updateUser object without profileUrl
    const updateUser = {
      firstName,
      lastName,
      location,
      profession,
      travelPreference,
      _id: userId,
    };

    if (profileUrl) {
      updateUser.profileUrl = profileUrl;
      const uploadResponse = await cloudinary.v2.uploader.upload(profileUrl);
    }

    const user = await Travelers.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });
    console.log("user", user);

    await user.populate({ path: "friends", select: "-password" });
    const token = createJwt(user?._id);

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
export const getUserProfile = () => {};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("email from password reset", email);
    const user = await Travelers.findOne({ email });
    if (user.isGoogleAuth) {
      return res.status(404).json({
        status: "FAILED",
        message:
          "You are logged by google account so login uisng this google account.",
      });
    }
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "Email address not found.",
      });
    }

    const existingRequest = await PasswordReset.findOne({ email });
    if (existingRequest) {
      if (existingRequest.expiresAt > Date.now()) {
        return res.status(201).json({
          status: "PENDING",
          message: "Reset password link has already been sent tp your email.",
        });
      }
      await PasswordReset.findOneAndDelete({ email });
    }
    await resetPasswordLink(user, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { userId, token } = req.params;
  console.log("resetpassword second step");
  try {
    // find record
    const user = await Travelers.findById(userId);

    if (!user) {
      const message = "Invalid password reset link. Try again";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    }

    const resetPassword = await PasswordReset.findOne({ userId });

    if (!resetPassword) {
      const message = "Invalid password reset link. Try again";
      return res.redirect(
        `/users/resetpassword?status=error&message=${message}`
      );
    }

    const { expiresAt, token: resetToken } = resetPassword;

    if (expiresAt < Date.now()) {
      const message = "Reset Password link has expired. Please try again";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    } else {
      const isMatch = await comparePassword(token, resetToken);

      if (!isMatch) {
        const message = "Invalid reset password link. Please try again";
        res.redirect(`/users/resetpassword?status=error&message=${message}`);
      } else {
        res.redirect(`/users/resetpassword?type=reset&id=${userId}`);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    console.log("uuu", userId, password);
    console.log("helloooo");
    const hashedpassword = await hashPassword(password);

    const user = await Travelers.findByIdAndUpdate(
      { _id: userId },
      { password: hashedpassword }
    );

    if (user) {
      await PasswordReset.findOneAndDelete({ userId });

      res.status(200).json({
        ok: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
