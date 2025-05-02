import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
import AuthRoutes from "./routers/auth.routes.js";
dotenv.config();

const app = express();

const port = process.env.PORT;

// routes
app.use("/api/v1/auth", AuthRoutes);

app.listen(port, () => {
    connectDB();
    console.log(`Server running on port ${port}`);
});