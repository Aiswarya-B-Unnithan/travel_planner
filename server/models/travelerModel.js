import mongoose, { schema } from "mongoose";

//schema

const travelerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "FirstName Is Required"],
  },
  lastName: {
    type: String,
    required: [true, "LastName Is Required"],
  },
  email: {
    type: String,
    required: [true, "Email Is Required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Paswword Is Required"],
    minLength: [6, "Password length should be greater than 6 characters"],
    select: true,
  },
  profileUrl: {
    type: String,
  },

  location: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  friends: [
    {
      type: schema.Types.OnjectId,
      ref: "Travelers",
    },
  ],
  socialMediaLinks: {
    type: [
      {
        platform: {
          type: String,
          enum: ["Instagram", "Facebook", "Twitter", "LinkedIn", "Other"],
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
  travelPreferences: {
    type: [String],
    enum: [
      "Hiking",
      "Safari",
      "Beach",
      "Baloon Safari",
      "City",
      "Forest Safari",
      "Cultural",
      "Adventure",
      "Other",
    ],
    default: [],
  },
  profileViews: [
    {
      viewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Traveler",
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
},{timestamps:true});
const Traveler = mongoose.model("Traveler", travelerSchema);

export default Traveler;