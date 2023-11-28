import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";

/*CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("assests", express.static(path.join(__dirname, "public/assets")));

/*FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assests");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
/*ROUTES */
app.post("/auth/register", upload.single("picture"), register);

/*MONGODB SETUP */
const PORT = process.env.PORT;
const connectionString =
  "mongodb+srv://unnithanchippy:JavtJX9cItBvjhUh@cluster0.snot6by.mongodb.net/TravelPlanner";

mongoose
  .connect(connectionString)
  .then(() => {
    console.log(`server is on Port ${PORT}`);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
