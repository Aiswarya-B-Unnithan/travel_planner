import mongoose, { Schema } from "mongoose";
//schema
function passwordValidator() {
  const isGoogleAuth = this.isGoogleAuth || false;

  // Check if the document is being updated and isGoogleAuth is false
  if (
    !this.isNew &&
    !isGoogleAuth &&
    (!this.password || this.password.length < 6)
  ) {
    this.invalidate(
      "password",
      "Password is required and should be at least 6 characters long."
    );
  }
}
const travelerSchema = new mongoose.Schema(
  {
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
      select: true,
      validate: {
        validator: passwordValidator,
        message:
          "Custom password validation failed. Password is required and should be at least 6 characters long.",
      },
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
    friends: [{ type: Schema.Types.ObjectId, ref: "Traveler" }],
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
    // travelPreferences: {
    //   type: [String],
    //   enum: [
    //     "Hiking",
    //     "Safari",
    //     "Beach",
    //     "Baloon Safari",
    //     "City",
    //     "Forest Safari",
    //     "Cultural",
    //     "Adventure",
    //     "Other",
    //   ],
    //   default: [],
    // },
    travelPreference: {
      type: String,
      default: "",
    },
    profession: {
      type: String,
      default: "",
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
    isGoogleAuth: {
      type: Boolean,
      default: false,
    },
    Role: {
      type: String,
      default: "Traveler",
    },
  },

  { timestamps: true }
);
const Travelers = mongoose.model("Traveler", travelerSchema);

export default Travelers;
