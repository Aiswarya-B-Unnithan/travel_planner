const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hostSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  role: {
    type: String,
    default: "host",
  },
  verificationStatus: {
    type: Boolean,
    default: false, // Set to true after admin verification
  },
  rooms: [
    {
      roomName: {
        type: String,
        required: true,
      },
      images: [String], // Array of image URLs
      ratePerDay: {
        type: Number,
        required: true,
      },
      maxGuests: {
        type: Number,
        required: true,
      },
     
    },
  ],
});

const Host = mongoose.model("Host", hostSchema);

module.exports = Host;
