import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import dbConnection from "./dbConfig/config.js";
import errorMiddleware from "../server/middleware/errorMiddleware.js";
import cloudinary from "cloudinary";
//security packages
import helmet from "helmet";
import router from "./routes/index.js";

const __dirname = path.resolve(path.dirname(""));
dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "views/build")));
const PORT = process.env.PORT || 8800;
dbConnection();

//MIDDLEWARES
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(router);

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//error middleware
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`);
});
