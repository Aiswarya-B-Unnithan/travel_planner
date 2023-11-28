import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: (value) => {
          const currentDate = new Date();
          const userDate = new Date(value);
          return currentDate.getFullYear() - userDate.getFullYear() > 18;
        },
        message: "User must be at least 18 years old.",
      },
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      enum: ["Traveler", "Host", "Admin"],
      default: "Traveler",
    },
    currentLocation: {
      type: String,
    },
    currentCity: {
      type: String,
    },
    travelStories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TravelStory",
      },
    ],
    // Travel Plans
    upcomingTrips: [
      {
        destination: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    events: [
      {
        eventName: {
          type: String,
          required: true,
          min: 2,
          max: 100,
        },
        eventDate: {
          type: Date,
          required: true,
        },
        location: {
          type: String,
        },
        description: {
          type: String,
          max: 500,
        },
        invitedUsers: [
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            status: {
              type: String,
              enum: ["pending", "accepted"],
              default: "pending",
            },
          },
        ],
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // Additional Information for Hosts
    hostInfo: {
      verificationDetails: {
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        details: {
          type: String,
          maxlength: 500, // Set a maximum length for the details
          // Add more validation rules specific to verification details
        },
      },
      ratings: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      rooms: [
        {
          roomName: String,
          images: [String], // Array of image URLs
          ratePerDay: {
            type: mongoose.Schema.Types.Mixed,
            validate: {
              validator: function (value) {
                // Add custom validation logic if needed
                return typeof value === "number" || value === "free";
              },
              message: 'Rate must be a number or "free".',
            },
          },
          maxCapacity: Number,
        },
      ],
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", UserSchema);

export default User;
