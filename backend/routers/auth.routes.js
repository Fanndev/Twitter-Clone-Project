import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
const AuthRoutes = Router();

    AuthRoutes.post("/register", register);
    AuthRoutes.post("/login", login);
    AuthRoutes.post("/logout", logout);

export default AuthRoutes