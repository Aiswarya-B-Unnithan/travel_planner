import mongoose from "mongoose";
import Verification from "../models/emailVerifiaction.js";
import Travelers from "../models/travelerModel.js";
import { comparePassword, createJwt } from "../utils/index.js";
import { upload } from "../middleware/multer.js";
import cloudinary from "cloudinary";
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
      travelPreferences,
    } = req.body;

    if (
      !(
        firstName ||
        lastName ||
        contact ||
        profession ||
        location ||
        travelPreferences
      )
    ) {
      next("Please provide all required fields");
      return;
    }

    const { userId } = req.body;
    console.log("from usercontroller", firstName, lastName, location);
    const updateUser = {
      firstName,
      lastName,
      location,
      profileUrl,
      profession,
      travelPreferences,
      _id: userId,
    };
    if (profileUrl) {
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
      sucess: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
