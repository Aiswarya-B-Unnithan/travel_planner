import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*REGISTER USER */
export const register = async (req, res) => {
  console.log("hello")
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      fullName,
      dateOfBirth,
      currentLocation,
      currentCity,
    } = req.body;

    const existingUser = User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ Message: "Email already exists" });
    }
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;
    if (role === "Traveler") {
      newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        fullName,
        dateOfBirth,
        currentLocation,
        currentCity,
      });
    } else if (role === "Host") {
      newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        fullName,
        dateOfBirth,
        currentLocation,
        currentCity,
        hostInfo: {
          verificationDetails: {
            status: "pending",
            details: "",
          },
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
    const registeredUser = await newUser.save();
    console.log(registeredUser);
    res.status(201).json(registeredUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal server error:${error}` });
  }
};
