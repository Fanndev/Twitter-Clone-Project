import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
import AuthRoutes from "./routers/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRoutes from "./routers/user.routes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDYNARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});



const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors());

// routes
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", UserRoutes);

app.listen(port, () => {
    connectDB();
    console.log(`Server running on port ${port}`);
});